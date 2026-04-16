/**
 * proxy.ts — Next.js 16 request middleware (renamed from middleware.ts).
 *
 * Responsibilities:
 *   1. Refresh the Supabase session cookie so server components see a valid user.
 *   2. Gate auth-required routes; redirect unauthenticated users to /login.
 *   3. Parse the tenant slug from /school/[slug]/... and stamp it into a
 *      request header so downstream layouts can read it cheaply.
 *   4. Guard /super-admin/* with a minimal "is logged in" check; deep role
 *      enforcement happens in each dashboard's layout (server-side) via
 *      requirePermission.
 *
 * Next.js 16 changes this file from `middleware.ts` (exporting `middleware`)
 * to `proxy.ts` (exporting `proxy`). See proxy docs.
 */

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/config/env";

const PUBLIC_PATHS = new Set([
  "/",
  "/pricing",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
]);

const AUTH_PATHS = new Set([
  "/login",
  "/register-school",
  "/forgot-password",
  "/reset-password",
]);

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true;
  if (AUTH_PATHS.has(pathname)) return true;
  if (pathname.startsWith("/api/public")) return true;
  if (pathname.startsWith("/api/auth/callback")) return true;
  if (pathname.startsWith("/api/payment/")) return true;      // gateway webhooks
  if (pathname.startsWith("/_next/")) return true;
  if (pathname.startsWith("/static/")) return true;
  if (pathname.startsWith("/icons/")) return true;
  if (pathname === "/favicon.ico" || pathname === "/manifest.webmanifest") return true;
  return false;
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  // --- Supabase session refresh ------------------------------------------
  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options as CookieOptions);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // --- Tenant slug header -----------------------------------------------
  const schoolMatch = pathname.match(/^\/school\/([^/]+)/);
  if (schoolMatch) {
    response.headers.set("x-school-slug", schoolMatch[1]);
  }

  // --- Auth gating -------------------------------------------------------
  const isPublic = isPublicPath(pathname);

  if (!user && !isPublic) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/login";
    redirect.searchParams.set("next", pathname);
    return NextResponse.redirect(redirect);
  }

  if (user && AUTH_PATHS.has(pathname)) {
    // Already logged in — bounce away from the auth pages
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/";
    return NextResponse.redirect(redirect);
  }

  return response;
}

export const config = {
  // Skip Next internals and public asset paths. Note: always include the
  // root and dynamic paths so auth cookies refresh on every navigation.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|icons/|static/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)",
  ],
};
