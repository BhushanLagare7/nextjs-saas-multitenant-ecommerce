import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error(
    "CRITICAL: STRIPE_SECRET_KEY is not set in the environment variables.",
  );
}

/**
 * Singleton Stripe client instance configured with the application's secret key.
 */
export const stripe = new Stripe(secretKey, {
  apiVersion: "2026-06-24.dahlia",
  typescript: true,
});
