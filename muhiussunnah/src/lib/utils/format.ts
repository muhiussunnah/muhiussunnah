/**
 * Locale-aware formatters — numbers, currency, percentages, dates.
 *
 * Bangladesh convention: Indian numbering (lakh / crore) with the ৳ symbol;
 * digit script follows the active locale (Bangla / English / Arabic-Indic).
 *
 * FRONTEND_UX_GUIDE §6.3: store ASCII, display locale-native.
 * Keep raw numbers/dates in state; format at the display boundary only.
 */

import { localiseNumber } from "./number";
import type { Locale } from "@/lib/i18n/config";

/** BCP-47 tag for each supported UI locale, used with `Intl.*`. */
const intlTag: Record<Locale, string> = {
  bn: "bn-BD",
  en: "en-US",
  ur: "ur-PK",
  ar: "ar-SA",
};

/** Which digit system to use for a given UI locale. */
function digitsFor(locale: Locale): "bn" | "en" | "ar" {
  if (locale === "bn") return "bn";
  if (locale === "ar" || locale === "ur") return "ar";
  return "en";
}

// ─────────────────────────────────────────────────────────────
// CURRENCY — Bangladesh Taka (৳)
// ─────────────────────────────────────────────────────────────

/**
 * ৳ 1,23,45,678 — Indian grouping, locale-native digits.
 *
 *   formatTaka(850000, "bn") → "৳ ৮,৫০,০০০"
 *   formatTaka(850000, "en") → "৳ 8,50,000"
 */
export function formatTaka(
  amount: number | string | null | undefined,
  locale: Locale = "bn",
  options: { withSymbol?: boolean; compact?: boolean; decimals?: number } = {},
): string {
  const { withSymbol = true, compact = false, decimals = 0 } = options;
  if (amount === null || amount === undefined || amount === "") return "";
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(n)) return "";

  if (compact) return compactTaka(n, locale, withSymbol);

  const grouped = n.toLocaleString("en-IN", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
  const final = localiseNumber(grouped, digitsFor(locale));
  return withSymbol ? `৳ ${final}` : final;
}

/** Short Taka — uses lakh/crore in bn, same units (written in Latin) in en. */
function compactTaka(n: number, locale: Locale, withSymbol: boolean): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "−" : "";
  const bn = locale === "bn";
  const prefix = withSymbol ? "৳ " : "";

  let value: string;
  let unit: string;
  if (abs >= 10_000_000) {
    value = (abs / 10_000_000).toFixed(2).replace(/\.00$/, "");
    unit = bn ? " কোটি" : " crore";
  } else if (abs >= 100_000) {
    value = (abs / 100_000).toFixed(2).replace(/\.00$/, "");
    unit = bn ? " লক্ষ" : " lakh";
  } else if (abs >= 1_000) {
    value = (abs / 1_000).toFixed(1).replace(/\.0$/, "");
    unit = "K";
  } else {
    return formatTaka(n, locale, { withSymbol });
  }
  return `${sign}${prefix}${localiseNumber(value, digitsFor(locale))}${unit}`;
}

// ─────────────────────────────────────────────────────────────
// COUNTS / NUMBERS
// ─────────────────────────────────────────────────────────────

/** Simple count with Indian thousand separators. 1,248 → ১,২৪৮ (bn) / 1,248 (en) */
export function formatCount(value: number | string | null | undefined, locale: Locale = "bn"): string {
  if (value === null || value === undefined || value === "") return "";
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(n)) return "";
  return localiseNumber(n.toLocaleString("en-IN"), digitsFor(locale));
}

/** Generic non-grouped number. For unit values, IDs, roll numbers etc. */
export function formatNumber(value: number | string | null | undefined, locale: Locale = "bn"): string {
  if (value === null || value === undefined || value === "") return "";
  return localiseNumber(String(value), digitsFor(locale));
}

// ─────────────────────────────────────────────────────────────
// PERCENT / TREND
// ─────────────────────────────────────────────────────────────

/** 94.3% → ৯৪.৩% (bn) / 94.3% (en) */
export function formatPercent(
  value: number | string | null | undefined,
  locale: Locale = "bn",
  decimals = 1,
): string {
  if (value === null || value === undefined || value === "") return "";
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(n)) return "";
  return `${localiseNumber(n.toFixed(decimals), digitsFor(locale))}%`;
}

/** Signed trend: +4.2% / −2.1% — for metric cards. */
export function formatTrend(delta: number | null | undefined, locale: Locale = "bn", decimals = 1): string {
  if (delta === null || delta === undefined) return "";
  if (!Number.isFinite(delta)) return "";
  const sign = delta > 0 ? "+" : delta < 0 ? "−" : "";
  const abs = Math.abs(delta).toFixed(decimals);
  return `${sign}${localiseNumber(abs, digitsFor(locale))}%`;
}

// ─────────────────────────────────────────────────────────────
// DATES
// ─────────────────────────────────────────────────────────────

/**
 * Locale-native date — "21 এপ্রিল 2026" / "21 Apr 2026" / "21 أبريل 2026".
 *
 * Uses `Intl.DateTimeFormat` so month names + weekday names come out
 * correct in every supported language. Digits are left as whatever the
 * platform gives (already localised by Intl), so we don't double-convert.
 */
export function formatDate(
  value: string | Date | null | undefined,
  locale: Locale = "bn",
  style: "long" | "medium" | "short" = "medium",
): string {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  const tag = intlTag[locale];
  const options: Intl.DateTimeFormatOptions =
    style === "long"
      ? { year: "numeric", month: "long", day: "numeric" }
      : style === "short"
        ? { year: "2-digit", month: "2-digit", day: "2-digit" }
        : { year: "numeric", month: "short", day: "numeric" };
  try {
    return new Intl.DateTimeFormat(tag, options).format(d);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

/** Hours + minutes — "9:30 AM" / "৯:৩০ AM". */
export function formatTime(value: string | Date | null | undefined, locale: Locale = "bn"): string {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  try {
    return new Intl.DateTimeFormat(intlTag[locale], { hour: "numeric", minute: "2-digit" }).format(d);
  } catch {
    return "";
  }
}

/** Relative — "5 minutes ago" / "৫ মিনিট আগে". */
export function formatRelativeTime(value: string | Date | null | undefined, locale: Locale = "bn"): string {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  const diffMs = d.getTime() - Date.now();
  const seconds = Math.round(diffMs / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  try {
    const rtf = new Intl.RelativeTimeFormat(intlTag[locale], { numeric: "auto" });
    if (Math.abs(seconds) < 60) return rtf.format(seconds, "second");
    if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
    if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
    if (Math.abs(days) < 30) return rtf.format(days, "day");
    const months = Math.round(days / 30);
    if (Math.abs(months) < 12) return rtf.format(months, "month");
    return rtf.format(Math.round(months / 12), "year");
  } catch {
    return "";
  }
}
