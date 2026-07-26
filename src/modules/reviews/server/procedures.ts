import { TRPCError } from "@trpc/server";
import z from "zod";

import type { Context } from "@/trpc/init";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

// ---------------------------------------------------------------------------
// Shared schemas
// ---------------------------------------------------------------------------

/** Schema validating a single `productId` string — reused across review procedures. */
const productIdSchema = z.object({
  productId: z.string(),
});

/**
 * Schema for the mutable fields of a review.
 *
 * - `rating`      – integer between 1 and 5 (inclusive).
 * - `description` – non-empty free-text body of the review.
 */
const reviewFieldsSchema = z.object({
  rating: z.number().min(1, { message: "Rating is required" }).max(5),
  description: z.string().min(1, { message: "Description is required" }),
});

// ---------------------------------------------------------------------------
// Shared query helpers
// ---------------------------------------------------------------------------

/**
 * Executes a product lookup and a user review lookup concurrently.
 * Throws a NOT_FOUND error if the product does not exist.
 */
async function fetchProductAndReviewOrThrow(
  db: Context["db"],
  productId: string,
  userId: string,
) {
  const [product, { docs: reviews }] = await Promise.all([
    db.findByID({ collection: "products", id: productId }),
    db.find({
      collection: "reviews",
      limit: 1,
      where: {
        and: [{ product: { equals: productId } }, { user: { equals: userId } }],
      },
    }),
  ]);

  if (!product) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Product not found",
    });
  }

  return { product, review: reviews[0] ?? null };
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

/**
 * tRPC router exposing review-related procedures.
 *
 * All procedures require an authenticated session (`protectedProcedure`).
 *
 * Includes:
 * - `getOne`: retrieves the current user's review for a given product.
 * - `create`: creates a new review for a product.
 * - `update`: updates an existing review by its ID.
 */
export const reviewsRouter = createTRPCRouter({
  /**
   * Retrieves the current user's review for a specific product.
   *
   * Uses {@link fetchProductAndReviewOrThrow} to verify the product exists
   * before returning the review (which may be `null` if the user hasn't
   * reviewed the product yet).
   *
   * @param input.productId - ID of the product to look up the review for.
   *
   * @throws {TRPCError} `NOT_FOUND` if the product does not exist.
   * @returns The user's review document, or `null` if none exists.
   */
  getOne: protectedProcedure
    .input(productIdSchema)
    .query(async ({ ctx, input }) => {
      const { review } = await fetchProductAndReviewOrThrow(
        ctx.db,
        input.productId,
        ctx.session.user.id,
      );

      return review;
    }),

  /**
   * Creates a new review for a product on behalf of the authenticated user.
   *
   * Guards:
   * - The target product must exist (throws `NOT_FOUND` otherwise).
   * - The user must not have already reviewed the product (throws `BAD_REQUEST`).
   *
   * @param input.productId   - ID of the product being reviewed.
   * @param input.rating      - Star rating (1–5).
   * @param input.description - Free-text review body.
   *
   * @throws {TRPCError} `NOT_FOUND` if the product does not exist.
   * @throws {TRPCError} `BAD_REQUEST` if the user has already reviewed this product.
   * @returns The newly created review document.
   */
  create: protectedProcedure
    .input(productIdSchema.merge(reviewFieldsSchema))
    .mutation(async ({ input, ctx }) => {
      const { review: existingReview, product } =
        await fetchProductAndReviewOrThrow(
          ctx.db,
          input.productId,
          ctx.session.user.id,
        );

      if (existingReview) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already reviewed this product",
        });
      }

      return ctx.db.create({
        collection: "reviews",
        data: {
          user: ctx.session.user.id,
          product: product.id,
          rating: input.rating,
          description: input.description,
        },
      });
    }),

  /**
   * Updates an existing review owned by the authenticated user.
   *
   * @param input.reviewId    - ID of the review to update.
   * @param input.rating      - New star rating (1–5).
   * @param input.description - New free-text review body.
   *
   * @throws {TRPCError} `NOT_FOUND` if the review does not exist or belongs to
   *   a different user.
   * @returns The updated review document.
   */
  update: protectedProcedure
    .input(
      z
        .object({ reviewId: z.string() })
        .merge(reviewFieldsSchema),
    )
    .mutation(async ({ input, ctx }) => {
      const existingReview = await ctx.db.findByID({
        collection: "reviews",
        id: input.reviewId,
      });

      if (
        !existingReview ||
        (typeof existingReview.user === "object"
          ? existingReview.user.id
          : existingReview.user) !== ctx.session.user.id
      ) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }

      return ctx.db.update({
        collection: "reviews",
        id: input.reviewId,
        data: {
          rating: input.rating,
          description: input.description,
        },
      });
    }),
});
