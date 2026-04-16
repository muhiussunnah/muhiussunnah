/**
 * i18n configuration.
 *
 * Primary: bn (Bangla). Fallback: en (English). Optional: ar (Arabic, RTL) —
 * enabled automatically for madrasa tenants via locale cookie.
 *
 * We use COOKIE-based locale switching (not URL prefix) because our
 * route structure already carries meaningful segments (/school/[slug]/...).
 * Adding a locale prefix would deepen every URL unnecessarily.
 */

export const locales = ["bn", "en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "bn";

export const localeCookieName = "shikkha-locale";

export const localeDirection: Record<Locale, "ltr" | "rtl"> = {
  bn: "ltr",
  en: "ltr",
  ar: "rtl",
};

export const localeDisplayName: Record<Locale, string> = {
  bn: "বাংলা",
  en: "English",
  ar: "العربية",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
