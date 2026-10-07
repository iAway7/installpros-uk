import type { Metadata } from "next";
import { MainHeader } from "@/components/funnel/main-header";
import { HeroSection } from "@/components/funnel/hero-section";
import { WhatsAppFab } from "@/components/funnel/whatsapp-fab";
import { SectorsSection } from "@/components/funnel/sectors-section";
import { WhatItRunsSection } from "@/components/funnel/what-it-runs-section";
import { CustomerStoriesSection } from "@/components/funnel/customer-stories-section";
import { TrustpilotSection } from "@/components/funnel/trustpilot-section";
import { WhyInstallProsSection, COMMERCIAL_FEATURES } from "@/components/funnel/why-installpros-section";
import { ClientLogosSection } from "@/components/funnel/client-logos-section";
import { CoverageMapSection } from "@/components/funnel/coverage-map-section";
import { EquipmentSection, COMMERCIAL_EQUIPMENT } from "@/components/funnel/equipment-section";
import { SiteApprovalPackSection } from "@/components/funnel/site-approval-pack-section";
import { TrackRecordSection } from "@/components/funnel/track-record-section";
import { BeforeAfterSection } from "@/components/funnel/before-after-section";
import { FaqSectionAlt } from "@/components/funnel/faq-section-alt";
import { COMMERCIAL_FAQS } from "@/lib/funnel/faqs";
import { CtaSection } from "@/components/funnel/cta-section";
import { FunnelFooter } from "@/components/funnel/funnel-footer";
import { ExperimentProvider } from "@/components/experiments/experiment-provider";

/**
 * Commercial segment landing, for Google Ads only.
 *
 * Cloned from /starlink-installation as the starting point. Right now it is
 * identical to its parent apart from the metadata: the segment copy lands in
 * follow-up commits, section by section, once Will confirms the commercial
 * price, lead time, equipment and accreditations.
 *
 * noindex is deliberate. installpros.co.uk already ranks a commercial page at
 * the same slug, and this subdomain exists to receive paid clicks, not to
 * compete with it. Google Ads does not require an indexable landing page and
 * Quality Score is unaffected; AdsBot crawls independently of this directive.
 * Do NOT add it to sitemap.ts while this stands.
 *
 * Because it is noindex, there is no canonical either: pointing one elsewhere
 * while telling Google to drop the page is a contradictory pair of signals.
 */

export const metadata: Metadata = {
  title: "Commercial Starlink Installation UK | Offices, Warehouses & Sites",
  description:
    "Commercial Starlink installation across the UK. Site survey, fixed quote and full install for offices, warehouses, depots and rural sites. Call 020 3397 7003.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Commercial Starlink Installation UK | Offices, Warehouses & Sites",
    description:
      "Commercial Starlink installation across the UK. Survey, fixed quote and full install for business sites.",
    url: "/commercial-starlink-installation",
  },
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: COMMERCIAL_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function CommercialStarlinkInstallationPage() {
  return (
    <div className="theme-editorial min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <MainHeader />
      <ExperimentProvider>
        <main id="main" tabIndex={-1} className="flex flex-col outline-none">
          <HeroSection
            smartCoverage
            addressMode
            image="/funnel/hero-commercial-rooftop.webp"
            // The keyword moves into the pill so the H1 is free to sell what
            // Will says the business actually is. Message match survives:
            // someone arriving on "commercial starlink installation" still
            // reads it back, just one line higher.
            badge="Commercial Starlink Installation"
            badgeFlag={false}
            // Leads with what Will says the business actually is: not a faster
            // connection, a site that does not go down. It also makes the
            // visitor who already has good fibre the target rather than an
            // objection, because he is the one with something to lose.
            //
            // It read "stays online, whatever happens to your main line" until
            // 6 October. Two words went and the strategy did not. "Whatever
            // happens" promised to cover every failure, including a power cut
            // and a dead router, which is not what we sell and not what we can
            // hold. "When your main connection does not" scopes it to the one
            // failure this product does answer, and costs nothing: the line is
            // the same 58 characters it was. "Line" went to "connection" for
            // the reason Will gave on the cost section: line names the physical
            // circuit, and a reader who thinks of it as "the internet" has to
            // translate.
            //
            // The old headline, "Commercial Starlink installation, fitted in
            // under a week", is the obvious challenger if we want to test this.
            // It goes in an experiment as `headlineCommercial`, a key only this
            // page reads. See HeroHeadline for why it is not plain `headline`:
            // on-page experiments are not page-scoped, and that key would
            // rewrite the residential H1s too.
            headline="Your site keeps working when your main connection does not"
            headlineConfigKey="headlineCommercial"
            // Two lines. The paragraph is max-w-3xl at 24px on lg, so roughly
            // 62 characters a line: past about 120 it spills to a third. This
            // is 113.
            subheadline="Starlink installed and managed, with 5G failover alongside your existing connection. Fixed quote, set-up in days."
            // They arrived on the commercial page, from a commercial ad, and
            // have just read a commercial headline. Asking them what they are
            // installing is a step that answers itself.
            defaultInstallType="commercial"
            // Will: "they are on a page specific to commercial so shouldn't
            // need to specify what we're installing". The step goes; the value
            // still travels with the lead, set by the page rather than typed.
            skipServiceStep
            formName="starlink_commercial"
            installs={{ count: "460+", label: "commercial installations" }}
          />
          {/* Mounted here on purpose: the sentinel inside it sits in flow at
              this exact spot, so the button appears once the hero is behind
              you. It takes itself off screen again over the quote form. */}
          <WhatsAppFab />
          <ClientLogosSection />
          <WhyInstallProsSection
            features={COMMERCIAL_FEATURES}
            heading="Engineered for sites that cannot go offline."
            // "One certified team" until 7 October. The £10m Cover card two lines
            // down exists because Will confirmed we hold none of CHAS,
            // SafeContractor, ISO 9001, 14001, 45001, IPAF, PASMA or NICEIC, so
            // the accreditation claim came out of the card and was left sitting
            // in the intro above it. The word goes; nothing else needed to.
            intro="One team handles everything, from the first site survey to the final speed test, and picks up the phone long after."
          />
          <SectorsSection />
          {/* "Who this is for" running straight into "what it keeps working for
              you". The chat log asks about tills, gates, cameras and phones far
              more than about speed, and that answer was buried in the FAQ. */}
          <WhatItRunsSection />
          {/* No CoverageSection here, and that is three claims removed rather
              than one. It carried "Every Install Type: residential, commercial,
              marine and mobile", which is the wrong segment on a page bought
              with commercial clicks. The other two were already made further
              down and better: CoverageMapSection says "From the Highlands to
              Cornwall, our engineers cover all four nations" and prints a 7 day
              lead time, and TrackRecordSection counts 225+ towns.

              It also took the last two "certified" claims on this page with it.
              Will confirmed we hold none of CHAS, SafeContractor, ISO 9001,
              14001, 45001, IPAF, PASMA or NICEIC, which is why the word came
              out of the Why InstallPros intro, and it was still sitting in this
              section twice because the component is shared.

              The component stays as it is: /starlink-installation, /install-
              quote and the vehicles landing all render it, and there the list
              of install types is accurate. The "certified engineers" line is
              not, on any of them, but that is those pages' problem to fix and
              /install-quote is live.

              Backgrounds still alternate without it: WhatItRuns is
              bg-secondary and Trustpilot is bg-background. */}
          <TrustpilotSection />
          <CustomerStoriesSection />
          <EquipmentSection equipment={COMMERCIAL_EQUIPMENT} />
          {/* Straight after the equipment card on purpose: the reader has just
              seen what goes on the roof, and the next thought for anyone in a
              leased unit is who has to approve it. */}
          <SiteApprovalPackSection />
          {/* No install video here. The one we have is a residential job, and a
              house works against everything else this page says to someone
              buying for a depot. The slot stays empty until there is commercial
              footage. Both residential landings still show it. */}
          {/* Cost, not speed: on this page the speed comparison argues against
              us the moment a visitor on good fibre runs the test, and minutes
              of downtime are not a line anybody budgets against. Pounds are.
              variant="continuity" is the same argument in minutes and is one
              word away if this reads as too much. See the component. */}
          <BeforeAfterSection variant="cost" />
          {/* Seven, not the shared three: it is the "under a week" Will has
              used himself, and it does not undercut the FAQ. */}
          <CoverageMapSection leadTime="7 days" />
          <TrackRecordSection />
          <FaqSectionAlt faqs={COMMERCIAL_FAQS} />
          <CtaSection addressMode defaultService="commercial" skipServiceStep formName="starlink_commercial" />
        </main>
      </ExperimentProvider>
      <FunnelFooter />
    </div>
  );
}
