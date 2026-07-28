import { NextResponse } from "next/server";

import config from "@payload-config";
import { getPayload } from "payload";
import type { Stripe } from "stripe";

import { stripe } from "@/lib/stripe";
import { ExpandedLineItem } from "@/modules/checkout/types";

function getStripeWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error(
      "CRITICAL: STRIPE_WEBHOOK_SECRET is not set in the environment variables.",
    );
  }

  return secret;
}

const stripeWebhookSecret = getStripeWebhookSecret();

/** Convenience alias for the Payload client instance type. */
type Payload = Awaited<ReturnType<typeof getPayload>>;

/**
 * Stripe event types this webhook is able to process.
 * Using a `Set` gives O(1) membership checks and avoids
 * re-allocating an array on every request.
 */
const PERMITTED_EVENTS = new Set<Stripe.Event["type"]>([
  "checkout.session.completed",
  "account.updated",
]);

/**
 * Handles a `checkout.session.completed` Stripe event.
 *
 * Validates that the checkout session is linked to a known user, retrieves
 * the fully expanded session (including line items and their products),
 * and creates one `orders` document per purchased line item.
 *
 * @throws {Error} If the session has no associated user, the user cannot
 * be found, or the session has no line items.
 */
async function handleCheckoutSessionCompleted(
  event: Stripe.Event,
  payload: Payload,
): Promise<void> {
  const session = event.data.object as Stripe.Checkout.Session;

  if (!session.metadata?.userId) {
    throw new Error("User ID is required");
  }

  const user = await payload.findByID({
    collection: "users",
    id: session.metadata.userId,
  });

  if (!user) {
    throw new Error("User not found");
  }

  const expandedSession = await stripe.checkout.sessions.retrieve(
    session.id,
    { expand: ["line_items.data.price.product"] },
    { stripeAccount: event.account },
  );

  if (
    !expandedSession.line_items?.data ||
    !expandedSession.line_items.data.length
  ) {
    throw new Error("No line items found");
  }

  const lineItems = expandedSession.line_items.data as ExpandedLineItem[];

  // Idempotency guard: skip order creation if this session was already processed
  const existingOrders = await payload.find({
    collection: "orders",
    where: {
      stripeCheckoutSessionId: { equals: session.id },
      ...(event.account
        ? { stripeAccountId: { equals: event.account } }
        : {}),
    },
    limit: 1,
  });

  if (existingOrders.docs.length > 0) {
    console.log(
      `⚠️ Orders for session ${session.id} already exist, skipping duplicate.`,
    );
    return;
  }

  for (const item of lineItems) {
    await payload.create({
      collection: "orders",
      data: {
        stripeCheckoutSessionId: session.id,
        stripeAccountId: event.account,
        user: user.id,
        product: item.price.product.metadata.id,
        name: item.price.product.name,
      },
    });
  }
}

/**
 * Handles an `account.updated` Stripe event.
 *
 * Synchronises the `stripeDetailsSubmitted` flag on the matching `tenants`
 * document with the connected account's current `details_submitted` status.
 */
async function handleAccountUpdated(
  event: Stripe.Event,
  payload: Payload,
): Promise<void> {
  const account = event.data.object as Stripe.Account;

  await payload.update({
    collection: "tenants",
    where: {
      stripeAccountId: {
        equals: account.id,
      },
    },
    data: {
      stripeDetailsSubmitted: account.details_submitted,
    },
  });
}

/**
 * Stripe webhook endpoint.
 *
 * Verifies the incoming request's signature, and for permitted event types
 * (`checkout.session.completed`, `account.updated`) performs the associated
 * side effects against the Payload CMS collections.
 *
 * @param req - The raw incoming webhook request from Stripe.
 * @returns
 * - `200` with `{ message: "Received" }` on success (including for
 *   event types that are not handled).
 * - `400` with `{ message: "Webhook Error: <reason>" }` if signature
 *   verification fails.
 * - `500` with `{ message: "Webhook handler failed" }` if processing a
 *   permitted event throws.
 */
export async function POST(req: Request): Promise<NextResponse> {
  let event: Stripe.Event;

  const stripeSignature = req.headers.get("stripe-signature");

  if (!stripeSignature) {
    return NextResponse.json(
      { message: "Webhook Error: Missing stripe-signature header" },
      { status: 400 },
    );
  }

  try {
    event = stripe.webhooks.constructEvent(
      await req.text(),
      stripeSignature,
      stripeWebhookSecret,
    );
  } catch (error) {
    const isError = error instanceof Error;
    const errorMessage = isError ? error.message : "Unknown error";

    if (isError) {
      console.error(error);
    }

    console.error(`❌ Error message: ${errorMessage}`);
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 },
    );
  }

  console.log("✅ Success:", event.id);

  if (PERMITTED_EVENTS.has(event.type)) {
    const payload = await getPayload({ config });

    try {
      switch (event.type) {
        case "checkout.session.completed":
          await handleCheckoutSessionCompleted(event, payload);
          break;
        case "account.updated":
          await handleAccountUpdated(event, payload);
          break;
        default:
          throw new Error(`Unhandled event: ${event.type}`);
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { message: "Webhook handler failed" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ message: "Received" }, { status: 200 });
}
