import type { Metadata } from "next";
import { MainHeader } from "@/components/funnel/main-header";
import { HeroSection } from "@/components/funnel/hero-section";
import { WhatsAppFab } from "@/components/funnel/whatsapp-fab";
import { CustomerStoriesSection } from "@/components/funnel/customer-stories-section";
import { TrustpilotSection } from "@/components/funnel/trustpilot-section";
import { WhyInstallProsSection, MARINE_FEATURES } from "@/components/funnel/why-installpros-section";
import { MarineMooringSection } from "@/components/funnel/marine-mooring-section";
import { MarineCostSection } from "@/components/funnel/marine-cost-section";
import { MarineFitSection } from "@/components/funnel/marine-fit-section";
import { MarineHowItWorksSection } from "@/components/funnel/marine-how-it-works-section";
import { CoverageMapSection } from "@/components/funnel/coverage-map-section";
import { TrackRecordSection } from "@/components/funnel/track-record-section";
import { FaqSectionAlt } from "@/components/funnel/faq-section-alt";
import { MARINE_FAQS } from "@/lib/funnel/faqs";
import { CtaSection } from "@/components/funnel/cta-section";
import { FunnelFooter } from "@/components/funnel/funnel-footer";
import { ExperimentProvider } from "@/components/experiments/experiment-provider";

/**
 * Boats: narrowboats, houseboats, motor cruisers and yachts. Moored, mostly
 * moored, or cruising the canals.
 *
 * Cloned from /starlink-installation-for-static-caravans, not from the cars
 * page, and then rebuilt section by section from the twelve marine
 * conversations of 1 July to 21 September 2026
 * (superchat-analysis/marine-questions-for-will). Statics is the parent
 * because the report's own conclusion is that the boats which buy behave like
 * "households with an access problem, not like vessels": both that bought
 * were permanently or mostly moored, not one of the twelve reports use on a
 * moving boat, and two of the four who got a price walked on it while a third
 * needed finance. So the statics skeleton carries over: money straight after
 * the hero, fitting spreadable, plan pausable, no motion claims.
 *
 * What is borrowed from the vehicle page instead is the argument of its fit
 * section, because a boat shares the vehicle's three technical gates: no
 * holes in the roof, 12 volt power, and where the cable goes. Those were
 * written for boats once already; vehicle-fit-section.tsx retired its boats
 * item on 14 September pending this page.
 *
 * What is new and on no other page:
 *   1. MarineMooringSection, first under the hero. 8 of 12 volunteer whether
 *      the boat moves before anyone asks, because they believe it decides
 *      everything. It does, so the page opens in their frame.
 *   2. Marina access, in the fit section, the steps and the FAQ. 3 of 12
 *      raise it and the customer who bought sent his barrier code unprompted.
 *   3. "What happens to the roof when it comes off", the one question in the
 *      corpus that nobody answered.
 *
 * TWELVE IS A SMALL NUMBER. The report says every count is a direction, not a
 * statistic, and nothing should become a percentage. No count from the corpus
 * appears in the page copy; they live in comments so the next editor knows
 * where each line came from.
 *
 * ── WHAT THIS PAGE IS MISSING ───────────────────────────────────────────────
 * 1. THE PHOTOGRAPH IS STOCK. An aerial of a motor yacht at sea, no dish
 *    on it (see the note on the hero). There is still no picture of a boat
 *    we fitted, so FinishedInstallSection stays absent. Ask Will for the
 *    Tattenhall narrowboat or the Cuxton houseboat.
 * 2. NO PRICES, BY DECISION. The report's strongest ask is an indicative
 *    install price or a range, and this page does not meet it, for the same
 *    reason as cars and statics: no figure has been agreed with Will for the
 *    segment and the number depends on the boat. The section argues the
 *    structure instead. When a figure exists it goes in MarineCostSection's
 *    first card.
 * 3. REVIEWS ARE NOT FILTERED. Migration 0012 tags Trustpilot reviews by
 *    segment so this page could show marine ones (the Cuxton houseboat left
 *    one naming the engineer). TrustpilotSection does not take a tag yet, so
 *    it shows the company-wide rail.
 * 4. NOT IN THE FUNNEL YET. No link points here and no route in sitemap.ts,
 *    deliberately: see the noindex note below.
 * ────────────────────────────────────────────────────────────────────────────
 *
 * noindex for the same reason as the cars and statics pages: installpros.co.uk
 * ranks its own marine page, and this subdomain exists to receive paid clicks
 * rather than to compete with it. Do NOT add it to sitemap.ts while that
 * stands.
 */

export const metadata: Metadata = {
  title: "Starlink Installation for Boats | Narrowboats, Houseboats & Yachts UK",
  description:
    "Starlink fitted to your boat at the berth. No holes in the roof, runs off 12 V or shore power, cable in the way the last one came. One fitting fee you can spread, a plan you can pause. Call 020 3397 7003.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Starlink Installation for Boats | Narrowboats, Houseboats & Yachts UK",
    description:
      "Fitted at the berth without drilling the boat. 12 V or shore power, one fitting fee you can spread, a plan you can pause.",
    url: "/starlink-installation-for-boats",
  },
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: MARINE_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function StarlinkInstallationForBoatsPage() {
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
            // Aerial top-down of a motor yacht on dark water, chosen 5 October
            // 2026 to match a reference the user liked. Stock: Pexels 5581859 by
            // Taryn Elliott, Pexels licence (free commercial use, no credit
            // required), cropped to 2:1 at 1920 wide. The boat sits left of
            // centre and in the upper half, so the headline overlay and the
            // bottom crop on wide screens both miss it.
            //
            // No Starlink dish on this boat, and it is under way at sea, which
            // the marine report argues against. Both are known. It is a stand-in
            // until a generated or shot image with the dish exists; the copy
            // claims nothing about being under way.
            image="/funnel/hero-marine-aerial.webp"
            // 3:4 crop centred on the boat, for phones.
            imageMobile="/funnel/hero-marine-aerial-portrait.webp"
            // The four kinds of boat in the corpus, in the customers' own
            // words: 3 narrowboats, a houseboat, a Fairline motor cruiser,
            // two yachts. Not "marine": nobody in the twelve uses the word.
            badge="Narrowboats, houseboats, cruisers & yachts"
            badgeFlag={false}
            // Leads on the two things the report says decide it: it is done
            // at the berth (access, 3 of 12) and nothing is drilled (4 of 12,
            // and the first objection in every mounting thread). "Berth"
            // rather than "marina" so a canal mooring reads itself in.
            //
            // Own key, `headlineMarine`, so a headline test on this page
            // cannot rewrite any other H1.
            headline="Starlink fitted to your boat at the berth, without drilling the roof"
            headlineConfigKey="headlineMarine"
            // Power, mooring and price in one breath, in the order the
            // conversations raise them.
            subheadline="Runs off 12 V or shore power, moored or cruising. One fitting fee you can spread, priced from two photos."
            // `marine` exists in the lead form, the enum (migration 0019) and
            // the Superchat webhook, which maps it to "Starlink Marine". The
            // report says the boat BUTTON is noise, because 10 of 12 real
            // boats never tapped it. On a dedicated page the type is set by
            // the URL, not the button, so the noise problem does not apply.
            defaultInstallType="marine"
            skipServiceStep
            formName="starlink_marine"
            // No `installs` override: nobody has given a figure for boats,
            // and two completed installs is not a trust-bar number anyway.
          />
          {/* Same placement as the other landings: the sentinel sits in flow
              here, so the button appears once the hero is behind you. */}
          <WhatsAppFab />
          {/* The split the customers already make, before the page asks them
              for anything. 8 of 12 state it unprompted. */}
          <MarineMooringSection />
          {/* Money second, same reasoning as statics: of four priced boats,
              two walked on cost and one needed finance. Filtering that out
              here costs less than after a survey. */}
          <MarineCostSection />
          <WhyInstallProsSection
            features={MARINE_FEATURES}
            heading="Fitted for a roof you cannot drill."
            intro="One engineer does the mount, the power, the cable run and the account, at the berth. The same team answers the phone when the boat is laid up."
          />
          {/* The three technical gates plus access and coverage inside. Each
              card confirms the solution the customer usually arrives with. */}
          <MarineFitSection />
          {/* Proof before process, same order as cars and statics. */}
          <TrustpilotSection />
          <CustomerStoriesSection />
          {/* Photo first, unlike statics, because for a coastal cruiser the
              photograph replaces a two-and-a-half-hour drive to the boat. */}
          <MarineHowItWorksSection />
          {/* Seven days, in step with the cars and statics pages. */}
          <CoverageMapSection leadTime="7 days" />
          <TrackRecordSection />
          <FaqSectionAlt faqs={MARINE_FAQS} />
          <CtaSection addressMode defaultService="marine" skipServiceStep formName="starlink_marine" />
          {/* Deliberately absent: RoadPlansSection (argues motion and Europe
              to a boat that has not left its berth this year), VehicleFitSection
              (airbags and motorway speed), StaticFitSection (park warranties
              and the view from the next pitch), FinishedInstallSection (no
              photograph of a fitted boat exists yet). */}
        </main>
      </ExperimentProvider>
      <FunnelFooter />
    </div>
  );
}
