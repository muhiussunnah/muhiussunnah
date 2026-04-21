"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAction, type ActionResult } from "@/server/actions/auth";

type Props = {
  next?: string;
};

const inputCls =
  "h-12 rounded-xl bg-card/50 border-border/70 ps-11 pe-3.5 text-sm transition-all focus-visible:bg-card focus-visible:border-primary/50 focus-visible:shadow-lg focus-visible:shadow-primary/10 hover:border-border";
const labelCls = "text-sm font-semibold text-foreground/90";
const iconCls = "pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground";

export function LoginForm({ next = "/" }: Props) {
  const t = useTranslations("auth");
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    signInAction,
    null,
  );

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="next" value={next} />

      <div className="flex flex-col gap-2">
        <Label htmlFor="email" className={labelCls}>{t("email")}</Label>
        <div className="relative">
          <Mail className={iconCls} />
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder={t("email_placeholder")}
            className={inputCls}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password" className={labelCls}>{t("password")}</Label>
        <div className="relative">
          <Lock className={iconCls} />
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            minLength={6}
            placeholder={t("password_placeholder")}
            className={inputCls}
          />
        </div>
      </div>

      {state && !state.ok ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={pending}
        className="mt-1 h-12 rounded-xl bg-gradient-primary animate-gradient text-white text-base font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
      >
        {pending ? t("login_pending") : t("login_button")}
      </Button>
    </form>
  );
}
