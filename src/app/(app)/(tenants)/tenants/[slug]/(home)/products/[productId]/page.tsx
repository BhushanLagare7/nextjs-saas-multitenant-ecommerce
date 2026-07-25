import { Suspense } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  ProductView,
  ProductViewSkeleton,
} from "@/modules/products/ui/views/product-view";
import { getQueryClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface TenantsProductIdPageProps {
  params: Promise<{ productId: string; slug: string }>;
}

export default async function TenantsProductIdPage({
  params,
}: TenantsProductIdPageProps) {
  const { productId, slug } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.tenants.getOne.queryOptions({
      slug,
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductViewSkeleton />}>
        <ProductView productId={productId} tenantSlug={slug} />
      </Suspense>
    </HydrationBoundary>
  );
}
