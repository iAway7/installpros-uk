import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VoipThankYouCard } from "@/components/funnel/voip-thank-you-card";
import { FunnelHeaderLight } from "@/components/funnel/funnel-header-light";
import { FunnelFooter } from "@/components/funnel/funnel-footer";

export const metadata: Metadata = {
  title: "Request Received",
  robots: { index: false, follow: false },
};

/**
 * Post-submit page for the digital landline page, in the Hikvision one's
 * shell. Asks for a photo of the phone bill, the first thing a number
 * transfer needs.
 *
 * DRAFT GUARD: 404 in production until the page launches, like the landing.
 */
export default function ThankYouVoipPage() {
  if (process.env.VERCEL_ENV === "production") notFound();
  return (
    <div className="theme-editorial flex min-h-screen flex-col bg-background md:bg-secondary">
      <FunnelHeaderLight />
      <main id="main" tabIndex={-1} className="flex flex-1 items-center justify-center px-5 py-10 outline-none md:py-14">
        <VoipThankYouCard />
      </main>
      <FunnelFooter />
    </div>
  );
}
