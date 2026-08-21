import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { FunnelFooter } from "@/components/funnel/funnel-footer";

export const metadata: Metadata = {
  title: "Your Same-Day Quote | InstallPros",
  robots: { index: false, follow: false },
};

/**
 * Landing spot after the photo-upload step. Kept intentionally light — the full
 * same-day quote experience is a later phase; this confirms the hand-off so the
 * funnel never dead-ends on a 404.
 */
export default function SameDayQuotePage() {
  return (
    <div className="theme-editorial flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-center border-b border-border bg-white md:h-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/funnel/installpros-logo-colored-new.svg" alt="InstallPros" className="h-8 md:h-10" />
      </header>
      <main className="flex flex-1 items-center justify-center px-6 py-20">
        <div className="mx-auto max-w-lg text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-green-500" />
          <h1 className="mt-6 text-3xl font-bold text-foreground md:text-4xl">Thanks, your photos are in!</h1>
          <p className="mt-3 text-muted-foreground">
            Our team is preparing your same-day Starlink installation quote. We&apos;ll text you shortly at the number
            you provided. Need anything sooner? Call{" "}
            <a href="tel:02033977003" className="font-semibold text-primary">
              020 3397 7003
            </a>
            .
          </p>
        </div>
      </main>
      <FunnelFooter />
    </div>
  );
}
