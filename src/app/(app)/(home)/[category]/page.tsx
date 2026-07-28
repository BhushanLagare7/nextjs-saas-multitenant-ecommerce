import type { SearchParams } from "nuqs/server";

import { DEFAULT_LIMIT } from "@/constants";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  /** Dynamic route parameters */
  params: Promise<{
    category: string;
  }>;
  /** URL search parameters used for product filtering/sorting */
  searchParams: Promise<SearchParams>;
}

/**
 * Category product listing page.
 * Parses URL filters and prefetches the initial page of products on the server for SSR hydration.
 */
export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = await params;
  const filters = await loadProductFilters(searchParams);

  // Prefetch the first page of products for the category
  void prefetch(
    trpc.products.getMany.infiniteQueryOptions(
      {
        ...filters,
        category,
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
      <ProductListView category={category} />
    </HydrateClient>
  );
}
