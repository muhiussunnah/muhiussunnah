"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addExamAction } from "@/server/actions/exams";
import type { ActionResult } from "@/server/actions/_helpers";

type Year = { id: string; name: string; is_active: boolean };
type Props = { schoolSlug: string; years: Year[] };

export function AddExamForm({ schoolSlug, years }: Props) {
  const t = useTranslations("exams");
  const router = useRouter();
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(addExamAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success(state.message ?? t("form_success"));
      if (state.redirect) router.push(state.redirect);
    } else {
      toast.error(state.error);
    }
  }, [state, router, t]);

  const activeYear = years.find((y) => y.is_active);

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="schoolSlug" value={schoolSlug} />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">{t("form_name")}</Label>
        <Input id="name" name="name" required placeholder={t("form_name_placeholder")} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="type">{t("form_type")}</Label>
          <Select name="type" defaultValue="term">
            <SelectTrigger id="type">
              <SelectValue>
                {(v: unknown) => {
                  const k = typeof v === "string" ? v : "term";
                  try { return t(`type_${k}`); } catch { return k; }
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="term">{t("type_term")}</SelectItem>
              <SelectItem value="annual">{t("type_annual")}</SelectItem>
              <SelectItem value="model_test">{t("type_model_test")}</SelectItem>
              <SelectItem value="monthly">{t("type_monthly")}</SelectItem>
              <SelectItem value="other">{t("type_other")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="academic_year_id">{t("form_year")}</Label>
          <Select name="academic_year_id" defaultValue={activeYear?.id} required>
            <SelectTrigger id="academic_year_id"><SelectValue placeholder={t("form_year_placeholder")} /></SelectTrigger>
            <SelectContent>
              {years.map((y) => (<SelectItem key={y.id} value={y.id}>{y.name}{y.is_active ? t("form_year_active_suffix") : ""}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="start_date">{t("form_start")}</Label>
          <Input id="start_date" name="start_date" type="date" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="end_date">{t("form_end")}</Label>
          <Input id="end_date" name="end_date" type="date" />
        </div>
      </div>
      <Button type="submit" disabled={pending || years.length === 0} className="mt-1 bg-gradient-primary text-white">
        {pending ? t("form_pending") : t("form_submit")}
      </Button>
    </form>
  );
}
