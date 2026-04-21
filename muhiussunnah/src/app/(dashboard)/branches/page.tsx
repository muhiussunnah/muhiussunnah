import { getTranslations } from "next-intl/server";
import { Building2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { BanglaDigit } from "@/components/ui/bangla-digit";
import { supabaseServer } from "@/lib/supabase/server";
import { requireActiveRole } from "@/lib/auth/active-school";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { AddBranchForm } from "./add-branch-form";
import { BranchList } from "./branch-list";

export default async function BranchesPage() {
  const membership = await requireActiveRole(ADMIN_ROLES);
  const t = await getTranslations("branches");

  const schoolSlug = membership.school_slug;
  const supabase = await supabaseServer();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("school_branches")
    .select("id, name, address, phone, is_primary")
    .eq("school_id", membership.school_id)
    .order("is_primary", { ascending: false })
    .order("name");

  const branches = (data ?? []) as { id: string; name: string; address: string | null; phone: string | null; is_primary: boolean }[];

  return (
    <>
      <PageHeader
        title={t("page_title")}
        subtitle={t("page_subtitle")}
        impact={[{ label: <>{t("tally_total")} · <BanglaDigit value={branches.length} /></>, tone: "accent" }]}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section>
          {branches.length === 0 ? (
            <EmptyState
              icon={<Building2 className="size-8" />}
              title={t("empty_title")}
              body={t("empty_body")}
            />
          ) : (
            <BranchList branches={branches} schoolSlug={schoolSlug} />
          )}
        </section>

        <aside>
          <Card>
            <CardContent className="p-5">
              <h2 className="mb-4 text-lg font-semibold">{t("new_heading")}</h2>
              <AddBranchForm  schoolSlug={schoolSlug}/>
            </CardContent>
          </Card>
        </aside>
      </div>
    </>
  );
}
