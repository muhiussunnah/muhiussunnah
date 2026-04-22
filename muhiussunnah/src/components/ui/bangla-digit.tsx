"use client";

/**
 * <BanglaDigit> — locale-aware digit renderer.
 *
 * Automatically picks the right digit system from the active next-intl
 * locale:
 *   • bn       → Bangla digits (০১২৩…)
 *   • ar / ur  → Arabic-Indic digits (٠١٢٣…)
 *   • en       → English digits (0123…)
 *
 * An optional `locale` prop overrides auto-detection — useful when a
 * number should stay in one script regardless of UI language (e.g. an
 * invoice number printed for a Bangladeshi institution).
 *
 * Data STAYS English / ASCII in storage; this is purely presentational.
 * FRONTEND_UX_GUIDE §6.3: numbers stored English, shown locale-native.
 */

import { useLocale } from "next-intl";
import { localiseNumber } from "@/lib/utils/number";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  value: string | number | null | undefined;
  /** Override the auto-detected locale. Prefer letting next-intl decide. */
  locale?: Locale;
  className?: string;
};

export function BanglaDigit({ value, locale, className }: Props) {
  const auto = useLocale() as Locale;
  const resolved = locale ?? auto;
  const digitSystem: "bn" | "en" = resolved === "bn" ? "bn" : "en";
  return <span className={className}>{localiseNumber(value, digitSystem)}</span>;
}
