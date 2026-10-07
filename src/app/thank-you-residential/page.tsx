import type { Metadata } from "next";
import { PhotoRequestCard } from "@/components/funnel/photo-request-card";
import { FunnelHeaderLight } from "@/components/funnel/funnel-header-light";
import { FunnelFooter } from "@/components/funnel/funnel-footer";

export const metadata: Metadata = {
  title: "One Step Left",
  robots: { index: false, follow: false },
};

/**
 * Post-submit page for residential leads, which is what the photo request was
 * always written for: the roof decides the mount, so a photo is the one thing
 * worth asking for while they are still here.
 *
 * Split from the shared /thank-you on 7 October. That page stays as the
 * fallback and still renders this card. Commercial gets its own, because what
 * it needs back is the site rather than a photo.
 *
 * Post-submit thank-you. The funnel header in its light state rather than a
 * centred logo, so the page still looks like the site the visitor was just on
 * and the two contact routes stay one tap away. Off-white surface from md up,
 * where the card becomes a panel; plain white on mobile, where it does not.
 */
export default function ThankYouPage() {
  return (
    <div className="theme-editorial flex min-h-screen flex-col bg-background md:bg-secondary">
      <FunnelHeaderLight />
      <main id="main" tabIndex={-1} className="flex flex-1 items-center justify-center px-5 py-10 outline-none md:py-14">
        <PhotoRequestCard />
      </main>
      <FunnelFooter />
    </div>
  );
}
