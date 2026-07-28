import { DEFAULT_LIMIT } from "@/constants";
import { LibraryView } from "@/modules/library/ui/views/library-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

/**
 * Library page component.
 * Prefetches the first page of owned products on the server for SSR hydration.
 */
export default async function LibraryPage() {
  // Prefetch the first page of owned products for SSR hydration
  void prefetch(
    trpc.library.getMany.infiniteQueryOptions(
      { limit: DEFAULT_LIMIT },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
        },
      },
    ),
  );

  // Hydrate the tRPC client with the prefetched data
  return (
    <HydrateClient>
      <LibraryView />
    </HydrateClient>
  );
}
