-- =====================================================================
-- 0024 — Replace seeded plans with the real pricing-page plans
-- =====================================================================
-- Migration 0023 seeded five invented plans (free_trial / basic / pro /
-- madrasa_pro / enterprise) that don't match marketing. The actual
-- pricing page ships four plans: Lifetime Basic, Starter, Growth,
-- Scale. Wipe the wrong rows and seed the real ones.
--
-- Source of truth for names, prices, limits:
--   src/lib/i18n/marketing.ts ("plans" array)
--   src/app/pricing/page.tsx
-- =====================================================================

-- 1) Remove the placeholder plans from 0023. Any schools still pointing
--    at them get their subscription_plan_id nulled out (schools.FK is
--    ON DELETE SET NULL), which is safe — super admin can re-assign
--    from the Manage dialog.
delete from public.subscription_plans
where code in ('free_trial', 'basic', 'pro', 'madrasa_pro', 'enterprise');

-- 2) Insert the four real plans (idempotent via ON CONFLICT).
--    max_students/max_branches/max_sms = null means unlimited.
insert into public.subscription_plans
  (code, name_bn, name_en, price_bdt, max_students, max_branches, max_sms, max_storage_mb, features, is_active, display_order)
values
  ('lifetime',
     'লাইফটাইম বেসিক', 'Lifetime Basic',
     20000, 200, 1, null, 1024,
     '{"billing":"one_time","tagline_bn":"ছোট প্রতিষ্ঠান · একবার পেমেন্টে সারাজীবন"}'::jsonb,
     true, 10),
  ('starter',
     'স্টার্টার', 'Starter',
     1000, 500, 1, 1000, 2048,
     '{"billing":"monthly","tagline_bn":"বৃদ্ধিমান প্রতিষ্ঠান","pwa_offline":true}'::jsonb,
     true, 20),
  ('growth',
     'গ্রোথ', 'Growth',
     2000, null, 1, 5000, 5120,
     '{"billing":"monthly","tagline_bn":"মাঝারি থেকে বড় প্রতিষ্ঠান","highlighted":true,"online_payments":true,"whatsapp":true,"ai_dropout_risk":true,"ai_report_comments":true,"online_classes":true,"two_fa":true}'::jsonb,
     true, 30),
  ('scale',
     'স্কেল', 'Scale',
     4000, null, null, 20000, 102400,
     '{"billing":"monthly","tagline_bn":"এন্টারপ্রাইজ · মাল্টি-ব্রাঞ্চ","custom_domain":true,"public_website":true,"api_access":true,"webhooks":true,"sso":true,"white_label":true,"priority_support":true,"sla_uptime":99.9}'::jsonb,
     true, 40)
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
