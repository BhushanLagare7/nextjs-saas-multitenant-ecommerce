import type { MetadataRoute } from "next";

/**
 * Generates the robots.txt configuration for search engine crawlers.
 */
export default function robots(): MetadataRoute.Robots {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    throw new Error(
      "CRITICAL: NEXT_PUBLIC_APP_URL is not set in the environment variables.",
    );
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
