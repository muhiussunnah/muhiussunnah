"use client";

import { useActionState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { shiftStudentAction } from "@/server/actions/students";
import type { ActionResult } from "@/server/actions/_helpers";

type Section = { id: string; name: string; class_id: string; classes: { name_bn: string } };

type Props = {
  schoolSlug: string;
  studentId: string;
  currentSectionId: string | null;
  sections: Section[];
};

export function ShiftForm({ schoolSlug, studentId, currentSectionId, sections }: Props) {
  const t = useTranslations("studentsExtra");
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(shiftStudentAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.ok) toast.success(state.message ?? t("shift_done"));
    else toast.error(state.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="schoolSlug" value={schoolSlug} />
      <input type="hidden" name="student_id" value={studentId} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="to_section_id">{t("shift_new_section")}</Label>
        <Select name="to_section_id" required>
          <SelectTrigger id="to_section_id" className="w-60">
            <SelectValue placeholder={t("shift_placeholder")} />
          </SelectTrigger>
          <SelectContent>
            {sections.filter((s) => s.id !== currentSectionId).map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.classes.name_bn} — {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-1 min-w-40 flex-col gap-1.5">
        <Label htmlFor="reason">{t("shift_reason_label")}</Label>
        <Input id="reason" name="reason" placeholder={t("shift_reason_placeholder")} />
      </div>

      <Button type="submit" disabled={pending} className="bg-gradient-primary text-white">
        {pending ? "..." : t("shift_cta")}
      </Button>
    </form>
  );
}
