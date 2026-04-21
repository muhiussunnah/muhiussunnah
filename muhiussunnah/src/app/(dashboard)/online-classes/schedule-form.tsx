"use client";

import { useActionState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { scheduleOnlineClassAction } from "@/server/actions/lms";

type Section = { id: string; name_bn: string; class_bn: string };
type Subject = { id: string; name_bn: string };

export function ScheduleClassForm({ schoolSlug, sections, subjects }: { schoolSlug: string; sections: Section[]; subjects: Subject[] }) {
  const t = useTranslations("onlineClassesAdmin");
  const [state, action, pending] = useActionState(scheduleOnlineClassAction, null);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state) return;
    if (state.ok) { toast.success(state.message ?? t("form_scheduled")); ref.current?.reset(); }
    else toast.error(state.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form ref={ref} action={action} className="space-y-3">
      <input type="hidden" name="schoolSlug" value={schoolSlug} />
      <div>
        <Label>{t("form_title_label")}</Label>
        <Input name="title" placeholder={t("form_title_placeholder")} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>{t("form_section_label")}</Label>
          <select name="section_id" required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">{t("form_section_placeholder")}</option>
            {sections.map((s) => <option key={s.id} value={s.id}>{s.class_bn} — {s.name_bn}</option>)}
          </select>
        </div>
        <div>
          <Label>{t("form_subject_label")}</Label>
          <select name="subject_id" required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">{t("form_subject_placeholder")}</option>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name_bn}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>{t("form_start_label")}</Label>
          <Input name="scheduled_at" type="datetime-local" required />
        </div>
        <div>
          <Label>{t("form_duration_label")}</Label>
          <Input name="duration_mins" type="number" min={1} defaultValue={60} />
        </div>
      </div>
      <div>
        <Label>{t("form_url_label")}</Label>
        <Input name="meet_url" type="url" placeholder="https://meet.google.com/..." required />
      </div>
      <div>
        <Label>{t("form_provider_label")}</Label>
        <select name="provider" defaultValue="zoom" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="zoom">Zoom</option>
          <option value="google_meet">Google Meet</option>
          <option value="teams">Microsoft Teams</option>
          <option value="other">{t("provider_other")}</option>
        </select>
      </div>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? t("form_scheduling") : t("form_cta")}
      </Button>
    </form>
  );
}
