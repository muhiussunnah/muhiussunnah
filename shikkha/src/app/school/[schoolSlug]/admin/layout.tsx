import type { ReactNode } from "react";
import {
  BookOpenText,
  Building2,
  ClipboardList,
  CreditCard,
  FileCheck2,
  LayoutDashboard,
  Megaphone,
  ScrollText,
  Settings2,
  Users2,
  Wallet,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireRole, type ActiveSchoolMembership } from "@/lib/auth/session";
import { ADMIN_ROLES } from "@/lib/auth/roles";

type Props = {
  children: ReactNode;
  params: Promise<{ schoolSlug: string }>;
};

export default async function SchoolAdminLayout({ children, params }: Props) {
  const { schoolSlug } = await params;
  const membership = await requireRole(schoolSlug, [...ADMIN_ROLES, "ACCOUNTANT"]);

  const nav = adminNav(schoolSlug, membership);

  return (
    <DashboardShell
      title={membership.school_name_bn}
      subtitle={membership.school_name_en ?? undefined}
      nav={nav}
      userLabel={membership.full_name_bn ?? membership.full_name_en ?? undefined}
    >
      {children}
    </DashboardShell>
  );
}

function adminNav(slug: string, membership: ActiveSchoolMembership) {
  const items = [
    { href: `/school/${slug}/admin`,                label: "ড্যাশবোর্ড",    icon: <LayoutDashboard className="size-4" /> },
    { href: `/school/${slug}/admin/admission-inquiry`, label: "ভর্তি জিজ্ঞাসা",  icon: <ClipboardList className="size-4" /> },
    { href: `/school/${slug}/admin/students`,       label: "ছাত্র-ছাত্রী",     icon: <Users2 className="size-4" /> },
    { href: `/school/${slug}/admin/staff`,          label: "শিক্ষক/স্টাফ",     icon: <Users2 className="size-4" /> },
    { href: `/school/${slug}/admin/classes`,        label: "শ্রেণি",           icon: <Building2 className="size-4" /> },
    { href: `/school/${slug}/admin/attendance`,     label: "উপস্থিতি",         icon: <FileCheck2 className="size-4" /> },
    { href: `/school/${slug}/admin/exams`,          label: "পরীক্ষা",          icon: <ScrollText className="size-4" /> },
    { href: `/school/${slug}/admin/fees`,           label: "ফি",                icon: <Wallet className="size-4" /> },
    { href: `/school/${slug}/admin/expenses`,       label: "খরচ",              icon: <CreditCard className="size-4" /> },
    { href: `/school/${slug}/admin/donations`,      label: "চাঁদা",             icon: <CreditCard className="size-4" /> },
    { href: `/school/${slug}/admin/notices`,        label: "নোটিশ",            icon: <Megaphone className="size-4" /> },
    { href: `/school/${slug}/admin/reports`,        label: "রিপোর্ট",          icon: <ScrollText className="size-4" /> },
  ];

  if (membership.school_type === "madrasa" || membership.school_type === "both") {
    items.push(
      { href: `/school/${slug}/admin/madrasa/hifz`,        label: "হিফজ",         icon: <BookOpenText className="size-4" /> },
      { href: `/school/${slug}/admin/madrasa/kitab`,       label: "কিতাব",        icon: <BookOpenText className="size-4" /> },
      { href: `/school/${slug}/admin/madrasa/daily-sabaq`, label: "দৈনিক সবক",   icon: <BookOpenText className="size-4" /> },
    );
  }

  items.push({ href: `/school/${slug}/admin/settings`, label: "সেটিংস", icon: <Settings2 className="size-4" /> });
  return items;
}
