"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerSchoolAction, type ActionResult } from "@/server/actions/auth";
import type { RegisterPageCopy } from "@/lib/i18n/pages";

export function RegisterSchoolForm({ copy }: { copy: RegisterPageCopy }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    registerSchoolAction,
    null,
  );

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success(state.message ?? copy.registerSuccessFallback);
      if (state.redirect) router.push(state.redirect);
    } else {
      toast.error(state.error);
    }
  }, [state, router, copy.registerSuccessFallback]);

  return (
    <form action={action} className="flex flex-col gap-4">
      <fieldset className="flex flex-col gap-4">
        <legend className="sr-only">{copy.schoolInfoLegend}</legend>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="school_name_bn">{copy.schoolNameBnLabel}</Label>
          <Input id="school_name_bn" name="school_name_bn" required placeholder={copy.schoolNameBnPlaceholder} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="school_name_en">{copy.schoolNameEnLabel}</Label>
          <Input id="school_name_en" name="school_name_en" placeholder={copy.schoolNameEnPlaceholder} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="school_type">{copy.schoolTypeLabel}</Label>
            <Select name="school_type" defaultValue="school">
              <SelectTrigger id="school_type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="school">{copy.schoolTypeSchool}</SelectItem>
                <SelectItem value="madrasa">{copy.schoolTypeMadrasa}</SelectItem>
                <SelectItem value="both">{copy.schoolTypeBoth}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="eiin">{copy.eiinLabel}</Label>
            <Input id="eiin" name="eiin" inputMode="numeric" />
          </div>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border-t border-border/60 pt-4">
        <legend className="sr-only">{copy.adminInfoLegend}</legend>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="admin_full_name">{copy.adminNameLabel}</Label>
          <Input id="admin_full_name" name="admin_full_name" required />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="admin_email">{copy.emailLabel}</Label>
            <Input
              id="admin_email"
              name="admin_email"
              type="email"
              required
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="admin_phone">{copy.phoneLabel}</Label>
            <Input id="admin_phone" name="admin_phone" type="tel" inputMode="tel" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="admin_password">{copy.passwordLabel}</Label>
          <Input
            id="admin_password"
            name="admin_password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>
      </fieldset>

      {state && !state.ok ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="mt-2 bg-gradient-primary text-white">
        {pending ? copy.submitPending : copy.submitIdle}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        {copy.termsNote}
      </p>
    </form>
  );
}
