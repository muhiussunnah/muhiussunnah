-- =====================================================================
-- 0029 — Add OTHER_STAFF catch-all role to user_role enum
-- =====================================================================
-- A school can have all kinds of staff that don't fit the existing
-- buckets (gardener, security guard, cook, peon, IT helper, etc.).
-- Rather than expanding the enum every time, give principals an
-- "Other Staff" choice they can use as a generic membership.
--
-- ALTER TYPE … ADD VALUE is safe to run repeatedly because Postgres
-- silently no-ops if the label already exists (IF NOT EXISTS clause).
-- =====================================================================

alter type public.user_role add value if not exists 'OTHER_STAFF';
