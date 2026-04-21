"use client";

import { useActionState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { addAcademicYearAction } from "@/server/actions/academic";
import type { ActionResult } from "@/server/actions/_helpers";

export function AddYearForm({ schoolSlug }: { schoolSlug: string }) {
  const t = useTranslations("academicYears");
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(addAcademicYearAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.ok) { toast.success(state.message ?? t("form_added")); formRef.current?.reset(); }
    else toast.error(state.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-3">
      <input type="hidden" name="schoolSlug" value={schoolSlug} />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">{t("form_name_label")}</Label>
        <Input id="name" name="name" required placeholder={t("form_name_placeholder")} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="start_date">{t("form_start_label")}</Label>
          <Input id="start_date" name="start_date" type="date" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="end_date">{t("form_end_label")}</Label>
          <Input id="end_date" name="end_date" type="date" required />
        </div>
      </div>
      <label className="inline-flex items-center gap-2 text-sm">
        <Checkbox name="is_active" /> {t("form_active_label")}
      </label>
      <Button type="submit" disabled={pending} className="mt-1 bg-gradient-primary text-white">
        {pending ? "..." : t("form_cta")}
      </Button>
    </form>
  );
}
