import { TRPCError } from "@trpc/server";
import z from "zod";

import { DEFAULT_LIMIT } from "@/constants";
import { groupReviewsByProduct } from "@/modules/reviews/utils";
import { Media, Tenant } from "@/payload-types";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

/**
 * Router responsible for exposing the authenticated user's "library",
 * i.e. the set of products the user has purchased (has an existing
 * order for).
 */
export const libraryRouter = createTRPCRouter({
  /**
   * Retrieves a single purchased product belonging to the current user.
   *
   * Flow:
   * 1. Confirms an order exists linking the authenticated user to the
   *    requested product (ownership/authorization check).
   * 2. Fetches and returns the product document.
   *
   * @throws {TRPCError} `NOT_FOUND` if no matching order exists.
   * @throws {TRPCError} `NOT_FOUND` if the product does not exist.
   */
  getOne: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Verify the current user has purchased this product before
      // fetching it, to avoid leaking product data to non-owners.
      const ordersData = await ctx.db.find({
        collection: "orders",
        limit: 1,
        pagination: false,
        where: {
          and: [
            { product: { equals: input.productId } },
            { user: { equals: ctx.session.user.id } },
          ],
        },
      });

      const order = ordersData.docs[0];

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      const product = await ctx.db.findByID({
        collection: "products",
        id: input.productId,
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      return product;
    }),

  /**
   * Retrieves a paginated list of products purchased by the current
   * user, each enriched with a summarized `reviewCount` and average
   * `reviewRating`.
   *
   * @param cursor - Page number to fetch (1-indexed). Defaults to `1`.
   * @param limit - Number of orders/products per page. Defaults to `DEFAULT_LIMIT`.
   */
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Fetch the current page of orders belonging to the user.
      const ordersData = await ctx.db.find({
        collection: "orders",
        depth: 0, // We want to just get ids, without populating
        page: input.cursor,
        limit: input.limit,
        where: {
          user: {
            equals: ctx.session.user.id,
          },
        },
      });

      const productIds = ordersData.docs.map((order) => order.product);

      // Fetch the products referenced by the user's orders.
      const productsData = await ctx.db.find({
        collection: "products",
        pagination: false,
        where: {
          id: {
            in: productIds,
          },
        },
      });

      // Fetch all reviews for all retrieved products in a single query,
      // instead of one query per product (avoids N+1 queries).
      const reviewsData = await ctx.db.find({
        collection: "reviews",
        depth: 0,
        pagination: false,
        select: { rating: true, product: true },
        where: {
          product: {
            in: productsData.docs.map((doc) => doc.id),
          },
        },
      });

      // Group reviews by product and compute per-product count/rating.
      const reviewsByProductId = groupReviewsByProduct(reviewsData.docs);

      // Attach summarized review count/rating to each product.
      const dataWithSummarizedReviews = productsData.docs.map((doc) => {
        const { reviewCount, reviewRating } = reviewsByProductId.get(
          doc.id,
        ) ?? { reviewCount: 0, reviewRating: 0 };

        return {
          ...doc,
          reviewCount,
          reviewRating,
        };
      });

      return {
        ...productsData,
        docs: dataWithSummarizedReviews.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
