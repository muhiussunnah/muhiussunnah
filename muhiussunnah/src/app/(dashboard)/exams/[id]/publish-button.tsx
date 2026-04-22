"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { CheckCircle2, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { confirmDialog } from "@/components/ui/confirm-dialog";
import { publishExamAction, unpublishExamAction } from "@/server/actions/exams";

type Props = { schoolSlug: string; examId: string; published: boolean };

export function PublishButton({ schoolSlug, examId, published }: Props) {
  const t = useTranslations("exams");
  const [pending, startTransition] = useTransition();

  async function handleClick() {
    if (published) {
      const ok = await confirmDialog({
        title: t("unpublish_confirm"),
        tone: "destructive",
        confirmLabel: t("unpublish_btn_label"),
      });
      if (!ok) return;
      startTransition(async () => {
        const res = await unpublishExamAction(schoolSlug, examId);
        if (res.ok) toast.success(res.message ?? t("unpublish_done"));
        else toast.error(res.error);
      });
    } else {
      const ok = await confirmDialog({
        title: t("publish_confirm_new"),
        confirmLabel: t("publish_btn_label"),
      });
      if (!ok) return;
      startTransition(async () => {
        const res = await publishExamAction(schoolSlug, examId);
        if (res.ok) toast.success(res.message ?? t("publish_done"));
        else toast.error(res.error);
      });
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      onClick={handleClick}
      disabled={pending}
      className={published ? "" : "bg-gradient-primary text-white"}
      variant={published ? "outline" : "default"}
    >
      {pending ? (
        t("publish_pending_dots")
      ) : published ? (
        <><EyeOff className="me-1 size-3.5" /> {t("unpublish_btn_label")}</>
      ) : (
        <><CheckCircle2 className="me-1 size-3.5" /> {t("publish_btn_label")}</>
      )}
    </Button>
  );
}
