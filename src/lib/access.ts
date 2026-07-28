import { ClientUser } from "payload";

import type { User } from "@/payload-types";

/**
 * Checks if the provided user has the "super-admin" role.
 *
 * @param user - The user object to evaluate, or null.
 * @returns True if the user has the super-admin role, false otherwise.
 */
export function isSuperAdmin(user: User | ClientUser | null) {
  return Boolean(user?.roles?.includes("super-admin"));
}
