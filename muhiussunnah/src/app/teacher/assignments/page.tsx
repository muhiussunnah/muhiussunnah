import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ClipboardCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { BanglaDigit } from "@/components/ui/bangla-digit";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { supabaseServer } from "@/lib/supabase/server";
import { requireActiveRole } from "@/lib/auth/active-school";

export default async function TeacherAssignmentsPage() {
  const membership = await requireActiveRole(["CLASS_TEACHER", "SUBJECT_TEACHER", "MADRASA_USTADH"]);
  const t = await getTranslations("teacher");

  const schoolSlug = membership.school_slug;
  const supabase = await supabaseServer();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: teachings } = await (supabase as any)
    .from("teacher_assignments")
    .select("section_id")
    .eq("school_user_id", membership.school_user_id);

  const sectionIds = [...new Set(((teachings ?? []) as { section_id: string }[]).map((tg) => tg.section_id))];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: assignments } = sectionIds.length > 0
    ? await (supabase as any)
        .from("assignments")
        .select("id, title, due_date, max_marks, sections ( name_bn, classes ( name_bn ) ), subjects ( name_bn )")
        .in("section_id", sectionIds)
        .order("created_at", { ascending: false })
    : { data: [] };

  type Row = { id: string; title: string; due_date: string | null; max_marks: number | null; sections: { name_bn: string; classes: { name_bn: string } } | null; subjects: { name_bn: string } | null };
  const list = (assignments ?? []) as Row[];

  return (
    <>
      <PageHeader
        title={t("assn_title")}
        subtitle={t("assn_subtitle")}
        impact={[{ label: <><BanglaDigit value={list.length} /> {t("assn_count_suffix")}</>, tone: "default" }]}
        actions={
          <Link href={`/assignments`} className={buttonVariants({ variant: "default", size: "sm" })}>
            {t("assn_new")}
          </Link>
        }
      />

      {list.length === 0 ? (
        <EmptyState
          icon={<ClipboardCheck className="size-8" />}
          title={t("assn_empty_title")}
          body={t("assn_empty_body")}
        />
      ) : (
        <div className="grid gap-3">
          {list.map((a) => (
            <Link key={a.id} href={`/assignments/${a.id}`}>
              <Card className="transition hover:shadow-hover">
                <CardContent className="p-4 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-medium">{a.title}</h3>
                    <div className="text-xs text-muted-foreground">
                      {a.sections ? `${a.sections.classes?.name_bn} — ${a.sections.name_bn}` : "—"} · {a.subjects?.name_bn ?? "—"}
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    {a.due_date && (
                      <Badge variant={new Date(a.due_date) < new Date() ? "destructive" : "secondary"}>
                        {t("assn_deadline")}: {new Date(a.due_date).toLocaleDateString()}
                      </Badge>
                    )}
                    {a.max_marks && <Badge variant="outline">{t("assn_marks_label")} <BanglaDigit value={a.max_marks} /></Badge>}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
