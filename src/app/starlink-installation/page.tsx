import type { Metadata } from "next";
import { MainHeader } from "@/components/funnel/main-header";
import { HeroSection } from "@/components/funnel/hero-section";
import { CoverageSection } from "@/components/funnel/coverage-section";
import { CustomerStoriesSection } from "@/components/funnel/customer-stories-section";
import { TrustpilotSection } from "@/components/funnel/trustpilot-section";
import { WhyInstallProsSection } from "@/components/funnel/why-installpros-section";
import { CoverageMapSection } from "@/components/funnel/coverage-map-section";
import { EquipmentSection } from "@/components/funnel/equipment-section";
import { InstallVideoSection } from "@/components/funnel/install-video-section";
import { TrackRecordSection } from "@/components/funnel/track-record-section";
import { BeforeAfterSection } from "@/components/funnel/before-after-section";
import { FaqSectionAlt } from "@/components/funnel/faq-section-alt";
import { LANDING_FAQS } from "@/lib/funnel/faqs";
import { CtaSection } from "@/components/funnel/cta-section";
import { FunnelFooter } from "@/components/funnel/funnel-footer";
import { ExperimentProvider } from "@/components/experiments/experiment-provider";

/**
 * A/B-test variant of /install-quote. Differences from the original:
 *  1. SlimHeader — logo + phone only, no nav (nav is a top-5 clicked element
 *     on the original, i.e. a funnel exit).
 *  2. smartCoverage — the postcode step swaps the generic "we're available"
 *     copy for a real broadband-data message (see /api/broadband-coverage).
 * Everything else intentionally identical. /install-quote is untouched.
 */

export const metadata: Metadata = {
  title: "Starlink Installation UK | Same-Week Professional Setup",
  description:
    "UK-wide Starlink installation by accredited engineers. Real broadband check for your postcode, fixed pricing, same-week fitting. Call 020 3397 7003.",
  alternates: { canonical: "/starlink-installation" },
  openGraph: {
    title: "Starlink Installation UK | Same-Week Professional Setup",
    description:
      "UK-wide Starlink installation by accredited engineers. Same-week scheduling and fixed pricing.",
    url: "/starlink-installation",
  },
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: LANDING_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function StarlinkInstallationPage() {
  return (
    <div className="theme-editorial min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <MainHeader />
      <ExperimentProvider>
        <main id="main" tabIndex={-1} className="flex flex-col outline-none">
          <HeroSection smartCoverage addressMode />
          <WhyInstallProsSection />
          <CoverageSection />
          <TrustpilotSection />
          <CustomerStoriesSection />
          <EquipmentSection />
          <InstallVideoSection />
          <BeforeAfterSection />
          <CoverageMapSection />
          <TrackRecordSection />
          <FaqSectionAlt />
          <CtaSection addressMode />
        </main>
      </ExperimentProvider>
      <FunnelFooter />
    </div>
  );
}
