import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { BanglaDigit } from "@/components/ui/bangla-digit";
import { supabaseServer } from "@/lib/supabase/server";
import { requireActiveRole } from "@/lib/auth/active-school";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { AddTemplateForm } from "./add-template-form";

export default async function TemplatesPage() {
  const membership = await requireActiveRole(ADMIN_ROLES);

  const schoolSlug = membership.school_slug;
  const supabase = await supabaseServer();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("certificate_templates")
    .select("id, name, type, orientation, paper_size, is_active, variables")
    .eq("school_id", membership.school_id)
    .order("type");

  const list = (data ?? []) as Array<{
    id: string; name: string; type: string; orientation: string; paper_size: string;
    is_active: boolean; variables: string[];
  }>;

  const t = await getTranslations("certificates");
  const typeText = (ty: string) => { try { return t(`type_${ty}`); } catch { return ty; } };

  return (
    <>
      <PageHeader
        breadcrumbs={
          <Link href={`/certificates`} className="inline-flex items-center gap-1 text-sm hover:text-foreground">
            <ArrowLeft className="size-3.5" /> {t("templates_back")}
          </Link>
        }
        title={t("templates_title")}
        subtitle={t("templates_subtitle_alt")}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <section>
          {list.length === 0 ? (
            <EmptyState
              icon={<FileText className="size-8" />}
              title={t("templates_empty_title")}
              body={t("templates_empty_body")}
              proTip={t("templates_empty_tip")}
            />
          ) : (
            <div className="grid gap-3">
              {list.map((tpl) => (
                <Card key={tpl.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{tpl.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {typeText(tpl.type)} · {tpl.orientation} · {tpl.paper_size}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <BanglaDigit value={tpl.variables?.length ?? 0} /> {t("templates_card_variables_suffix")}
                      </div>
                    </div>
                    {tpl.variables && tpl.variables.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {tpl.variables.map((v) => (
                          <span key={v} className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono">
                            {`{{${v}}}`}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <aside>
          <Card>
            <CardContent className="p-5">
              <h2 className="mb-4 text-lg font-semibold">{t("templates_add_title")}</h2>
              <AddTemplateForm  schoolSlug={schoolSlug}/>
            </CardContent>
          </Card>
        </aside>
      </div>
    </>
  );
}
