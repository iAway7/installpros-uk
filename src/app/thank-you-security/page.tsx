import type { Metadata } from "next";
import { SecurityThankYouCard } from "@/components/funnel/security-thank-you-card";
import { FunnelHeaderLight } from "@/components/funnel/funnel-header-light";
import { FunnelFooter } from "@/components/funnel/funnel-footer";

export const metadata: Metadata = {
  title: "Request Received",
  robots: { index: false, follow: false },
};

/**
 * Post-submit page for the Ajax alarm and CCTV funnel. Same shell as the
 * commercial one; the card says why it asks for nothing.
 * lib/funnel/thank-you-path.ts covers why these are separate routes at all.
 */
export default function ThankYouSecurityPage() {
  return (
    <div className="theme-editorial flex min-h-screen flex-col bg-background md:bg-secondary">
      <FunnelHeaderLight />
      <main
        id="main"
        tabIndex={-1}
        className="flex flex-1 items-center justify-center px-5 py-10 outline-none md:py-14"
      >
        <SecurityThankYouCard />
      </main>
      <FunnelFooter />
    </div>
  );
}
