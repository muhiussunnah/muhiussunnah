"use client";

import { useActionState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteRoutineRowAction } from "@/server/actions/exams";
import type { ActionResult } from "@/server/actions/_helpers";

export function DeleteRoutineButton({ schoolSlug, examId, rowId }: { schoolSlug: string; examId: string; rowId: string }) {
  const t = useTranslations("exams");
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(deleteRoutineRowAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.ok) toast.success(state.message ?? t("routine_delete_success"));
    else toast.error(state.error);
  }, [state, t]);

  return (
    <form action={action} onSubmit={(e) => { if (!confirm(t("routine_delete_confirm"))) e.preventDefault(); }}>
      <input type="hidden" name="schoolSlug" value={schoolSlug} />
      <input type="hidden" name="exam_id" value={examId} />
      <input type="hidden" name="id" value={rowId} />
      <Button type="submit" size="icon-sm" variant="ghost" disabled={pending} aria-label={t("routine_delete_aria")}>
        <Trash2 className="size-4 text-destructive" />
      </Button>
    </form>
  );
}
