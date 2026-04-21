"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addRoutineRowAction } from "@/server/actions/exams";
import type { ActionResult } from "@/server/actions/_helpers";

type Subject = { id: string; name_bn: string; class_id: string | null; full_marks: number; pass_marks: number };
type Section = { id: string; name: string; class_id: string; classes: { name_bn: string } };

type Props = {
  schoolSlug: string;
  examId: string;
  subjects: Subject[];
  sections: Section[];
};

export function RoutineAddForm({ schoolSlug, examId, subjects, sections }: Props) {
  const t = useTranslations("exams");
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(addRoutineRowAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.ok) { toast.success(state.message ?? t("routine_form_success")); formRef.current?.reset(); setSelectedSubject(""); }
    else toast.error(state.error);
  }, [state, t]);

  const subject = subjects.find((s) => s.id === selectedSubject);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-3">
      <input type="hidden" name="schoolSlug" value={schoolSlug} />
      <input type="hidden" name="exam_id" value={examId} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="subject_id">{t("routine_form_subject")}</Label>
        <Select name="subject_id" value={selectedSubject} onValueChange={(v: string | null) => v && setSelectedSubject(v)} required>
          <SelectTrigger id="subject_id"><SelectValue placeholder={t("form_year_placeholder")} /></SelectTrigger>
          <SelectContent>
            {subjects.map((s) => (<SelectItem key={s.id} value={s.id}>{s.name_bn}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="section_id">{t("detail_class_section_col")}</Label>
        <Select name="section_id" required>
          <SelectTrigger id="section_id"><SelectValue placeholder={t("form_year_placeholder")} /></SelectTrigger>
          <SelectContent>
            {sections.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.classes.name_bn} — {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="date">{t("routine_form_date")}</Label>
          <Input id="date" name="date" type="date" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="start_time">{t("routine_form_time")}</Label>
          <Input id="start_time" name="start_time" type="time" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="duration_mins">{t("routine_form_time")} (m)</Label>
          <Input id="duration_mins" name="duration_mins" type="number" min={1} placeholder="90" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="full_marks">{t("routine_form_total_marks")}</Label>
          <Input id="full_marks" name="full_marks" type="number" min={1} defaultValue={subject?.full_marks ?? 100} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pass_marks">{t("routine_form_pass_marks")}</Label>
          <Input id="pass_marks" name="pass_marks" type="number" min={0} defaultValue={subject?.pass_marks ?? 33} />
        </div>
      </div>

      <Button type="submit" disabled={pending} className="mt-1 bg-gradient-primary text-white">
        {pending ? t("routine_form_pending") : t("routine_form_submit")}
      </Button>
    </form>
  );
}
