import { getTranslations } from "next-intl/server";
import { ClipboardCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { BanglaDigit } from "@/components/ui/bangla-digit";
import { Badge } from "@/components/ui/badge";
import { supabaseServer } from "@/lib/supabase/server";
import { requireActiveRole } from "@/lib/auth/active-school";
import { PORTAL_ROLES } from "@/lib/auth/roles";
import { SubmitForm } from "./submit-form";

export default async function PortalAssignmentsPage() {
  const membership = await requireActiveRole(PORTAL_ROLES);
  const t = await getTranslations("portal");

  const schoolSlug = membership.school_slug;
  const supabase = await supabaseServer();

  let childrenIds: string[] = [];
  if (membership.role === "PARENT") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: guardians } = await (supabase as any)
      .from("student_guardians")
      .select("student_id")
      .eq("user_id", membership.school_user_id);
    childrenIds = ((guardians ?? []) as { student_id: string }[]).map((g) => g.student_id);
  }

  if (childrenIds.length === 0) {
    return (
      <>
        <PageHeader title={t("assignments_title")} subtitle={t("assignments_subtitle_short")} />
        <EmptyState
          icon={<ClipboardCheck className="size-8" />}
          title={t("assignments_no_link_title")}
          body={t("assignments_no_link_body")}
        />
      </>
    );
  }

  const [studentsRes, submissionsRes] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("students")
      .select("id, name_bn, name_en, section_id")
      .in("id", childrenIds)
      .eq("is_active", true),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("assignment_submissions")
      .select("id, assignment_id, student_id, body, file_url, marks, feedback, submitted_at, graded_at")
      .in("student_id", childrenIds),
  ]);
  const { data: studentsData } = studentsRes;
  const { data: submissions } = submissionsRes;

  type Student = { id: string; name_bn: string | null; name_en: string | null; section_id: string | null };
  const students = (studentsData ?? []) as Student[];
  const sectionIds = [...new Set(students.map((s) => s.section_id).filter(Boolean))] as string[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: assignments } = await (supabase as any)
    .from("assignments")
    .select("id, title, description, due_date, max_marks, section_id, subjects ( name_bn )")
    .in("section_id", sectionIds)
    .order("due_date", { ascending: true, nullsFirst: false });

  type Assignment = { id: string; title: string; description: string | null; due_date: string | null; max_marks: number | null; section_id: string; subjects: { name_bn: string } | null };
  type Submission = { id: string; assignment_id: string; student_id: string; body: string | null; file_url: string | null; marks: number | null; feedback: string | null; submitted_at: string | null; graded_at: string | null };
  const aList = (assignments ?? []) as Assignment[];
  const subMap = new Map<string, Submission>();
  for (const s of (submissions ?? []) as Submission[]) {
    subMap.set(`${s.assignment_id}_${s.student_id}`, s);
  }

  const pending = aList.length;

  return (
    <>
      <PageHeader
        title={t("assignments_title")}
        subtitle={t("assignments_subtitle")}
        impact={[{ label: <>{t("assignments_total")} · <BanglaDigit value={pending} /></>, tone: "default" }]}
      />

      {aList.length === 0 ? (
        <EmptyState
          icon={<ClipboardCheck className="size-8" />}
          title={t("assignments_empty_title")}
          body={t("assignments_empty_body")}
        />
      ) : (
        <div className="space-y-4">
          {students.map((st) => (
            <div key={st.id}>
              <h2 className="mb-2 font-semibold">{st.name_bn ?? st.name_en}</h2>
              <div className="space-y-2">
                {aList.filter((a) => a.section_id === st.section_id).map((a) => {
                  const sub = subMap.get(`${a.id}_${st.id}`);
                  const overdue = a.due_date && new Date(a.due_date) < new Date() && !sub?.submitted_at;
                  return (
                    <Card key={a.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <h3 className="font-medium">{a.title}</h3>
                            <div className="flex gap-2 items-center flex-wrap mt-1">
                              <Badge variant="outline" className="text-xs">{a.subjects?.name_bn ?? "—"}</Badge>
                              {a.due_date && (
                                <Badge variant={overdue ? "destructive" : "secondary"} className="text-xs">
                                  {t("assignments_deadline")}: {new Date(a.due_date).toLocaleDateString()}
                                </Badge>
                              )}
                              {sub?.graded_at && sub.marks !== null && (
                                <Badge className="bg-success/10 text-success text-xs" variant="secondary">
                                  {t("assignments_grade")}: <BanglaDigit value={sub.marks} />{a.max_marks ? `/${a.max_marks}` : ""}
                                </Badge>
                              )}
                              {sub?.submitted_at && !sub.graded_at && (
                                <Badge variant="default" className="text-xs">{t("assignments_submitted")}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        {a.description && (
                          <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{a.description}</p>
                        )}
                        {sub?.feedback && (
                          <div className="mt-3 rounded-md bg-success/5 border border-success/20 p-2 text-sm">
                            <strong>{t("assignments_teacher_feedback")}:</strong> {sub.feedback}
                          </div>
                        )}
                        <div className="mt-3">
                          <SubmitForm
                            assignmentId={a.id}
                            studentId={st.id}
                            existingBody={sub?.body ?? null}
                            existingFile={sub?.file_url ?? null} schoolSlug={schoolSlug}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
