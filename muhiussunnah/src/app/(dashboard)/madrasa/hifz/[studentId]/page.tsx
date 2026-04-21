import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BanglaDigit } from "@/components/ui/bangla-digit";
import { BengaliDate } from "@/components/ui/bengali-date";
import { supabaseServer } from "@/lib/supabase/server";
import { requireActiveMadrasaRole } from "@/lib/auth/require-madrasa";
import { ADMIN_ROLES, TEACHER_ROLES } from "@/lib/auth/roles";
import { ParaRow } from "./para-row";

type PageProps = {
  params: Promise<{ studentId: string }>;
  searchParams: Promise<{ para?: string }>;
};

export default async function HifzStudentPage({ params, searchParams }: PageProps) {
  const { studentId } = await params;
  const { para: paraParam } = await searchParams;
  const { active } = await requireActiveMadrasaRole([...ADMIN_ROLES, ...TEACHER_ROLES, "MADRASA_USTADH"]);
  const t = await getTranslations("madrasa");

  const schoolSlug = active.school_slug;
  const supabase = await supabaseServer();

  const [studentRes, progressRes] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("students")
      .select("id, name_bn, student_code, roll, photo_url, sections(name, classes(name_bn))")
      .eq("id", studentId)
      .eq("school_id", active.school_id)
      .single(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("hifz_progress")
      .select("para_no, status, mark, grade, mistakes_count, tested_on, note")
      .eq("student_id", studentId)
      .order("para_no"),
  ]);
  const { data: student } = studentRes;
  const { data: progress } = progressRes;

  if (!student) notFound();

  const progressMap = new Map<number, { status: string; mark: number | null; grade: string | null; mistakes_count: number; tested_on: string | null; note: string | null }>();
  for (const p of (progress ?? []) as Array<{ para_no: number; status: string; mark: number | null; grade: string | null; mistakes_count: number; tested_on: string | null; note: string | null }>) {
    progressMap.set(p.para_no, p);
  }

  const paras = Array.from({ length: 30 }, (_, i) => i + 1);
  const completed = paras.filter((n) => {
    const st = progressMap.get(n)?.status;
    return st === "completed" || st === "tested";
  }).length;
  const pct = Math.round((completed / 30) * 100);

  const highlightPara = paraParam ? Number(paraParam) : null;

  const statusMap: Record<string, { label: string; cls: string }> = {
    learning:  { label: t("hifz_status_learning"),  cls: "bg-warning/20 text-warning-foreground dark:text-warning" },
    revising:  { label: t("hifz_status_revising"),  cls: "bg-info/20 text-info" },
    completed: { label: t("hifz_status_completed"), cls: "bg-primary/20 text-primary" },
    tested:    { label: t("hifz_status_tested"),    cls: "bg-success/20 text-success" },
    none:      { label: t("hifz_legend_none"),      cls: "bg-muted text-muted-foreground" },
  };

  return (
    <>
      <PageHeader
        breadcrumbs={
          <Link href={`/madrasa/hifz`} className="inline-flex items-center gap-1 text-sm hover:text-foreground">
            <ArrowLeft className="size-3.5" /> {t("hifz_detail_back")}
          </Link>
        }
        title={
          <span className="flex items-center gap-3">
            <Avatar className="size-10">
              {student.photo_url ? <AvatarImage src={student.photo_url} alt={student.name_bn} /> : null}
              <AvatarFallback className="bg-primary/10 text-primary">{student.name_bn.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{student.name_bn}</span>
          </span>
        }
        subtitle={
          <>
            {student.sections ? <>{student.sections.classes.name_bn} — {student.sections.name} · </> : null}
            ID: <span className="font-mono">{student.student_code}</span>
          </>
        }
        impact={[
          { label: <>{t("hifz_detail_completed")} · <BanglaDigit value={completed} />/<BanglaDigit value={30} /></>, tone: "success" },
          { label: <>{t("hifz_detail_progress")} · <BanglaDigit value={pct} />%</>, tone: "accent" },
        ]}
      />

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs">
              <tr>
                <th className="p-2 text-left">{t("hifz_col_para")}</th>
                <th className="p-2 text-left">{t("hifz_col_status")}</th>
                <th className="p-2 text-right">{t("hifz_col_mark")}</th>
                <th className="p-2 text-center">{t("hifz_col_mistakes")}</th>
                <th className="p-2 text-left">{t("hifz_col_tested")}</th>
                <th className="p-2 text-left">{t("hifz_col_note")}</th>
                <th className="p-2 text-right">{t("hifz_col_update")}</th>
              </tr>
            </thead>
            <tbody>
              {paras.map((n) => {
                const p = progressMap.get(n);
                const statusKey = p?.status ?? "none";
                const m = statusMap[statusKey] ?? statusMap.none;
                return (
                  <tr key={n} className={`border-t border-border/40 ${highlightPara === n ? "bg-primary/5" : ""}`}>
                    <td className="p-2 font-semibold"><BanglaDigit value={n} /></td>
                    <td className="p-2"><span className={`rounded-full px-2 py-0.5 text-xs ${m.cls}`}>{m.label}</span></td>
                    <td className="p-2 text-right">{p?.mark !== null && p?.mark !== undefined ? <BanglaDigit value={p.mark} /> : "—"}</td>
                    <td className="p-2 text-center">{p?.mistakes_count ? <BanglaDigit value={p.mistakes_count} /> : "—"}</td>
                    <td className="p-2 text-xs">{p?.tested_on ? <BengaliDate value={p.tested_on} /> : "—"}</td>
                    <td className="p-2 text-xs text-muted-foreground">{p?.note ?? "—"}</td>
                    <td className="p-2 text-right">
                      <ParaRow
                        studentId={studentId}
                        paraNo={n}
                        initial={{
                          status: (p?.status ?? "learning") as "learning" | "revising" | "completed" | "tested",
                          mark: p?.mark ?? null,
                          grade: p?.grade ?? "",
                          mistakes_count: p?.mistakes_count ?? 0,
                          note: p?.note ?? "",
                        }}
                        schoolSlug={schoolSlug}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </>
  );
}
