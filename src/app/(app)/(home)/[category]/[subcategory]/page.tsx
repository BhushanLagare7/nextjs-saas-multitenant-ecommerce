import { SearchParams } from "nuqs/server";

import { DEFAULT_LIMIT } from "@/constants";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface CategorySubcategoryPageProps {
  params: Promise<{
    subcategory: string;
  }>;
  searchParams: Promise<SearchParams>;
}

export default async function CategorySubcategoryPage({
  params,
  searchParams,
}: CategorySubcategoryPageProps) {
  const { subcategory } = await params;
  const filters = await loadProductFilters(searchParams);

  void prefetch(
    trpc.products.getMany.infiniteQueryOptions(
      {
        ...filters,
        category: subcategory,
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
      <ProductListView category={subcategory} />
    </HydrateClient>
  );
}
