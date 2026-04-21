import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Home, LifeBuoy, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default async function DashboardNotFound() {
  const t = await getTranslations("dashboardNotFound");
  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-3xl flex-col items-center justify-center py-12 text-center">
      <div
        className="pointer-events-none absolute -top-8 start-1/4 size-56 rounded-full bg-primary/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-12 end-1/4 size-56 rounded-full bg-accent/15 blur-3xl"
        aria-hidden
      />

      <div className="relative">
        <h1 className="select-none text-[9rem] md:text-[11rem] font-black leading-none tracking-tighter bg-gradient-to-br from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
          404
        </h1>

        <h2 className="mt-2 text-2xl md:text-3xl font-bold text-foreground">
          {t("title")}
        </h2>
        <p className="mt-3 max-w-xl text-sm md:text-base text-muted-foreground leading-relaxed">
          {t("body")}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/admin"
            className={buttonVariants({ size: "lg", className: "bg-gradient-primary text-white shadow-lg shadow-primary/30" })}
          >
            <Home className="size-4" />
            {t("cta_dashboard")}
          </Link>
          <Link
            href="/students"
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            <Search className="size-4" />
            {t("cta_students")}
          </Link>
          <Link
            href="/tickets"
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            <LifeBuoy className="size-4" />
            {t("cta_support")}
          </Link>
        </div>

      </div>
    </div>
  );
}
