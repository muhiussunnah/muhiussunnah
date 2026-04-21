"use client";

import { useActionState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addInquiryAction } from "@/server/actions/admission-inquiry";
import type { ActionResult } from "@/server/actions/_helpers";

type ClassOption = { id: string; name_bn: string };

export function AddInquiryForm({ schoolSlug, classes }: { schoolSlug: string; classes: ClassOption[] }) {
  const t = useTranslations("admissionInquiry");
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(addInquiryAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success(state.message ?? t("add_added"));
      formRef.current?.reset();
    } else toast.error(state.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-3">
      <input type="hidden" name="schoolSlug" value={schoolSlug} />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="student_name">{t("add_student_name")}</Label>
        <Input id="student_name" name="student_name" required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="guardian_name">{t("add_guardian_name")}</Label>
        <Input id="guardian_name" name="guardian_name" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="guardian_phone">{t("add_guardian_phone")}</Label>
        <Input id="guardian_phone" name="guardian_phone" type="tel" required />
      </div>
      {classes.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="class_interested">{t("add_class_label")}</Label>
          <Select name="class_interested">
            <SelectTrigger id="class_interested"><SelectValue placeholder={t("add_class_placeholder")} /></SelectTrigger>
            <SelectContent>
              {classes.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name_bn}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      ) : null}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="source">{t("add_source_label")}</Label>
        <Select name="source" defaultValue="walk_in">
          <SelectTrigger id="source"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="walk_in">{t("add_source_walk_in")}</SelectItem>
            <SelectItem value="phone">{t("add_source_phone")}</SelectItem>
            <SelectItem value="online">{t("add_source_online")}</SelectItem>
            <SelectItem value="referral">{t("add_source_referral")}</SelectItem>
            <SelectItem value="other">{t("add_source_other")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="followup_date">{t("add_followup_label")}</Label>
        <Input id="followup_date" name="followup_date" type="date" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">{t("add_notes_label")}</Label>
        <Textarea id="notes" name="notes" rows={2} />
      </div>
      <Button type="submit" disabled={pending} className="mt-1 bg-gradient-primary text-white">
        {pending ? t("add_adding") : t("add_cta")}
      </Button>
    </form>
  );
}
