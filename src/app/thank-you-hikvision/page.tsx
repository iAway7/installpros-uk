import type { Metadata } from "next";
import { HikvisionThankYouCard } from "@/components/funnel/hikvision-thank-you-card";
import { FunnelHeaderLight } from "@/components/funnel/funnel-header-light";
import { FunnelFooter } from "@/components/funnel/funnel-footer";

export const metadata: Metadata = {
  title: "Request Received",
  robots: { index: false, follow: false },
};

/**
 * Post-submit page for the Hikvision CCTV funnel, in the Ajax one's shell.
 * Its own route because thankYouPath() sends install_type security to the
 * Ajax page, whose message asks about an alarm.
 */
export default function ThankYouHikvisionPage() {
  return (
    <div className="theme-editorial flex min-h-screen flex-col bg-background md:bg-secondary">
      <FunnelHeaderLight />
      <main id="main" tabIndex={-1} className="flex flex-1 items-center justify-center px-5 py-10 outline-none md:py-14">
        <HikvisionThankYouCard />
      </main>
      <FunnelFooter />
    </div>
  );
}
