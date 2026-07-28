import { CheckoutView } from "@/modules/checkout/ui/views/checkout-view";

/**
 * Interface for the Tenants Checkout page props.
 */
interface TenantsCheckoutPageProps {
  /** Dynamic route parameters */
  params: Promise<{ slug: string }>;
}

/**
 * Tenants checkout page.
 * Displays the checkout view for a specific tenant.
 */
export default async function TenantsCheckoutPage({
  params,
}: TenantsCheckoutPageProps) {
  // Extract tenant slug from route parameters
  const { slug } = await params;

  return <CheckoutView tenantSlug={slug} />;
}
