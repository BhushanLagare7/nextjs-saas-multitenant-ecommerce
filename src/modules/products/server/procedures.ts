import { headers as getHeaders } from "next/headers";

import { TRPCError } from "@trpc/server";
import type { Sort, Where } from "payload";
import z from "zod";

import { DEFAULT_LIMIT } from "@/constants";
import { groupReviewsByProduct } from "@/modules/reviews/utils";
import { Category, Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { sortValues } from "../search-params";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Maps a public sort key to the Payload `sort` field syntax.
 * Only `hot_and_new` diverges from the default; all others use newest-first.
 */
const SORT_MAP: Partial<Record<(typeof sortValues)[number], Sort>> = {
  hot_and_new: "+createdAt",
};

/**
 * Computes the average rating and a percentage-based star distribution (1–5)
 * from a flat list of review documents in a single pass.
 *
 * @param docs  - Raw review documents returned by Payload.
 */
function summariseReviews(docs: Array<{ rating: number }>): {
  reviewRating: number;
  ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number>;
} {
  const ratingDistribution: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  const count = docs.length;

  if (count === 0) {
    return {
      reviewRating: 0,
      ratingDistribution: ratingDistribution as Record<
        1 | 2 | 3 | 4 | 5,
        number
      >,
    };
  }

  let ratingSum = 0;

  for (const review of docs) {
    const { rating } = review;
    ratingSum += rating;

    // Guard against out-of-range values stored in the database.
    if (rating >= 1 && rating <= 5) {
      ratingDistribution[rating] = (ratingDistribution[rating] ?? 0) + 1;
    }
  }

  // Convert raw counts to integer percentages.
  for (let i = 1; i <= 5; i++) {
    ratingDistribution[i] = Math.round(
      ((ratingDistribution[i] ?? 0) / count) * 100,
    );
  }

  return {
    reviewRating: ratingSum / count,
    ratingDistribution: ratingDistribution as Record<1 | 2 | 3 | 4 | 5, number>,
  };
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

/**
 * Router handling product-related tRPC procedures.
 */
export const productsRouter = createTRPCRouter({
  /**
   * Fetches a single product by its ID.
   *
   * Includes contextual data:
   * - Whether the authenticated user has already purchased the product.
   * - Average review rating and percentage-based star distribution.
   *
   * Throws `NOT_FOUND` when the product is archived.
   */
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const headers = await getHeaders();

      // Parallelise independent initial queries.
      const [session, product] = await Promise.all([
        ctx.db.auth({ headers }),
        ctx.db.findByID({
          collection: "products",
          id: input.id,
          // depth 2 → loads product.image, product.tenant, product.tenant.image
          depth: 2,
          select: { content: false },
        }),
      ]);

      if (product.isArchived) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      // Parallelise secondary queries once the product is confirmed live.
      const [ordersData, reviewsData] = await Promise.all([
        // Only query orders when there is an authenticated user.
        session.user
          ? ctx.db.find({
              collection: "orders",
              pagination: false,
              limit: 1,
              where: {
                and: [
                  { product: { equals: input.id } },
                  { user: { equals: session.user.id } },
                ],
              },
            })
          : null,
        ctx.db.find({
          collection: "reviews",
          depth: 0,
          pagination: false,
          select: { rating: true },
          where: { product: { equals: input.id } },
        }),
      ]);

      const isPurchased = !!ordersData?.docs[0];
      const { reviewRating, ratingDistribution } = summariseReviews(
        reviewsData.docs,
      );

      return {
        ...product,
        isPurchased,
        image: product.image as Media | null,
        tenant: product.tenant as Tenant & { image: Media | null },
        reviewRating,
        reviewCount: reviewsData.totalDocs,
        ratingDistribution,
      };
    }),

  /**
   * Fetches a paginated list of products based on comprehensive filtering criteria.
   *
   * Supports filtering by search term, category (including subcategories),
   * price range, tags, sort order, and tenant slug.
   *
   * When `tenantSlug` is omitted the query is treated as a public storefront
   * request and private products (`isPrivate: true`) are excluded.
   *
   * Review statistics are batch-fetched in a single query and grouped
   * in memory to avoid an N+1 query pattern.
   */
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
        search: z.string().nullable().optional(),
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
        tenantSlug: z.string().nullable().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {
        isArchived: { not_equals: true },
      };

      // Only `hot_and_new` diverges; all other values default to newest-first.
      const sort: Sort = (input.sort && SORT_MAP[input.sort]) ?? "-createdAt";

      // Consolidate price filtering using object spread; omit the clause entirely
      // when neither bound is supplied.
      if (input.minPrice || input.maxPrice) {
        where.price = {
          ...(input.minPrice && { greater_than_equal: input.minPrice }),
          ...(input.maxPrice && { less_than_equal: input.maxPrice }),
        };
      }

      if (input.tenantSlug) {
        where["tenant.slug"] = { equals: input.tenantSlug };
      } else {
        // Public storefront: exclude products private to a tenant store.
        where["isPrivate"] = { not_equals: true };
      }

      // Resolve the requested category and collect its subcategory slugs so
      // that filtering on a parent also includes its children.
      if (input.category) {
        const categoriesData = await ctx.db.find({
          collection: "categories",
          limit: 1,
          // depth 1 → populates subcategories; each subcategory doc is a Category
          depth: 1,
          pagination: false,
          where: { slug: { equals: input.category } },
        });

        const parentCategory = categoriesData.docs[0] as Category | undefined;

        if (parentCategory) {
          const subcategorySlugs = (
            parentCategory.subcategories?.docs ?? []
          ).map((subcategory) => (subcategory as Category).slug);

          where["category.slug"] = {
            in: [parentCategory.slug, ...subcategorySlugs],
          };
        }
      }

      if (input.tags?.length) {
        where["tags.name"] = { in: input.tags };
      }

      if (input.search) {
        where["name"] = { like: input.search };
      }

      const data = await ctx.db.find({
        collection: "products",
        // depth 2 → populates category, image, tenant, tenant.image
        depth: 2,
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
        select: { content: false },
      });

      // Batch-fetch all reviews for the returned products in a single query,
      // then group them in memory — avoids an N+1 pattern entirely.
      const productIds = data.docs.map((doc) => doc.id);
      let reviewsByProductMap = new Map<
        string,
        { reviewCount: number; reviewRating: number }
      >();

      if (productIds.length > 0) {
        const reviewsData = await ctx.db.find({
          collection: "reviews",
          depth: 0,
          pagination: false,
          select: { rating: true, product: true },
          where: { product: { in: productIds } },
        });

        reviewsByProductMap = groupReviewsByProduct(reviewsData.docs);
      }

      return {
        ...data,
        docs: data.docs.map((doc) => {
          const { reviewCount, reviewRating } = reviewsByProductMap.get(
            doc.id,
          ) ?? { reviewCount: 0, reviewRating: 0 };

          return {
            ...doc,
            image: doc.image as Media | null,
            tenant: doc.tenant as Tenant & { image: Media | null },
            reviewCount,
            reviewRating,
          };
        }),
      };
    }),
});
