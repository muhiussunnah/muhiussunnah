-- =====================================================================
-- 0027 — Cascade school_users when their auth user is deleted
-- =====================================================================
-- school_users.user_id was declared as `uuid not null` without a FK
-- reference. That meant deleting a user from Supabase's Authentication
-- dashboard would leave orphan membership rows behind — the staff /
-- subscriptions pages would show an "admin" whose auth account no
-- longer exists, and the user couldn't log in to fix it.
--
-- Attach a real foreign key to `auth.users(id)` with ON DELETE CASCADE
-- so auth deletions propagate cleanly from now on. Any existing
-- orphans should be cleaned first (see the node script in commit
-- message) before the FK is added, otherwise this migration fails.
-- =====================================================================

do $$
begin
  if not exists (
    select 1
    from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'school_users'
      and constraint_name = 'school_users_user_id_fkey'
  ) then
    alter table public.school_users
      add constraint school_users_user_id_fkey
      foreign key (user_id)
      references auth.users(id)
      on delete cascade;
  end if;
end $$;

create index if not exists idx_school_users_user_id
  on public.school_users(user_id);
