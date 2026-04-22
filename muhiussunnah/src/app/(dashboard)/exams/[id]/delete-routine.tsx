"use client";

import { useActionState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { confirmDialog } from "@/components/ui/confirm-dialog";
import { deleteRoutineRowAction } from "@/server/actions/exams";
import type { ActionResult } from "@/server/actions/_helpers";

export function DeleteRoutineButton({ schoolSlug, examId, rowId }: { schoolSlug: string; examId: string; rowId: string }) {
  const t = useTranslations("exams");
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(deleteRoutineRowAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state) return;
    if (state.ok) toast.success(state.message ?? t("routine_delete_success"));
    else toast.error(state.error);
  }, [state, t]);

  async function handleClick() {
    const ok = await confirmDialog({
      title: t("routine_delete_confirm"),
      tone: "destructive",
    });
    if (ok) formRef.current?.requestSubmit();
  }

  return (
    <form ref={formRef} action={action}>
      <input type="hidden" name="schoolSlug" value={schoolSlug} />
      <input type="hidden" name="exam_id" value={examId} />
      <input type="hidden" name="id" value={rowId} />
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        disabled={pending}
        aria-label={t("routine_delete_aria")}
        onClick={handleClick}
      >
        <Trash2 className="size-4 text-destructive" />
      </Button>
    </form>
  );
}
