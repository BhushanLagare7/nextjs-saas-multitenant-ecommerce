import type { SearchParams } from "nuqs/server";

import { DEFAULT_LIMIT } from "@/constants";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

/**
 * Interface for the Tenants Slug page props.
 */
interface TenantsSlugPageProps {
  /** URL query parameters */
  searchParams: Promise<SearchParams>;
  /** Dynamic route parameters */
  params: Promise<{ slug: string }>;
}

/**
 * Tenants slug page.
 * Prefetches the first page of products on the server for SSR hydration.
 */
export default async function TenantsSlugPage({
  params,
  searchParams,
}: TenantsSlugPageProps) {
  // Extract tenant slug from route parameters
  const { slug } = await params;
  // Load product filters from search parameters
  const filters = await loadProductFilters(searchParams);

  // Prefetch the first page of products for SSR hydration
  void prefetch(
    trpc.products.getMany.infiniteQueryOptions(
      {
        ...filters,
        tenantSlug: slug,
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
        },
      },
    ),
  );

  return (
    <HydrateClient>
      <ProductListView narrowView tenantSlug={slug} />
    </HydrateClient>
  );
}
