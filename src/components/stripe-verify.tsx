import { Button, Link } from "@payloadcms/ui";

/**
 * Renders a button link directing users to the Stripe account verification page.
 */
export function StripeVerify() {
  return (
    <Link href="/stripe-verify">
      <Button>Verify account</Button>
    </Link>
  );
}
