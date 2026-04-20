import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://muhiussunnah.app";

/**
 * Dynamic robots.txt. Allows all search bots on public content while
 * disallowing authenticated / internal surfaces (tenant dashboards,
 * private APIs, Next.js internals). Points to the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/school/",
          "/super-admin/",
          "/_next/",
          "/login",
          "/register-school",
          "/forgot-password",
          "/reset-password",
          "/s/*/admin",
          "/*?*", // any URL with query params (filters, tracking)
        ],
      },
      {
        // Extra-aggressive cache for Googlebot's image crawler.
        userAgent: "Googlebot-Image",
        allow: ["/", "/icon-512.svg", "/favicon.svg", "/payments/", "/icons/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
