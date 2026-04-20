import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/session";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { NewStudentForm } from "./new-student-form";

type PageProps = { params: Promise<{ schoolSlug: string }> };

/**
 * Every class needs at least one section internally. Most small schools do
 * not actually use sections, so we silently seed a default "ক" section.
 */
async function ensureDefaultSections(schoolId: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = supabaseAdmin() as any;
    const { data: classes } = await admin
      .from("classes")
      .select("id, sections(id)")
      .eq("school_id", schoolId);
    const orphans = (classes ?? []).filter(
      (c: { id: string; sections: unknown[] | null }) =>
        !c.sections || c.sections.length === 0,
    );
    if (orphans.length === 0) return;
    await admin.from("sections").insert(
      orphans.map((c: { id: string }) => ({
        class_id: c.id,
        name: "ক",
        capacity: null,
      })),
    );
  } catch {
    // non-fatal
  }
}

export default async function NewStudentPage({ params }: PageProps) {
  const { schoolSlug } = await params;
  const membership = await requireRole(schoolSlug, [...ADMIN_ROLES, "ACCOUNTANT"]);

  await ensureDefaultSections(membership.school_id);

  const supabase = await supabaseServer();

  // Classes + their sections
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: classes } = await (supabase as any)
    .from("classes")
    .select("id, name_bn, name_en, display_order, sections(id, name)")
    .eq("school_id", membership.school_id)
    .order("display_order", { ascending: true });

  // Academic years for session picker (active one highlighted)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: years } = await (supabase as any)
    .from("academic_years")
    .select("id, name, is_active")
    .eq("school_id", membership.school_id)
    .order("start_date", { ascending: false });

  // Existing student + guardian names — fuel for the autocomplete datalists
  // so admins can reuse family names when enrolling siblings.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existing } = await (supabase as any)
    .from("students")
    .select("name_bn, name_en")
    .eq("school_id", membership.school_id)
    .order("created_at", { ascending: false })
    .limit(500);

  // Deduplicate case-insensitively
  const nameSetBn = new Set<string>();
  const nameSetEn = new Set<string>();
  for (const row of (existing ?? []) as { name_bn: string | null; name_en: string | null }[]) {
    if (row.name_bn) nameSetBn.add(row.name_bn);
    if (row.name_en) nameSetEn.add(row.name_en);
  }

  // Guardian names from student_guardians for a richer autocomplete
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: guardianRows } = await (supabase as any)
    .from("student_guardians")
    .select("name_bn, relation, students!inner(school_id)")
    .eq("students.school_id", membership.school_id)
    .limit(1000);
  const fatherNames = new Set<string>();
  const motherNames = new Set<string>();
  for (const g of (guardianRows ?? []) as { name_bn: string | null; relation: string | null }[]) {
    if (!g.name_bn) continue;
    if (g.relation === "mother") motherNames.add(g.name_bn);
    else fatherNames.add(g.name_bn);
  }

  const classList = (classes ?? []) as Array<{
    id: string;
    name_bn: string;
    name_en: string | null;
    display_order: number;
    sections: { id: string; name: string }[];
  }>;

  const academicYears = (years ?? []) as Array<{
    id: string;
    name: string;
    is_active: boolean;
  }>;

  return (
    <>
      <PageHeader
        breadcrumbs={
          <Link href={`/school/${schoolSlug}/admin/students`} className="inline-flex items-center gap-1 text-sm hover:text-foreground">
            <ArrowLeft className="size-3.5" /> ছাত্র তালিকা
          </Link>
        }
        title="নতুন শিক্ষার্থী ভর্তি"
        subtitle="ফর্ম পূরণ করতে প্রায় ২ মিনিট লাগবে। পরে সকল তথ্য edit করা যাবে।"
        impact={[
          { label: "⏱️ ~২ মিনিট", tone: "accent" },
          { label: "💾 ছাত্র কোড স্বয়ংক্রিয়ভাবে তৈরি হবে", tone: "default" },
        ]}
      />

      <Card>
        <CardContent className="p-5 md:p-6">
          {classList.length > 0 ? (
            <NewStudentForm
              schoolSlug={schoolSlug}
              classes={classList}
              years={academicYears}
              nameSuggestionsBn={[...nameSetBn]}
              nameSuggestionsEn={[...nameSetEn]}
              fatherSuggestions={[...fatherNames]}
              motherSuggestions={[...motherNames]}
            />
          ) : (
            <div className="rounded-xl border border-dashed border-warning/40 bg-warning/5 p-6 text-center">
              <p className="text-base font-semibold mb-2">আগে ক্লাস যোগ করুন</p>
              <p className="text-sm text-muted-foreground mb-4">
                ছাত্র ভর্তি করতে হলে কমপক্ষে একটি ক্লাস প্রয়োজন। সেকশন ঐচ্ছিক।
              </p>
              <Link
                href={`/school/${schoolSlug}/admin/classes`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/25"
              >
                ক্লাস সেটআপে যান →
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
