"use client";

import { useActionState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addKitabAction } from "@/server/actions/kitab";
import type { ActionResult } from "@/server/actions/_helpers";

type Class = { id: string; name_bn: string };

export function AddKitabForm({ schoolSlug, classes }: { schoolSlug: string; classes: Class[] }) {
  const t = useTranslations("madrasa");
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(addKitabAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.ok) { toast.success(state.message ?? t("kitab_form_added")); formRef.current?.reset(); }
    else toast.error(state.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-3">
      <input type="hidden" name="schoolSlug" value={schoolSlug} />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="stage">{t("kitab_form_stage")}</Label>
        <Select name="stage" defaultValue="ibtedaiyyah">
          <SelectTrigger id="stage"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ibtedaiyyah">{t("kitab_stage_ibtedaiyyah")}</SelectItem>
            <SelectItem value="mutawassita">{t("kitab_stage_mutawassita")}</SelectItem>
            <SelectItem value="sanaweeya_aamma">{t("kitab_stage_sanaweeya_aamma")}</SelectItem>
            <SelectItem value="sanaweeya_khassa">{t("kitab_stage_sanaweeya_khassa")}</SelectItem>
            <SelectItem value="fazilat">{t("kitab_stage_fazilat")}</SelectItem>
            <SelectItem value="kamil">{t("kitab_stage_kamil")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="kitab_name">{t("kitab_form_name")}</Label>
        <Input id="kitab_name" name="kitab_name" required placeholder={t("kitab_form_name_placeholder")} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="author">{t("kitab_form_author")}</Label>
        <Input id="author" name="author" placeholder={t("kitab_form_author_placeholder")} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="display_order">{t("kitab_form_order")}</Label>
          <Input id="display_order" name="display_order" type="number" min={0} defaultValue={0} />
        </div>
        {classes.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="class_id">{t("kitab_form_class")}</Label>
            <Select name="class_id">
              <SelectTrigger id="class_id"><SelectValue placeholder={t("kitab_form_class_all")} /></SelectTrigger>
              <SelectContent>
                {classes.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name_bn}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
      </div>
      <Button type="submit" disabled={pending} className="mt-1 bg-gradient-primary text-white">
        {pending ? "..." : t("kitab_form_cta")}
      </Button>
    </form>
  );
}
