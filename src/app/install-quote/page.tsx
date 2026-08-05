import type { Metadata } from "next";
import { MainHeader } from "@/components/funnel/main-header";
import { HeroSection } from "@/components/funnel/hero-section";
import { WhyInstallProsSection } from "@/components/funnel/why-installpros-section";
import { CoverageSection } from "@/components/funnel/coverage-section";
import { CustomerStoriesSection } from "@/components/funnel/customer-stories-section";
import { TrustpilotSection } from "@/components/funnel/trustpilot-section";
import { EquipmentSection } from "@/components/funnel/equipment-section";
import { BeforeAfterSection } from "@/components/funnel/before-after-section";
import { CoverageMapSection } from "@/components/funnel/coverage-map-section";
import { TrackRecordSection } from "@/components/funnel/track-record-section";
import { FaqSectionAlt } from "@/components/funnel/faq-section-alt";
import { LANDING_FAQS } from "@/lib/funnel/faqs";
import { CtaSection } from "@/components/funnel/cta-section";
import { FunnelFooter } from "@/components/funnel/funnel-footer";
import { ExperimentProvider } from "@/components/experiments/experiment-provider";

export const metadata: Metadata = {
  title: "Professional Starlink Installation | Fast & Safe Setup",
  description:
    "Professional Starlink installation across the UK. Get connected fast with our accredited installers. Call 020 3397 7003 for a free quote.",
  alternates: { canonical: "/install-quote" },
  openGraph: {
    title: "Professional Starlink Installation | Fast & Safe Setup",
    description:
      "Professional Starlink installation services nationwide. Get connected in 72 hours with our expert installers.",
    url: "/install-quote",
  },
};

/** FAQPage structured data so Google can understand (and potentially feature) the FAQs. */
const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: LANDING_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

/**
 * Postcode variant of the landing (A/B pair with /starlink-installation).
 * Identical to /starlink-installation in every section EXCEPT the hero: this
 * page asks for a postcode; /starlink-installation asks for a full address.
 * That single difference is the experiment.
 */
export default function InstallQuotePage() {
  return (
    <div className="theme-funnel min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <MainHeader />
      <ExperimentProvider>
        <main id="main" tabIndex={-1} className="flex flex-col outline-none">
          <HeroSection />
          <WhyInstallProsSection />
          <CoverageSection />
          <CustomerStoriesSection />
          <TrustpilotSection />
          <EquipmentSection />
          <BeforeAfterSection />
          <CoverageMapSection />
          <TrackRecordSection />
          <FaqSectionAlt />
          <CtaSection />
        </main>
      </ExperimentProvider>
      <FunnelFooter />
    </div>
  );
}
