import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { BanglaDigit } from "@/components/ui/bangla-digit";
import { PrintButton } from "@/components/ui/print-button";
import { PrintWatermark } from "@/components/ui/print-watermark";
import { BengaliDate } from "@/components/ui/bengali-date";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabaseServer } from "@/lib/supabase/server";
import { requireActiveRole } from "@/lib/auth/active-school";
import { ADMIN_ROLES } from "@/lib/auth/roles";

type PageProps = { params: Promise<{ id: string; studentId: string }> };

export default async function AdmitCardPage({ params }: PageProps) {
  const { id: examId, studentId } = await params;
  const membership = await requireActiveRole([...ADMIN_ROLES, "ACCOUNTANT"]);

  const schoolSlug = membership.school_slug;
  const supabase = await supabaseServer();
  // Four independent — student/exam/school/seat all keyed off known params. Schedule depends on student.section_id.
  const [studentRes, examRes, schoolRes, seatRes] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("students")
      .select("id, name_bn, name_en, student_code, roll, photo_url, date_of_birth, section_id, sections(name, classes(name_bn))")
      .eq("id", studentId)
      .eq("school_id", membership.school_id)
      .single(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("exams")
      .select("id, name, start_date, end_date, type")
      .eq("id", examId)
      .eq("school_id", membership.school_id)
      .single(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("schools")
      .select("name_bn, name_en, eiin, address, phone, logo_url")
      .eq("id", membership.school_id)
      .single(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("exam_seating")
      .select("seat_row, seat_col, exam_rooms(name)")
      .eq("student_id", studentId)
      .limit(1)
      .maybeSingle(),
  ]);
  const { data: student } = studentRes;
  const { data: exam } = examRes;
  const { data: school } = schoolRes;
  const { data: seat } = seatRes;

  if (!student) notFound();
  if (!exam) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: schedule } = await (supabase as any)
    .from("exam_subjects")
    .select("id, date, start_time, duration_mins, full_marks, subjects(name_bn, code)")
    .eq("exam_id", examId)
    .eq("section_id", student.section_id)
    .order("date", { ascending: true });

  const schedList = (schedule ?? []) as Array<{
    id: string; date: string | null; start_time: string | null; duration_mins: number | null; full_marks: number;
    subjects: { name_bn: string; code: string | null };
  }>;

  const t = await getTranslations("exams");

  return (
    <>
      <div className="mb-4 flex items-center justify-between print:hidden">
        <Link href={`/exams/${examId}`} className="inline-flex items-center gap-1 text-sm hover:text-foreground">
          <ArrowLeft className="size-3.5" /> {t("admit_back_text")}
        </Link>
        <PrintButton />
      </div>

      <PrintWatermark logoUrl={school?.logo_url ?? null} />
      <article className="admit-card relative z-10 mx-auto max-w-3xl rounded-lg border-2 border-primary/60 bg-card/95 p-6 shadow-soft print:border-2 print:shadow-none print:bg-transparent">
        <header className="flex items-center gap-4 border-b-2 border-primary/60 pb-3">
          {school?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={school.logo_url} alt={school.name_bn} className="size-14 rounded object-cover" />
          ) : (
            <div className="flex size-14 items-center justify-center rounded bg-gradient-primary text-xl font-bold text-white">
              {school?.name_bn?.charAt(0) ?? "শ"}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-xl font-bold">{school?.name_bn}</h1>
            {school?.name_en ? <p className="text-xs text-muted-foreground">{school.name_en}</p> : null}
            {school?.address ? <p className="text-xs text-muted-foreground">{school.address}</p> : null}
            <p className="text-xs text-muted-foreground">
              {school?.eiin ? <>EIIN: {school.eiin}</> : null}
              {school?.phone ? <> · {school.phone}</> : null}
            </p>
          </div>
        </header>

        <h2 className="my-4 text-center text-lg font-bold tracking-wide">
          {t("admit_title_bn_en")}
        </h2>
        <p className="mb-4 text-center text-sm font-semibold">{exam.name}</p>

        <section className="mb-6 flex gap-6 items-start">
          <Avatar className="size-24 rounded-md">
            {student.photo_url ? <AvatarImage src={student.photo_url} alt={student.name_bn} /> : null}
            <AvatarFallback className="rounded-md bg-primary/10 text-2xl text-primary">
              {student.name_bn.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            <Row label={t("admit_row_name")} value={student.name_bn} />
            {student.name_en ? <Row label="Name" value={student.name_en} /> : <div />}
            <Row label={t("admit_row_class")} value={student.sections ? `${student.sections.classes.name_bn} — ${student.sections.name}` : "—"} />
            <Row label={t("admit_row_roll")} value={student.roll ?? "—"} />
            <Row label="ID" value={student.student_code} />
            {student.date_of_birth ? <Row label={t("admit_row_dob")} value={<BengaliDate value={student.date_of_birth} />} /> : <div />}
            {seat ? (
              <Row label={t("admit_row_seat")} value={`${seat.exam_rooms?.name ?? "—"} · ${seat.seat_row}-${seat.seat_col}`} />
            ) : null}
          </div>
        </section>

        <section className="mb-4">
          <h3 className="mb-2 text-sm font-semibold">{t("admit_sched_heading")}</h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-primary/60">
                <th className="p-2 text-left">{t("admit_sched_col_date")}</th>
                <th className="p-2 text-left">{t("admit_sched_col_time")}</th>
                <th className="p-2 text-left">{t("admit_sched_col_subject")}</th>
                <th className="p-2 text-right">{t("admit_sched_col_duration")}</th>
                <th className="p-2 text-right">{t("admit_sched_col_max")}</th>
              </tr>
            </thead>
            <tbody>
              {schedList.map((s) => (
                <tr key={s.id} className="border-b border-border/40">
                  <td className="p-2 text-xs">{s.date ? <BengaliDate value={s.date} /> : "—"}</td>
                  <td className="p-2 text-xs">{s.start_time ?? "—"}</td>
                  <td className="p-2">{s.subjects.name_bn}</td>
                  <td className="p-2 text-right text-xs">{s.duration_mins ? `${s.duration_mins} ${t("admit_duration_unit")}` : "—"}</td>
                  <td className="p-2 text-right"><BanglaDigit value={s.full_marks} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-6 rounded-md border border-border/60 bg-muted/30 p-3 text-xs">
          <p className="font-semibold mb-1">{t("admit_instructions_heading")}</p>
          <ol className="ml-4 list-decimal space-y-1 text-muted-foreground">
            <li>{t("admit_inst_1")}</li>
            <li>{t("admit_inst_2")}</li>
            <li>{t("admit_inst_3")}</li>
          </ol>
        </section>

        <footer className="mt-10 flex items-end justify-between text-xs">
          <div className="border-t border-border px-12 pt-1">{t("admit_sig_student")}</div>
          <div className="border-t border-border px-12 pt-1">{t("admit_sig_principal")}</div>
        </footer>
      </article>
    </>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="min-w-20 text-muted-foreground">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
