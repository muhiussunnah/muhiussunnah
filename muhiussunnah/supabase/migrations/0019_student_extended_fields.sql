-- 0019_student_extended_fields.sql
-- Adds commonly-requested admission fields to the students table.
--
--   • session_id     — FK to academic_years so each student carries their
--                      enrollment year explicitly (not derived from
--                      school.active_year).
--   • rf_id_card     — optional RFID / smart card number for gate
--                      attendance and canteen wallet integrations.
--   • admission_fee  — one-time admission fee amount paid at enrollment.
--   • tuition_fee    — default monthly tuition fee for this student.
--                      Used as a baseline when invoices are generated;
--                      scholarships / adjustments layer on top.
--   • transport_fee  — monthly transport surcharge (null = student does
--                      not use school transport).

alter table public.students
  add column if not exists session_id uuid references public.academic_years(id) on delete set null,
  add column if not exists rf_id_card text,
  add column if not exists admission_fee numeric(12, 2),
  add column if not exists tuition_fee numeric(12, 2),
  add column if not exists transport_fee numeric(12, 2);

comment on column public.students.session_id     is 'Academic year this student was enrolled in.';
comment on column public.students.rf_id_card     is 'Optional RFID / smart-card number for gate attendance + canteen wallet.';
comment on column public.students.admission_fee  is 'One-time admission fee paid at enrollment.';
comment on column public.students.tuition_fee    is 'Default monthly tuition baseline for invoice generation.';
comment on column public.students.transport_fee  is 'Monthly transport surcharge. Null when the student is not on school transport.';
