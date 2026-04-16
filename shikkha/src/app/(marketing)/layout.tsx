import type { ReactNode } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-gradient-primary font-bold text-white">
              শ
            </span>
            <span className="text-lg font-semibold tracking-tight">Shikkha</span>
          </Link>
          <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
            <Link href="/#features" className="transition hover:text-foreground">
              ফিচার
            </Link>
            <Link href="/#pricing" className="transition hover:text-foreground">
              প্রাইসিং
            </Link>
            <Link href="/#madrasa" className="transition hover:text-foreground">
              মাদ্রাসা
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              লগইন
            </Link>
            <Link
              href="/register-school"
              className={buttonVariants({ size: "sm", className: "bg-gradient-primary text-white" })}
            >
              শুরু করুন
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-6 text-sm text-muted-foreground md:flex-row md:px-10">
          <span>© ২০২৬ Shikkha Platform · বাংলাদেশের স্কুল ও মাদ্রাসার জন্য</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
