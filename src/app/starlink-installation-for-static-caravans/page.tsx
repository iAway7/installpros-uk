import type { Metadata } from "next";
import { MainHeader } from "@/components/funnel/main-header";
import { HeroSection } from "@/components/funnel/hero-section";
import { WhatsAppFab } from "@/components/funnel/whatsapp-fab";
import { CustomerStoriesSection } from "@/components/funnel/customer-stories-section";
import { TrustpilotSection } from "@/components/funnel/trustpilot-section";
import { WhyInstallProsSection, STATIC_FEATURES } from "@/components/funnel/why-installpros-section";
import { StaticFitSection } from "@/components/funnel/static-fit-section";
import { StaticCostSection } from "@/components/funnel/static-cost-section";
import { StaticHowItWorksSection } from "@/components/funnel/static-how-it-works-section";
import { CoverageMapSection } from "@/components/funnel/coverage-map-section";
import { TrackRecordSection } from "@/components/funnel/track-record-section";
import { FaqSectionAlt } from "@/components/funnel/faq-section-alt";
import { STATIC_FAQS } from "@/lib/funnel/faqs";
import { CtaSection } from "@/components/funnel/cta-section";
import { FunnelFooter } from "@/components/funnel/funnel-footer";
import { ExperimentProvider } from "@/components/experiments/experiment-provider";

/**
 * Static caravans, park homes and holiday lodges. Units that stay put.
 *
 * Cloned from /starlink-installation-for-cars and then rebuilt section by
 * section from the 175 static conversations of 1 July to 21 September 2026
 * (superchat-analysis/statics-questions-for-will). It keeps that page's shell
 * and almost none of its argument, because the two segments want opposite
 * things:
 *
 *   Vehicles              Statics
 *   ───────────────────   ─────────────────────────────────────────────
 *   No drilling           Nobody mentions drilling. 0 of 175
 *   What holds it on      What it looks like from the next pitch
 *   Works while moving    Stops when the season does
 *   Roam plan             A residential plan they can pause
 *   Price not published   Price is the whole fight: 43 of 61 who walked
 *                         named the install fee, 7 named the monthly
 *
 * So the money section is the first thing under the hero rather than the last
 * thing before the FAQ, "how it works" starts without a photograph because the
 * customer is usually at home rather than at the van, and the fit section is
 * about warranties and sightlines instead of mounts and vibration.
 *
 * The slug says static caravans and the page says all three, on purpose.
 * "Caravan" is overwhelmingly what these customers call the thing: 37 of the
 * verbatim quotes against 6 for park home and 4 for lodge. It cannot be
 * "caravans" alone, because installpros.co.uk/starlink-installation-for-campervan
 * is titled "Starlink Installation For Campervans | Starlink For Caravans" and
 * there a caravan is a touring one. "Static" is the word that separates them,
 * and it is the customers' own: "Its a static caravan i want it from april to
 * october". Park home and lodge carry in the title, the H1 and the badge
 * instead, which matters because one of them objects to the word in the
 * corpus: "It's a residential park home not a caravan."
 *
 * ── WHAT THIS PAGE IS MISSING ───────────────────────────────────────────────
 * 1. NO PHOTOGRAPH. The vehicle page opens on a real install under the hero.
 *    There is no photo of a fitted static, and the analysis asks for one
 *    showing the view from a neighbouring pitch. Until it exists this page
 *    argues without evidence.
 * 2. NO PRICES, BY DECISION. Same as the cars page: the number arrives in the
 *    quote, where it is specific to the unit and the park. What this page
 *    carries instead is the structure, because that is what the corpus says
 *    loses the sale. The payment terms in static-cost-section.tsx still need
 *    confirming; they came from the vehicle analysis.
 * 3. NOT IN THE FUNNEL YET. No link points here, and there is no route in
 *    sitemap.ts, deliberately: see the noindex note below.
 * ────────────────────────────────────────────────────────────────────────────
 *
 * noindex for the same reason as the cars page: installpros.co.uk ranks its
 * own static and park home pages, and this subdomain exists to receive paid
 * clicks rather than to compete with them. Do NOT add it to sitemap.ts while
 * that stands.
 */

export const metadata: Metadata = {
  title: "Starlink for Static Caravans, Park Homes & Lodges | UK",
  description:
    "Starlink fitted to your static caravan, park home or lodge. One fitting fee you can spread, a plan you can pause out of season, and a mount that does not touch the unit. Call 020 3397 7003.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Starlink for Static Caravans, Park Homes & Lodges | UK",
    description:
      "One fitting fee you can spread, a plan you can pause out of season, and a mount that does not touch the unit.",
    url: "/starlink-installation-for-static-caravans",
  },
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: STATIC_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function StarlinkInstallationForStaticsPage() {
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
            // PLACEHOLDER, and a worse one than the cars page had. This is the
            // holiday park photograph from the commercial sectors grid, 800px
            // wide, so it is soft at full bleed. It is here because a house or
            // a moving vehicle on this page contradicts the headline. Replace
            // with a fitted static from Will: a caravan on a park with the
            // dish on the old bracket, around 60 KB.
            image="/funnel/sector-campsites.webp"
            // The segment names itself three ways and resents the wrong one.
            // "It's a residential park home not a caravan."
            badge="Static caravans, park homes & lodges"
            badgeFlag={false}
            // Leads on the two things that decide it: the fitting is once and
            // the plan stops with the season. 61 of 175 walked on price and 43
            // of them named the install fee, so the headline answers that
            // before the page asks for anything.
            headline="Starlink at your static caravan, paused out of season"
            headlineConfigKey="headlineStatics"
            // The four facts the enquiries ask for, in one breath: what is
            // fixed to what, what it costs, what happens out of season, and
            // that the quote does not need a trip to the van.
            subheadline="One fitting fee you can spread. Tell us your park and we price it the same day."
            // No `mobile_rv`: this unit does not move. `residential` is the
            // closest slug the lead form and migration 0019 already accept,
            // and a park home genuinely is a dwelling.
            defaultInstallType="residential"
            skipServiceStep
            formName="starlink_static"
            // No `installs` override, same as the cars page: nobody has given
            // a figure for this segment, so the bar shows the company-wide one.
          />
          {/* Same placement as the other landings: the sentinel sits in flow
              here, so the button appears once the hero is behind you. */}
          <WhatsAppFab />
          {/* The money first, which is the one structural difference from every
              other page in this funnel. On the cars page the price is not
              published at all; here it is the argument. 43 of the 61 who walked
              away named the installation fee, and the fix the analysis asks for
              is structural: the fitting and the plan side by side, the fitting
              spreadable, the plan pausable. Putting that below three sections
              of capability copy would lose the same people again. */}
          <StaticCostSection />
          <WhyInstallProsSection
            features={STATIC_FEATURES}
            heading="Fitted for a unit that stays put."
            intro="One engineer does the mount, the power and the account. The same team answers the phone in November."
          />
          {/* Where it goes and what it looks like, which is what mounting means
              in this segment. Not one of the 175 conversations mentions
              drilling. */}
          <StaticFitSection />
          {/* Proof before process, same order the cars page settled on. */}
          <TrustpilotSection />
          <CustomerStoriesSection />
          {/* Reversed against the vehicle page: the price comes before the
              photograph, because roughly 50 of the 175 threads end on a park
              name or a photo request with no price ever arriving, and the
              customer is usually at home rather than at the van. */}
          <StaticHowItWorksSection />
          <CoverageMapSection leadTime="7 days" />
          <TrackRecordSection />
          <FaqSectionAlt faqs={STATIC_FAQS} />
          <CtaSection addressMode defaultService="residential" skipServiceStep formName="starlink_static" />
          {/* Sections from the cars page that are deliberately absent:
              RoadPlansSection argues Roam, motion and Europe to somebody whose
              caravan has not moved since it was craned in. VehicleFitSection
              answers drilling, airbags and motorway speed. FinishedInstallSection
              would be the best thing on this page and cannot exist until there
              is a photograph of a fitted static. */}
        </main>
      </ExperimentProvider>
      <FunnelFooter />
    </div>
  );
}
