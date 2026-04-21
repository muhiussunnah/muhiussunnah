import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { BookOpenText, CalendarCheck, ClipboardCheck, CreditCard, Home, LifeBuoy, Mail, Megaphone, ScrollText, UserCircle2, Video } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireActiveRole } from "@/lib/auth/active-school";
import { PORTAL_ROLES } from "@/lib/auth/roles";

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const membership = await requireActiveRole(PORTAL_ROLES);
  const t = await getTranslations("portal");

  const nav = [
    { href: "/portal",              label: t("nav_home"),           icon: <Home className="size-4" /> },
    { href: "/portal/attendance",   label: t("nav_attendance"),     icon: <CalendarCheck className="size-4" /> },
    { href: "/portal/results",      label: t("nav_results"),        icon: <ScrollText className="size-4" /> },
    { href: "/portal/assignments",  label: t("nav_assignments"),    icon: <ClipboardCheck className="size-4" /> },
    { href: "/portal/online-classes", label: t("nav_online_classes"), icon: <Video className="size-4" /> },
    { href: "/portal/fees",         label: t("nav_fees"),           icon: <CreditCard className="size-4" /> },
    { href: "/portal/notices",      label: t("nav_notices"),        icon: <Megaphone className="size-4" /> },
    { href: "/portal/messages",     label: t("nav_messages"),       icon: <Mail className="size-4" /> },
    { href: "/portal/support",      label: t("nav_support"),        icon: <LifeBuoy className="size-4" /> },
    { href: "/portal/profile",      label: t("nav_profile"),        icon: <UserCircle2 className="size-4" /> },
  ];

  if (membership.school_type === "madrasa" || membership.school_type === "both") {
    nav.splice(3, 0, {
      href: "/portal/hifz",
      label: t("nav_hifz"),
      icon: <BookOpenText className="size-4" />,
    });
  }

  return (
    <DashboardShell
      title={membership.school_name_bn}
      subtitle={membership.role === "PARENT" ? t("layout_parent") : t("layout_student")}
      nav={nav}
      userLabel={membership.full_name_bn ?? membership.full_name_en ?? undefined}
      userPhotoUrl={membership.photo_url}
    >
      {children}
    </DashboardShell>
  );
}
