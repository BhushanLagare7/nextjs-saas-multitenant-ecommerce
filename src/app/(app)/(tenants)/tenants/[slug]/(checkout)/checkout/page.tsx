import { CheckoutView } from "@/modules/checkout/ui/views/checkout-view";

interface TenantsCheckoutPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TenantsCheckoutPage({
  params,
}: TenantsCheckoutPageProps) {
  const { slug } = await params;

  return <CheckoutView tenantSlug={slug} />;
}
