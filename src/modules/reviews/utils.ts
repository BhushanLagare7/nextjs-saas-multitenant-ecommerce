/**
 * Utility for grouping review documents by product and computing per-product
 * review count / average rating.
 *
 * Shared by `library/server/procedures.ts` and `products/server/procedures.ts`
 * to eliminate duplicated Map/reduce logic.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ReviewSummary {
  reviewCount: number;
  reviewRating: number;
}

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

/**
 * Groups a flat list of review documents by their associated product ID and
 * computes an average `reviewRating` and `reviewCount` for each product.
 *
 * Payload can return `product` as either a populated object or a raw string
 * ID depending on query depth, so both shapes are handled.
 *
 * @param reviews - Review documents that contain at least `rating` and `product`.
 * @returns A `Map` keyed by product ID with the computed {@link ReviewSummary}.
 */
export function groupReviewsByProduct(
  reviews: Array<{ rating: number; product: string | { id: string } }>,
): Map<string, ReviewSummary> {
  const map = new Map<string, { totalRating: number; count: number }>();

  for (const review of reviews) {
    const productId =
      typeof review.product === "object" ? review.product.id : review.product;

    if (!productId) continue;

    const entry = map.get(productId) ?? { totalRating: 0, count: 0 };
    entry.totalRating += review.rating;
    entry.count += 1;
    map.set(productId, entry);
  }

  const result = new Map<string, ReviewSummary>();

  for (const [productId, { totalRating, count }] of map) {
    result.set(productId, {
      reviewCount: count,
      reviewRating: count > 0 ? totalRating / count : 0,
    });
  }

  return result;
}
