"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Props = { schoolSlug: string; examId: string; studentId: string };

export function GenerateCommentButton({ schoolSlug, examId, studentId }: Props) {
  const t = useTranslations("exams");
  const [pending, startTransition] = useTransition();

  function generate() {
    startTransition(async () => {
      try {
        const res = await fetch("/api/ai/report-comment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ schoolSlug, exam_id: examId, student_id: studentId }),
        });
        const data = (await res.json()) as { ok?: boolean; comment?: string; source?: "ai" | "rule"; error?: string };
        if (data.ok && data.comment) {
          toast.success(`${t("gc_toast_success")} (${data.source === "ai" ? "AI" : "rule-based"})`, {
            description: data.comment,
            duration: 15000,
          });
        } else {
          toast.error(data.error ?? t("gc_toast_error"));
        }
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  }

  return (
    <Button type="button" size="sm" variant="outline" onClick={generate} disabled={pending}>
      <Sparkles className="me-1 size-3.5" />
      {pending ? t("gc_pending") : t("gc_button")}
    </Button>
  );
}
