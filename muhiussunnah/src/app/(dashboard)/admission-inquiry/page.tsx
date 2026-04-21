import { getTranslations } from "next-intl/server";
import { ClipboardList, PhoneCall } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { BanglaDigit } from "@/components/ui/bangla-digit";
import { BengaliDate } from "@/components/ui/bengali-date";
import { supabaseServer } from "@/lib/supabase/server";
import { requireActiveRole } from "@/lib/auth/active-school";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { AddInquiryForm } from "./add-inquiry-form";
import { InquiryStatusToggle } from "./status-toggle";

const statusTones: Record<string, string> = {
  new: "bg-primary/10 text-primary",
  contacted: "bg-info/10 text-info",
  visited: "bg-warning/10 text-warning-foreground dark:text-warning",
  admitted: "bg-success/10 text-success",
  lost: "bg-destructive/10 text-destructive",
};

export default async function AdmissionInquiryPage() {
  const membership = await requireActiveRole([...ADMIN_ROLES, "ACCOUNTANT"]);
  const t = await getTranslations("admissionInquiry");

  const statusLabels: Record<string, string> = {
    new: t("status_new"),
    contacted: t("status_contacted"),
    visited: t("status_visited"),
    admitted: t("status_admitted"),
    lost: t("status_lost"),
  };

  const schoolSlug = membership.school_slug;
  const supabase = await supabaseServer();
  const [inquiriesRes, classesRes] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("admission_inquiries")
      .select("id, student_name, guardian_name, guardian_phone, source, status, followup_date, notes, created_at, class_interested, classes(name_bn)")
      .eq("school_id", membership.school_id)
      .order("created_at", { ascending: false })
      .limit(200),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("classes")
      .select("id, name_bn")
      .eq("school_id", membership.school_id)
      .order("display_order"),
  ]);
  const { data: inquiries } = inquiriesRes;
  const { data: classes } = classesRes;

  const list = (inquiries ?? []) as Array<{
    id: string; student_name: string; guardian_name: string | null; guardian_phone: string;
    source: string; status: string; followup_date: string | null; notes: string | null;
    created_at: string; class_interested: string | null; classes: { name_bn: string } | null;
  }>;

  const stats = {
    total: list.length,
    new: list.filter((i) => i.status === "new").length,
    admitted: list.filter((i) => i.status === "admitted").length,
    conversion: list.length > 0
      ? Math.round((list.filter((i) => i.status === "admitted").length / list.length) * 100)
      : 0,
  };

  return (
    <>
      <PageHeader
        title={t("page_title")}
        subtitle={t("page_subtitle")}
        impact={[
          { label: <>{t("tally_total")} · <BanglaDigit value={stats.total} /></>, tone: "accent" },
          { label: <>{t("tally_new")} · <BanglaDigit value={stats.new} /></>, tone: "default" },
          { label: <>{t("tally_admitted")} · <BanglaDigit value={stats.admitted} /></>, tone: "success" },
          { label: <>{t("tally_conversion")} · <BanglaDigit value={stats.conversion} />%</>, tone: "warning" },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section>
          {list.length === 0 ? (
            <EmptyState
              icon={<ClipboardList className="size-8" />}
              title={t("empty_title")}
              body={t("empty_body")}
              proTip={t("empty_tip")}
            />
          ) : (
            <Card>
              <CardContent className="p-0">
                <ul className="divide-y divide-border/60">
                  {list.map((i) => (
                    <li key={i.id} className="flex flex-col gap-2 p-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">{i.student_name}</span>
                          <span className={`rounded-full px-2 py-0.5 text-xs ${statusTones[i.status]}`}>
                            {statusLabels[i.status]}
                          </span>
                          {i.classes?.name_bn ? (
                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                              {i.classes.name_bn}
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          {i.guardian_name ? <span>👤 {i.guardian_name}</span> : null}
                          <span className="inline-flex items-center gap-1">
                            <PhoneCall className="size-3" />
                            <a href={`tel:${i.guardian_phone}`} className="hover:text-foreground">{i.guardian_phone}</a>
                          </span>
                          <span>{t("field_source_label")}: {i.source}</span>
                          {i.followup_date ? (
                            <span>{t("field_followup_label")}: <BengaliDate value={i.followup_date} /></span>
                          ) : null}
                        </div>
                        {i.notes ? <p className="mt-2 text-xs text-muted-foreground">{i.notes}</p> : null}
                      </div>
                      <InquiryStatusToggle
                        id={i.id}
                        currentStatus={i.status} schoolSlug={schoolSlug}
                      />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </section>

        <aside>
          <Card>
            <CardContent className="p-5">
              <h2 className="mb-4 text-lg font-semibold">{t("new_heading")}</h2>
              <AddInquiryForm classes={classes ?? []} schoolSlug={schoolSlug} />
            </CardContent>
          </Card>
        </aside>
      </div>
    </>
  );
}
