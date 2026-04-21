"use client";

import { useActionState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { addBranchAction } from "@/server/actions/school";
import type { ActionResult } from "@/server/actions/_helpers";

export function AddBranchForm({ schoolSlug }: { schoolSlug: string }) {
  const t = useTranslations("branches");
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(addBranchAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.ok) toast.success(state.message ?? t("form_added"));
    else toast.error(state.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="schoolSlug" value={schoolSlug} />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">{t("form_name_label")}</Label>
        <Input id="name" name="name" required placeholder={t("form_name_placeholder")} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="address">{t("form_address_label")}</Label>
        <Textarea id="address" name="address" rows={2} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">{t("form_phone_label")}</Label>
        <Input id="phone" name="phone" type="tel" />
      </div>
      <label className="inline-flex items-center gap-2 text-sm">
        <Checkbox name="is_primary" />
        {t("form_primary_label")}
      </label>
      <Button type="submit" disabled={pending} className="mt-1 bg-gradient-primary text-white">
        {pending ? t("form_adding") : t("form_cta")}
      </Button>
    </form>
  );
}
