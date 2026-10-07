import type { Metadata } from "next";
import { SurveyPrepCard } from "@/components/funnel/survey-prep-card";
import { FunnelHeaderLight } from "@/components/funnel/funnel-header-light";
import { FunnelFooter } from "@/components/funnel/funnel-footer";

export const metadata: Metadata = {
  title: "Request Received",
  robots: { index: false, follow: false },
};

/**
 * Post-submit page for the commercial funnel.
 *
 * Same shell as the residential one, different ask. Residential wants photos
 * of a roof; a business needs its site understood before anyone drives to it,
 * so this screen does the qualification the hero form deliberately leaves out.
 * See lib/funnel/thank-you-path.ts for why these are separate routes.
 *
 * items-start rather than centred: the form is taller than the viewport on a
 * phone, and vertically centring it would push the heading off the top of the
 * screen on the one device most of this traffic arrives on.
 */
export default function ThankYouCommercialPage() {
  return (
    <div className="theme-editorial flex min-h-screen flex-col bg-background md:bg-secondary">
      <FunnelHeaderLight />
      <main
        id="main"
        tabIndex={-1}
        className="flex flex-1 items-start justify-center px-5 py-10 outline-none md:py-14"
      >
        <SurveyPrepCard />
      </main>
      <FunnelFooter />
    </div>
  );
}
