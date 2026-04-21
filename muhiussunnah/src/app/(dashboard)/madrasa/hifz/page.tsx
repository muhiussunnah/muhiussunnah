import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { BookOpenText } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { BanglaDigit } from "@/components/ui/bangla-digit";
import { supabaseServer } from "@/lib/supabase/server";
import { requireActiveMadrasaRole } from "@/lib/auth/require-madrasa";
import { ADMIN_ROLES, TEACHER_ROLES } from "@/lib/auth/roles";

const statusColor: Record<string, string> = {
  learning:  "bg-warning/40",
  revising:  "bg-info/40",
  completed: "bg-primary/60",
  tested:    "bg-success/70",
  none:      "bg-muted",
};

export default async function HifzIndexPage() {
  const { active } = await requireActiveMadrasaRole([...ADMIN_ROLES, "ACCOUNTANT", ...TEACHER_ROLES, "MADRASA_USTADH"]);
  const t = await getTranslations("madrasa");

  const schoolSlug = active.school_slug;
  const supabase = await supabaseServer();

  const [studentsRes, progressRes] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("students")
      .select("id, name_bn, student_code, roll, sections(name, classes(name_bn, stream))")
      .eq("school_id", active.school_id)
      .eq("status", "active")
      .order("name_bn")
      .limit(300),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("hifz_progress")
      .select("student_id, para_no, status")
      .eq("school_id", active.school_id),
  ]);
  const { data: students } = studentsRes;
  const { data: progress } = progressRes;

  const studentList = (students ?? []) as Array<{
    id: string; name_bn: string; student_code: string; roll: number | null;
    sections: { name: string; classes: { name_bn: string; stream: string } } | null;
  }>;

  const progressList = (progress ?? []) as { student_id: string; para_no: number; status: string }[];
  const byStudent = new Map<string, Map<number, string>>();
  for (const p of progressList) {
    const m = byStudent.get(p.student_id) ?? new Map<number, string>();
    m.set(p.para_no, p.status);
    byStudent.set(p.student_id, m);
  }

  const hifzStudents = studentList.filter((s) => s.sections?.classes.stream === "hifz");
  const displayStudents = hifzStudents.length > 0 ? hifzStudents : studentList;

  const completedTotal = progressList.filter((p) => p.status === "completed" || p.status === "tested").length;
  const totalParasPossible = displayStudents.length * 30;
  const overallPct = totalParasPossible > 0 ? Math.round((completedTotal / totalParasPossible) * 100) : 0;

  return (
    <>
      <PageHeader
        title={t("hifz_page_title")}
        subtitle={t("hifz_page_subtitle")}
        impact={[
          { label: <>{t("hifz_tally_students")} · <BanglaDigit value={displayStudents.length} /></>, tone: "accent" },
          { label: <>{t("hifz_tally_completed")} · <BanglaDigit value={completedTotal} /></>, tone: "success" },
          { label: <>{t("hifz_tally_overall")} · <BanglaDigit value={overallPct} />%</>, tone: "default" },
        ]}
      />

      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        {([
          ["none", t("hifz_legend_none")],
          ["learning", t("hifz_legend_learning")],
          ["revising", t("hifz_legend_revising")],
          ["completed", t("hifz_legend_completed")],
          ["tested", t("hifz_legend_tested")],
        ] as const).map(([k, label]) => (
          <span key={k} className="inline-flex items-center gap-1.5">
            <span className={`inline-block size-3 rounded ${statusColor[k]}`} />
            {label}
          </span>
        ))}
      </div>

      {displayStudents.length === 0 ? (
        <EmptyState
          icon={<BookOpenText className="size-8" />}
          title={t("hifz_empty_title")}
          body={t("hifz_empty_body")}
        />
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/50">
                <tr>
                  <th className="sticky left-0 bg-muted/50 p-2 text-left min-w-48">{t("hifz_col_student")}</th>
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => (
                    <th key={n} className="p-1 text-center min-w-7"><BanglaDigit value={n} /></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayStudents.map((s) => {
                  const paraMap = byStudent.get(s.id);
                  return (
                    <tr key={s.id} className="border-t border-border/40">
                      <td className="sticky left-0 bg-background p-2">
                        <Link
                          href={`/madrasa/hifz/${s.id}`}
                          className="font-medium hover:underline"
                        >
                          {s.name_bn}
                        </Link>
                        <div className="text-[10px] text-muted-foreground">
                          {s.sections ? `${s.sections.classes.name_bn} — ${s.sections.name}` : s.student_code}
                        </div>
                      </td>
                      {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => {
                        const st = paraMap?.get(n) ?? "none";
                        return (
                          <td key={n} className="p-0.5 text-center">
                            <Link
                              href={`/madrasa/hifz/${s.id}?para=${n}`}
                              className={`block size-6 rounded ${statusColor[st]} hover:ring-2 hover:ring-primary transition`}
                              aria-label={t("hifz_para_alt", { n, status: st })}
                              title={t("hifz_para_alt", { n, status: st })}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </>
  );
}
