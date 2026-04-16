import type { ReactNode } from "react";
import Link from "next/link";
import { TrustBadge } from "@/components/ui/trust-badge";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <header className="flex items-center justify-between px-6 py-5 md:px-10">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-gradient-primary font-bold text-white">
            শ
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Shikkha Platform
          </span>
        </Link>
        <Link
          href="/"
          className="text-sm text-muted-foreground transition hover:text-foreground"
        >
          ← ফিরে যান
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="px-6 pb-6 md:px-10">
        <TrustBadge />
      </footer>
    </div>
  );
}
