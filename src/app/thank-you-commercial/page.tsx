import type { Metadata } from "next";
import { CommercialThankYouCard } from "@/components/funnel/commercial-thank-you-card";
import { FunnelHeaderLight } from "@/components/funnel/funnel-header-light";
import { FunnelFooter } from "@/components/funnel/funnel-footer";

export const metadata: Metadata = {
  title: "Request Received",
  robots: { index: false, follow: false },
};

/**
 * Post-submit page for the commercial funnel.
 *
 * Same shell as the residential one, different content. Residential has
 * something to ask for and this does not; see the card for why.
 * lib/funnel/thank-you-path.ts covers why these are separate routes at all.
 */
export default function ThankYouCommercialPage() {
  return (
    <div className="theme-editorial flex min-h-screen flex-col bg-background md:bg-secondary">
      <FunnelHeaderLight />
      <main
        id="main"
        tabIndex={-1}
        className="flex flex-1 items-center justify-center px-5 py-10 outline-none md:py-14"
      >
        <CommercialThankYouCard />
      </main>
      <FunnelFooter />
    </div>
  );
}
