import { cookies as getCookies } from "next/headers";

interface GenerateAuthCookieProps {
  prefix: string;
  value: string;
}

/**
 * Creates an HttpOnly auth cookie securely.
 * Automatically handles cross-subdomain cookie access in production environments.
 *
 * @param prefix - Prefix used for naming the cookie (e.g., 'session')
 * @param value - The JWT or session token value
 */
export async function generateAuthCookie({
  prefix,
  value,
}: GenerateAuthCookieProps) {
  const cookies = await getCookies();

  cookies.set({
    name: `${prefix}-token`,
    value: value,
    httpOnly: true, // Prevents client-side JS access for security
    path: "/",

    // Dynamically apply production-specific settings for subdomain support
    ...(process.env.NODE_ENV !== "development" &&
      (() => {
        const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

        // Fail fast if production environment lacks the required domain configuration
        if (!rootDomain) {
          throw new Error(
            "CRITICAL: NEXT_PUBLIC_ROOT_DOMAIN is not set in the environment variables.",
          );
        }

        return {
          sameSite: "lax" as const, // Allows subdomain sharing while preventing CSRF
          domain: rootDomain, // Allows the cookie to be read across all subdomains
          secure: true, // Enforces HTTPS-only transmission
        };
      })()),
  });
}
