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
import { ADMIN_ROLES, TEACHER_ROLES } from "@/lib/auth/roles";

export default async function DailySabaqIndexPage() {
  const { active } = await requireActiveMadrasaRole([...ADMIN_ROLES, "ACCOUNTANT", ...TEACHER_ROLES, "MADRASA_USTADH"]);
  const t = await getTranslations("madrasa");
  const locale = (await getLocale()) as Locale;


  const schoolSlug = active.school_slug;
  const supabase = await supabaseServer();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: sections } = await (supabase as any)
    .from("sections")
    .select("id, name, classes!inner(name_bn, school_id, stream)")
    .eq("classes.school_id", active.school_id);

  const all = (sections ?? []) as Array<{ id: string; name: string; classes: { name_bn: string; stream: string } }>;
  const madrasa = all.filter((s) => ["hifz", "kitab", "nazera"].includes(s.classes.stream));
  const display = madrasa.length > 0 ? madrasa : all;

  const today = new Date().toISOString().slice(0, 10);
  const todayLabel = formatDualDate(today, { withWeekday: true, withHijri: true, locale: locale });

  return (
    <>
      <PageHeader
        title={t("sabaq_title")}
        subtitle={t("sabaq_subtitle", { date: todayLabel })}
        impact={[{ label: <>{t("sabaq_section_count")} · <BanglaDigit value={display.length} /></>, tone: "accent" }]}
      />

      {display.length === 0 ? (
        <EmptyState
          icon={<BookOpenText className="size-8" />}
          title={t("sabaq_empty_title")}
          body={t("sabaq_empty_body")}
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {display.map((s) => (
            <Link
              key={s.id}
              href={`/madrasa/daily-sabaq/${s.id}?date=${today}`}
              className="group"
            >
              <Card className="transition hover:shadow-hover">
                <CardContent className="p-5">
                  <h3 className="font-semibold">{s.classes.name_bn} — {t("sabaq_section_prefix")} {s.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{t("sabaq_stream_label")}: {s.classes.stream}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
