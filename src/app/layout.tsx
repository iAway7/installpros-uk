import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Inter, Be_Vietnam_Pro } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

// Self-hosted via next/font — no render-blocking request to Google, and the
// size-adjusted fallback metrics eliminate the font-swap layout shift (CLS).
//
// What gets preloaded matters on a slow phone: every preloaded file downloads
// alongside the hero photo, the largest thing on the first screen. On
// 22 October 2026 the landings preloaded 8 files (140 kB) before it.
//   - Inter is not preloaded. On the landings it only sets the cookie banner
//     and the hidden skip link; the pages are Be Vietnam Pro (theme-editorial).
//     It still loads, on demand, wherever it is used (dashboard, auth).
//   - Be Vietnam Pro without 300: no class, style or rendered element used it
//     (checked in the code and on the live landings). 800 stays, for the
//     weather hero's title (weather-hero.module.css).
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter", preload: false });
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["200", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-be-vietnam",
});
import { siteConfig } from "@/lib/site-config";
import { PostHogProvider, PageViewTracker } from "@/components/analytics/posthog-provider";
import { ScrollDepthTracker } from "@/components/analytics/scroll-depth-tracker";
import { AnalyticsScripts, GtmNoScript } from "@/components/analytics/analytics-scripts";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Starlink Installation UK | Professional Satellite Internet | InstallPros",
    template: "%s | InstallPros",
  },
  description: siteConfig.description,
  keywords: [
    "Starlink installation UK",
    "Starlink installer",
    "satellite internet UK",
    "rural broadband",
    "Starlink setup",
    "professional Starlink fitting",
  ],
  // No canonical here: set at this level it was inherited by every page, so
  // each landing pointed at "/", which only redirects to /install-quote. Each
  // landing sets its own (19 October 2026); pages without one emit none.
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Starlink Installation UK | Professional Satellite Internet",
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Starlink Installation UK | InstallPros",
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1d4ed8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${beVietnamPro.variable}`} suppressHydrationWarning>
      <head>
        <AnalyticsScripts />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }}
        />
      </head>
      <body className="min-h-dvh font-sans">
        <GtmNoScript />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <PostHogProvider>
          <Suspense fallback={null}>
            <PageViewTracker />
          </Suspense>
          <ScrollDepthTracker />
          {children}
          <Toaster position="top-center" richColors />
        </PostHogProvider>
      </body>
    </html>
  );
}

function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    areaServed: { "@type": "Country", name: "United Kingdom" },
    // No aggregateRating. It said 4.9 from 2400 reviews, and both numbers were
    // invented: the real Trustpilot figures are 5.0 from 460-odd, read from the
    // database and already shown in the hero trust bar. Fabricated review
    // counts are a DMCC Act 2024 problem and Google can issue a manual action
    // against structured data that does not match the page, so this came out
    // rather than getting corrected in place.
    //
    // Putting the real numbers here instead is a separate, deliberate job, and
    // not in this file: it is the root layout, so it also covers /dashboard and
    // pages that show no reviews at all, and Google treats a rating marked up
    // on a page with nothing to back it as self-serving. The place for it is
    // the pages that actually render TrustpilotSection, reading the same stats
    // row the trust bar reads.
  };
}
