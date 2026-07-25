import { DEFAULT_LIMIT } from "@/constants";
import { LibraryView } from "@/modules/library/ui/views/library-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
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

  return (
    <HydrateClient>
      <LibraryView />
    </HydrateClient>
  );
}
