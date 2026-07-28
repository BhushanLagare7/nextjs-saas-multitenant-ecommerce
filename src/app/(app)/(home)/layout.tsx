import { Suspense } from "react";

import { Footer } from "@/modules/home/ui/components/footer";
import { Navbar } from "@/modules/home/ui/components/navbar";
import {
  SearchFilters,
  SearchFiltersSkeleton,
} from "@/modules/home/ui/components/search-filters";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

interface HomeLayoutProps {
  /** The main content of the page, including product listings or category/subcategory pages. */
  children: React.ReactNode;
}

/**
 * Layout component for the main home page.
 * Prefetches all categories on the server for SSR hydration.
 * Contains the navbar, search filters, main content, and footer.
 */
export default async function HomeLayout({ children }: HomeLayoutProps) {
  // Prefetch all categories for SSR hydration
  void prefetch(trpc.categories.getMany.queryOptions());

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {/* Hydrate the tRPC client with the prefetched categories */}
      <HydrateClient>
        <Suspense fallback={<SearchFiltersSkeleton />}>
          <SearchFilters />
        </Suspense>
      </HydrateClient>
      {/* Main content area, rendered in a client component */}
      <div className="flex-1 bg-[#F4F4F0]">{children}</div>
      <Footer />
    </div>
  );
}
