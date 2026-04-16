# Shikkha Platform

Multi-tenant school + madrasa management SaaS for Bangladesh — Phase 0 scaffolding.

**Stack**: Next.js 16 (App Router) · TypeScript · Supabase (Postgres + Auth + RLS + Realtime + Storage) · Tailwind v4 · shadcn/ui · next-intl · PWA

**Primary language**: Bangla · Fallback: English · Optional: Arabic (RTL for madrasa mode)

See the four planning PDFs in the parent folder for authoritative spec:

- `PROJECT_PLAN.md.pdf` — what to build
- `FEATURE_COMPARISON.md.pdf` — why (Bornomala audit + 10 differentiators)
- `FRONTEND_UX_GUIDE.md.pdf` — how every page must look and speak
- `ENV_SETUP_GUIDE.md.pdf` — every integration key + setup

---

## What's in place (Phase 0)

- Next.js 16 app with TS + Tailwind v4 + shadcn/ui (dark-first theme)
- Bangla / Arabic / English fonts (Hind Siliguri, Noto Naskh Arabic, JetBrains Mono)
- Zod-validated env schema (`src/lib/config/env.schema.ts`)
- Supabase SQL migrations 0001–0014 covering §5.1–§5.13 (all tables + RLS baseline + `seed_new_school()` function)
- Supabase client wrappers (browser / server / service-role)
- `src/proxy.ts` (Next 16 renamed middleware → proxy) for session refresh + tenant slug detection + auth gating
- Role model + `requirePermission()` server helper + `usePermission()` client hook
- Auth flow: `/login`, `/register-school` (creates school + primary branch + SCHOOL_ADMIN + seeds defaults), `/forgot-password`
- Four dashboard route groups with role gates:
  - `/super-admin` → SUPER_ADMIN only
  - `/school/[schoolSlug]/admin` → principal / vice-principal / branch-admin / accountant
  - `/school/[schoolSlug]/teacher` → class / subject / madrasa teachers
  - `/school/[schoolSlug]/portal` → student / parent
- Universal UX components per UX guide §15: `PageHeader`, `EmptyState`, `MetricCard`, `BanglaDigit`, `BengaliDate`, `TrustBadge`, `LiveIndicator`
- i18n config + bn/en/ar message bundles
- PWA manifest + robots.txt
- `npm run build` passes

---

## Prerequisites

- Node.js ≥ 20 (tested with 24.15.0)
- npm ≥ 10
- Supabase account — create a project at https://supabase.com
- Supabase CLI (optional, for migrations): `npm install -g supabase`

---

## First-time setup

1. **Install deps**
   ```bash
   npm install
   ```

2. **Fill `.env.local`** with your Supabase project keys. See `../ENV_SETUP_GUIDE.md.pdf` for the full walkthrough. Minimum required:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
   JWT_SECRET=<openssl rand -base64 32>
   SESSION_SECRET=<openssl rand -hex 32>
   ```

3. **Apply migrations** (using Supabase CLI against your remote project):
   ```bash
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```

4. **Generate typed DB client** (replaces the placeholder in `src/lib/supabase/types.ts`):
   ```bash
   npx supabase gen types typescript --project-id <your-project-ref> > src/lib/supabase/types.ts
   ```

5. **Run locally**
   ```bash
   npm run dev
   ```

Visit http://localhost:3000 → register your first school → sign in → you'll land in the principal dashboard.

---

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local dev server (http://localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Serve the built app |
| `npm run lint` | ESLint |
| `npm run db:push` | Apply pending migrations to the linked Supabase project |
| `npm run db:types` | Regenerate `src/lib/supabase/types.ts` from your project |

---

## Project structure (matches PROJECT_PLAN §8)

```
src/
├── app/
│   ├── (marketing)/        Public landing, pricing
│   ├── (auth)/             /login, /register-school, /forgot-password
│   ├── super-admin/        Dashboard 1 — platform owner
│   └── school/[schoolSlug]/
│       ├── admin/          Dashboard 2 — principal
│       ├── teacher/        Dashboard 3 — teachers
│       └── portal/         Dashboard 4 — parent/student PWA
├── components/
│   ├── ui/                 shadcn + custom (PageHeader, MetricCard, …)
│   ├── dashboard/          Shell + layout primitives
│   └── providers/          SchoolContextProvider
├── hooks/                  useActiveSchool, useActiveBranch, usePermission
├── lib/
│   ├── auth/               roles, session, permissions
│   ├── config/             env schema + runtime validator
│   ├── i18n/               locale config
│   ├── supabase/           client / server / admin wrappers + types
│   └── utils/              number, format, date, slug
├── messages/               bn.json, en.json, ar.json
├── server/actions/         Server actions (auth.ts now, more in Phase 1+)
├── i18n/request.ts         next-intl request handler
└── proxy.ts                Next 16 middleware (renamed from middleware.ts)

supabase/
├── migrations/0001–0014    Full schema + RLS baseline + seed_new_school()
└── seed.sql                Platform-level seed (subscription plans)
```

---

## Next steps (Phase 1 — PROJECT_PLAN §11)

1. Replace `src/lib/supabase/types.ts` with generated types from your Supabase project.
2. Build the Admission Inquiry pipeline UI (`/school/[slug]/admin/admission-inquiry`).
3. Build Students module: new / bulk-import / per-student ledger / shift-transfer.
4. Staff management + granular permission UI.
5. Classes + sections + subjects CRUD.
6. Attendance vertical slice (teacher entry + parent view) — exercises the full permission + realtime stack.
7. PWA scaffold (install prompt, offline shell, IndexedDB queue).

---

## Next.js 16 notes

This project uses Next.js 16, which renames several APIs from prior versions:

- `middleware.ts` → `proxy.ts` (exports `proxy()` not `middleware()`)
- `params` / `searchParams` in pages and layouts are **async** (Promise) — always `await` them
- `cookies()` from `next/headers` is async
- `useActionState` replaces `useFormState`

See `node_modules/next/dist/docs/` for the full Next.js 16 documentation bundled with the install.
