import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { MainHeader } from "@/components/funnel/main-header";
import { FunnelFooter } from "@/components/funnel/funnel-footer";
import { Button } from "@/components/system/button";
import { FaqTabs } from "@/components/funnel/faq-tabs";
import { ALL_FAQS, FAQ_SERVICES } from "@/lib/funnel/faqs";

export const metadata: Metadata = {
  title: "Starlink Installation FAQs | InstallPros UK",
  description:
    "Answers to common questions about professional Starlink installation in the UK — cost, timings, roof mounting, Wi-Fi, and more. Installation from £899.",
  alternates: { canonical: "/faqs" },
  openGraph: {
    title: "Starlink Installation FAQs | InstallPros UK",
    description: "Everything you need to know about professional Starlink installation in the UK.",
    url: "/faqs",
  },
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: ALL_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqsPage() {
  return (
    <div className="theme-editorial min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <MainHeader />

      <main className="px-6 pb-16 pt-28 md:pt-36">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <h1
              className="text-[2rem] font-bold text-foreground md:text-[3rem]"
              style={{ lineHeight: "1.1em", letterSpacing: "-2px" }}
            >
              Starlink installation FAQs
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-body text-muted-foreground md:text-lg">
              Everything you need to know about getting Starlink professionally installed in the UK. Can&apos;t find your
              answer? Check your coverage and we&apos;ll help.
            </p>
            <Button asChild className="mt-6">
              <a href="/install-quote#quote">Check Availability</a>
            </Button>
          </div>

          <div className="mt-12">
            <FaqTabs faqs={ALL_FAQS} tabs={FAQ_SERVICES} groupBy="service" />
          </div>

          <div className="mt-12 rounded-[32px] bg-secondary px-8 py-12 text-center">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">Still have questions?</h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              Check availability at your postcode and our team will walk you through everything, no obligation.
            </p>
            <Button asChild className="mt-6">
              <a href="/install-quote#quote">
                Check Availability <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </main>

      <FunnelFooter />
    </div>
  );
}
