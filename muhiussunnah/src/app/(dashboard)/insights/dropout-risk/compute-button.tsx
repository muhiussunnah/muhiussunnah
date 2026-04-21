"use client";

import { useActionState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { computeRiskScoresAction } from "@/server/actions/insights";
import { Sparkles } from "lucide-react";

export function ComputeRiskButton({ schoolSlug }: { schoolSlug: string }) {
  const t = useTranslations("insights");
  const [state, action, pending] = useActionState(computeRiskScoresAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.ok) toast.success(state.message ?? t("compute_done"));
    else toast.error(state.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={action} className="inline">
      <input type="hidden" name="schoolSlug" value={schoolSlug} />
      <Button type="submit" disabled={pending}>
        <Sparkles className="me-1.5 size-4" />
        {pending ? t("computing") : t("compute_cta")}
      </Button>
    </form>
  );
}
