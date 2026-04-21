import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LifeBuoy, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { BengaliDate } from "@/components/ui/bengali-date";
import { supabaseServer } from "@/lib/supabase/server";
import { requireActiveRole } from "@/lib/auth/active-school";
import { PORTAL_ROLES } from "@/lib/auth/roles";
import { NewTicketForm } from "./new-ticket-form";

export default async function PortalSupportPage() {
  const membership = await requireActiveRole(PORTAL_ROLES);
  const t = await getTranslations("portal");

  const statusLabel: Record<string, string> = {
    open: t("support_status_open"),
    in_progress: t("support_status_in_progress"),
    waiting: t("support_status_waiting"),
    resolved: t("support_status_resolved"),
    closed: t("support_status_closed"),
  };

  const schoolSlug = membership.school_slug;
  const supabase = await supabaseServer();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("support_tickets")
    .select("id, subject, body, status, priority, created_at")
    .eq("school_id", membership.school_id)
    .eq("created_by", membership.school_user_id)
    .order("created_at", { ascending: false })
    .limit(50);

  const tickets = (data ?? []) as Array<{ id: string; subject: string; body: string; status: string; priority: string; created_at: string }>;

  return (
    <>
      <PageHeader
        title={t("support_title")}
        subtitle={t("support_subtitle")}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section>
          {tickets.length === 0 ? (
            <EmptyState
              icon={<LifeBuoy className="size-8" />}
              title={t("support_no_tickets_title")}
              body={t("support_no_tickets_body")}
            />
          ) : (
            <div className="grid gap-3">
              {tickets.map((tk) => (
                <Link key={tk.id} href={`/portal/support/${tk.id}`} className="group">
                  <Card className="transition hover:shadow-hover">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{tk.subject}</h3>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                          {statusLabel[tk.status] ?? tk.status}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{tk.body}</p>
                      <p className="mt-2 text-xs text-muted-foreground"><BengaliDate value={tk.created_at} /></p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        <aside>
          <Card>
            <CardContent className="p-5">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Plus className="size-4" /> {t("support_new_ticket")}
              </h2>
              <NewTicketForm  schoolSlug={schoolSlug}/>
            </CardContent>
          </Card>
        </aside>
      </div>
    </>
  );
}
