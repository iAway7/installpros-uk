import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConnectivityThankYouCard } from "@/components/funnel/connectivity-thank-you-card";
import { FunnelHeaderLight } from "@/components/funnel/funnel-header-light";
import { FunnelFooter } from "@/components/funnel/funnel-footer";

export const metadata: Metadata = {
  title: "Request Received",
  robots: { index: false, follow: false },
};

/**
 * Post-submit page for the 4G/5G and fibre page, in the VoIP one's shell.
 * Asks for photos of the outside of the house, which the virtual survey
 * needs before any recommendation.
 *
 * DRAFT GUARD: 404 in production until the page launches, like the landing.
 */
export default function ThankYouConnectivityPage() {
  if (process.env.VERCEL_ENV === "production") notFound();
  return (
    <div className="theme-editorial flex min-h-screen flex-col bg-background md:bg-secondary">
      <FunnelHeaderLight />
      <main id="main" tabIndex={-1} className="flex flex-1 items-center justify-center px-5 py-10 outline-none md:py-14">
        <ConnectivityThankYouCard />
      </main>
      <FunnelFooter />
    </div>
  );
}
