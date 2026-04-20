import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://muhiussunnah.vercel.app";

/**
 * Dynamic sitemap.xml generator. Enumerates every indexable public route
 * with proper lastModified / changeFrequency / priority hints. Google +
 * Bing fetch this via /sitemap.xml; we also reference it from robots.ts.
 *
 * Per-locale URLs aren't exposed at distinct paths (our i18n is cookie-
 * based so all locales share the same canonical URL), so we emit one
 * entry per page and use the alternates array to tell search engines
 * which languages are available.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const alternates = {
    languages: {
      "bn-BD": `${SITE_URL}/`,
      "en-US": `${SITE_URL}/`,
      "ur-PK": `${SITE_URL}/`,
      "ar-SA": `${SITE_URL}/`,
    },
  };

  const pages: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "/",              changeFrequency: "weekly",  priority: 1.0 },
    { path: "/features",      changeFrequency: "monthly", priority: 0.9 },
    { path: "/pricing",       changeFrequency: "monthly", priority: 0.9 },
    { path: "/pricing/lifetime", changeFrequency: "monthly", priority: 0.8 },
    { path: "/pricing/starter",  changeFrequency: "monthly", priority: 0.8 },
    { path: "/pricing/growth",   changeFrequency: "monthly", priority: 0.8 },
    { path: "/pricing/scale",    changeFrequency: "monthly", priority: 0.8 },
    { path: "/about",         changeFrequency: "monthly", priority: 0.7 },
    { path: "/contact",       changeFrequency: "yearly",  priority: 0.6 },
    { path: "/support",       changeFrequency: "monthly", priority: 0.6 },
    { path: "/refund-policy", changeFrequency: "yearly",  priority: 0.4 },
    { path: "/register-school", changeFrequency: "monthly", priority: 0.8 },
    { path: "/login",         changeFrequency: "yearly",  priority: 0.3 },
  ];

  return pages.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
    alternates,
  }));
}
