import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { createTRPCContext } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";

/**
 * Handles incoming HTTP requests for tRPC operations.
 *
 * Uses the Fetch API adapter to route requests to the tRPC router.
 * Automatically preserves the original request body encoding (e.g. FormData
 * for file uploads) thanks to `fetchRequestHandler`'s internal handling.
 *
 * @param req - The incoming `Request` to handle.
 * @returns A `Response` object suitable for returning from the API route.
 */
function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });
}

export { handler as GET, handler as POST };
