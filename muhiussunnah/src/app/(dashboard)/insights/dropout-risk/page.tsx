import { getTranslations } from "next-intl/server";
import { AlertTriangle, TrendingDown } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BanglaDigit } from "@/components/ui/bangla-digit";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabaseServer } from "@/lib/supabase/server";
import { requireActiveRole } from "@/lib/auth/active-school";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { ComputeRiskButton } from "./compute-button";

const levelVariant = (lv: string): "default" | "secondary" | "destructive" | "outline" =>
  lv === "critical" ? "destructive" : lv === "high" ? "destructive" : lv === "medium" ? "secondary" : "outline";

export default async function DropoutRiskPage() {
  const membership = await requireActiveRole([...ADMIN_ROLES]);
  const t = await getTranslations("insights");

  const levelLabel = (lv: string) =>
    ({ critical: t("level_critical"), high: t("level_high"), medium: t("level_medium"), low: t("level_low") }[lv] ?? lv);

  const schoolSlug = membership.school_slug;
  const supabase = await supabaseServer();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: scores } = await (supabase as any)
    .from("student_risk_scores")
    .select("id, score, risk_level, attendance_pct, avg_marks_pct, fee_overdue_days, factors, suggestion, computed_at, students ( id, name_bn, name_en, roll_no, sections ( name_bn, classes ( name_bn ) ) )")
    .eq("school_id", membership.school_id)
    .order("score", { ascending: false })
    .limit(200);

  type Row = {
    id: string;
    score: number;
    risk_level: string;
    attendance_pct: number | null;
    avg_marks_pct: number | null;
    fee_overdue_days: number | null;
    factors: Record<string, string>;
    suggestion: string | null;
    computed_at: string;
    students: { name_bn: string | null; name_en: string | null; roll_no: string | null; sections: { name_bn: string; classes: { name_bn: string } } | null } | null;
  };

  const list = (scores ?? []) as Row[];
  const critical = list.filter((r) => r.risk_level === "critical").length;
  const high = list.filter((r) => r.risk_level === "high").length;
  const lastComputed = list[0]?.computed_at;

  return (
    <>
      <PageHeader
        title={t("page_title")}
        subtitle={t("page_subtitle")}
        impact={[
          { label: <>{t("tally_critical")} · <BanglaDigit value={critical} /></>, tone: critical > 0 ? "warning" : "default" },
          { label: <>{t("tally_high")} · <BanglaDigit value={high} /></>, tone: high > 0 ? "warning" : "default" },
          { label: <>{t("tally_total")} · <BanglaDigit value={list.length} /></>, tone: "default" },
          ...(lastComputed ? [{ label: <>{t("tally_last_computed")} {new Date(lastComputed).toLocaleDateString()}</>, tone: "accent" as const }] : []),
        ]}
        actions={<ComputeRiskButton  schoolSlug={schoolSlug}/>}
      />

      {list.length === 0 ? (
        <EmptyState
          icon={<TrendingDown className="size-8" />}
          title={t("empty_title")}
          body={t("empty_body")}
          proTip={t("empty_tip")}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("col_student")}</TableHead>
                  <TableHead>{t("col_class")}</TableHead>
                  <TableHead>{t("col_score")}</TableHead>
                  <TableHead>{t("col_level")}</TableHead>
                  <TableHead className="text-right">{t("col_attendance")}</TableHead>
                  <TableHead className="text-right">{t("col_marks")}</TableHead>
                  <TableHead className="text-right">{t("col_overdue")}</TableHead>
                  <TableHead>{t("col_suggestion")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-sm">
                      <div className="font-medium">{r.students?.name_bn ?? r.students?.name_en ?? "—"}</div>
                      {r.students?.roll_no && <div className="text-xs text-muted-foreground">{t("roll_label")} <BanglaDigit value={r.students.roll_no} /></div>}
                    </TableCell>
                    <TableCell className="text-xs">
                      {r.students?.sections ? `${r.students.sections.classes?.name_bn} — ${r.students.sections.name_bn}` : "—"}
                    </TableCell>
                    <TableCell>
                      <span className={`font-bold ${r.risk_level === "critical" ? "text-destructive" : r.risk_level === "high" ? "text-warning-foreground dark:text-warning" : "text-muted-foreground"}`}>
                        <BanglaDigit value={r.score} />
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={levelVariant(r.risk_level)} className="text-xs">
                        {r.risk_level === "critical" && <AlertTriangle className="me-1 size-3" />}
                        {levelLabel(r.risk_level)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs">
                      {r.attendance_pct !== null ? <><BanglaDigit value={Math.round(r.attendance_pct)} />%</> : "—"}
                    </TableCell>
                    <TableCell className="text-right text-xs">
                      {r.avg_marks_pct !== null ? <><BanglaDigit value={Math.round(r.avg_marks_pct)} />%</> : "—"}
                    </TableCell>
                    <TableCell className="text-right text-xs">
                      {r.fee_overdue_days !== null && r.fee_overdue_days > 0 ? <><BanglaDigit value={r.fee_overdue_days} /> {t("days_suffix")}</> : "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs">
                      {r.suggestion ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
}
