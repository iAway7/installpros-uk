import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Toaster } from "sonner";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import { PostHogProvider, PageViewTracker } from "@/components/analytics/posthog-provider";
import { ScrollDepthTracker } from "@/components/analytics/scroll-depth-tracker";
import { AnalyticsScripts, GtmNoScript } from "@/components/analytics/analytics-scripts";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Starlink Installation UK | Professional Satellite Internet — InstallPros",
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
  alternates: { canonical: "/" },
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
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        {/* Inter via standard link (no build-time fetch — builds in any CI). */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router root layout, loads site-wide */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Be+Vietnam+Pro:wght@200;300;400;500;600;700&family=Geist:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
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
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "2400" },
  };
}
