import { Suspense } from "react";

import { Footer } from "@/modules/tenants/ui/components/footer";
import { Navbar, NavbarSkeleton } from "@/modules/tenants/ui/components/navbar";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

/**
 * Interface for the Tenants layout props.
 */
interface TenantsLayoutProps {
  /** Child components to render */
  children: React.ReactNode;
  /** Dynamic route parameters */
  params: Promise<{ slug: string }>;
}

/**
 * Tenants layout.
 * Provides a consistent layout for tenant pages with navbar and footer.
 */
export default async function TenantsLayout({
  children,
  params,
}: TenantsLayoutProps) {
  const { slug } = await params;

  // Prefetch the tenant data for SSR hydration
  void prefetch(
    trpc.tenants.getOne.queryOptions({
      slug,
    }),
  );

  // Render the tenant layout with navbar and footer
  return (
    <div className="flex min-h-screen flex-col bg-[#F4F4F0]">
      <HydrateClient>
        {/* Suspense boundary for fallback UI while data loads */}
        <Suspense fallback={<NavbarSkeleton />}>
          <Navbar slug={slug} />
        </Suspense>
      </HydrateClient>
      <div className="flex-1">
        <div className="mx-auto max-w-(--breakpoint-xl)">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
