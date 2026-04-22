/**
 * i18n configuration.
 *
 * Supported locales: bn (default), en.
 *
 * Urdu + Arabic were scoped out for the initial release — only Bangla
 * and English show in the switcher. Re-adding them later is just a
 * matter of putting them back in `locales` and filling the catalogs.
 *
 * Cookie-based locale switching (no URL prefix) — our routes already
 * carry tenant slugs, so adding a locale prefix would bloat URLs.
 */

export const locales = ["bn", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "bn";

export const localeCookieName = "shikkha-locale";

export const localeDirection: Record<Locale, "ltr" | "rtl"> = {
  bn: "ltr",
  en: "ltr",
};

export const localeDisplayName: Record<Locale, string> = {
  bn: "বাংলা",
  en: "English",
};

export const localeFlag: Record<Locale, string> = {
  bn: "🇧🇩",
  en: "🇬🇧",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
