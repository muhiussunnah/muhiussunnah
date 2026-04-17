import type { Metadata, Viewport } from "next";
import {
  Hind_Siliguri,
  Inter,
  JetBrains_Mono,
  Noto_Naskh_Arabic,
  Noto_Sans_Bengali,
} from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { RegisterServiceWorker } from "@/components/pwa/register-sw";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-noto-sans-bengali",
  subsets: ["bengali", "latin"],
  display: "swap",
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: "--font-noto-naskh-arabic",
  subsets: ["arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Shikkha Platform — স্কুল ও মাদ্রাসা ব্যবস্থাপনা",
    template: "%s · Shikkha",
  },
  description:
    "বাংলাদেশের স্কুল ও মাদ্রাসার জন্য সম্পূর্ণ ব্যবস্থাপনা সমাধান — ভর্তি, উপস্থিতি, পরীক্ষা, ফি, অভিভাবক পোর্টাল ও আরও অনেক কিছু।",
  applicationName: "Shikkha",
  keywords: [
    "school management",
    "madrasa management",
    "bangladesh",
    "bornomala alternative",
    "hifz",
    "sabaq",
    "bangla",
    "শিক্ষা",
    "মাদ্রাসা",
  ],
  authors: [{ name: "Shikkha Platform" }],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafbfc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1020" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      dir="ltr"
      className={`${hindSiliguri.variable} ${inter.variable} ${jetbrainsMono.variable} ${notoSansBengali.variable} ${notoNaskhArabic.variable} dark h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans antialiased">
        {children}
        <Toaster position="top-right" richColors closeButton />
        <InstallPrompt />
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
