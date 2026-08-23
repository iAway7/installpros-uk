import type { Metadata } from "next";
import { PhotoRequestCard } from "@/components/funnel/photo-request-card";
import { FunnelFooter } from "@/components/funnel/funnel-footer";

export const metadata: Metadata = {
  title: "One Step Left | InstallPros",
  robots: { index: false, follow: false },
};

/**
 * Post-submit thank-you. Same shell as /upload-property-images and
 * /same-day-quote: theme class on the wrapper, logo bar, FunnelFooter. No nav,
 * because there is exactly one thing to do here.
 */
export default function ThankYouPage() {
  return (
    <div className="theme-editorial flex min-h-screen flex-col bg-background">
      <header className="flex h-16 items-center justify-center border-b border-border bg-white md:h-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/funnel/installpros-logo-colored-new.svg" alt="InstallPros" className="h-8 md:h-10" />
      </header>
      <main id="main" className="flex flex-1 items-center justify-center px-5 py-12 md:py-16">
        <PhotoRequestCard />
      </main>
      <FunnelFooter />
    </div>
  );
}
