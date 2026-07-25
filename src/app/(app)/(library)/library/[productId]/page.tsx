import { Suspense } from "react";

import {
  ProductView,
  ProductViewSkeleton,
} from "@/modules/library/ui/views/product-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface LibraryProductIdPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function LibraryProductIdPage({
  params,
}: LibraryProductIdPageProps) {
  const { productId } = await params;

  void prefetch(
    trpc.library.getOne.queryOptions({
      productId,
    }),
  );

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
