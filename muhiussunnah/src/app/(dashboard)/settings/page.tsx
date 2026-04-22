import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Shield, User } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { supabaseServer } from "@/lib/supabase/server";
import { requireActiveRole } from "@/lib/auth/active-school";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { SchoolSettingsForm } from "./settings-form";
import { ProfileForm } from "./profile-form";

// Subscription status can change from the super-admin side at any
// moment; the tenant must see fresh data, not a cached render.
export const dynamic = "force-dynamic";

export default async function SchoolSettingsPage() {
  const membership = await requireActiveRole(ADMIN_ROLES);
  const t = await getTranslations("settings");

  const schoolSlug = membership.school_slug;
  const supabase = await supabaseServer();
  const [schoolRes, authRes] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("schools")
      .select("*, plan:subscription_plans ( code, name_bn, name_en, price_bdt )")
      .eq("id", membership.school_id)
      .single(),
    supabase.auth.getUser(),
  ]);
  const { data } = schoolRes;

  const school = data as {
    slug: string; name_bn: string; name_en: string | null; name_ar?: string | null;
    eiin: string | null;
    type: "school" | "madrasa" | "both"; address: string | null; phone: string | null;
    email: string | null; website: string | null;
    subscription_status: string; trial_ends_at: string | null;
    subscription_expires_at?: string | null;
    logo_url?: string | null; display_name_locale?: "bn" | "en" | null;
    header_display_fields?: string | null;
    plan?: { code: string; name_bn: string; name_en: string; price_bdt: number } | null;
  } | null;

  if (!school) return null;

  const { data: { user: authUser } } = authRes;
  const currentEmail = authUser?.email ?? "";
  const currentFullName = membership.full_name_bn ?? membership.full_name_en ?? "";

  const subLabel = (status: string): string => {
    const map: Record<string, string> = {
      trial: t("sub_trial"),
      active: t("sub_active"),
      past_due: t("sub_past_due"),
      canceled: t("sub_canceled"),
      suspended: t("sub_suspended"),
    };
    return map[status] ?? status;
  };

  return (
    <>
      <PageHeader
        title={t("page_title")}
        subtitle={t("page_subtitle")}
        impact={[
          { label: t("subscription_badge", { status: subLabel(school.subscription_status) }), tone: "accent" },
        ]}
      />

      {/*
        Layout split — wide form column on the left, stack of smaller
        cards on the right. The old grid put Basic Info (tall) and
        Profile (tall) on row 1, then four short cards beneath, leaving
        a huge vertical gap on the right while the left kept scrolling.
        This layout fills that gap: Basic Info flows naturally on the
        left; Profile / Subscription / Security / SMS stack in the
        right column next to it.
      */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* ── Left column: main school form ─────────────────── */}
        <Card>
          <CardContent className="p-5">
            <h2 className="mb-4 text-lg font-semibold">{t("basic_info_heading")}</h2>
            <SchoolSettingsForm initial={school} schoolSlug={schoolSlug} />
          </CardContent>
        </Card>

        {/* ── Right column: stack of ancillary cards ────────── */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="flex flex-col gap-4 p-5">
              <div className="flex items-center gap-2">
                <span className="inline-flex size-9 items-center justify-center rounded-xl bg-gradient-primary text-white shadow-lg shadow-primary/25">
                  <User className="size-4" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold leading-tight">{t("profile_heading")}</h2>
                  <p className="text-xs text-muted-foreground">{t("profile_subheading")}</p>
                </div>
              </div>
              <ProfileForm
                currentEmail={currentEmail}
                currentFullName={currentFullName}
                currentPhotoUrl={membership.photo_url}
                schoolSlug={schoolSlug}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-3 p-5">
              <h2 className="text-lg font-semibold">{t("subscription_heading")}</h2>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <dt className="text-muted-foreground">{t("subscription_plan_label")}</dt>
                <dd>
                  {school.plan ? (
                    <>
                      <span className="font-medium">{school.plan.name_bn}</span>
                      <span className="ms-1 text-xs text-muted-foreground">
                        · ৳{Number(school.plan.price_bdt).toLocaleString("en-IN")}
                      </span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">{t("subscription_plan_none")}</span>
                  )}
                </dd>
                <dt className="text-muted-foreground">{t("subscription_status_label")}</dt>
                <dd>{subLabel(school.subscription_status)}</dd>
                {school.trial_ends_at ? (
                  <>
                    <dt className="text-muted-foreground">{t("subscription_trial_ends")}</dt>
                    <dd>{new Date(school.trial_ends_at).toLocaleDateString()}</dd>
                  </>
                ) : null}
                {school.subscription_expires_at ? (
                  <>
                    <dt className="text-muted-foreground">{t("subscription_expires_label")}</dt>
                    <dd>{new Date(school.subscription_expires_at).toLocaleDateString()}</dd>
                  </>
                ) : null}
                <dt className="text-muted-foreground">{t("subscription_url")}</dt>
                <dd className="font-mono text-xs break-all">/school/{school.slug}</dd>
              </dl>
              <p className="mt-2 rounded-md border border-dashed border-primary/30 bg-primary/5 p-3 text-xs text-muted-foreground">
                {t("subscription_tip")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-3 p-5">
              <h2 className="text-lg font-semibold">{t("security_heading")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("security_body")}
              </p>
              <Link
                href={`/settings/2fa`}
                className={buttonVariants({ variant: "outline", size: "sm", className: "self-start" })}
              >
                <Shield className="me-1.5 size-4" />
                {t("security_2fa_cta")}
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-3 p-5">
              <h2 className="text-lg font-semibold">{t("sms_heading")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("sms_body")}
              </p>
              <Link
                href={`/messaging/templates`}
                className={buttonVariants({ variant: "outline", size: "sm", className: "self-start" })}
              >
                {t("sms_cta")}
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
