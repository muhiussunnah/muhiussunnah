import { getTranslations } from "next-intl/server";
import { Video, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BanglaDigit } from "@/components/ui/bangla-digit";
import { buttonVariants } from "@/components/ui/button";
import { supabaseServer } from "@/lib/supabase/server";
import { requireActiveRole } from "@/lib/auth/active-school";
import { PORTAL_ROLES } from "@/lib/auth/roles";

export default async function PortalOnlineClassesPage() {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: students } = childrenIds.length > 0
    ? await (supabase as any).from("students").select("id, name_bn, section_id").in("id", childrenIds).eq("is_active", true)
    : { data: [] };

  const sectionIds = [...new Set(((students ?? []) as Array<{ section_id: string | null }>).map((s) => s.section_id).filter(Boolean))] as string[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: classes } = sectionIds.length > 0
    ? await (supabase as any)
        .from("online_classes")
        .select("id, title, scheduled_at, duration_mins, meet_url, provider, recording_url, sections ( name_bn, classes ( name_bn ) ), subjects ( name_bn )")
        .in("section_id", sectionIds)
        .order("scheduled_at", { ascending: false })
        .limit(50)
    : { data: [] };

  type Row = {
    id: string; title: string | null; scheduled_at: string; duration_mins: number | null; meet_url: string; provider: string; recording_url: string | null;
    sections: { name_bn: string; classes: { name_bn: string } } | null; subjects: { name_bn: string } | null;
  };
  const list = (classes ?? []) as Row[];
  const now = new Date().toISOString();
  const upcoming = list.filter((c) => c.scheduled_at >= now);
  const past = list.filter((c) => c.scheduled_at < now);

  const providerLabel = (p: string) => ({ zoom: "Zoom", google_meet: "Meet", teams: "Teams", other: t("online_provider_other") }[p] ?? p);

  return (
    <>
      <PageHeader
        title={t("online_title")}
        subtitle={t("online_subtitle")}
        impact={[
          { label: <>{t("online_upcoming_label")} · <BanglaDigit value={upcoming.length} /></>, tone: "accent" },
        ]}
      />

      {list.length === 0 ? (
        <EmptyState
          icon={<Video className="size-8" />}
          title={t("online_empty_title")}
          body={t("online_empty_body")}
        />
      ) : (
        <div className="space-y-4">
          {upcoming.length > 0 && <h2 className="font-semibold">{t("online_upcoming_heading")}</h2>}
          {upcoming.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="font-medium">{c.title ?? c.subjects?.name_bn ?? t("online_class_fallback")}</h3>
                  <div className="text-xs text-muted-foreground mt-1">
                    🗓️ {new Date(c.scheduled_at).toLocaleString()}
                    {c.duration_mins && <> · <BanglaDigit value={c.duration_mins} /> {t("online_minutes")}</>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{providerLabel(c.provider)}</Badge>
                  <a href={c.meet_url} target="_blank" rel="noreferrer" className={buttonVariants({ size: "sm" })}>
                    <ExternalLink className="me-1.5 size-3.5" />{t("online_join")}
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}

          {past.length > 0 && <h2 className="font-semibold text-muted-foreground mt-6">{t("online_past_heading")}</h2>}
          {past.slice(0, 20).map((c) => (
            <Card key={c.id} className="opacity-75">
              <CardContent className="p-3 flex items-center justify-between flex-wrap gap-2">
                <div className="text-sm">
                  {c.title ?? c.subjects?.name_bn}
                  <div className="text-xs text-muted-foreground">{new Date(c.scheduled_at).toLocaleDateString()}</div>
                </div>
                {c.recording_url && (
                  <a href={c.recording_url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">
                    {t("online_view_recording")}
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
