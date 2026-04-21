"use client";

import { useActionState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateInquiryStatusAction } from "@/server/actions/admission-inquiry";
import type { ActionResult } from "@/server/actions/_helpers";

type Props = { schoolSlug: string; id: string; currentStatus: string };

export function InquiryStatusToggle({ schoolSlug, id, currentStatus }: Props) {
  const t = useTranslations("admissionInquiry");
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(updateInquiryStatusAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.ok) toast.success(state.message ?? t("toggle_updated"));
    else toast.error(state.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function handleChange(status: string | null) {
    if (!status) return;
    const fd = new FormData();
    fd.set("schoolSlug", schoolSlug);
    fd.set("id", id);
    fd.set("status", status);
    action(fd);
  }

  return (
    <Select defaultValue={currentStatus} onValueChange={handleChange} disabled={pending}>
      <SelectTrigger className="h-8 w-36 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="new">{t("status_new")}</SelectItem>
        <SelectItem value="contacted">{t("status_contacted")}</SelectItem>
        <SelectItem value="visited">{t("status_visited")}</SelectItem>
        <SelectItem value="admitted">{t("status_admitted")}</SelectItem>
        <SelectItem value="lost">{t("status_lost")}</SelectItem>
      </SelectContent>
    </Select>
  );
}
