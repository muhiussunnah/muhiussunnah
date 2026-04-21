"use client";

import { useActionState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createAssignmentAction } from "@/server/actions/lms";

type Section = { id: string; name_bn: string; class_bn: string };
type Subject = { id: string; name_bn: string };

export function AssignmentForm({ schoolSlug, sections, subjects }: { schoolSlug: string; sections: Section[]; subjects: Subject[] }) {
  const t = useTranslations("assignments");
  const [state, action, pending] = useActionState(createAssignmentAction, null);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state) return;
    if (state.ok) { toast.success(state.message ?? t("form_success")); ref.current?.reset(); }
    else toast.error(state.error);
  }, [state, t]);

  return (
    <form ref={ref} action={action} className="space-y-3">
      <input type="hidden" name="schoolSlug" value={schoolSlug} />
      <div>
        <Label>{t("form_title")}</Label>
        <Input name="title" placeholder={t("form_title_placeholder")} required />
      </div>
      <div>
        <Label>{t("form_description")}</Label>
        <Textarea name="description" placeholder={t("form_description_placeholder")} rows={3} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>{t("form_section")}</Label>
          <select name="section_id" required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">{t("form_select")}</option>
            {sections.map((s) => <option key={s.id} value={s.id}>{s.class_bn} — {s.name_bn}</option>)}
          </select>
        </div>
        <div>
          <Label>{t("form_subject")}</Label>
          <select name="subject_id" required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">{t("form_select")}</option>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name_bn}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>{t("form_due_date")}</Label>
          <Input name="due_date" type="datetime-local" />
        </div>
        <div>
          <Label>{t("form_max_marks")}</Label>
          <Input name="max_marks" type="number" min={0} placeholder="100" />
        </div>
      </div>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? t("form_pending") : t("form_submit")}
      </Button>
    </form>
  );
}
