import { getTranslations } from "next-intl/server";
import { CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { BengaliDate } from "@/components/ui/bengali-date";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabaseServer } from "@/lib/supabase/server";
import { requireActiveRole } from "@/lib/auth/active-school";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { AddYearForm } from "./add-year-form";

export default async function AcademicYearsPage() {
  const membership = await requireActiveRole(ADMIN_ROLES);
  const t = await getTranslations("academicYears");

  const schoolSlug = membership.school_slug;
  const supabase = await supabaseServer();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("academic_years")
    .select("id, name, start_date, end_date, is_active")
    .eq("school_id", membership.school_id)
    .order("start_date", { ascending: false });

  const list = (data ?? []) as { id: string; name: string; start_date: string; end_date: string; is_active: boolean }[];

  return (
    <>
      <PageHeader
        title={t("page_title")}
        subtitle={t("page_subtitle")}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section>
          {list.length === 0 ? (
            <EmptyState
              icon={<CalendarDays className="size-8" />}
              title={t("empty_title")}
              body={t("empty_body")}
            />
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("col_name")}</TableHead>
                      <TableHead>{t("col_start")}</TableHead>
                      <TableHead>{t("col_end")}</TableHead>
                      <TableHead>{t("col_status")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {list.map((y) => (
                      <TableRow key={y.id}>
                        <TableCell className="font-medium">{y.name}</TableCell>
                        <TableCell><BengaliDate value={y.start_date} /></TableCell>
                        <TableCell><BengaliDate value={y.end_date} /></TableCell>
                        <TableCell>
                          {y.is_active ? (
                            <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">{t("status_active")}</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
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
              <h2 className="mb-4 text-lg font-semibold">{t("new_heading")}</h2>
              <AddYearForm  schoolSlug={schoolSlug}/>
            </CardContent>
          </Card>
        </aside>
      </div>
    </>
  );
}
