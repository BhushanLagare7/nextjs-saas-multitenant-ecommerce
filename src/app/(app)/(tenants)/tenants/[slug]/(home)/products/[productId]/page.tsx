import { Suspense } from "react";

import {
  ProductView,
  ProductViewSkeleton,
} from "@/modules/products/ui/views/product-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

/**
 * Interface for the Tenants Slug Products Product ID page props.
 */
interface TenantsSlugProductsProductIdPageProps {
  /** Dynamic route parameters */
  params: Promise<{ productId: string; slug: string }>;
}

/**
 * Tenants slug products product detail page.
 * Prefetches the tenant data on the server for SSR hydration.
 */
export default async function TenantsSlugProductsProductIdPage({
  params,
}: TenantsSlugProductsProductIdPageProps) {
  const { productId, slug } = await params;

  // Prefetch the tenant data for SSR hydration
  void prefetch(
    trpc.tenants.getOne.queryOptions({
      slug,
    }),
  );

  return (
    <HydrateClient>
      {/* Suspense boundary for fallback UI while data loads */}
      <Suspense fallback={<ProductViewSkeleton />}>
        <ProductView productId={productId} tenantSlug={slug} />
      </Suspense>
    </HydrateClient>
  );
}
