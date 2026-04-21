"use client";

import { useTranslations } from "next-intl";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton() {
  const t = useTranslations("certificates");
  return (
    <Button type="button" size="sm" variant="outline" onClick={() => window.print()}>
      <Printer className="me-1 size-3.5" /> {t("print_button")}
    </Button>
  );
}
