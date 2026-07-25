import type { SearchParams } from "nuqs/server";

import { DEFAULT_LIMIT } from "@/constants";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface TenantsHomePageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
}

export default async function TenantsHomePage({
  params,
  searchParams,
}: TenantsHomePageProps) {
  const { slug } = await params;
  const filters = await loadProductFilters(searchParams);

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
