"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-state";

type NavItem = {
  href: string;
  label: string;
  icon?: ReactNode;
};

/**
 * Sidebar nav with active-page highlighting. A small client-only component
 * so we can read usePathname() without making the whole shell client-side.
 */
export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const { collapsed } = useSidebar();

  /**
   * Pick exactly ONE "active" item — the one whose href best matches the
   * current pathname.
   *
   * Previous buggy logic used prefix-matching on every item, so visiting
   * /fees/payments lit up BOTH the "ফি" (/fees) and "পেমেন্ট" (/fees/
   * payments) sidebar items because /fees is a prefix of /fees/payments.
   *
   * Correct logic: among all items whose href either exactly equals the
   * pathname OR is a proper path-segment prefix of it, pick the one with
   * the longest href. That's always the most specific menu item and the
   * one we want highlighted.
   *
   * Exception: dashboard root URLs (/admin, /teacher, /portal) only
   * count as matches when the pathname equals them exactly — they must
   * never activate for any descendant page.
   */
  const rootHomes = new Set(["/admin", "/teacher", "/portal"]);
  let activeHref: string | null = null;
  if (pathname) {
    let bestLen = -1;
    for (const item of items) {
      const href = item.href;
      let matches: boolean;
      if (rootHomes.has(href)) {
        matches = pathname === href;
      } else {
        matches = pathname === href || pathname.startsWith(href + "/");
      }
      if (matches && href.length > bestLen) {
        bestLen = href.length;
        activeHref = href;
      }
    }
  }

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = item.href === activeHref;
        return (
          <Link
            key={item.href}
            href={item.href}
            // Force full prefetch on all sidebar links. By default Next 15+
            // prefetches only the loading boundary for dynamic routes; forcing
            // the full RSC payload means clicking a sidebar item after hover
            // is instant (no server round-trip). Cost: a bit more upfront
            // bandwidth when the sidebar is in view, which is negligible.
            prefetch={true}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group/nav relative flex items-center rounded-xl border text-sm font-medium transition-all duration-200",
              collapsed
                ? "justify-center size-12 mx-auto"
                : "gap-3 px-3.5 py-2.5",
              active
                ? "border-primary/40 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent text-primary shadow-md shadow-primary/15 font-semibold"
                : "border-transparent text-sidebar-foreground/80 hover:border-primary/30 hover:bg-primary/5 hover:text-primary hover:shadow-sm hover:shadow-primary/10",
              !collapsed && !active && "hover:translate-x-0.5",
              !collapsed && active && "",
            )}
            title={collapsed ? item.label : undefined}
          >
            {/* Active rail on the start edge — gradient + glow (hide in collapsed mode) */}
            {active && !collapsed ? (
              <>
                <span
                  className="pointer-events-none absolute start-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-e-full bg-gradient-primary animate-gradient shadow-[0_0_8px_rgba(124,92,255,0.6)]"
                  aria-hidden
                />
                <span
                  className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent"
                  aria-hidden
                />
              </>
            ) : null}
            <span
              className={cn(
                "flex items-center justify-center transition-colors shrink-0",
                collapsed ? "size-6 [&_svg]:size-5" : "size-6 [&_svg]:size-5",
                active ? "text-primary" : "text-muted-foreground group-hover/nav:text-primary",
              )}
            >
              {item.icon}
            </span>
            {!collapsed ? <span className="truncate">{item.label}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}
