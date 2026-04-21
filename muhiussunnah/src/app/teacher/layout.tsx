import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { BookOpenText, CalendarCheck, ClipboardList, LayoutDashboard, Mail, ScrollText } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireActiveRole } from "@/lib/auth/active-school";
import { TEACHER_ROLES } from "@/lib/auth/roles";

export default async function TeacherLayout({ children }: { children: ReactNode }) {
  const membership = await requireActiveRole(TEACHER_ROLES);
  const t = await getTranslations("teacher");

  const nav = [
    { href: "/teacher",              label: t("nav_dashboard"),     icon: <LayoutDashboard className="size-4" /> },
    { href: "/teacher/attendance",   label: t("nav_attendance"),    icon: <CalendarCheck className="size-4" /> },
    { href: "/teacher/marks",        label: t("nav_marks"),         icon: <ScrollText className="size-4" /> },
    { href: "/teacher/assignments",  label: t("nav_assignments"),   icon: <ClipboardList className="size-4" /> },
    { href: "/teacher/messages",     label: t("nav_messages"),      icon: <Mail className="size-4" /> },
  ];

  if (membership.role === "MADRASA_USTADH" || membership.school_type !== "school") {
    nav.splice(3, 0, {
      href: "/teacher/daily-sabaq",
      label: t("nav_daily_sabaq"),
      icon: <BookOpenText className="size-4" />,
    });
  }

  return (
    <DashboardShell
      title={membership.school_name_bn}
      subtitle={t("layout_subtitle")}
      nav={nav}
      userLabel={membership.full_name_bn ?? membership.full_name_en ?? undefined}
      userPhotoUrl={membership.photo_url}
    >
      {children}
    </DashboardShell>
  );
}
