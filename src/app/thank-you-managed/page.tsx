import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ManagedThankYouCard } from "@/components/funnel/managed-thank-you-card";
import { FunnelHeaderLight } from "@/components/funnel/funnel-header-light";
import { FunnelFooter } from "@/components/funnel/funnel-footer";

export const metadata: Metadata = {
  title: "Request Received",
  robots: { index: false, follow: false },
};

/**
 * Post-submit page for the managed service page, in the VoIP one's shell.
 * Asks for the camera recorder and monitoring company, or what the VPN
 * connects to: what decides whether a fixed IP is needed.
 *
 * DRAFT GUARD: 404 in production until the page launches, like the landing.
 */
export default function ThankYouManagedPage() {
  if (process.env.VERCEL_ENV === "production") notFound();
  return (
    <div className="theme-editorial flex min-h-screen flex-col bg-background md:bg-secondary">
      <FunnelHeaderLight />
      <main id="main" tabIndex={-1} className="flex flex-1 items-center justify-center px-5 py-10 outline-none md:py-14">
        <ManagedThankYouCard />
      </main>
      <FunnelFooter />
    </div>
  );
}
