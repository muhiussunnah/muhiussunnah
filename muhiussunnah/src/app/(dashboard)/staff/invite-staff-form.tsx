"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, KeyRound, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import {
  inviteStaffAction,
  createStaffWithPasswordAction,
} from "@/server/actions/staff";
import type { ActionResult } from "@/server/actions/_helpers";

type Branch = { id: string; name: string };
type Props = { schoolSlug: string; branches: Branch[] };

type Mode = "invite" | "create";

const ROLE_OPTIONS = [
  "SCHOOL_ADMIN",
  "VICE_PRINCIPAL",
  "ACCOUNTANT",
  "BRANCH_ADMIN",
  "CLASS_TEACHER",
  "SUBJECT_TEACHER",
  "MADRASA_USTADH",
  "LIBRARIAN",
  "TRANSPORT_MANAGER",
  "HOSTEL_WARDEN",
  "CANTEEN_MANAGER",
  "COUNSELOR",
  "OTHER_STAFF",
] as const;

export function InviteStaffForm({ schoolSlug, branches }: Props) {
  const t = useTranslations("staff");
  const formRef = useRef<HTMLFormElement>(null);
  const [mode, setMode] = useState<Mode>("invite");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<string>("CLASS_TEACHER");
  const [branchId, setBranchId] = useState<string>("");
  const [createdCredentials, setCreatedCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const action = mode === "invite" ? inviteStaffAction : createStaffWithPasswordAction;
  const [state, dispatch, pending] = useActionState<ActionResult | null, FormData>(action, null);

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success(state.message ?? t("invite_added"));
      formRef.current?.reset();
      const data = state.data as { email?: string; password?: string } | undefined;
      if (mode === "create" && data?.email && data?.password) {
        setCreatedCredentials({ email: data.email, password: data.password });
      }
    } else {
      toast.error(state.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div className="flex flex-col gap-3">
      {/* Mode toggle — invite vs create-with-password */}
      <div className="grid grid-cols-2 gap-1 rounded-xl border border-border/60 bg-muted/30 p-1">
        <button
          type="button"
          onClick={() => {
            setMode("invite");
            setCreatedCredentials(null);
          }}
          className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition cursor-pointer ${
            mode === "invite"
              ? "bg-gradient-primary text-white shadow-sm shadow-primary/20"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Mail className="size-3.5" />
          {t("mode_invite")}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("create");
            setCreatedCredentials(null);
          }}
          className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition cursor-pointer ${
            mode === "create"
              ? "bg-gradient-primary text-white shadow-sm shadow-primary/20"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <KeyRound className="size-3.5" />
          {t("mode_create")}
        </button>
      </div>

      {/* Just-created credentials card — copy + share */}
      {createdCredentials ? <CredentialsCard data={createdCredentials} /> : null}

      <form ref={formRef} action={dispatch} className="flex flex-col gap-3">
        <input type="hidden" name="schoolSlug" value={schoolSlug} />

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="full_name_bn">{t("invite_name_label")}</Label>
          <Input
            id="full_name_bn"
            name="full_name_bn"
            required
            placeholder={t("invite_name_placeholder")}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">{t("invite_email_label")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="teacher@school.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">{t("invite_phone_label")}</Label>
            <Input id="phone" name="phone" type="tel" />
          </div>
        </div>

        {/* Password field — only visible in create mode */}
        {mode === "create" ? (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">{t("create_password_label")}</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">{t("create_password_hint")}</p>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="role">{t("invite_role_label")}</Label>
            {/* Hidden input ships the value with the form submit so the
                server action sees it. The Select renders the localized
                label in its trigger via a manual lookup (the base-ui
                Value primitive falls back to raw "CLASS_TEACHER" text
                otherwise — same gotcha as the manage dialog). */}
            <input type="hidden" name="role" value={role} />
            <Select value={role} onValueChange={(v) => setRole(v ?? role)}>
              <SelectTrigger id="role" className="w-full justify-between">
                <span className="flex-1 text-left">
                  {t(`role_${role}` as Parameters<typeof t>[0])}
                </span>
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {t(`role_${r}` as Parameters<typeof t>[0])}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="employee_code">{t("invite_code_label")}</Label>
            <Input id="employee_code" name="employee_code" placeholder="EMP-001" />
          </div>
        </div>

        {branches.length > 1 ? (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="branch_id">{t("invite_branch_label")}</Label>
            <input type="hidden" name="branch_id" value={branchId} />
            <Select value={branchId} onValueChange={(v) => setBranchId(v ?? "")}>
              <SelectTrigger id="branch_id" className="w-full justify-between">
                <span className="flex-1 text-left">
                  {branches.find((b) => b.id === branchId)?.name ?? t("invite_branch_all")}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">— {t("invite_branch_all")} —</SelectItem>
                {branches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        <Button
          type="submit"
          disabled={pending}
          className="mt-1 bg-gradient-primary text-white"
        >
          {pending
            ? mode === "invite"
              ? t("invite_sending")
              : t("create_creating")
            : mode === "invite"
              ? t("invite_cta")
              : t("create_cta")}
        </Button>
        <p className="text-xs text-muted-foreground">
          {mode === "invite" ? t("invite_help") : t("create_help")}
        </p>
      </form>
    </div>
  );
}

function CredentialsCard({ data }: { data: { email: string; password: string } }) {
  const t = useTranslations("staff");
  const [copied, setCopied] = useState<"email" | "password" | "both" | null>(null);

  const copy = async (
    text: string,
    label: "email" | "password" | "both",
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      toast.success(t("credentials_copied"));
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error("কপি করা যায়নি");
    }
  };

  return (
    <div className="rounded-xl border-2 border-success/40 bg-gradient-to-br from-success/10 via-card to-success/5 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-success">
        <Check className="size-3.5" />
        {t("credentials_heading")}
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-20 shrink-0 text-xs text-muted-foreground">{t("credentials_email")}</span>
          <code className="flex-1 truncate rounded-md bg-muted/60 px-2 py-1 text-xs font-mono">
            {data.email}
          </code>
          <button
            type="button"
            onClick={() => copy(data.email, "email")}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary cursor-pointer"
            aria-label="Copy email"
          >
            {copied === "email" ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-20 shrink-0 text-xs text-muted-foreground">{t("credentials_password")}</span>
          <code className="flex-1 truncate rounded-md bg-muted/60 px-2 py-1 text-xs font-mono">
            {data.password}
          </code>
          <button
            type="button"
            onClick={() => copy(data.password, "password")}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary cursor-pointer"
            aria-label="Copy password"
          >
            {copied === "password" ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          </button>
        </div>
        <button
          type="button"
          onClick={() =>
            copy(
              `Email: ${data.email}\nPassword: ${data.password}\nLogin: muhiussunnah.app`,
              "both",
            )
          }
          className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/20 cursor-pointer"
        >
          {copied === "both" ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {t("credentials_copy_both")}
        </button>
      </div>
    </div>
  );
}
