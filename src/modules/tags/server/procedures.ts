import z from "zod";

import { DEFAULT_LIMIT } from "@/constants";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

/**
 * tRPC router exposing tag-related procedures.
 *
 * Includes:
 * - `getMany`: fetches a paginated list of tags.
 */
export const tagsRouter = createTRPCRouter({
  /**
   * Retrieves a paginated list of tags.
   *
   * @param input.cursor - Page number to fetch (1-indexed). Defaults to `1`.
   * @param input.limit  - Number of tags per page. Defaults to `DEFAULT_LIMIT`.
   *
   * @returns Paginated tag documents as returned by Payload.
   */
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.find({
        collection: "tags",
        page: input.cursor,
        limit: input.limit,
      });

      return data;
    }),
});
