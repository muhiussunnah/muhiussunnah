import Link from "next/link";
import { FileCheck2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { BanglaDigit } from "@/components/ui/bangla-digit";
import { BengaliDate } from "@/components/ui/bengali-date";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { buttonVariants } from "@/components/ui/button";
import { supabaseServer } from "@/lib/supabase/server";
import { requireActiveRole } from "@/lib/auth/active-school";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { IssueCertificateForm } from "./issue-form";

export default async function CertificatesPage() {
  const membership = await requireActiveRole(ADMIN_ROLES);

  const schoolSlug = membership.school_slug;
  const supabase = await supabaseServer();
  // Independent — all three keyed off school_id only.
  const [issuedRes, templatesRes, studentsRes] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("certificates_issued")
      .select(`
        id, serial_no, issued_on,
        students ( id, name_bn, student_code ),
        certificate_templates ( type, name )
      `)
      .eq("school_id", membership.school_id)
      .order("issued_on", { ascending: false })
      .limit(200),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("certificate_templates")
      .select("id, name, type, is_active")
      .eq("school_id", membership.school_id)
      .eq("is_active", true),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("students")
      .select("id, name_bn, student_code")
      .eq("school_id", membership.school_id)
      .order("name_bn")
      .limit(1000),
  ]);
  const { data: issued } = issuedRes;
  const { data: templates } = templatesRes;
  const { data: students } = studentsRes;

  const list = (issued ?? []) as Array<{
    id: string; serial_no: string; issued_on: string;
    students: { id: string; name_bn: string; student_code: string } | null;
    certificate_templates: { type: string; name: string } | null;
  }>;

  const templateList = (templates ?? []) as { id: string; name: string; type: string; is_active: boolean }[];
  const studentList = (students ?? []) as { id: string; name_bn: string; student_code: string }[];

  const t = await getTranslations("certificates");
  const typeText = (ty: string) => { try { return t(`type_${ty}`); } catch { return ty; } };

  return (
    <>
      <PageHeader
        title={t("page_title")}
        subtitle={t("page_subtitle")}
        impact={[
          { label: <>{t("impact_issued")} · <BanglaDigit value={list.length} /></>, tone: "accent" },
          { label: <>{t("impact_templates")} · <BanglaDigit value={templateList.length} /></>, tone: "default" },
        ]}
        actions={
          <Link
            href={`/certificates/templates`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            {t("manage_templates_btn")}
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section>
          {list.length === 0 ? (
            <EmptyState
              icon={<FileCheck2 className="size-8" />}
              title={t("empty_title")}
              body={t("empty_body")}
              proTip={templateList.length === 0 ? t("empty_tip_no_templates") : null}
            />
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("col_serial")}</TableHead>
                      <TableHead>{t("col_student")}</TableHead>
                      <TableHead>{t("col_type")}</TableHead>
                      <TableHead>{t("col_date")}</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {list.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-mono text-xs">{c.serial_no}</TableCell>
                        <TableCell>
                          {c.students ? (
                            <>
                              <div className="font-medium">{c.students.name_bn}</div>
                              <div className="text-xs text-muted-foreground">{c.students.student_code}</div>
                            </>
                          ) : "—"}
                        </TableCell>
                        <TableCell className="text-xs">
                          {c.certificate_templates ? (
                            <span className="rounded-full bg-muted px-2 py-0.5">
                              {typeText(c.certificate_templates.type)}
                            </span>
                          ) : "—"}
                        </TableCell>
                        <TableCell className="text-xs"><BengaliDate value={c.issued_on} /></TableCell>
                        <TableCell>
                          <Link
                            href={`/certificates/${c.id}`}
                            className="text-xs text-primary hover:underline"
                          >
                            {t("view_link")}
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </section>

        <aside>
          <Card>
            <CardContent className="p-5">
              <h2 className="mb-4 text-lg font-semibold">{t("sidebar_title")}</h2>
              <IssueCertificateForm templates={templateList} students={studentList} schoolSlug={schoolSlug} />
            </CardContent>
          </Card>
        </aside>
      </div>
    </>
  );
}
