"use client";

import { useActionState, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitAssignmentAction } from "@/server/actions/lms";

export function SubmitForm({ schoolSlug, assignmentId, studentId, existingBody, existingFile }: {
  schoolSlug: string;
  assignmentId: string;
  studentId: string;
  existingBody: string | null;
  existingFile: string | null;
}) {
  const t = useTranslations("portal");
  const [state, action, pending] = useActionState(submitAssignmentAction, null);
  const [open, setOpen] = useState(!existingBody && !existingFile);

  useEffect(() => {
    if (!state) return;
    if (state.ok) { toast.success(state.message ?? t("assignments_submit_success")); setOpen(false); }
    else toast.error(state.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>{t("assignments_edit")}</Button>
    );
  }

  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="schoolSlug" value={schoolSlug} />
      <input type="hidden" name="assignment_id" value={assignmentId} />
      <input type="hidden" name="student_id" value={studentId} />
      <div>
        <Label>{t("assignments_write_answer")}</Label>
        <Textarea name="body" defaultValue={existingBody ?? ""} rows={5} placeholder={t("assignments_answer_placeholder")} />
      </div>
      <div>
        <Label>{t("assignments_or_file_url")}</Label>
        <Input name="file_url" type="url" defaultValue={existingFile ?? ""} placeholder="https://..." />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? t("assignments_submitting") : t("assignments_submit")}
        </Button>
        {(existingBody || existingFile) && (
          <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>{t("assignments_cancel")}</Button>
        )}
      </div>
    </form>
  );
}
