import { BookOpen } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { BanglaDigit } from "@/components/ui/bangla-digit";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireActiveRole } from "@/lib/auth/active-school";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { ensureDefaultSections } from "@/lib/schools/self-heal";
import { ClassesWorkspace } from "./classes-workspace";

export default async function ClassesPage() {
  const membership = await requireActiveRole([...ADMIN_ROLES, "ACCOUNTANT"]);

  const schoolSlug = membership.school_slug;
  // Legacy classes get a default section so downstream modules
  // (attendance / marks / online classes) keep resolving section_id
  // even though the UI never shows it.
  await ensureDefaultSections(membership.school_id);

  const supabase = supabaseAdmin();
  const [classesRes, branchesRes, studentsRes] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("classes")
      .select(`
        id, name_bn, name_en, stream, display_order, branch_id,
        sections ( id, name, capacity, room )
      `)
      .eq("school_id", membership.school_id)
      .order("display_order", { ascending: true }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("school_branches")
      .select("id, name")
      .eq("school_id", membership.school_id)
      .order("is_primary", { ascending: false }),
    // Only need class_id now — per-class counts come straight from the
    // direct column (migration 0022). No section aggregation needed
    // since the UI no longer surfaces sections.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("students")
      .select("class_id")
      .eq("school_id", membership.school_id)
      .eq("status", "active")
      .limit(10000),
  ]);
  const { data: classes } = classesRes;
  const { data: branches } = branchesRes;
  const { data: students } = studentsRes;

  const classList = (classes ?? []) as {
    id: string;
    name_bn: string;
    name_en: string | null;
    stream: string;
    display_order: number;
    branch_id: string | null;
    sections: { id: string; name: string; capacity: number | null; room: string | null }[];
  }[];

  const classCounts = new Map<string, number>();
  for (const s of (students ?? []) as { class_id: string | null }[]) {
    if (s.class_id) classCounts.set(s.class_id, (classCounts.get(s.class_id) ?? 0) + 1);
  }
  const classStudentCounts: Record<string, number> = {};
  for (const c of classList) classStudentCounts[c.id] = classCounts.get(c.id) ?? 0;
  const totalStudents = (students ?? []).length;

  const t = await getTranslations("classes");

  return (
    <>
      <PageHeader
        title={t("page_title")}
        subtitle={t("page_subtitle")}
        impact={[
          { label: <>{t("impact_total")} · <BanglaDigit value={classList.length} /></>, tone: "accent" },
          { label: <>{t("impact_total_students")} · <BanglaDigit value={totalStudents} /></>, tone: "success" },
        ]}
      />

      {classList.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="size-8" />}
          title={t("empty_title")}
          body={t("empty_body")}
          proTip={t("empty_pro_tip")}
        />
      ) : (
        <ClassesWorkspace
          schoolSlug={schoolSlug}
          classes={classList}
          branches={branches ?? []}
          classStudentCounts={classStudentCounts}
        />
      )}
    </>
  );
}
