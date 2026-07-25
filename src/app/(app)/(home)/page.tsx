import type { SearchParams } from "nuqs/server";

import { DEFAULT_LIMIT } from "@/constants";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

interface HomePageProps {
  searchParams: Promise<SearchParams>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const filters = await loadProductFilters(searchParams);

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
