import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

/**
 * tRPC router exposing category-related procedures.
 *
 * Includes:
 * - `getMany`: fetches all root-level categories with their subcategories.
 */
export const categoriesRouter = createTRPCRouter({
  /**
   * Retrieves all root-level categories (those without a parent), sorted
   * alphabetically by name, with their subcategories populated at depth 1.
   *
   * Each returned category includes a flat `subcategories` array of fully
   * typed `Category` objects, derived from the populated relationship docs.
   *
   * @returns An array of root categories, each with a typed `subcategories` list.
   */
  getMany: baseProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.find({
      collection: "categories",
      depth: 1, // Populate subcategories, subcategores.[0] will be a type of "Category"
      pagination: false,
      where: {
        parent: {
          exists: false,
        },
      },
      sort: "name",
    });

    const formattedData = data.docs.map((doc) => ({
      ...doc,
      subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
        // Because of "depth: 1" we are confident "doc" will be a type of "Category"
        ...(doc as Category),
      })),
    }));

    return formattedData;
  }),
});
