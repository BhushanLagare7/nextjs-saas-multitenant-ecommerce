import { Suspense } from "react";

import {
  ProductView,
  ProductViewSkeleton,
} from "@/modules/library/ui/views/product-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

/**
 * Interface for the Library Product ID page props.
 */
interface LibraryProductIdPageProps {
  /** Dynamic route parameters */
  params: Promise<{
    productId: string;
  }>;
}

/**
 * Library product detail page.
 * Prefetches the product and reviews data on the server for SSR hydration.
 */
export default async function LibraryProductIdPage({
  params,
}: LibraryProductIdPageProps) {
  const { productId } = await params;

  // Prefetch the product data for SSR hydration
  void prefetch(
    trpc.library.getOne.queryOptions({
      productId,
    }),
  );

  // Prefetch the reviews data for SSR hydration
  void prefetch(
    trpc.reviews.getOne.queryOptions({
      productId,
    }),
  );

  return (
    <HydrateClient>
      <Suspense fallback={<ProductViewSkeleton />}>
        <ProductView productId={productId} />
      </Suspense>
    </HydrateClient>
  );
}
