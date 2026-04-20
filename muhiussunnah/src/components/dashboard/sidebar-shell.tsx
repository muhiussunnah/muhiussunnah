"use client";

import type { ReactNode } from "react";
import { useSidebar } from "./sidebar-state";
import { cn } from "@/lib/utils";

/**
 * Client wrapper around the sidebar <aside> — subscribes to collapse
 * state so the width + padding can animate between full (w-60) and
 * icon-only (w-16) modes.
 */
export function SidebarShell({ children }: { children: ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <aside
      data-collapsed={collapsed ? "true" : "false"}
      className={cn(
        "relative sticky top-[74px] hidden h-[calc(100vh-74px)] shrink-0 flex-col overflow-y-auto bg-sidebar/70 backdrop-blur-md md:flex transition-[width,padding] duration-300 ease-in-out",
        collapsed ? "w-[72px] px-2 py-5" : "w-60 px-3 py-5",
      )}
    >
      {/* Edge gradient rail */}
      <div
        className="pointer-events-none absolute end-0 inset-y-0 w-px bg-gradient-to-b from-primary/20 via-primary/40 to-accent/20"
        aria-hidden
      />
      {/* Corner glow */}
      <div
        className="pointer-events-none absolute -top-8 -start-8 size-40 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />

      {children}
    </aside>
  );
}

export function SidebarFooter() {
  const { collapsed } = useSidebar();
  return (
    <div className="relative mt-auto pt-4">
      <div
        className="pointer-events-none mb-3 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        aria-hidden
      />
      <div className={cn(
        "flex items-center gap-2 text-xs text-muted-foreground/80",
        collapsed ? "justify-center" : "px-1",
      )}>
        <span className="inline-flex size-6 items-center justify-center rounded-md bg-gradient-primary animate-gradient text-white font-bold text-[11px] shadow-sm shadow-primary/30 shrink-0">
          م
        </span>
        {!collapsed ? (
          <span className="font-medium">
            Powered by{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-semibold">
              Muhius Sunnah
            </span>
          </span>
        ) : null}
      </div>
    </div>
  );
}
