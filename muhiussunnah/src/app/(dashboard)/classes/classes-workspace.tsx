"use client";

/**
 * Workspace shell for /classes:
 *
 *   [ Search ─────────────── ] [ + New class ]
 *   ┌───────────┬───────────┐
 *   │ class 1   │ class 2   │
 *   ├───────────┼───────────┤
 *   │ class 3   │ class 4   │
 *   └───────────┴───────────┘
 *
 * A wrapper around <ClassSectionList /> that owns:
 *   - Live name search (client-side; fast, no server round-trip)
 *   - "New class" dialog (replaces the old always-open right sidebar
 *     that ate half the viewport)
 *   - 2-column responsive grid (md+) so the page uses its width
 *
 * Counts come from the server; we don't refetch on search because
 * filtering is purely presentational.
 */

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Info, Plus, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClassSectionList } from "./class-section-list";
import { AddClassForm } from "./add-class-form";

type ClassRow = {
  id: string;
  name_bn: string;
  name_en: string | null;
  stream: string;
  display_order: number;
  branch_id: string | null;
  sections: { id: string; name: string; capacity: number | null; room: string | null }[];
};

type Branch = { id: string; name: string };

type Props = {
  schoolSlug: string;
  classes: ClassRow[];
  branches: Branch[];
  classStudentCounts: Record<string, number>;
};

export function ClassesWorkspace({
  schoolSlug,
  classes,
  branches,
  classStudentCounts,
}: Props) {
  const t = useTranslations("classes");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return classes;
    return classes.filter((c) => {
      const hay = `${c.name_bn} ${c.name_en ?? ""} ${c.stream}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [classes, q]);

  return (
    <>
      {/* Sticky toolbar: search + new-class CTA. Sits above the grid
          and doesn't scroll off so jumping between classes is fast. */}
      <div className="sticky top-14 z-10 mb-5 -mx-1 flex flex-wrap items-center gap-3 rounded-2xl border border-border/60 bg-background/75 px-3 py-2 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search_placeholder")}
            aria-label={t("search_aria")}
            className="h-10 rounded-xl border-primary/20 bg-card/60 ps-9 pe-9 shadow-sm shadow-primary/5 transition-all duration-200 hover:border-primary/40 focus-visible:border-primary/60"
          />
          {q ? (
            <button
              type="button"
              onClick={() => setQ("")}
              aria-label={t("search_clear")}
              className="absolute end-2 top-1/2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>

        <Button
          type="button"
          onClick={() => setOpen(true)}
          className="h-10 gap-2 rounded-xl bg-gradient-primary animate-gradient px-5 font-semibold text-white shadow-lg shadow-primary/30 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-xl hover:shadow-primary/40"
        >
          <Plus className="size-4" />
          {t("sidebar_new_class")}
        </Button>
      </div>

      {/* Hint banner — tells principals how to handle multi-section
          classes without ever exposing the word "section" in the UI. */}
      <div className="mb-4 flex items-start gap-2 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 p-3.5 text-sm">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        <div className="flex-1">
          <p className="font-medium text-foreground">{t("multi_section_hint_title")}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t("multi_section_hint_body")}
          </p>
        </div>
      </div>

      {/* Results count when filtering */}
      {q && filtered.length !== classes.length ? (
        <p className="mb-3 text-xs text-muted-foreground">
          {t("search_results", { found: filtered.length, total: classes.length })}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <ClassSectionList
          classes={filtered}
          schoolSlug={schoolSlug}
          classStudentCounts={classStudentCounts}
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("sidebar_new_class")}</DialogTitle>
          </DialogHeader>
          <AddClassForm branches={branches} schoolSlug={schoolSlug} />
        </DialogContent>
      </Dialog>
    </>
  );
}
