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
 * Before rendering the new-student form, we make sure every class in this
 * school has at least one section. Any class created before the
 * auto-default-section feature would otherwise appear to "disable" the
 * dropdown — we heal that here so admins never hit an empty picker.
 */
async function ensureDefaultSections(schoolId: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = supabaseAdmin() as any;

    // Find classes in this school with NO sections.
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
    // Non-fatal — the form will show a helpful empty state if this ever fails.
  }
}

export default async function NewStudentPage({ params }: PageProps) {
  const { schoolSlug } = await params;
  const membership = await requireRole(schoolSlug, [...ADMIN_ROLES, "ACCOUNTANT"]);

  // Heal any legacy classes missing a default section.
  await ensureDefaultSections(membership.school_id);

  const supabase = await supabaseServer();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: sections } = await (supabase as any)
    .from("sections")
    .select("id, name, class_id, classes!inner(name_bn, school_id, display_order)")
    .eq("classes.school_id", membership.school_id)
    .order("classes(display_order)", { ascending: true });

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
          {sections && sections.length > 0 ? (
            <NewStudentForm schoolSlug={schoolSlug} sections={sections} />
          ) : (
            <div className="rounded-xl border border-dashed border-warning/40 bg-warning/5 p-6 text-center">
              <p className="text-base font-semibold mb-2">আগে ক্লাস যোগ করুন</p>
              <p className="text-sm text-muted-foreground mb-4">
                ছাত্র ভর্তি করতে হলে কমপক্ষে একটি ক্লাস ও একটি সেকশন প্রয়োজন।
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
