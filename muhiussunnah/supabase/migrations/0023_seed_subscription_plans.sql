-- =====================================================================
-- 0023 — Seed default subscription plans
-- =====================================================================
-- The subscription_plans table was created back in 0002 but never
-- populated, so the super-admin "Manage" dialog showed an empty plan
-- dropdown. This migration idempotently upserts the five standard
-- plans used by Bangladesh schools & madrasas.
--
-- Prices are in BDT. Limits are conservative starting caps; tune with
-- follow-up updates rather than re-seeding.
-- =====================================================================

insert into public.subscription_plans
  (code, name_bn, name_en, price_bdt, max_students, max_branches, max_sms, max_storage_mb, features, is_active, display_order)
values
  ('free_trial',  'ফ্রি ট্রায়াল',       'Free Trial',  0,     50,   1,  500,    500,   '{"trial_days":30}'::jsonb,   true, 0),
  ('basic',       'বেসিক',               'Basic',       2500,  300,  1,  3000,   2048,  '{}'::jsonb,                  true, 10),
  ('pro',         'প্রো',                'Pro',         5000,  1000, 3,  10000,  5120,  '{"reports_ai":true}'::jsonb, true, 20),
  ('madrasa_pro', 'মাদ্রাসা প্রো',       'Madrasa Pro', 5500,  1000, 3,  10000,  5120,  '{"hifz_tracking":true,"kitab_stages":true}'::jsonb, true, 25),
  ('enterprise',  'এন্টারপ্রাইজ',       'Enterprise',  15000, null, null, null, null,  '{"custom_domain":true,"priority_support":true}'::jsonb, true, 30)
on conflict (code) do update set
  name_bn        = excluded.name_bn,
  name_en        = excluded.name_en,
  price_bdt      = excluded.price_bdt,
  max_students   = excluded.max_students,
  max_branches   = excluded.max_branches,
  max_sms        = excluded.max_sms,
  max_storage_mb = excluded.max_storage_mb,
  features       = excluded.features,
  is_active      = excluded.is_active,
  display_order  = excluded.display_order,
  updated_at     = now();
