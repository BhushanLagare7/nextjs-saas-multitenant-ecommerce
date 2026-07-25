import { Suspense } from "react";

import {
  ProductView,
  ProductViewSkeleton,
} from "@/modules/products/ui/views/product-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface TenantsProductIdPageProps {
  params: Promise<{ productId: string; slug: string }>;
}

export default async function TenantsProductIdPage({
  params,
}: TenantsProductIdPageProps) {
  const { productId, slug } = await params;

  void prefetch(
    trpc.tenants.getOne.queryOptions({
      slug,
    }),
  );

  return (
    <HydrateClient>
      <Suspense fallback={<ProductViewSkeleton />}>
        <ProductView productId={productId} tenantSlug={slug} />
      </Suspense>
    </HydrateClient>
  );
}
