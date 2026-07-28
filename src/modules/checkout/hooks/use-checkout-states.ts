import { parseAsBoolean, useQueryStates } from "nuqs";

/**
 * Hook to manage post-checkout UI states using URL query parameters.
 * Synchronizes 'success' and 'cancel' states directly with the URL (e.g., ?success=true).
 * Automatically removes the parameters from the URL when they match the default value (false).
 */
export function useCheckoutStates() {
  return useQueryStates({
    success: parseAsBoolean.withDefault(false).withOptions({
      clearOnDefault: true,
    }),
    cancel: parseAsBoolean.withDefault(false).withOptions({
      clearOnDefault: true,
    }),
  });
}
