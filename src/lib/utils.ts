import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes conditionally, resolving any conflicting utility classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates the absolute URL for a specific tenant.
 * Uses path-based routing (`/tenants/slug`) in development or when subdomains are disabled,
 * and subdomain routing (`slug.domain.com`) in production.
 *
 * @param tenantSlug - The unique string identifier for the tenant.
 */
export function generateTenantURL(tenantSlug: string) {
  const isDevelopment = process.env.NODE_ENV === "development";
  const isSubdomainRoutingEnabled =
    process.env.NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING === "true";

  // In development or subdomain routing disabled mode, use normal routing
  if (isDevelopment || !isSubdomainRoutingEnabled) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!appUrl) {
      throw new Error(
        "CRITICAL: NEXT_PUBLIC_APP_URL is not set in the environment variables.",
      );
    }

    return `${appUrl}/tenants/${tenantSlug}`;
  }

  const protocol = "https";
  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

  if (!domain) {
    throw new Error(
      "CRITICAL: NEXT_PUBLIC_ROOT_DOMAIN is not set in the environment variables.",
    );
  }

  // In production, use subdomain routing
  return `${protocol}://${tenantSlug}.${domain}`;
}

/**
 * Generates the URL for a path on the main application domain.
 * Automatically handles environment-specific routing logic.
 *
 * @param path - The relative path to append to the main app URL (e.g., "/login").
 */
export function generateMainAppURL(path: string) {
  const isDevelopment = process.env.NODE_ENV === "development";
  const isSubdomainRoutingEnabled =
    process.env.NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING === "true";

  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  if (isDevelopment || !isSubdomainRoutingEnabled) {
    return cleanPath;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    throw new Error(
      "CRITICAL: NEXT_PUBLIC_APP_URL is not set in the environment variables.",
    );
  }

  return `${appUrl}${cleanPath}`;
}

/**
 * Formats a number or numeric string as USD currency with no decimal places.
 */
export function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value));
}
