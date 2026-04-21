"use client";

/**
 * <BengaliDate> — locale-aware formatted date with optional Hijri.
 *
 * Auto-detects the active UI locale from next-intl, so the same
 * component reads "১৬ এপ্রিল ২০২৬" in Bangla and "16 April 2026"
 * in English without callers having to pass a locale prop.
 *
 * FRONTEND_UX_GUIDE §6.4: dual calendar (Gregorian + Hijri) for
 * madrasa tenants; `withHijri` appends that second calendar line.
 *
 * An explicit `locale` prop overrides auto-detection.
 */

import { useLocale } from "next-intl";
import { formatDualDate } from "@/lib/utils/date";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  value: Date | string | number | null | undefined;
  withWeekday?: boolean;
  withHijri?: boolean;
  /** Override the auto-detected locale. Usually unnecessary. */
  locale?: Locale;
  className?: string;
};

export function BengaliDate({ value, withWeekday, withHijri, locale, className }: Props) {
  const auto = useLocale() as Locale;
  const resolved = locale ?? auto;
  // formatDualDate only knows bn / en / ar; Urdu maps to Arabic script.
  const mapped: "bn" | "en" | "ar" =
    resolved === "bn" ? "bn" : resolved === "ar" || resolved === "ur" ? "ar" : "en";
  return (
    <span className={className}>
      {formatDualDate(value, { withWeekday, withHijri, locale: mapped })}
    </span>
  );
}
