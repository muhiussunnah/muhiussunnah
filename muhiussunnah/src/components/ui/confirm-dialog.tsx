"use client";

/**
 * Global custom confirm dialog.
 *
 * The browser's native `confirm()` shows an unbranded "site says…" popup
 * which (a) breaks our dark theme, (b) ignores Bangla typography, and
 * (c) shows the raw URL in Chrome. This module provides a single global
 * alert-dialog that matches the app's design language, with an
 * imperative API that's almost a drop-in replacement for `confirm()`:
 *
 *   const ok = await confirmDialog({
 *     title: "স্থায়ীভাবে মুছে ফেলবেন?",
 *     body: "এই কাজ উল্টানো যাবে না।",
 *     confirmLabel: "হ্যাঁ, মুছুন",
 *     tone: "destructive",
 *   });
 *   if (!ok) return;
 *
 * The mount lives once in the dashboard layout (<ConfirmDialogRoot />).
 * A module-scoped resolver lets any client component anywhere trigger
 * the dialog without threading a provider through every subtree.
 */

import { useEffect, useState } from "react";
import { AlertTriangle, Info } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type ConfirmOptions = {
  title: string;
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Destructive uses red action button + warning icon. */
  tone?: "default" | "destructive";
};

// ── Module-scoped resolver + setter ─────────────────────────────
// One dialog in the entire app. These closures are swapped in by
// <ConfirmDialogRoot /> when it mounts, and consumed by confirmDialog()
// anywhere in client code.
let resolver: ((v: boolean) => void) | null = null;
let setOptions: ((o: ConfirmOptions | null) => void) | null = null;

export function confirmDialog(opts: ConfirmOptions): Promise<boolean> {
  // Server-render fallback: if the root hasn't mounted yet (SSR, prerender),
  // fall back to window.confirm so we never silently drop the action.
  if (!setOptions) {
    if (typeof window !== "undefined") {
      const msg = opts.body ? `${opts.title}\n\n${opts.body}` : opts.title;
      return Promise.resolve(window.confirm(msg));
    }
    return Promise.resolve(false);
  }

  return new Promise<boolean>((resolve) => {
    // If another call is in flight, reject it — keep UI state simple;
    // callers shouldn't be stacking confirms anyway.
    resolver?.(false);
    resolver = resolve;
    setOptions!(opts);
  });
}

export function ConfirmDialogRoot() {
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);

  useEffect(() => {
    setOptions = setOpts;
    return () => {
      setOptions = null;
      // Reject any in-flight promise so the caller can continue.
      resolver?.(false);
      resolver = null;
    };
  }, []);

  const close = (value: boolean) => {
    const r = resolver;
    resolver = null;
    setOpts(null);
    r?.(value);
  };

  const tone = opts?.tone ?? "default";
  const isDestructive = tone === "destructive";

  return (
    <AlertDialog open={!!opts} onOpenChange={(open) => !open && close(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia
            className={
              isDestructive
                ? "bg-destructive/10 text-destructive"
                : "bg-primary/10 text-primary"
            }
          >
            {isDestructive ? <AlertTriangle /> : <Info />}
          </AlertDialogMedia>
          <AlertDialogTitle>{opts?.title}</AlertDialogTitle>
          {opts?.body ? (
            <AlertDialogDescription>{opts.body}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => close(false)}>
            {opts?.cancelLabel ?? "বাতিল"}
          </AlertDialogCancel>
          <AlertDialogAction
            variant={isDestructive ? "destructive" : "default"}
            className={
              isDestructive
                ? ""
                : "bg-gradient-primary text-white hover:opacity-90"
            }
            onClick={() => close(true)}
          >
            {opts?.confirmLabel ?? "নিশ্চিত"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
