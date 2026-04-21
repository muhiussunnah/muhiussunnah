import { getTranslations } from "next-intl/server";
import { Megaphone } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { BanglaDigit } from "@/components/ui/bangla-digit";
import { BengaliDate } from "@/components/ui/bengali-date";
import { supabaseServer } from "@/lib/supabase/server";
import { requireActiveRole } from "@/lib/auth/active-school";
import { PORTAL_ROLES } from "@/lib/auth/roles";

export default async function PortalNoticesPage() {
  const membership = await requireActiveRole(PORTAL_ROLES);
  const t = await getTranslations("portal");

  const schoolSlug = membership.school_slug;
  const supabase = await supabaseServer();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("notices")
    .select("id, title, body, sent_at, created_at, audience")
    .eq("school_id", membership.school_id)
    .in("audience", ["all", "parents", "students"])
    .not("sent_at", "is", null)
    .order("sent_at", { ascending: false })
    .limit(100);

  const notices = (data ?? []) as { id: string; title: string; body: string; sent_at: string; audience: string }[];

  return (
    <>
      <PageHeader
        title={t("notices_title")}
        subtitle={t("notices_subtitle")}
        impact={[{ label: <>{t("notices_total")} · <BanglaDigit value={notices.length} /></>, tone: "accent" }]}
      />

      {notices.length === 0 ? (
        <EmptyState
          icon={<Megaphone className="size-8" />}
          title={t("notices_empty_title")}
          body={t("notices_empty_body")}
        />
      ) : (
        <div className="grid gap-3">
          {notices.map((n) => (
            <Card key={n.id}>
              <CardContent className="p-5">
                <h3 className="font-semibold">{n.title}</h3>
                <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{n.body}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  <BengaliDate value={n.sent_at} />
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
