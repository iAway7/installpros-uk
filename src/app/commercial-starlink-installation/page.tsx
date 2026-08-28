import type { Metadata } from "next";
import { MainHeader } from "@/components/funnel/main-header";
import { HeroSection } from "@/components/funnel/hero-section";
import { CoverageSection } from "@/components/funnel/coverage-section";
import { SectorsSection } from "@/components/funnel/sectors-section";
import { CustomerStoriesSection } from "@/components/funnel/customer-stories-section";
import { TrustpilotSection } from "@/components/funnel/trustpilot-section";
import { WhyInstallProsSection, COMMERCIAL_FEATURES } from "@/components/funnel/why-installpros-section";
import { CoverageMapSection } from "@/components/funnel/coverage-map-section";
import { EquipmentSection, COMMERCIAL_EQUIPMENT } from "@/components/funnel/equipment-section";
import { InstallVideoSection } from "@/components/funnel/install-video-section";
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
            headline="Commercial Starlink installation, fitted in under a week"
            subheadline="Offices, warehouses, depots and rural sites across the UK. Survey, fixed quote and full install, usually inside seven days."
            installs={{ count: "460+", label: "commercial installations" }}
          />
          <WhyInstallProsSection
            features={COMMERCIAL_FEATURES}
            heading="Engineered for sites that cannot go offline."
            intro="One certified team handles everything, from the first site survey to the final speed test, and picks up the phone long after."
          />
          <SectorsSection />
          <CoverageSection />
          <TrustpilotSection />
          <CustomerStoriesSection />
          <EquipmentSection equipment={COMMERCIAL_EQUIPMENT} />
          <InstallVideoSection />
          <BeforeAfterSection />
          <CoverageMapSection />
          <TrackRecordSection />
          <FaqSectionAlt faqs={COMMERCIAL_FAQS} />
          <CtaSection addressMode />
        </main>
      </ExperimentProvider>
      <FunnelFooter />
    </div>
  );
}
