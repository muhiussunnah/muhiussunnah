"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTicketAction } from "@/server/actions/support";
import type { ActionResult } from "@/server/actions/_helpers";

export function NewTicketForm({ schoolSlug }: { schoolSlug: string }) {
  const t = useTranslations("portal");
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(createTicketAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success(state.message ?? t("support_sent_success"));
      formRef.current?.reset();
      if (state.redirect) router.push(state.redirect);
    } else {
      toast.error(state.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, router]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-3">
      <input type="hidden" name="schoolSlug" value={schoolSlug} />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="subject">{t("support_subject")}</Label>
        <Input id="subject" name="subject" required placeholder={t("support_subject_placeholder")} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="body">{t("support_details")}</Label>
        <Textarea id="body" name="body" rows={4} required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="priority">{t("support_priority")}</Label>
        <Select name="priority" defaultValue="normal">
          <SelectTrigger id="priority"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="low">{t("support_priority_low")}</SelectItem>
            <SelectItem value="normal">{t("support_priority_normal")}</SelectItem>
            <SelectItem value="high">{t("support_priority_high")}</SelectItem>
            <SelectItem value="urgent">{t("support_priority_urgent")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={pending} className="mt-1 bg-gradient-primary text-white">
        {pending ? t("support_sending") : t("support_send")}
      </Button>
    </form>
  );
}
