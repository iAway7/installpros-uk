import type { Metadata } from "next";
import { MainHeader } from "@/components/funnel/main-header";
import { HeroSection } from "@/components/funnel/hero-section";
import { WhatsAppFab } from "@/components/funnel/whatsapp-fab";
import { CustomerStoriesSection } from "@/components/funnel/customer-stories-section";
import { TrustpilotSection } from "@/components/funnel/trustpilot-section";
import { WhyInstallProsSection, VEHICLE_FEATURES } from "@/components/funnel/why-installpros-section";
import { VehicleFitSection } from "@/components/funnel/vehicle-fit-section";
import { HowItWorksSection } from "@/components/funnel/how-it-works-section";
import { RoadPlansSection } from "@/components/funnel/road-plans-section";
import { CoverageMapSection } from "@/components/funnel/coverage-map-section";
import { TrackRecordSection } from "@/components/funnel/track-record-section";
import { FaqSectionAlt } from "@/components/funnel/faq-section-alt";
import { VEHICLE_FAQS } from "@/lib/funnel/faqs";
import { CtaSection } from "@/components/funnel/cta-section";
import { FunnelFooter } from "@/components/funnel/funnel-footer";
import { ExperimentProvider } from "@/components/experiments/experiment-provider";

/**
 * Vehicle segment landing: motorhomes, campervans, cars and vans. No boats:
 * they get their own Marine landing later, so nothing on this page mentions
 * them, in copy or in the FAQ.
 *
 * Cloned from /commercial-starlink-installation, then rebuilt section by
 * section from what the Superchat corpus says vehicle customers ask (see
 * superchat-analysis/tab2-motorhomes-campervans-cars-boats.md). The segment is
 * never called "mobile" on the page: nobody in the chat log uses the word, and
 * Will has retired the travel kit that the old "mobile" pages were built to
 * sell. Static caravans, lodges and park homes are a different job with a
 * different mount and a different quote, and get their own landing.
 *
 * What the segment looks like in the data, for whoever edits this next:
 * thirty-two vehicle and four boat conversations in four weeks. Not lost on
 * price: two quotes out of fourteen were. Lost on process: fifteen still open,
 * waiting on a roof photo, a mounting proposal or the vehicle itself, and seven
 * asked to see a finished install before deciding. So the page front-loads
 * how the job is done, where it happens and what to send, and puts the
 * installation photos, when Will supplies them, above all of it.
 *
 * noindex is deliberate, for the same reason as the commercial page.
 * installpros.co.uk already ranks /starlink-installation-for-cars/ and
 * /starlink-installation-for-campervan/, and this subdomain exists to receive
 * paid clicks, not to compete with them. Do NOT add it to sitemap.ts while
 * this stands, and no canonical for the same reason as its parent.
 */

export const metadata: Metadata = {
  title: "Starlink Installation for Cars, Motorhomes & Campervans | UK",
  description:
    "Starlink Mini fitted to your motorhome, campervan, car or van. Vehicle-specific mount, wired to 12 V, tested before you drive off. Fixed quote from two photos. Call 020 3397 7003.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Starlink Installation for Cars, Motorhomes & Campervans | UK",
    description:
      "Starlink Mini fitted to your motorhome, campervan, car or van. Low-profile mount, 12 V power, fixed quote from two photos.",
    url: "/starlink-installation-for-cars",
  },
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: VEHICLE_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function StarlinkInstallationForCarsPage() {
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
            // PLACEHOLDER. There is no vehicle photograph in public/funnel yet.
            // This is the holiday park image from the commercial sectors grid,
            // 800px wide, so it will look soft at full bleed. It is here
            // because a house or an office roof on a vehicle page contradicts
            // the headline before anyone reads it. Replace with a real install
            // photo from Will (a motorhome or a van with the Mini on the roof,
            // around 60 KB, see HeroSection on why the weight matters) before
            // this page takes traffic.
            image="/funnel/sector-campsites.webp"
            // The pill names the segment, in the words the customers use. Not
            // "mobile": see the header comment.
            badge="Motorhomes, campervans & cars"
            badgeFlag={false}
            // Leads with the thing they cannot get from a phone hotspot or a
            // dongle: connection that goes with the vehicle rather than with
            // a mast. "Wherever you park" is also the answer to the question
            // the chat log asks most, whether it works away from home.
            //
            // Own key, `headlineVehicles`, so a headline test on this page
            // cannot rewrite the residential or commercial H1s. See
            // HeroHeadline for why the key is per page.
            headline="Starlink fitted to your motorhome, van or car, working wherever you park"
            headlineConfigKey="headlineVehicles"
            // The four things the chat log asks first, in one breath: which
            // dish, what holds it on, what powers it, and how you get a price.
            // 113 characters, under the two-line limit noted on the parent.
            subheadline="A Starlink Mini on a low-profile mount, wired to 12 V and tested before you drive off. Fixed quote from two photos."
            // They arrived from a vehicle ad on a vehicle page. The install
            // type is set by the page; the step that asks for it goes.
            defaultInstallType="mobile_rv"
            skipServiceStep
            formName="starlink_vehicle"
            // No `installs` override. The commercial page counts its own work
            // because Will gave a number for it; nobody has given one for
            // vehicles, so the bar shows the company-wide figure, which is
            // true on any page.
          />
          {/* Same placement as the parent: the sentinel inside it sits in flow
              here, so the button appears once the hero is behind you. */}
          <WhatsAppFab />
          {/* No client logos. Every logo in that section is a business, and a
              row of company names above a motorhome page reads as the wrong
              page. */}
          <WhyInstallProsSection
            features={VEHICLE_FEATURES}
            heading="Engineered for a roof that moves."
            intro="Wind, vibration, rain at motorway speed and a 12 V supply. One engineer handles the mount, the power, the cabling and the testing, and the same team answers the phone afterwards."
          />
          {/* Replaces SectorsSection and WhatItRunsSection from the parent.
              A vehicle customer does not need to be told who the page is for,
              and the systems question ("will my till still work?") becomes
              "what holds it on, where does the cable go, what powers it". */}
          <VehicleFitSection />
          {/* The process, in four numbered steps, ending on the one action this
              segment converts on: sending a photo. Where the job happens is
              step three. This is where the open vehicle conversations in the
              chat log are stuck, so it sits above the plan and the reviews
              rather than in the FAQ. */}
          <HowItWorksSection />
          {/* Starlink's Roam prices, motion, abroad, pausing and an honest
              speed line. Replaces CoverageSection, which argues fixed-site
              speed to a reader who will be on a deprioritised plan. */}
          <RoadPlansSection />
          <TrustpilotSection />
          <CustomerStoriesSection />
          {/* No EquipmentSection: it renders the Gen 3 kit and there is no
              Starlink Mini image in public/funnel yet. The Mini is described in
              the hero, the fit section and the FAQ instead. Add it back with a
              VEHICLE_EQUIPMENT list once the photo exists. */}
          {/* No SiteApprovalPackSection: nobody signs off a campervan. */}
          {/* No BeforeAfterSection: both variants compare a fixed connection
              with the one before it, and a motorhome had none. */}
          {/* Seven days is what the existing cars page on installpros.co.uk
              already promises ("Installed within 7 days"). Keep the two in
              step. */}
          <CoverageMapSection leadTime="7 days" />
          <TrackRecordSection />
          <FaqSectionAlt faqs={VEHICLE_FAQS} />
          <CtaSection addressMode defaultService="mobile_rv" skipServiceStep formName="starlink_vehicle" />
        </main>
      </ExperimentProvider>
      <FunnelFooter />
    </div>
  );
}
