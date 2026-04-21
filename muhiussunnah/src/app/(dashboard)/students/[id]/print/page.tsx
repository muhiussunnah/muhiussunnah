import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { supabaseServer } from "@/lib/supabase/server";
import { requireActiveRole } from "@/lib/auth/active-school";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { resolveStudentId } from "@/lib/students/resolve";
import { getSchoolBranding } from "@/lib/schools/branding";
import { BanglaDigit } from "@/components/ui/bangla-digit";
import { PrintActions } from "./print-actions";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: "admission" | "invoice" }>;
};

export default async function StudentPrintPage({ params, searchParams }: PageProps) {
  const [{ id: idOrCode }, sp] = await Promise.all([params, searchParams]);
  const type = sp.type === "invoice" ? "invoice" : "admission";

  const membership = await requireActiveRole([...ADMIN_ROLES, "ACCOUNTANT"]);
  const t = await getTranslations("studentPrint");
  const id = await resolveStudentId(idOrCode, membership.school_id);
  if (!id) notFound();
  const supabase = await supabaseServer();

  const [sRes, feesRes, brandingRow] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("students")
      .select(`
        id, student_code, name_bn, name_en, name_ar, roll, gender, photo_url,
        blood_group, religion, date_of_birth, admission_date, guardian_phone,
        address_present, address_permanent, previous_school,
        admission_fee, tuition_fee, transport_fee,
        sections ( name, classes ( name_bn ) ),
        student_guardians ( name_bn, phone, relation, is_primary )
      `)
      .eq("id", id)
      .eq("school_id", membership.school_id)
      .single(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("fee_invoices")
      .select("id, invoice_no, total_amount, paid_amount, issue_date, status")
      .eq("student_id", id)
      .order("issue_date", { ascending: false })
      .limit(10),
    getSchoolBranding(membership.school_id),
  ]);
  const { data: s } = sRes;
  const { data: feeInvoices } = feesRes;
  if (!s) notFound();

  const student = s as {
    id: string; student_code: string; name_bn: string; name_en: string | null; name_ar: string | null;
    roll: number | null; gender: string | null; photo_url: string | null;
    blood_group: string | null; religion: string | null; date_of_birth: string | null;
    admission_date: string | null; guardian_phone: string | null;
    address_present: string | null; address_permanent: string | null; previous_school: string | null;
    admission_fee: number | null; tuition_fee: number | null; transport_fee: number | null;
    sections: { name: string; classes: { name_bn: string } } | null;
    student_guardians: { name_bn: string; phone: string | null; relation: string; is_primary: boolean }[];
  };

  const branding = brandingRow as {
    name_bn: string;
    name_en: string | null;
    name_ar: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    logo_url: string | null;
    header_display_fields: string | null;
  } | null;

  const headerFields = parseHeaderFields(branding);

  return (
    <div className="bg-white text-black print:bg-white min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-6 print:p-0 print:max-w-none">
        <PrintActions />

        <header className="flex items-center gap-5 border-b-2 border-black pb-4">
          {branding?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={branding.logo_url}
              alt={branding.name_bn}
              className="size-24 shrink-0 object-contain"
            />
          ) : (
            <div className="flex size-24 shrink-0 items-center justify-center rounded-full border border-black/40 text-3xl font-bold">
              م
            </div>
          )}
          <PrintHeaderText fields={headerFields} fallbackName={membership.school_name_bn} />
          {student.photo_url && student.photo_url.trim().length > 0 ? (
            <Image
              src={student.photo_url}
              alt={student.name_bn}
              width={96}
              height={120}
              className="h-28 w-24 shrink-0 rounded border border-black/40 object-cover"
              unoptimized
            />
          ) : (
            <div className="h-28 w-24 shrink-0 rounded border border-black/50 bg-white flex items-center justify-center text-sm text-gray-600">
              {t("photo_label")}
            </div>
          )}
        </header>

        <h2 className="mt-5 text-center text-xl font-bold">
          {type === "invoice" ? t("heading_invoice") : t("heading_admission")}
        </h2>

        {type === "admission" ? (
          <AdmissionDetails student={student} t={t} />
        ) : (
          <InvoiceDetails student={student} feeInvoices={feeInvoices ?? []} t={t} />
        )}

        {type === "admission" ? (
          <div className="mt-12 grid grid-cols-2 gap-8 text-center text-sm">
            <div>
              <div className="mx-auto w-2/3 border-t border-black/70 pt-1">{t("sign_muhtamim")}</div>
            </div>
            <div>
              <div className="mx-auto w-2/3 border-t border-black/70 pt-1">{t("sign_director")}</div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type TT = (key: string, values?: Record<string, string | number>) => string;

function AdmissionDetails({
  student,
  t,
}: {
  student: {
    student_code: string; name_bn: string; name_en: string | null; name_ar: string | null;
    roll: number | null; gender: string | null;
    religion: string | null; date_of_birth: string | null; admission_date: string | null;
    address_present: string | null; address_permanent: string | null;
    blood_group: string | null; previous_school: string | null;
    admission_fee: number | null; tuition_fee: number | null; transport_fee: number | null;
    sections: { name: string; classes: { name_bn: string } } | null;
    student_guardians: { name_bn: string; phone: string | null; relation: string; is_primary: boolean }[];
  };
  t: TT;
}) {
  const father = student.student_guardians.find((g) => g.relation === "father");
  const mother = student.student_guardians.find((g) => g.relation === "mother");
  const primary = student.student_guardians.find((g) => g.is_primary);

  const genderLabel = student.gender === "male" ? t("gender_male") : student.gender === "female" ? t("gender_female") : "—";

  return (
    <>
      <Section title={t("sec_student")}>
        <Row label={t("field_student_id")} value={student.student_code} />
        <Row label={t("field_name_bn")} value={student.name_bn} />
        {student.name_en ? <Row label={t("field_name_en")} value={student.name_en} /> : null}
        {student.name_ar ? <Row label={t("field_name_ar")} value={student.name_ar} /> : null}
        <Row label={t("field_class")} value={student.sections ? `${student.sections.classes.name_bn} — ${student.sections.name}` : "—"} />
        <Row label={t("field_roll")} value={student.roll ? <BanglaDigit value={student.roll} /> : "—"} />
        <Row label={t("field_dob")} value={student.date_of_birth ?? "—"} />
        <Row label={t("field_gender")} value={genderLabel} />
        <Row label={t("field_religion")} value={student.religion ?? "—"} />
        <Row label={t("field_blood")} value={student.blood_group ?? "—"} />
        <Row label={t("field_admission_date")} value={student.admission_date ?? "—"} />
      </Section>

      <Section title={t("sec_address")}>
        <Row label={t("field_present_address")} value={student.address_present ?? "—"} full />
        <Row label={t("field_permanent_address")} value={student.address_permanent ?? "—"} full />
        <Row label={t("field_previous_school")} value={student.previous_school ?? "—"} full />
      </Section>

      <Section title={t("sec_guardian")}>
        <Row label={t("field_father_name")} value={father?.name_bn ?? "—"} />
        <Row label={t("field_father_phone")} value={father?.phone ?? "—"} />
        <Row label={t("field_mother_name")} value={mother?.name_bn ?? "—"} />
        <Row label={t("field_mother_phone")} value={mother?.phone ?? "—"} />
        <Row label={t("field_primary_guardian")} value={primary ? `${primary.name_bn} (${primary.relation})` : "—"} />
        <Row label={t("field_guardian_phone")} value={primary?.phone ?? "—"} />
      </Section>

      <Section title={t("sec_fees")}>
        <Row label={t("field_admission_fee")} value={student.admission_fee != null ? <>৳ <BanglaDigit value={student.admission_fee} /></> : "—"} />
        <Row label={t("field_tuition_fee")} value={student.tuition_fee != null ? <>৳ <BanglaDigit value={student.tuition_fee} /></> : "—"} />
        <Row label={t("field_transport_fee")} value={student.transport_fee != null ? <>৳ <BanglaDigit value={student.transport_fee} /></> : "—"} />
      </Section>
    </>
  );
}

function InvoiceDetails({
  student,
  feeInvoices,
  t,
}: {
  student: {
    student_code: string; name_bn: string;
    admission_fee: number | null; tuition_fee: number | null; transport_fee: number | null;
    sections: { name: string; classes: { name_bn: string } } | null;
    admission_date: string | null;
  };
  feeInvoices: Array<{ id: string; invoice_no: string; total_amount: number; paid_amount: number; issue_date: string; status: string }>;
  t: TT;
}) {
  const admissionFee = student.admission_fee ?? 0;
  const tuitionFee = student.tuition_fee ?? 0;
  const transportFee = student.transport_fee ?? 0;
  const total = admissionFee + tuitionFee + transportFee;

  return (
    <>
      <Section title={t("sec_student_invoice")}>
        <Row label={t("field_student_id")} value={student.student_code} />
        <Row label={t("field_name_bn")} value={student.name_bn} />
        <Row label={t("field_class")} value={student.sections ? `${student.sections.classes.name_bn} — ${student.sections.name}` : "—"} />
        <Row label={t("field_admission_date")} value={student.admission_date ?? "—"} />
      </Section>

      <section className="mt-5 border border-black">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-black text-white">
              <th className="border border-black px-3 py-2 text-start">{t("invoice_col_desc")}</th>
              <th className="border border-black px-3 py-2 text-end w-32">{t("invoice_col_amount")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black px-3 py-2">{t("invoice_admission_fee")}</td>
              <td className="border border-black px-3 py-2 text-end tabular-nums"><BanglaDigit value={admissionFee} /></td>
            </tr>
            <tr>
              <td className="border border-black px-3 py-2">{t("invoice_tuition_fee")}</td>
              <td className="border border-black px-3 py-2 text-end tabular-nums"><BanglaDigit value={tuitionFee} /></td>
            </tr>
            <tr>
              <td className="border border-black px-3 py-2">{t("invoice_transport_fee")}</td>
              <td className="border border-black px-3 py-2 text-end tabular-nums"><BanglaDigit value={transportFee} /></td>
            </tr>
            <tr className="bg-gray-100 font-bold">
              <td className="border border-black px-3 py-2">{t("invoice_total")}</td>
              <td className="border border-black px-3 py-2 text-end tabular-nums">৳ <BanglaDigit value={total} /></td>
            </tr>
          </tbody>
        </table>
      </section>

      {feeInvoices.length > 0 ? (
        <Section title={t("sec_previous_invoices")}>
          <table className="col-span-2 w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-black">
                <th className="py-1 text-start">{t("invoice_col_invoice")}</th>
                <th className="py-1 text-start">{t("invoice_col_date")}</th>
                <th className="py-1 text-end">{t("invoice_col_total")}</th>
                <th className="py-1 text-end">{t("invoice_col_paid")}</th>
                <th className="py-1 text-end">{t("invoice_col_due")}</th>
              </tr>
            </thead>
            <tbody>
              {feeInvoices.map((inv) => (
                <tr key={inv.id} className="border-b border-black/30">
                  <td className="py-1">{inv.invoice_no}</td>
                  <td className="py-1">{inv.issue_date}</td>
                  <td className="py-1 text-end tabular-nums"><BanglaDigit value={inv.total_amount} /></td>
                  <td className="py-1 text-end tabular-nums"><BanglaDigit value={inv.paid_amount} /></td>
                  <td className="py-1 text-end tabular-nums"><BanglaDigit value={inv.total_amount - inv.paid_amount} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      ) : null}

      <div className="mt-16 grid grid-cols-2 gap-8 text-center text-sm">
        <div>
          <div className="mx-auto w-2/3 border-t border-black/70 pt-1">{t("sign_guardian")}</div>
        </div>
        <div>
          <div className="mx-auto w-2/3 border-t border-black/70 pt-1">{t("sign_accountant")}</div>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h3 className="mb-2 border-b border-black text-sm font-bold uppercase tracking-wider">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">{children}</div>
    </section>
  );
}

function Row({ label, value, full }: { label: string; value: React.ReactNode; full?: boolean }) {
  return (
    <div className={`flex items-baseline gap-2 ${full ? "col-span-2" : ""} border-b border-black/20 py-1`}>
      <span className="w-40 shrink-0 text-gray-700">{label}</span>
      <span className="font-medium">:</span>
      <span className="flex-1">{value}</span>
    </div>
  );
}

type HeaderField = { key: string; value: string };

function parseHeaderFields(
  branding: {
    name_bn: string;
    name_en: string | null;
    name_ar: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    header_display_fields: string | null;
  } | null,
): HeaderField[] {
  if (!branding) return [];
  const raw = (branding.header_display_fields ?? "name_bn").trim();
  const allowed = new Set(["name_bn", "name_en", "name_ar", "address", "phone", "email", "website"]);
  const keys = raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => allowed.has(s));
  const effective = keys.length > 0 ? keys : ["name_bn"];

  const valueMap: Record<string, string | null> = {
    name_bn: branding.name_bn,
    name_en: branding.name_en,
    name_ar: branding.name_ar,
    address: branding.address,
    phone: branding.phone,
    email: branding.email,
    website: branding.website,
  };

  return effective
    .map((k) => ({ key: k, value: (valueMap[k] ?? "").trim() }))
    .filter((f) => f.value.length > 0);
}

function PrintHeaderText({
  fields,
  fallbackName,
}: {
  fields: HeaderField[];
  fallbackName: string;
}) {
  if (fields.length === 0) {
    return (
      <div className="flex-1 text-center min-w-0">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight break-words">
          {fallbackName}
        </h1>
      </div>
    );
  }

  const [primary, ...rest] = fields;
  const nameLines = rest.filter((f) => f.key === "name_en" || f.key === "name_ar");
  const addressField = rest.find((f) => f.key === "address");
  const phoneField = rest.find((f) => f.key === "phone");
  const emailField = rest.find((f) => f.key === "email");
  const websiteField = rest.find((f) => f.key === "website");

  return (
    <div className="flex-1 text-center min-w-0">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight break-words">
        {primary.value}
      </h1>
      {nameLines.map((f) => (
        <p
          key={f.key}
          className="mt-0.5 text-sm font-semibold text-gray-800 break-words"
          dir={f.key === "name_ar" ? "rtl" : undefined}
        >
          {f.value}
        </p>
      ))}
      {addressField ? (
        <p className="mt-1 text-xs text-gray-700 break-words">
          <strong>Address:</strong> {addressField.value}
        </p>
      ) : null}
      {phoneField || emailField ? (
        <p className="mt-0.5 text-xs text-gray-700 break-words">
          {phoneField ? (
            <>
              <strong>Phone:</strong> {phoneField.value}
            </>
          ) : null}
          {phoneField && emailField ? <span className="mx-2 text-gray-400">·</span> : null}
          {emailField ? (
            <>
              <strong>Email:</strong> {emailField.value}
            </>
          ) : null}
        </p>
      ) : null}
      {websiteField ? (
        <p className="mt-0.5 text-xs text-gray-700 break-words">
          <strong>Website:</strong> {websiteField.value}
        </p>
      ) : null}
    </div>
  );
}
