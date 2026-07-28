import type { SearchParams } from "nuqs/server";

import { DEFAULT_LIMIT } from "@/constants";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

interface HomePageProps {
  /** URL search parameters used for product filtering and sorting */
  searchParams: Promise<SearchParams>;
}

/**
 * Home page component.
 * Parses URL filters and prefetches the first page of products for SSR hydration.
 */
export default async function HomePage({ searchParams }: HomePageProps) {
  // Parse URL search parameters to extract product filters
  const filters = await loadProductFilters(searchParams);

  // Prefetch the first page of products for SSR hydration
  void prefetch(
    trpc.products.getMany.infiniteQueryOptions(
      {
        ...filters,
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
      <ProductListView />
    </HydrateClient>
  );
}
