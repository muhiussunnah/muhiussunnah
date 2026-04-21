/**
 * Dashboard date-range helpers.
 *
 * Parses the ?range / ?from / ?to query params into a well-defined
 * { from, to, prevFrom, prevTo } struct so the server page can
 * run both current-period and prior-period queries in parallel and
 * compute trend deltas.
 *
 * UI-facing labels are returned as **translation keys + optional args**
 * (not raw strings) so the caller can translate them through the
 * message catalog in whichever locale is active.
 */

export type RangePreset =
  | "today"
  | "7d"
  | "30d"
  | "this_month"
  | "last_month"
  | "this_year"
  | "last_year"
  | "365d"
  | "yoy"
  | "custom";

export type ResolvedRange = {
  preset: RangePreset;
  /** i18n key under `dateRange.*` for the current-period label. */
  labelKey: string;
  /** i18n key under `dateRange.*` for the prior-period comparison label. */
  prevLabelKey: string;
  /** If non-null, pass as args to t(labelKey, args). */
  labelArgs?: Record<string, string | number> | null;
  prevLabelArgs?: Record<string, string | number> | null;
  from: string; // ISO yyyy-mm-dd
  to: string;
  prevFrom: string;
  prevTo: string;
};

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function resolveDateRange(search: {
  range?: string;
  from?: string;
  to?: string;
}): ResolvedRange {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const preset = (search.range as RangePreset) || "30d";

  if (preset === "custom" && search.from && search.to) {
    const from = new Date(search.from + "T00:00:00");
    const to = new Date(search.to + "T00:00:00");
    const days = Math.max(1, Math.round((to.getTime() - from.getTime()) / 86400000) + 1);
    return {
      preset: "custom",
      labelKey: "label_custom_with_dates",
      labelArgs: { from: search.from, to: search.to },
      prevLabelKey: "prev_days",
      prevLabelArgs: { count: days },
      from: iso(from),
      to: iso(to),
      prevFrom: iso(addDays(from, -days)),
      prevTo: iso(addDays(from, -1)),
    };
  }

  if (preset === "yoy") {
    const yearStart = new Date(today.getFullYear(), 0, 1);
    const prevYearStart = new Date(today.getFullYear() - 1, 0, 1);
    const prevYearSameDay = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    return {
      preset: "yoy",
      labelKey: "label_this_year_ytd",
      prevLabelKey: "prev_yoy_same",
      from: iso(yearStart),
      to: iso(today),
      prevFrom: iso(prevYearStart),
      prevTo: iso(prevYearSameDay),
    };
  }

  const mkWindow = (days: number, labelKey: string): ResolvedRange => {
    const from = addDays(today, -(days - 1));
    return {
      preset,
      labelKey,
      prevLabelKey: "prev_days",
      prevLabelArgs: { count: days },
      from: iso(from),
      to: iso(today),
      prevFrom: iso(addDays(from, -days)),
      prevTo: iso(addDays(from, -1)),
    };
  };

  switch (preset) {
    case "today":
      return {
        preset,
        labelKey: "label_today",
        prevLabelKey: "prev_yesterday",
        from: iso(today),
        to: iso(today),
        prevFrom: iso(addDays(today, -1)),
        prevTo: iso(addDays(today, -1)),
      };

    case "7d":
      return mkWindow(7, "label_7d");

    case "30d":
      return mkWindow(30, "label_30d");

    case "365d":
      return mkWindow(365, "label_365d");

    case "this_month": {
      const from = new Date(today.getFullYear(), today.getMonth(), 1);
      const prevMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const prevMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      return {
        preset,
        labelKey: "label_this_month",
        prevLabelKey: "prev_month",
        from: iso(from),
        to: iso(today),
        prevFrom: iso(prevMonthStart),
        prevTo: iso(prevMonthEnd),
      };
    }

    case "last_month": {
      const from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const to = new Date(today.getFullYear(), today.getMonth(), 0);
      const prevFrom = new Date(today.getFullYear(), today.getMonth() - 2, 1);
      const prevTo = new Date(today.getFullYear(), today.getMonth() - 1, 0);
      return {
        preset,
        labelKey: "label_last_month",
        prevLabelKey: "prev_month_before",
        from: iso(from),
        to: iso(to),
        prevFrom: iso(prevFrom),
        prevTo: iso(prevTo),
      };
    }

    case "this_year": {
      const from = new Date(today.getFullYear(), 0, 1);
      const prevFrom = new Date(today.getFullYear() - 1, 0, 1);
      const prevTo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
      return {
        preset,
        labelKey: "label_this_year",
        prevLabelKey: "prev_year_ytd",
        from: iso(from),
        to: iso(today),
        prevFrom: iso(prevFrom),
        prevTo: iso(prevTo),
      };
    }

    case "last_year": {
      const from = new Date(today.getFullYear() - 1, 0, 1);
      const to = new Date(today.getFullYear() - 1, 11, 31);
      const prevFrom = new Date(today.getFullYear() - 2, 0, 1);
      const prevTo = new Date(today.getFullYear() - 2, 11, 31);
      return {
        preset,
        labelKey: "label_last_year",
        prevLabelKey: "prev_year_before",
        from: iso(from),
        to: iso(to),
        prevFrom: iso(prevFrom),
        prevTo: iso(prevTo),
      };
    }

    default:
      return mkWindow(30, "label_30d");
  }
}

/**
 * Compute trend % between current and previous period values.
 * Returns null when previous is 0 and current is also 0 (no signal).
 * When previous is 0 and current is > 0, returns 100 (new activity).
 */
export function trendPct(current: number, previous: number): number | null {
  if (previous === 0 && current === 0) return null;
  if (previous === 0) return current > 0 ? 100 : -100;
  return Math.round(((current - previous) / Math.abs(previous)) * 100);
}
