import Link from "next/link";
import Script from "next/script";
import { ChevronRight, Home } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://muhiussunnah.app";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

/**
 * Accessible breadcrumb trail with BreadcrumbList JSON-LD for SEO.
 *
 * The JSON-LD is emitted as an inline <script> (not Next's <Script>) because
 * structured data must render at SSR time so crawlers can see it on first
 * fetch without waiting for JS hydration.
 */
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  if (!items.length) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/`,
      },
      ...items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: it.label,
        item: `${SITE_URL}${it.href}`,
      })),
    ],
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="mx-auto w-full max-w-7xl px-4 pt-24 md:px-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li className="flex items-center">
            <Link href="/" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
              <Home className="size-3.5" aria-hidden />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          {items.map((it, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={it.href} className="flex items-center gap-1.5">
                <ChevronRight className="size-3.5 rtl:rotate-180" aria-hidden />
                {isLast ? (
                  <span aria-current="page" className="font-medium text-foreground">
                    {it.label}
                  </span>
                ) : (
                  <Link href={it.href} className="hover:text-foreground transition-colors">
                    {it.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <Script
        id={`breadcrumb-jsonld-${items[items.length - 1]?.href.replace(/\W/g, "-")}`}
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
