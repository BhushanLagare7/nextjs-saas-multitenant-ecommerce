import { CheckoutView } from "@/modules/checkout/ui/views/checkout-view";

/**
 * Interface for the Tenants Slug Checkout page props.
 */
interface TenantsSlugCheckoutPageProps {
  /** Dynamic route parameters */
  params: Promise<{ slug: string }>;
}

/**
 * Tenants slug checkout page.
 * Displays the checkout view for a specific tenant.
 */
export default async function TenantsSlugCheckoutPage({
  params,
}: TenantsSlugCheckoutPageProps) {
  // Extract tenant slug from route parameters
  const { slug } = await params;

  return <CheckoutView tenantSlug={slug} />;
}
