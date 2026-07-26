import { headers as getHeaders } from "next/headers";

import { TRPCError } from "@trpc/server";
import type { BasePayload } from "payload";

import { stripe } from "@/lib/stripe";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { loginSchema, registerSchema } from "../schemas";
import { generateAuthCookie } from "../utils";

/**
 * Authenticates a user against the database and sets the resulting
 * auth token as an HTTP-only cookie.
 *
 * This centralises the "login + set cookie" flow shared by both the
 * `register` and `login` procedures below, avoiding duplicated logic.
 *
 * @param ctx - The tRPC context, providing access to the database instance
 *              (expects `ctx.db.login` and `ctx.db.config.cookiePrefix`).
 * @param email - The user's email address.
 * @param password - The user's plaintext password.
 * @returns The login response data (including the auth token) returned by the database.
 * @throws {TRPCError} With code `UNAUTHORIZED` if no token is returned from the login attempt.
 */
async function loginAndSetCookie(
  ctx: { db: BasePayload },
  email: string,
  password: string,
) {
  const data = await ctx.db.login({
    collection: "users",
    data: { email, password },
  });

  if (!data.token) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Failed to login",
    });
  }

  await generateAuthCookie({
    prefix: ctx.db.config.cookiePrefix,
    value: data.token,
  });

  return data;
}

/**
 * tRPC router exposing authentication-related procedures.
 *
 * Includes:
 * - `session`: retrieves the current session based on request headers.
 * - `register`: creates a new tenant, Stripe account, and user, then logs the user in.
 * - `login`: authenticates an existing user and sets the auth cookie.
 */
export const authRouter = createTRPCRouter({
  /**
   * Retrieves the current authenticated session (if any) based on the
   * incoming request headers.
   *
   * @returns The current session object as resolved by `ctx.db.auth`.
   */
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();

    const session = await ctx.db.auth({ headers });

    return session;
  }),

  /**
   * Registers a new user.
   *
   * Steps performed:
   * 1. Ensures the requested username is not already taken.
   * 2. Creates a new Stripe connected account for the user's tenant.
   * 3. Creates a new tenant record linked to the Stripe account.
   * 4. Creates the user record, associating it with the new tenant.
   * 5. Logs the newly created user in and sets the auth cookie.
   *
   * @throws {TRPCError} `BAD_REQUEST` if the username is already taken.
   * @throws {TRPCError} `BAD_REQUEST` if Stripe account creation fails.
   * @throws {TRPCError} `UNAUTHORIZED` if the login after registration fails.
   */
  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      const existingData = await ctx.db.find({
        collection: "users",
        limit: 1,
        where: {
          username: {
            equals: input.username,
          },
        },
      });

      const existingUser = existingData.docs[0];

      if (existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username already taken",
        });
      }

      const account = await stripe.accounts.create({});

      if (!account) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to create Stripe account",
        });
      }

      const tenant = await ctx.db.create({
        collection: "tenants",
        data: {
          name: input.username,
          slug: input.username,
          stripeAccountId: account.id,
        },
      });

      await ctx.db.create({
        collection: "users",
        data: {
          email: input.email,
          username: input.username,
          password: input.password, // This will be hashed
          tenants: [
            {
              tenant: tenant.id,
            },
          ],
        },
      });

      await loginAndSetCookie(ctx, input.email, input.password);
    }),

  /**
   * Authenticates an existing user using email and password credentials,
   * and sets the resulting auth token as a cookie.
   *
   * @returns The login response data (including the auth token).
   * @throws {TRPCError} `UNAUTHORIZED` if the login attempt fails.
   */
  login: baseProcedure.input(loginSchema).mutation(async ({ input, ctx }) => {
    return loginAndSetCookie(ctx, input.email, input.password);
  }),
});
