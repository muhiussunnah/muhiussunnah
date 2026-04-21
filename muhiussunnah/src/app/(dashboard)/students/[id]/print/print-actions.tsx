"use client";

import { useTranslations } from "next-intl";
import { Printer, X } from "lucide-react";

export function PrintActions() {
  const t = useTranslations("studentPrint");
  return (
    <div className="mb-4 flex items-center justify-between print:hidden">
      <button
        type="button"
        onClick={() => window.close()}
        className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted"
      >
        <X className="size-3.5" />
        {t("action_close")}
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-1.5 rounded-md bg-gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/30 hover:opacity-90"
      >
        <Printer className="size-4" />
        {t("action_print")}
      </button>
    </div>
  );
}
