import { TRPCError } from "@trpc/server";
import z from "zod";

import { Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

/**
 * tRPC router exposing tenant-related procedures.
 *
 * Includes:
 * - `getOne`: fetches a single tenant by its unique slug.
 */
export const tenantsRouter = createTRPCRouter({
  /**
   * Retrieves a single tenant by its unique slug.
   *
   * The tenant document is returned at depth 1, so the `image`
   * relation is fully populated as a `Media` object.
   *
   * @param input.slug - The unique slug identifying the tenant.
   *
   * @throws {TRPCError} `NOT_FOUND` if no tenant matches the given slug.
   * @returns The tenant document with its `image` relation typed as `Media | null`.
   */
  getOne: baseProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const tenantsData = await ctx.db.find({
        collection: "tenants",
        depth: 1, // "tenant.image" is a type of "Media"
        where: {
          slug: {
            equals: input.slug,
          },
        },
        limit: 1,
        pagination: false,
      });

      const tenant = tenantsData.docs[0];

      if (!tenant) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Tenant not found" });
      }

      return tenant as Tenant & { image: Media | null };
    }),
});
