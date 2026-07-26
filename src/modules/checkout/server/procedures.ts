import { TRPCError } from "@trpc/server";
import type Stripe from "stripe";
import z from "zod";

import { PLATFORM_FEE_PERCENTAGE } from "@/constants";
import { stripe } from "@/lib/stripe";
import { generateTenantURL } from "@/lib/utils";
import { Media, Tenant } from "@/payload-types";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";

import { CheckoutMetadata, ProductMetadata } from "../types";

/** Base application URL used to build Stripe redirect links. */
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

/**
 * Throws a standardized tRPC `NOT_FOUND` error.
 *
 * @param message - Human-readable message describing what was not found.
 */
function notFound(message: string): never {
  throw new TRPCError({
    code: "NOT_FOUND",
    message,
  });
}

/**
 * Router that handles Stripe-related checkout operations:
 * - Seller account verification (Stripe Connect onboarding)
 * - Product purchase / checkout session creation
 * - Fetching products (with pricing info) for the checkout flow
 */
export const checkoutRouter = createTRPCRouter({
  /**
   * Generates a Stripe account onboarding link for the current user's tenant,
   * allowing them to complete Stripe Connect verification.
   *
   * @throws {TRPCError} `NOT_FOUND` if the user or their tenant cannot be found.
   * @throws {TRPCError} `BAD_REQUEST` if Stripe fails to return an account link URL.
   * @returns The Stripe account onboarding URL.
   */
  verify: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.db.findByID({
      collection: "users",
      id: ctx.session.user.id,
      depth: 0, // user.tenants[0].tenant is going to be a string (tenant ID)
    });

    if (!user) {
      notFound("User not found");
    }

    const tenantId = user.tenants?.[0]?.tenant as string; // This is an id because of depth: 0
    const tenant = await ctx.db.findByID({
      collection: "tenants",
      id: tenantId,
    });

    if (!tenant) {
      notFound("Tenant not found");
    }

    const accountLink = await stripe.accountLinks.create({
      account: tenant.stripeAccountId,
      refresh_url: `${APP_URL}/admin`,
      return_url: `${APP_URL}/admin`,
      type: "account_onboarding",
    });

    if (!accountLink.url) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to create verification link",
      });
    }

    return { url: accountLink.url };
  }),

  /**
   * Creates a Stripe Checkout session for purchasing one or more products
   * belonging to a single tenant, applying the platform fee on top.
   *
   * @param input.productIds - IDs of the products to purchase (must be non-empty).
   * @param input.tenantSlug - Slug of the tenant selling the products.
   *
   * @throws {TRPCError} `NOT_FOUND` if any product or the tenant cannot be found.
   * @throws {TRPCError} `BAD_REQUEST` if the tenant hasn't completed Stripe verification.
   * @throws {TRPCError} `INTERNAL_SERVER_ERROR` if Stripe fails to return a checkout URL.
   * @returns The Stripe Checkout session URL.
   */
  purchase: protectedProcedure
    .input(
      z.object({
        productIds: z.array(z.string()).min(1),
        tenantSlug: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // These two lookups are independent of each other, so run them concurrently.
      const [products, tenantsData] = await Promise.all([
        ctx.db.find({
          collection: "products",
          depth: 2,
          where: {
            and: [
              {
                id: {
                  in: input.productIds,
                },
              },
              {
                "tenant.slug": {
                  equals: input.tenantSlug,
                },
              },
              {
                isArchived: {
                  not_equals: true,
                },
              },
            ],
          },
        }),
        ctx.db.find({
          collection: "tenants",
          limit: 1,
          pagination: false,
          where: {
            slug: {
              equals: input.tenantSlug,
            },
          },
        }),
      ]);

      if (products.totalDocs !== input.productIds.length) {
        notFound("Products not found");
      }

      const tenant = tenantsData.docs[0];

      if (!tenant) {
        notFound("Tenant not found");
      }

      if (!tenant.stripeDetailsSubmitted) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Tenant not allowed to sell products",
        });
      }

      // Build the Stripe line items and compute the total amount in a single pass.
      let totalAmount = 0;
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
        products.docs.map((product) => {
          const unitAmount = product.price * 100; // Stripe handles prices in cents
          totalAmount += unitAmount;

          return {
            quantity: 1,
            price_data: {
              unit_amount: unitAmount,
              currency: "usd",
              product_data: {
                name: product.name,
                metadata: {
                  stripeAccountId: tenant.stripeAccountId,
                  id: product.id,
                  name: product.name,
                  price: product.price,
                } as ProductMetadata,
              },
            },
          };
        });

      const platformFeeAmount = Math.round(
        totalAmount * (PLATFORM_FEE_PERCENTAGE / 100),
      );

      const domain = generateTenantURL(input.tenantSlug);

      const checkout = await stripe.checkout.sessions.create(
        {
          customer_email: ctx.session.user.email,
          success_url: `${domain}/checkout?success=true`,
          cancel_url: `${domain}/checkout?cancel=true`,
          mode: "payment",
          line_items: lineItems,
          invoice_creation: {
            enabled: true,
          },
          metadata: {
            userId: ctx.session.user.id,
          } as CheckoutMetadata,
          payment_intent_data: {
            application_fee_amount: platformFeeAmount,
          },
        },
        {
          stripeAccount: tenant.stripeAccountId,
        },
      );

      if (!checkout.url) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }

      return { url: checkout.url };
    }),

  /**
   * Fetches a list of products by ID (excluding archived ones), along with
   * their populated `category`, `image`, `tenant`, and `tenant.image` relations,
   * plus the aggregate total price of all returned products.
   *
   * @param input.ids - IDs of the products to fetch.
   *
   * @throws {TRPCError} `NOT_FOUND` if any of the requested products cannot be found.
   * @returns The paginated product data plus a computed `totalPrice`.
   */
  getProducts: baseProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.find({
        collection: "products",
        depth: 2, // Populate "category", "image", "tenant" & "tenant.image"
        where: {
          and: [
            {
              id: {
                in: input.ids,
              },
            },
            {
              isArchived: {
                not_equals: true,
              },
            },
          ],
        },
      });

      if (data.totalDocs !== input.ids.length) {
        notFound("Products not found");
      }

      const totalPrice = data.docs.reduce((acc, product) => {
        const price = Number(product.price);
        return acc + (isNaN(price) ? 0 : price);
      }, 0);

      return {
        ...data,
        totalPrice,
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
