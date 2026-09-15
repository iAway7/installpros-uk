import type { Metadata } from "next";
import { MainHeader } from "@/components/funnel/main-header";
import { WeatherHero } from "@/components/funnel/weather-hero";
import { HeroTrustBar } from "@/components/funnel/hero-trust-bar";
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
 * /starlink-installation-for-cars-2: the vehicle landing with the weather
 * hero from weather-hero-kit in place of HeroSection. Everything below the
 * hero is a straight copy of /starlink-installation-for-cars; read that
 * page's header comment for the reasoning behind each section. Keep the two
 * in step until one of them wins.
 *
 * What the hero swap changes on the page:
 *  - HeroSection carried the funnel (ZipAvailabilityChecker) and the trust
 *    bar. The weather hero has its own postcode check, which hands off to the
 *    CtaSection at #quote for the lead form. HeroTrustBar stays, passed in
 *    through `bar` so it sits inside the hero as before. So on this page the
 *    only lead form is the bottom one.
 *  - No headline experiment: the H1 is scene copy inside the hero, so
 *    `headlineVehicles` does not apply here.
 *  - WhatsAppFab keeps its sentinel in flow under the hero, same as before.
 *
 * noindex for the same reason as the parent, and one more: this is a
 * duplicate of it. Do NOT add it to sitemap.ts.
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
    url: "/starlink-installation-for-cars-2",
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

export default function StarlinkInstallationForCars2Page() {
  return (
    <div className="theme-editorial min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <MainHeader />
      <ExperimentProvider>
        <main id="main" tabIndex={-1} className="flex flex-col outline-none">
          <WeatherHero bar={<HeroTrustBar />} />
          {/* Same placement as the parent: the sentinel inside it sits in flow
              here, so the button appears once the hero is behind you. */}
          <WhatsAppFab />
          <WhyInstallProsSection
            features={VEHICLE_FEATURES}
            heading="Engineered for a roof that moves."
            intro="Wind, vibration, rain at motorway speed and a 12 V supply. One engineer handles the mount, the power, the cabling and the testing, and the same team answers the phone afterwards."
          />
          <VehicleFitSection />
          <HowItWorksSection />
          <RoadPlansSection />
          <TrustpilotSection />
          <CustomerStoriesSection />
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
