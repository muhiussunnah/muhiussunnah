import { getTranslations, getLocale } from "next-intl/server";
import { CalendarCheck, ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { requireActiveRole } from "@/lib/auth/active-school";
import { TEACHER_ROLES } from "@/lib/auth/roles";
import { formatDualDate } from "@/lib/utils/date";
import type { Locale } from "@/lib/i18n/config";

export default async function TeacherDashboardPage() {
  const membership = await requireActiveRole(TEACHER_ROLES);
  const t = await getTranslations("teacher");
  const locale = (await getLocale()) as Locale;

  const schoolSlug = membership.school_slug;
  const today = formatDualDate(new Date(), { withWeekday: true, locale: locale });
  const displayName = membership.full_name_bn ?? membership.full_name_en ?? t("default_name");

  return (
    <>
      <PageHeader
        title={t("home_greeting", { name: displayName })}
        subtitle={t("home_subtitle", { date: today })}
        impact={[{ label: t("home_offline_badge"), tone: "success" }]}
      />

      <EmptyState
        icon={<CalendarCheck className="size-8" />}
        title={t("home_empty_title")}
        body={t("home_empty_body")}
        primaryAction={
          <a href={`/teacher/attendance`} className="rounded-md bg-gradient-primary px-4 py-2 text-sm font-medium text-white">
            {t("home_cta_attendance")}
          </a>
        }
        secondaryAction={
          <a href={`/teacher/assignments`} className="rounded-md border border-border px-4 py-2 text-sm">
            <ClipboardList className="me-1.5 inline size-4" />
            {t("home_cta_assignments")}
          </a>
        }
        proTip={t("home_pro_tip")}
      />
    </>
  );
}
