"use client";

import { useActionState, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Trash2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteSchoolAction } from "./actions";

type Props = {
  schoolId: string;
  schoolName: string;
  schoolSlug: string;
};

export function DeleteSchoolButton({ schoolId, schoolName, schoolSlug }: Props) {
  const t = useTranslations("superAdmin");
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(deleteSchoolAction, null);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (state?.ok) {
      toast.success(state.message ?? t("delete_school_done"));
      setOpen(false);
      setTyped("");
    } else if (state && !state.ok) {
      toast.error(state.error);
    }
  }, [state, t]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer"
        title={t("delete_school_cta")}
      >
        <Trash2 className="size-4" />
      </button>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setTyped("");
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5" />
              {t("delete_school_title")}
            </DialogTitle>
          </DialogHeader>

          <form action={action} className="flex flex-col gap-3">
            <input type="hidden" name="schoolId" value={schoolId} />

            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
              <p className="font-medium text-destructive">
                {t("delete_school_warning_title", { name: schoolName })}
              </p>
              <ul className="mt-2 list-disc ps-5 text-xs text-muted-foreground">
                <li>{t("delete_school_warning_1")}</li>
                <li>{t("delete_school_warning_2")}</li>
                <li>{t("delete_school_warning_3")}</li>
              </ul>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmSlug">
                {t("delete_school_confirm_label", { slug: schoolSlug })}
              </Label>
              <Input
                id="confirmSlug"
                name="confirmSlug"
                autoComplete="off"
                placeholder={schoolSlug}
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setTyped("");
                }}
              >
                {t("manage_cancel")}
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={pending || typed !== schoolSlug}
              >
                {pending ? t("delete_school_deleting") : t("delete_school_confirm_cta")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
