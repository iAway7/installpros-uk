import type { Metadata } from "next";
import { MainHeader } from "@/components/funnel/main-header";
import { HeroSection } from "@/components/funnel/hero-section";
import { CoverageSection } from "@/components/funnel/coverage-section";
import { TestimonialsSection } from "@/components/funnel/testimonials-section";
import { ProfessionalInstallationSection } from "@/components/funnel/professional-installation-section";
import { AvailabilitySection } from "@/components/funnel/availability-section";
import { FaqSection } from "@/components/funnel/faq-section";
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

export default function InstallQuotePage() {
  return (
    <div className="theme-funnel min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <MainHeader />
      {/* ExperimentProvider assigns A/B variants and exposes their config to the
          hero (and anywhere else). Fails open when no experiments are running. */}
      <ExperimentProvider>
      {/* Flex + responsive `order` lets us front-load proof on mobile (where ~80%
          of visitors are and most stop after a screen or two) while keeping the
          desktop order unchanged. Reviews jump up right under the hero on phones. */}
      <main className="flex flex-col">
        <div className="order-1">
          <HeroSection />
        </div>
        <div className="order-2 md:order-3">
          <TestimonialsSection />
        </div>
        <div className="order-3 md:order-2">
          <CoverageSection />
        </div>
        <div className="order-4 md:order-4">
          <ProfessionalInstallationSection />
        </div>
        <div className="order-5">
          <AvailabilitySection />
        </div>
        <div className="order-6">
          <FaqSection />
        </div>
        <div className="order-7">
          <CtaSection />
        </div>
      </main>
      </ExperimentProvider>
      <FunnelFooter />
    </div>
  );
}
