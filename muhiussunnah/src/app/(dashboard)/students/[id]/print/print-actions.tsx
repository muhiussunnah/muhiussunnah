"use client";

import { useTranslations } from "next-intl";
import { Printer, X, Info } from "lucide-react";

export function PrintActions() {
  const t = useTranslations("studentPrint");
  return (
    <div className="mb-4 flex flex-col gap-2 print:hidden">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => window.close()}
          className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted cursor-pointer"
        >
          <X className="size-3.5" />
          {t("action_close")}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-md bg-gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/30 hover:opacity-90 cursor-pointer"
        >
          <Printer className="size-4" />
          {t("action_print")}
        </button>
      </div>
      {/*
        Browser-injected page headers (date/time, page URL, page numbers)
        cannot be removed with CSS — they're controlled by the user's
        print dialog. One-line hint so the principal knows where to
        toggle for a perfectly clean printed sheet.
      */}
      <p className="rounded-md border border-info/30 bg-info/5 px-3 py-2 text-xs text-info-foreground/90 dark:text-info">
        <Info className="me-1 inline size-3.5 align-text-bottom" />
        প্রিন্ট ডায়ালগে &quot;More settings&quot; → &quot;Headers and footers&quot; uncheck করুন। তাহলে উপরে-নিচে URL/তারিখ আসবে না।
      </p>
    </div>
  );
}
