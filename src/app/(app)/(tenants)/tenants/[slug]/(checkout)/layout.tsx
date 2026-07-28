import { Navbar } from "@/modules/checkout/ui/components/navbar";
import { Footer } from "@/modules/tenants/ui/components/footer";

/**
 * Interface for the Tenants Checkout layout props.
 */
interface TenantsCheckoutLayoutProps {
  /** Child components to render */
  children: React.ReactNode;
  /** Dynamic route parameters */
  params: Promise<{ slug: string }>;
}

/**
 * Tenants checkout layout.
 * Provides a consistent layout for tenant checkout pages with navbar and footer.
 */
export default async function TenantsCheckoutLayout({
  children,
  params,
}: TenantsCheckoutLayoutProps) {
  // Extract tenant slug from route parameters
  const { slug } = await params;

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F4F0]">
      <Navbar slug={slug} />
      <div className="flex-1">
        <div className="mx-auto max-w-(--breakpoint-xl)">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
