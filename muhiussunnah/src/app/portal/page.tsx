import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CalendarCheck, CreditCard, Megaphone, ScrollText } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BanglaDigit } from "@/components/ui/bangla-digit";
import { BengaliDate } from "@/components/ui/bengali-date";
import { buttonVariants } from "@/components/ui/button";
import { supabaseServer } from "@/lib/supabase/server";
import { requireActiveRole } from "@/lib/auth/active-school";
import { PORTAL_ROLES } from "@/lib/auth/roles";
import { formatDualDate } from "@/lib/utils/date";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/lib/i18n/config";

export default async function PortalHomePage() {
  const membership = await requireActiveRole(PORTAL_ROLES);
  const t = await getTranslations("portal");
  const locale = (await getLocale()) as Locale;
  const dateLocale = locale === "ur" ? "en" : locale;
  const schoolSlug = membership.school_slug;
  const today = formatDualDate(new Date(), { withWeekday: true, locale: dateLocale });

  const supabase = await supabaseServer();

  // Load children for parents, self for students
  let childrenIds: string[] = [];
  if (membership.role === "PARENT") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: guardians } = await (supabase as any)
      .from("student_guardians")
      .select("student_id")
      .eq("user_id", membership.school_user_id);
    childrenIds = ((guardians ?? []) as { student_id: string }[]).map((g) => g.student_id);
  } else if (membership.role === "STUDENT") {
    childrenIds = [];
  }

  let children: Array<{
    id: string; name_bn: string; student_code: string; roll: number | null; photo_url: string | null;
    sections: { name: string; classes: { name_bn: string } } | null;
  }> = [];
  if (childrenIds.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from("students")
      .select("id, name_bn, student_code, roll, photo_url, sections(name, classes(name_bn))")
      .in("id", childrenIds);
    children = data ?? [];
  }

  const firstChild = children[0];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: noticesData } = await (supabase as any)
    .from("notices")
    .select("id, title, body, sent_at, created_at")
    .eq("school_id", membership.school_id)
    .order("created_at", { ascending: false })
    .limit(5);
  const notices = (noticesData ?? []) as { id: string; title: string; body: string; sent_at: string | null; created_at: string }[];

  let todayAtt: { status: string } | null = null;
  let recentAttendance: { date: string; status: string }[] = [];
  let dueTotal = 0;
  if (firstChild) {
    const d = new Date().toISOString().slice(0, 10);
    const [attRes, invsRes] = await Promise.all([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any)
        .from("attendance")
        .select("date, status")
        .eq("student_id", firstChild.id)
        .order("date", { ascending: false })
        .limit(30),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any)
        .from("fee_invoices")
        .select("due_amount")
        .eq("student_id", firstChild.id)
        .in("status", ["unpaid", "partial", "overdue"]),
    ]);
    const { data: att } = attRes;
    const { data: invs } = invsRes;
    recentAttendance = (att ?? []) as { date: string; status: string }[];
    todayAtt = recentAttendance.find((a) => a.date === d) ?? null;
    dueTotal = ((invs ?? []) as { due_amount: number }[]).reduce((sum, i) => sum + Number(i.due_amount ?? 0), 0);
  }

  const presentDays = recentAttendance.filter((a) => a.status === "present" || a.status === "late").length;
  const attendancePct = recentAttendance.length > 0 ? Math.round((presentDays / recentAttendance.length) * 100) : 0;

  const displayName = membership.full_name_bn
    ?? membership.full_name_en
    ?? (membership.role === "PARENT" ? t("default_parent_name") : t("default_student_name"));

  const greeting = membership.role === "PARENT"
    ? t("home_greeting_parent", { name: displayName })
    : t("home_greeting_student", { name: displayName });

  if (!firstChild) {
    return (
      <>
        <PageHeader title={greeting} subtitle={t("home_today", { date: today })} />
        <EmptyState
          icon={<CalendarCheck className="size-8" />}
          title={membership.role === "PARENT" ? t("home_no_child_parent") : t("home_no_profile_student")}
          body={t("home_no_child_body")}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={greeting}
        subtitle={t("home_today", { date: today })}
        impact={
          todayAtt
            ? [{ label: todayAtt.status === "absent" ? t("home_att_absent") : t("home_att_present"), tone: todayAtt.status === "absent" ? "warning" : "success" }]
            : [{ label: t("home_att_pending"), tone: "default" }]
        }
      />

      <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="flex items-center gap-4 p-5">
          <Avatar className="size-16">
            {firstChild.photo_url ? <AvatarImage src={firstChild.photo_url} alt={firstChild.name_bn} /> : null}
            <AvatarFallback className="bg-gradient-primary text-white text-xl">{firstChild.name_bn.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{firstChild.name_bn}</h2>
            <p className="text-sm text-muted-foreground">
              {firstChild.sections ? <>{firstChild.sections.classes.name_bn} — {firstChild.sections.name} · </> : null}
              {firstChild.roll ? <>{t("home_roll")}: <BanglaDigit value={firstChild.roll} /> · </> : null}
              {t("home_id")}: <span className="font-mono">{firstChild.student_code}</span>
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-1">
            <div className="text-xs text-muted-foreground">{t("home_this_month_attendance")}</div>
            <div className="text-xl font-bold"><BanglaDigit value={attendancePct} />%</div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarCheck className="size-4" />
              {t("home_card_attendance")}
            </div>
            <div className="text-3xl font-bold"><BanglaDigit value={attendancePct} />%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="size-4" />
              {t("home_card_due_fees")}
            </div>
            <div className="text-2xl font-bold">৳ <BanglaDigit value={dueTotal.toLocaleString("en-IN")} /></div>
            {dueTotal > 0 ? (
              <Link href={`/portal/fees`} className={buttonVariants({ size: "sm", className: "mt-2 bg-gradient-primary text-white" })}>
                {t("home_pay_now")}
              </Link>
            ) : (
              <p className="mt-1 text-xs text-success">{t("home_no_dues")}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Megaphone className="size-4" />
              {t("home_card_notices")}
            </div>
            <div className="text-3xl font-bold"><BanglaDigit value={notices.length} /></div>
            <Link href={`/portal/notices`} className="mt-2 inline-block text-xs text-primary">
              {t("home_see_all")}
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <ScrollText className="size-4" />
              {t("home_card_results")}
            </div>
            <p className="text-sm text-muted-foreground">{t("home_results_coming")}</p>
          </CardContent>
        </Card>
      </div>

      {notices.length > 0 ? (
        <Card className="mt-4">
          <CardContent className="p-5">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">{t("home_recent_notices")}</h3>
            <ul className="divide-y divide-border/60">
              {notices.map((n) => (
                <li key={n.id} className="py-2">
                  <div className="font-medium">{n.title}</div>
                  <div className="text-xs text-muted-foreground"><BengaliDate value={n.sent_at ?? n.created_at} /></div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}
