import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { BookOpenText } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { BanglaDigit } from "@/components/ui/bangla-digit";
import { formatDualDate } from "@/lib/utils/date";
import type { Locale } from "@/lib/i18n/config";
import { supabaseServer } from "@/lib/supabase/server";
import { requireActiveMadrasaRole } from "@/lib/auth/require-madrasa";
import { TEACHER_ROLES } from "@/lib/auth/roles";

export default async function TeacherSabaqPage() {
  const { active } = await requireActiveMadrasaRole([...TEACHER_ROLES, "MADRASA_USTADH"]);
  const t = await getTranslations("teacher");
  const locale = (await getLocale()) as Locale;
  const dateLocale = locale === "ur" ? "en" : locale;

  const schoolSlug = active.school_slug;
  const supabase = await supabaseServer();

  const [sectionsAsClassTeacherRes, assignmentsRes] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("sections")
      .select("id, name, classes!inner(name_bn, school_id, stream)")
      .eq("classes.school_id", active.school_id)
      .eq("class_teacher_id", active.school_user_id),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("teacher_assignments")
      .select("section_id, sections!inner(id, name, classes!inner(name_bn, school_id, stream))")
      .eq("school_user_id", active.school_user_id)
      .eq("sections.classes.school_id", active.school_id),
  ]);
  const { data: sectionsAsClassTeacher } = sectionsAsClassTeacherRes;
  const { data: assignments } = assignmentsRes;

  const map = new Map<string, { id: string; name: string; class_name: string; stream: string }>();
  for (const s of (sectionsAsClassTeacher ?? []) as Array<{ id: string; name: string; classes: { name_bn: string; stream: string } }>) {
    map.set(s.id, { id: s.id, name: s.name, class_name: s.classes.name_bn, stream: s.classes.stream });
  }
  for (const a of (assignments ?? []) as Array<{ sections: { id: string; name: string; classes: { name_bn: string; stream: string } } }>) {
    if (!a.sections) continue;
    map.set(a.sections.id, { id: a.sections.id, name: a.sections.name, class_name: a.sections.classes.name_bn, stream: a.sections.classes.stream });
  }
  const sections = Array.from(map.values());
  const today = new Date().toISOString().slice(0, 10);
  const todayLabel = formatDualDate(today, { withWeekday: true, withHijri: true, locale: dateLocale });

  return (
    <>
      <PageHeader
        title={t("sabaq_title")}
        subtitle={t("sabaq_subtitle", { date: todayLabel })}
        impact={[{ label: <>{t("sabaq_count")} · <BanglaDigit value={sections.length} /></>, tone: "accent" }]}
      />

      {sections.length === 0 ? (
        <EmptyState
          icon={<BookOpenText className="size-8" />}
          title={t("sabaq_no_sections_title")}
          body={t("sabaq_no_sections_body")}
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <Link
              key={s.id}
              href={`/madrasa/daily-sabaq/${s.id}?date=${today}`}
              className="group"
            >
              <Card className="transition hover:shadow-hover">
                <CardContent className="p-5">
                  <h3 className="font-semibold">{s.class_name} — {t("sabaq_section_suffix")} {s.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{t("sabaq_stream_label")}: {s.stream}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
