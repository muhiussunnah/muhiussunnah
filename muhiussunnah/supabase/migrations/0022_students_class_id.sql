-- 0022_students_class_id.sql
--
-- Give students a direct link to a class, not just via section.
--
-- Motivation: sections are explicitly optional in the UX (the Classes
-- page labels "সেকশন ব্যবস্থাপনা (ঐচ্ছিক)"). A school that runs without
-- sections still expects "Class N — X students" to work. Previously the
-- only path from a student to its class was `students.section_id →
-- sections.class_id`, so every section-less student was orphaned from
-- class aggregates: /admin donut, /classes card counts, etc all missed
-- them.
--
-- This migration:
--   1. Adds nullable `class_id` to `students` with FK + index.
--   2. Backfills it from existing `section_id → class_id` so legacy
--      rows keep their class link.
--   3. Leaves `section_id` untouched; they coexist. If a student has
--      both, `class_id` must be kept in sync with `section_id.class_id`
--      (handled at the app layer, since section moves are rare).

alter table students
  add column if not exists class_id uuid references classes(id) on delete set null;

-- Backfill from existing section links. Safe to re-run — the update is
-- idempotent (same values if section doesn't change).
update students s
set class_id = sec.class_id
from sections sec
where s.section_id = sec.id
  and s.class_id is distinct from sec.class_id;

create index if not exists students_class_id_idx on students(class_id);
create index if not exists students_school_class_idx on students(school_id, class_id);

comment on column students.class_id is
  'Direct class membership. Populated from section_id.class_id when a '
  'section is assigned; settable directly when school runs without '
  'sections. Nullable so unassigned students still insertable.';
