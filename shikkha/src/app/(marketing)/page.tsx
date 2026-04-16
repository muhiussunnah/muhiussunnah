import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  CreditCard,
  Languages,
  LayoutDashboard,
  MessageSquare,
  ShieldCheck,
  Smartphone,
  Users,
  WifiOff,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BanglaDigit } from "@/components/ui/bangla-digit";

const differentiators = [
  { icon: CreditCard,      title: "অনলাইন ফি পেমেন্ট",     body: "bKash, Nagad, Rocket, কার্ড — এক ক্লিকে।" },
  { icon: Smartphone,      title: "অভিভাবক মোবাইল অ্যাপ",  body: "PWA · offline-capable · তাৎক্ষণিক নোটিফিকেশন।" },
  { icon: LayoutDashboard, title: "লাইভ ড্যাশবোর্ড",        body: "Realtime attendance ring · instant updates।" },
  { icon: WifiOff,         title: "Offline Attendance",     body: "গ্রামের দুর্বল ইন্টারনেটেও কাজ করবে।" },
  { icon: Users,           title: "Granular Permissions",    body: "ক্লাস-টিচার ≠ বিষয়-টিচার। প্রতিটি স্কোপ আলাদা।" },
  { icon: MessageSquare,   title: "WhatsApp + SMS + Push",    body: "একসাথে ৫৬৮ অভিভাবকে ১৪ সেকেন্ডে।" },
  { icon: BookOpenText,    title: "মাদ্রাসা মডিউল",          body: "হিফজ · কিতাব · সবক-সবকী-মানজিল ডেইলি লগ।" },
  { icon: Languages,       title: "Tri-lingual + হিজরি",     body: "বাংলা · English · العربية · Hijri calendar।" },
];

export default function LandingPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-10 px-6 py-20 text-center md:px-10 md:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            🇧🇩 বাংলাদেশের জন্য তৈরি · Unicode first · Dark-mode native
          </span>
          <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            স্কুল ও মাদ্রাসার জন্য{" "}
            <span className="text-gradient-primary">সম্পূর্ণ ব্যবস্থাপনা</span>
          </h1>
          <p className="max-w-2xl text-balance text-base text-muted-foreground md:text-lg">
            ভর্তি থেকে পরীক্ষা, ফি থেকে অভিভাবক যোগাযোগ — সব এক প্ল্যাটফর্মে।
            অনলাইন পেমেন্ট · লাইভ ড্যাশবোর্ড · অফলাইন অ্যাটেনডেন্স · মাদ্রাসা মডিউল।
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/register-school"
              className={buttonVariants({ size: "lg", className: "bg-gradient-primary text-white" })}
            >
              বিনামূল্যে শুরু করুন <ArrowRight className="ms-2 size-4" />
            </Link>
            <Link href="/login" className={buttonVariants({ size: "lg", variant: "outline" })}>
              লগইন করুন
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5" /> SSL encrypted
            </span>
            <span>·</span>
            <span>৩০ দিনের ফ্রি ট্রায়াল</span>
            <span>·</span>
            <span>কোন কার্ড লাগবে না</span>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="mb-12 flex flex-col items-center gap-3 text-center">
          <span className="text-xs font-medium uppercase tracking-widest text-primary">
            Why Shikkha
          </span>
          <h2 className="max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
            Bornomala-এ যা আছে — সব আছে।{" "}
            <span className="text-gradient-primary">প্লাস যা ওদের নেই।</span>
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {differentiators.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="border-border/60 bg-card/60 transition hover:shadow-hover">
              <CardContent className="flex flex-col gap-2 p-5">
                <Icon className="size-6 text-primary" aria-hidden />
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto w-full max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <span className="text-xs font-medium uppercase tracking-widest text-primary">
            Pricing
          </span>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            সাশ্রয়ী · স্বচ্ছ · স্কেল-ready
          </h2>
          <p className="text-sm text-muted-foreground">
            ছোট স্কুল থেকে বড় চেইন মাদ্রাসা — প্রতিটি প্রতিষ্ঠানের জন্য উপযুক্ত প্ল্যান।
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <PricingCard title="Basic" priceBdt={1500} features={["৩০০ ছাত্র", "১ শাখা", "Parent portal", "SMS"]} />
          <PricingCard title="Pro" priceBdt={3500} popular features={["১,০০০ ছাত্র", "২ শাখা", "+ Online payments", "+ WhatsApp", "+ AI reports"]} />
          <PricingCard title="Madrasa Pro" priceBdt={3500} features={["১,০০০ ছাত্র", "২ শাখা", "+ Hifz / Kitab / Sabaq", "+ Hijri calendar", "+ Arabic RTL"]} />
        </div>
      </section>
    </>
  );
}

function PricingCard({
  title,
  priceBdt,
  features,
  popular,
}: {
  title: string;
  priceBdt: number;
  features: string[];
  popular?: boolean;
}) {
  return (
    <Card
      className={
        popular
          ? "border-primary/60 shadow-hover ring-1 ring-primary/40"
          : "border-border/60"
      }
    >
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          {popular ? (
            <span className="rounded-full bg-gradient-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
              জনপ্রিয়
            </span>
          ) : null}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">৳ <BanglaDigit value={priceBdt.toLocaleString("en-IN")} /></span>
          <span className="text-sm text-muted-foreground">/ মাস</span>
        </div>
        <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <Link
          href="/register-school"
          className={buttonVariants({
            variant: popular ? "default" : "outline",
            className: popular ? "bg-gradient-primary text-white" : "",
          })}
        >
          শুরু করুন
        </Link>
      </CardContent>
    </Card>
  );
}
