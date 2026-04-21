import {
  BookOpen,
  CalendarDays,
  CreditCard,
  FileText,
  Megaphone,
  MessageSquare,
  Receipt,
  ScrollText,
  TrendingDown,
  TrendingUp,
  UserCog,
  Users,
  Users2,
  Wallet,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { MetricCard } from "@/components/ui/metric-card";
import { RealtimeDashboardIndicator } from "@/components/dashboard/realtime-dashboard-indicator";
import { ClassDonut } from "@/components/dashboard/class-donut";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireActiveRole } from "@/lib/auth/active-school";
import { ADMIN_ROLES, isTeacherRole, type UserRole } from "@/lib/auth/roles";
import { formatDualDate } from "@/lib/utils/date";

export default async function SchoolAdminDashboardPage() {
  const membership = await requireActiveRole([...ADMIN_ROLES, "ACCOUNTANT"]);
  const showHijri = membership.school_type === "madrasa" || membership.school_type === "both";
  const today = formatDualDate(new Date(), { withWeekday: true, withHijri: showHijri });

  // ───────────────────────────────────────────────────────────
  // Pull every dashboard metric in one parallel shot.
  // Any failing query returns null; the UI falls back to 0 so the
  // dashboard never breaks on a missing migration.
  // ───────────────────────────────────────────────────────────
  // Admin client: requireActiveRole() already authorized the user, every
  // query below is scoped by school_id. Needed because RLS on `sections`
  // blocks nested joins (same cause that broke class name on students list).
  const supabase = supabaseAdmin();
  const schoolId = membership.school_id;
  const todayIso = new Date().toISOString().slice(0, 10);
  const monthStartIso = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .slice(0, 10);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;

  const [
    totalStudentsRes,
    activeStudentsRes,
    todayAttendanceRes,
    classesRes,
    subjectsRes,
    invoicesAggRes,
    thisMonthPaymentsRes,
    thisMonthExpensesRes,
    staffRes,
    noticesRes,
    studentsByClassRes,
  ] = await Promise.all([
    sb.from("students").select("id", { count: "exact", head: true }).eq("school_id", schoolId),
    sb.from("students").select("id", { count: "exact", head: true }).eq("school_id", schoolId).eq("status", "active"),
    sb.from("attendance").select("status").eq("date", todayIso).eq("school_id", schoolId),
    sb.from("classes").select("id, name_bn, display_order, sections(id)").eq("school_id", schoolId).order("display_order"),
    sb.from("subjects").select("id", { count: "exact", head: true }).eq("school_id", schoolId),
    sb.from("fee_invoices").select("total_amount, paid_amount, status").eq("school_id", schoolId),
    sb.from("fee_payments").select("amount").eq("school_id", schoolId).gte("payment_date", monthStartIso),
    sb.from("expenses").select("amount").eq("school_id", schoolId).gte("date", monthStartIso),
    sb.from("school_users").select("role, status").eq("school_id", schoolId),
    sb.from("notices").select("id", { count: "exact", head: true }).eq("school_id", schoolId),
    // Student-per-section → group client-side by class name
    sb.from("students")
      .select("id, section_id, sections ( id, name, class_id, classes ( id, name_bn, display_order ) )")
      .eq("school_id", schoolId)
      .eq("status", "active")
      .limit(5000),
  ]);

  const totalStudents = totalStudentsRes.count ?? 0;
  const activeStudents = activeStudentsRes.count ?? 0;

  // Today's attendance: present + late count out of records today
  const attendanceRows = (todayAttendanceRes.data ?? []) as { status: string }[];
  const presentToday = attendanceRows.filter((r) => r.status === "present" || r.status === "late").length;
  const attendancePct = attendanceRows.length > 0
    ? Math.round((presentToday / attendanceRows.length) * 100)
    : 0;

  const classList = (classesRes.data ?? []) as Array<{
    id: string;
    name_bn: string;
    display_order: number | null;
    sections: { id: string }[];
  }>;
  const classCount = classList.length;
  const sectionCount = classList.reduce((s, c) => s + (c.sections?.length ?? 0), 0);
  const subjectCount = subjectsRes.count ?? 0;

  const invoices = (invoicesAggRes.data ?? []) as Array<{
    total_amount: number;
    paid_amount: number;
    status: string;
  }>;
  const totalInvoiceAmount = invoices.reduce((s, i) => s + (Number(i.total_amount) || 0), 0);
  const paidInvoiceAmount = invoices.reduce((s, i) => s + (Number(i.paid_amount) || 0), 0);
  const pendingAmount = Math.max(0, totalInvoiceAmount - paidInvoiceAmount);
  const invoiceCount = invoices.length;

  const thisMonthIncome = ((thisMonthPaymentsRes.data ?? []) as { amount: number }[])
    .reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const thisMonthExpense = ((thisMonthExpensesRes.data ?? []) as { amount: number }[])
    .reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const cashFlow = thisMonthIncome - thisMonthExpense;

  // Staff / teachers / user accounts
  const staffRows = (staffRes.data ?? []) as Array<{ role: string; status: string }>;
  const activeStaff = staffRows.filter((r) => r.status === "active");
  const teacherCount = activeStaff.filter((r) => isTeacherRole(r.role as UserRole)).length;
  const staffCount = activeStaff.length - teacherCount;
  const userCount = staffRows.length;

  const noticesCount = noticesRes.count ?? 0;

  // Group students by class for the donut. Students without a class
  // go into an "অসংযুক্ত" (unassigned) bucket so the chart total
  // always matches the hero "মোট ছাত্র-ছাত্রী" card — otherwise admins
  // see "মোট ২" up top but an empty donut and get confused.
  type ClassBucket = { id: string; name: string; order: number; count: number };
  const classBuckets = new Map<string, ClassBucket>();
  const rawStudents = (studentsByClassRes.data ?? []) as Array<{
    id: string;
    sections: { id: string; class_id: string; classes: { id: string; name_bn: string; display_order: number | null } | null } | null;
  }>;
  let unassigned = 0;
  for (const s of rawStudents) {
    const cls = s.sections?.classes;
    if (!cls) {
      unassigned++;
      continue;
    }
    const b = classBuckets.get(cls.id);
    if (b) b.count++;
    else classBuckets.set(cls.id, { id: cls.id, name: cls.name_bn, order: cls.display_order ?? 999, count: 1 });
  }
  const donutSlices: ClassBucket[] = [...classBuckets.values()].sort((a, b) => a.order - b.order);
  if (unassigned > 0) {
    donutSlices.push({
      id: "__unassigned__",
      name: "⚠️ ক্লাস নির্ধারিত নেই",
      order: 9999,
      count: unassigned,
    });
  }

  // ───────────────────────────────────────────────────────────
  return (
    <>
      <PageHeader
        title={`স্বাগতম, ${membership.full_name_bn ?? "প্রিন্সিপাল"} সাহেব`}
        subtitle={`আজ ${today} · আপনার স্কুলের সম্পূর্ণ চিত্র এক নজরে`}
        impact={[
          { label: <RealtimeDashboardIndicator schoolId={schoolId} />, tone: "success" },
        ]}
      />

      {/* Hero metric row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="মোট ছাত্র-ছাত্রী"
          value={totalStudents}
          icon={<Users2 className="size-4" />}
          tone="accent"
          target={activeStudents > 0 ? `সক্রিয়: ${toBn(activeStudents)}` : "প্রথম শিক্ষার্থী ভর্তি করুন"}
        />
        <MetricCard
          label="আজকের উপস্থিতি"
          value={attendancePct}
          valueSuffix={<span className="text-muted-foreground text-base">%</span>}
          icon={<CalendarDays className="size-4" />}
          tone={attendancePct >= 80 ? "success" : attendancePct >= 50 ? "default" : "warning"}
          target={attendanceRows.length > 0 ? `${toBn(presentToday)}/${toBn(attendanceRows.length)} উপস্থিত` : undefined}
        />
        <MetricCard
          label="এ মাসের আয়"
          value={Math.round(thisMonthIncome)}
          valuePrefix="৳ "
          icon={<Wallet className="size-4" />}
          tone="success"
        />
        <MetricCard
          label="বাকি ফি"
          value={Math.round(pendingAmount)}
          valuePrefix="৳ "
          icon={<TrendingUp className="size-4" />}
          tone={pendingAmount > 0 ? "warning" : "success"}
          target={`${toBn(invoiceCount)} ইনভয়েস`}
        />
      </div>

      {/* Class-wise student distribution donut */}
      <div className="mt-8">
        <ClassDonut
          classes={donutSlices.map((c) => ({ id: c.id, name: c.name, count: c.count }))}
        />
      </div>

      {/* একাডেমিক ব্যবস্থাপনা */}
      <Section title="📚 একাডেমিক ব্যবস্থাপনা">
        <MetricCard
          label="শ্রেণি"
          value={classCount}
          icon={<BookOpen className="size-4" />}
          target={`${toBn(sectionCount)} শাখা`}
        />
        <MetricCard
          label="বিষয়"
          value={subjectCount}
          icon={<ScrollText className="size-4" />}
        />
        <MetricCard
          label="আজকের উপস্থিতি"
          value={presentToday}
          icon={<CalendarDays className="size-4" />}
          tone={attendancePct >= 80 ? "success" : "default"}
          target={`${toBn(attendancePct)}% হার`}
        />
        <MetricCard
          label="নোটিশ"
          value={noticesCount}
          icon={<Megaphone className="size-4" />}
        />
      </Section>

      {/* আর্থিক ব্যবস্থাপনা */}
      <Section title="💰 আর্থিক ব্যবস্থাপনা">
        <MetricCard
          label="এ মাসের আয়"
          value={Math.round(thisMonthIncome)}
          valuePrefix="৳ "
          icon={<Wallet className="size-4" />}
          tone="success"
        />
        <MetricCard
          label="এ মাসের ব্যয়"
          value={Math.round(thisMonthExpense)}
          valuePrefix="৳ "
          icon={<CreditCard className="size-4" />}
          tone="warning"
        />
        <MetricCard
          label="মোট ইনভয়েস"
          value={invoiceCount}
          icon={<Receipt className="size-4" />}
          target={`৳ ${toBnCurrency(Math.round(paidInvoiceAmount))} আদায়`}
        />
        <MetricCard
          label="ক্যাশ ফ্লো"
          value={Math.round(Math.abs(cashFlow))}
          valuePrefix={cashFlow >= 0 ? "৳ +" : "৳ -"}
          icon={cashFlow >= 0 ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
          tone={cashFlow >= 0 ? "success" : "danger"}
        />
      </Section>

      {/* এইচআর + অন্যান্য */}
      <Section title="👥 এইচআর + অন্যান্য">
        <MetricCard
          label="শিক্ষক"
          value={teacherCount}
          icon={<Users className="size-4" />}
          tone="accent"
        />
        <MetricCard
          label="অন্যান্য কর্মচারী"
          value={staffCount}
          icon={<UserCog className="size-4" />}
        />
        <MetricCard
          label="সিস্টেম ব্যবহারকারী"
          value={userCount}
          icon={<FileText className="size-4" />}
          target={`${toBn(activeStaff.length)} সক্রিয়`}
        />
        <MetricCard
          label="অ্যাসাইনমেন্ট ও মেসেজ"
          value={noticesCount}
          icon={<MessageSquare className="size-4" />}
        />
      </Section>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-base font-bold tracking-tight md:text-lg bg-gradient-to-r from-foreground via-foreground to-primary/80 bg-clip-text text-transparent">
        {title}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
    </section>
  );
}

function toBn(n: number): string {
  return String(n).replace(/[0-9]/g, (c) => "০১২৩৪৫৬৭৮৯"[Number(c)]);
}

function toBnCurrency(n: number): string {
  return n.toLocaleString("en-IN").replace(/[0-9]/g, (c) => "০১২৩৪৫৬৭৮৯"[Number(c)]);
}

