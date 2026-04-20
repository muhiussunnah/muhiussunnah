import { GoogleAnalytics } from "@next/third-parties/google";

/**
 * Production GA4 measurement ID. Hard-coded as the default so analytics
 * work the moment the site deploys, without waiting on a Vercel env var.
 * Can still be overridden per-environment via NEXT_PUBLIC_GA_ID (useful
 * for staging to point at a separate property).
 */
const DEFAULT_GA_ID = "G-RPS3F3FFWD";

export function AnalyticsProvider() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || DEFAULT_GA_ID;
  if (!gaId) return null;
  return <GoogleAnalytics gaId={gaId} />;
}
