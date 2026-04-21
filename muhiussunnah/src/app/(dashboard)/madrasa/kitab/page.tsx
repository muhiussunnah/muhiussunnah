import { getTranslations } from "next-intl/server";
import { BookOpenText } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { BanglaDigit } from "@/components/ui/bangla-digit";
import { supabaseServer } from "@/lib/supabase/server";
import { requireActiveMadrasaRole } from "@/lib/auth/require-madrasa";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { AddKitabForm } from "./add-kitab-form";

const stageOrder = ["ibtedaiyyah", "mutawassita", "sanaweeya_aamma", "sanaweeya_khassa", "fazilat", "kamil"];

export default async function KitabPage() {
  const { active } = await requireActiveMadrasaRole([...ADMIN_ROLES]);
  const t = await getTranslations("madrasa");

  const stageLabel: Record<string, string> = {
    ibtedaiyyah: t("kitab_stage_ibtedaiyyah"),
    mutawassita: t("kitab_stage_mutawassita"),
    sanaweeya_aamma: t("kitab_stage_sanaweeya_aamma"),
    sanaweeya_khassa: t("kitab_stage_sanaweeya_khassa"),
    fazilat: t("kitab_stage_fazilat"),
    kamil: t("kitab_stage_kamil"),
  };

  const schoolSlug = active.school_slug;
  const supabase = await supabaseServer();
  const [kitabRes, classesRes] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("kitab_curriculum")
      .select("id, stage, kitab_name, author, display_order")
      .eq("school_id", active.school_id)
      .order("display_order"),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("classes")
      .select("id, name_bn")
      .eq("school_id", active.school_id)
      .order("display_order"),
  ]);
  const { data } = kitabRes;
  const { data: classes } = classesRes;

  const list = (data ?? []) as { id: string; stage: string; kitab_name: string; author: string | null; display_order: number }[];
  const byStage = new Map<string, typeof list>();
  for (const k of list) {
    const arr = byStage.get(k.stage) ?? [];
    arr.push(k);
    byStage.set(k.stage, arr);
  }

  return (
    <>
      <PageHeader
        title={t("kitab_title")}
        subtitle={t("kitab_subtitle")}
        impact={[{ label: <>{t("kitab_tally")} · <BanglaDigit value={list.length} /></>, tone: "accent" }]}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="flex flex-col gap-4">
          {stageOrder.map((stage) => {
            const kitabs = byStage.get(stage) ?? [];
            return (
              <Card key={stage}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{stageLabel[stage]}</h3>
                    <span className="text-xs text-muted-foreground">
                      {t("kitab_stage_count", { count: kitabs.length })}
                    </span>
                  </div>
                  {kitabs.length === 0 ? (
                    <p className="mt-2 text-xs text-muted-foreground">{t("kitab_stage_empty")}</p>
                  ) : (
                    <ul className="mt-3 space-y-1.5 text-sm">
                      {kitabs.map((k) => (
                        <li key={k.id} className="flex items-center justify-between rounded-md border border-border/40 px-3 py-1.5">
                          <span>
                            <span className="font-medium">{k.kitab_name}</span>
                            {k.author ? <span className="ml-2 text-xs text-muted-foreground">— {k.author}</span> : null}
                          </span>
                          <span className="text-xs text-muted-foreground">#{k.display_order}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            );
          })}
          {list.length === 0 ? (
            <EmptyState
              icon={<BookOpenText className="size-8" />}
              title={t("kitab_empty_title")}
              body={t("kitab_empty_body")}
            />
          ) : null}
        </section>

        <aside>
          <Card>
            <CardContent className="p-5">
              <h2 className="mb-4 text-lg font-semibold">{t("kitab_new_heading")}</h2>
              <AddKitabForm classes={classes ?? []} schoolSlug={schoolSlug} />
            </CardContent>
          </Card>
        </aside>
      </div>
    </>
  );
}
