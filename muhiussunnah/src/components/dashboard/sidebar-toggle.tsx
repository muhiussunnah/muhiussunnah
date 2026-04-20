"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "./sidebar-state";

/**
 * Hamburger button in the header — collapses the sidebar to icon-only
 * mode. Visible only on md+ screens since mobile gets a different
 * pattern (full-screen drawer, not an icon rail).
 */
export function SidebarToggle() {
  const { collapsed, toggle } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={collapsed ? "সাইডবার খুলুন" : "সাইডবার বন্ধ করুন"}
      aria-expanded={!collapsed}
      className="hidden md:inline-flex size-10 items-center justify-center rounded-xl border border-border/60 bg-card/60 text-muted-foreground shadow-sm transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:shadow-md hover:shadow-primary/10 active:scale-95"
    >
      <Menu className="size-5" />
    </button>
  );
}
