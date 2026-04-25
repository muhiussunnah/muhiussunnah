"use client";

import { useMemo, useState } from "react";
import { Calculator, TrendingUp, Wallet, Target } from "lucide-react";

/**
 * Live earnings calculator — drives the entire affiliate pitch.
 *
 * Two sliders:
 *   - schools onboarded
 *   - average monthly plan
 * Computes annual / monthly / per-month breakdown for both
 * partner and platform sides under the 50/50 split.
 */

type Locale = "bn" | "en";

type Strings = {
  heading: string;
  subheading: string;
  sliderSchoolsLabel: string;
  sliderPlanLabel: string;
  perMonth: string;
  perYear: string;
  yourShareTitle: string;
  yourShareSubtitle: string;
  monthlyEarnLabel: string;
  yearlyEarnLabel: string;
  totalRevenueLabel: string;
  splitNote: string;
  cta: string;
  bdtLabel: string;
};

const strings: Record<Locale, Strings> = {
  bn: {
    heading: "আপনার আয়ের হিসাব",
    subheading: "স্লাইডার দিয়ে দেখুন কত স্কুল-মাদ্রাসা আনলে কত আয় হবে",
    sliderSchoolsLabel: "প্রতিষ্ঠান (মাদ্রাসা/স্কুল)",
    sliderPlanLabel: "গড় মাসিক প্ল্যান",
    perMonth: "/ মাস",
    perYear: "/ বছর",
    yourShareTitle: "আপনার ভাগ (৫০%)",
    yourShareSubtitle: "প্ল্যাটফর্মের সাথে ৫০/৫০ ভাগাভাগি",
    monthlyEarnLabel: "মাসিক আয়",
    yearlyEarnLabel: "বার্ষিক আয়",
    totalRevenueLabel: "মোট রাজস্ব",
    splitNote:
      "এই হিসাব শুধু সাবস্ক্রিপশন আয় থেকে। SMS রিচার্জ, প্রিমিয়াম অ্যাড-অন থেকেও আপনার ভাগ আসবে।",
    cta: "এখনই শুরু করুন",
    bdtLabel: "টাকা",
  },
  en: {
    heading: "Your earnings, live",
    subheading: "Slide to see how many schools at what plan brings what income",
    sliderSchoolsLabel: "Institutions (Madrasa / School)",
    sliderPlanLabel: "Average monthly plan",
    perMonth: "/ month",
    perYear: "/ year",
    yourShareTitle: "Your share (50%)",
    yourShareSubtitle: "Equal 50/50 split with the platform",
    monthlyEarnLabel: "Monthly income",
    yearlyEarnLabel: "Yearly income",
    totalRevenueLabel: "Total revenue",
    splitNote:
      "This is from subscriptions alone. SMS recharges + premium add-ons also share with you.",
    cta: "Start now",
    bdtLabel: "BDT",
  },
};

const PLAN_OPTIONS = [
  { value: 1000, label: "Starter ৳1,000" },
  { value: 2000, label: "Growth ৳2,000" },
  { value: 4000, label: "Scale ৳4,000" },
];

function formatBDT(n: number, locale: Locale): string {
  const formatted = n.toLocaleString("en-IN");
  if (locale === "en") return `৳${formatted}`;
  // Convert digits to Bangla numerals for the Bangla version
  const bn = formatted.replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);
  return `৳${bn}`;
}

export function EarningsCalculator({ locale }: { locale: Locale }) {
  const t = strings[locale];
  const [schools, setSchools] = useState(500);
  const [plan, setPlan] = useState(1000);

  const numbers = useMemo(() => {
    const monthlyRevenue = schools * plan;
    const yearlyRevenue = monthlyRevenue * 12;
    const partnerYearly = yearlyRevenue / 2;
    const partnerMonthly = monthlyRevenue / 2;
    return { monthlyRevenue, yearlyRevenue, partnerYearly, partnerMonthly };
  }, [schools, plan]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-accent/5 p-6 md:p-10 shadow-2xl shadow-primary/15">
      {/* Decorative blurs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-20 -end-20 size-72 rounded-full bg-primary/30 blur-[120px]" />
        <div className="absolute -bottom-20 -start-20 size-72 rounded-full bg-accent/20 blur-[120px]" />
      </div>

      <div className="relative">
        <div className="mb-6 flex items-start gap-3">
          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-lg shadow-primary/30">
            <Calculator className="size-6" />
          </span>
          <div>
            <h3 className="text-2xl font-bold tracking-tight md:text-3xl">{t.heading}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t.subheading}</p>
          </div>
        </div>

        {/* Sliders */}
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-sm">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">{t.sliderSchoolsLabel}</label>
              <span className="text-2xl font-bold text-gradient-primary">
                {locale === "bn" ? schools.toLocaleString("en-IN").replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]) : schools.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={2000}
              step={50}
              value={schools}
              onChange={(e) => setSchools(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
              <span>50</span>
              <span>2,000</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-sm">
            <div className="mb-2">
              <label className="text-sm font-medium">{t.sliderPlanLabel}</label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {PLAN_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPlan(opt.value)}
                  className={`rounded-xl px-2 py-2 text-xs font-medium transition cursor-pointer ${
                    plan === opt.value
                      ? "bg-gradient-primary text-white shadow-md shadow-primary/30"
                      : "border border-border/60 bg-background/50 text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result cards */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {/* Total revenue card */}
          <div className="rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="size-3.5" />
              {t.totalRevenueLabel} ({t.perYear.trim()})
            </div>
            <div className="mt-2 text-2xl font-bold">{formatBDT(numbers.yearlyRevenue, locale)}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {formatBDT(numbers.monthlyRevenue, locale)} {t.perMonth}
            </div>
          </div>

          {/* Partner monthly */}
          <div className="rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/15 via-card to-accent/10 p-5 backdrop-blur-sm shadow-lg shadow-primary/20">
            <div className="flex items-center gap-2 text-xs text-primary font-semibold">
              <Wallet className="size-3.5" />
              {t.monthlyEarnLabel} ({t.yourShareTitle})
            </div>
            <div className="mt-2 text-3xl font-bold text-gradient-primary">
              {formatBDT(numbers.partnerMonthly, locale)}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {t.perMonth} · {t.bdtLabel}
            </div>
          </div>

          {/* Partner yearly */}
          <div className="rounded-2xl border-2 border-success/40 bg-gradient-to-br from-success/15 via-card to-success/5 p-5 backdrop-blur-sm shadow-lg shadow-success/20">
            <div className="flex items-center gap-2 text-xs text-success font-semibold">
              <Target className="size-3.5" />
              {t.yearlyEarnLabel}
            </div>
            <div className="mt-2 text-3xl font-bold text-success">
              {formatBDT(numbers.partnerYearly, locale)}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{t.yourShareSubtitle}</div>
          </div>
        </div>

        <p className="mt-5 text-xs text-muted-foreground italic">{t.splitNote}</p>
      </div>
    </div>
  );
}
