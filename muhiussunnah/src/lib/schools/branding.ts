import { cache } from "react";
import { unstable_cache } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type SchoolBranding = {
  id: string;
  name_bn: string;
  name_en: string | null;
  name_ar: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo_url: string | null;
  display_name_locale: "bn" | "en" | null;
  header_display_fields: string | null;
};

const BRANDING_COLS =
  "id, name_bn, name_en, name_ar, address, phone, email, website, logo_url, display_name_locale, header_display_fields";

/**
 * School branding fetcher — cross-request cached for 5 minutes.
 *
 * Previously this only used React cache() (dedupes within one request)
 * which meant every tenant's dashboard navigation paid for one full DB
 * roundtrip just to render the header. Branding changes rarely (logo,
 * name, etc.), so we cache with `unstable_cache` tagged by school id.
 *
 * We use supabaseAdmin() here instead of supabaseServer(). The admin
 * client uses the service-role key and does NOT read cookies, which is
 * what lets `unstable_cache` actually cache — the previous cookie-bound
 * client made that impossible. Safe because branding is already exposed
 * to every tenant member; no sensitive leak.
 *
 * Invalidation: when branding mutates we call `revalidateTag("school:<id>")`
 * from the settings action (added for this speed pass).
 */
async function fetchBrandingById(schoolId: string): Promise<SchoolBranding | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = supabaseAdmin() as any;
  const { data } = await admin
    .from("schools")
    .select(BRANDING_COLS)
    .eq("id", schoolId)
    .maybeSingle();
  return (data ?? null) as SchoolBranding | null;
}

async function fetchBrandingBySlug(slug: string): Promise<SchoolBranding | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = supabaseAdmin() as any;
  const { data } = await admin
    .from("schools")
    .select(BRANDING_COLS)
    .eq("slug", slug)
    .maybeSingle();
  return (data ?? null) as SchoolBranding | null;
}

const cachedById = unstable_cache(fetchBrandingById, ["school-branding-id"], {
  revalidate: 300, // 5 minutes — tenant gets fresh branding within that window
  tags: ["school-branding"],
});

const cachedBySlug = unstable_cache(fetchBrandingBySlug, ["school-branding-slug"], {
  revalidate: 300,
  tags: ["school-branding"],
});

export const getSchoolBranding = cache(
  (schoolId: string): Promise<SchoolBranding | null> => cachedById(schoolId),
);

export const getSchoolBrandingBySlug = cache(
  (slug: string): Promise<SchoolBranding | null> => cachedBySlug(slug),
);
