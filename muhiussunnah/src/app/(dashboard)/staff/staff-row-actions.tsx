"use client";

import { useActionState, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Pencil, Trash2, KeyRound } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { confirmDialog } from "@/components/ui/confirm-dialog";
import { USER_ROLES } from "@/lib/auth/roles";
import { updateStaffAction, deleteStaffAction } from "@/server/actions/staff";

export type StaffRow = {
  id: string;
  full_name_bn: string | null;
  full_name_en: string | null;
  email: string | null;
  phone: string | null;
  employee_code: string | null;
  role: string;
  branch_id: string | null;
  status: string;
};

type Props = {
  schoolSlug: string;
  staff: StaffRow;
  branches: { id: string; name: string }[];
  /** Current user's own school_user_id — hides self-delete. */
  currentSchoolUserId: string;
  roleLabels: Record<string, string>;
};

const STATUSES = ["active", "inactive", "suspended"] as const;

export function StaffRowActions({
  schoolSlug,
  staff,
  branches,
  currentSchoolUserId,
  roleLabels,
}: Props) {
  const t = useTranslations("staff");
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isSelf = staff.id === currentSchoolUserId;

  async function onDelete() {
    const confirmed = await confirmDialog({
      title: t("confirm_delete_title"),
      body: t("confirm_delete_body", { name: staff.full_name_bn ?? "" }),
      confirmLabel: t("confirm_delete_yes"),
      cancelLabel: t("confirm_delete_no"),
      tone: "destructive",
    });
    if (!confirmed) return;

    setDeleting(true);
    const fd = new FormData();
    fd.set("schoolSlug", schoolSlug);
    fd.set("school_user_id", staff.id);
    const res = await deleteStaffAction(null, fd);
    setDeleting(false);
    if (res.ok) toast.success(res.message ?? t("deleted"));
    else toast.error(res.error);
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Link
          href={`/staff/${staff.id}/permissions`}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary"
          title={t("action_permissions")}
        >
          <KeyRound className="size-4" />
        </Link>
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary cursor-pointer"
          title={t("action_edit")}
        >
          <Pencil className="size-4" />
        </button>
        {!isSelf ? (
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer disabled:opacity-50"
            title={t("action_delete")}
          >
            <Trash2 className="size-4" />
          </button>
        ) : null}
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>{t("edit_title")}</DialogTitle>
          </DialogHeader>
          <EditStaffForm
            schoolSlug={schoolSlug}
            staff={staff}
            branches={branches}
            roleLabels={roleLabels}
            onDone={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

function EditStaffForm({
  schoolSlug,
  staff,
  branches,
  roleLabels,
  onDone,
}: {
  schoolSlug: string;
  staff: StaffRow;
  branches: { id: string; name: string }[];
  roleLabels: Record<string, string>;
  onDone: () => void;
}) {
  const t = useTranslations("staff");
  const [state, action, pending] = useActionState(updateStaffAction, null);
  const [role, setRole] = useState(staff.role);
  const [branchId, setBranchId] = useState(staff.branch_id ?? "");
  const [status, setStatus] = useState(staff.status);

  useEffect(() => {
    if (state?.ok) {
      toast.success(state.message ?? t("saved"));
      onDone();
    } else if (state && !state.ok) {
      toast.error(state.error);
    }
  }, [state, onDone, t]);

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="schoolSlug" value={schoolSlug} />
      <input type="hidden" name="school_user_id" value={staff.id} />
      <input type="hidden" name="role" value={role} />
      <input type="hidden" name="branch_id" value={branchId} />
      <input type="hidden" name="status" value={status} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="full_name_bn">{t("edit_name_bn")}</Label>
          <Input
            id="full_name_bn"
            name="full_name_bn"
            defaultValue={staff.full_name_bn ?? ""}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="full_name_en">{t("edit_name_en")}</Label>
          <Input
            id="full_name_en"
            name="full_name_en"
            defaultValue={staff.full_name_en ?? ""}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">{t("edit_email")}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={staff.email ?? ""}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">{t("edit_phone")}</Label>
          <Input id="phone" name="phone" defaultValue={staff.phone ?? ""} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="employee_code">{t("edit_employee_code")}</Label>
          <Input
            id="employee_code"
            name="employee_code"
            defaultValue={staff.employee_code ?? ""}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>{t("edit_role")}</Label>
          <Select value={role} onValueChange={(v) => setRole(v ?? role)}>
            <SelectTrigger className="w-full justify-between">
              <span className="flex-1 text-left">{roleLabels[role] ?? role}</span>
            </SelectTrigger>
            <SelectContent>
              {USER_ROLES.filter((r) => r !== "STUDENT" && r !== "PARENT").map((r) => (
                <SelectItem key={r} value={r}>
                  {roleLabels[r] ?? r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label>{t("edit_branch")}</Label>
          <Select value={branchId} onValueChange={(v) => setBranchId(v ?? "")}>
            <SelectTrigger className="w-full justify-between">
              <span className="flex-1 text-left">
                {branches.find((b) => b.id === branchId)?.name ?? t("edit_branch_none")}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">— {t("edit_branch_none")} —</SelectItem>
              {branches.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>{t("edit_status")}</Label>
          <Select value={status} onValueChange={(v) => setStatus(v ?? status)}>
            <SelectTrigger className="w-full justify-between">
              <span className="flex-1 text-left">
                {t(`edit_status_${status}` as Parameters<typeof t>[0])}
              </span>
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {t(`edit_status_${s}` as Parameters<typeof t>[0])}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onDone}>
          {t("edit_cancel")}
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? t("edit_saving") : t("edit_save")}
        </Button>
      </div>
    </form>
  );
}
