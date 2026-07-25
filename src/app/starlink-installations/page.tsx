import type { Metadata } from "next";
import { StarlinkInstallationsLanding } from "./landing-client";
import { LANDING_FAQS_ALT } from "./landing-data";

/**
 * /starlink-installations (note the plural) — alternative landing page to
 * /starlink-installation, built from the "InstallPros Landing" design handoff:
 * a dark, aerospace-inspired single-page funnel with a 2-step quote modal.
 * A light-theme variant lives at /starlink-installations/light.
 * The original /starlink-installation route is left untouched.
 */

export const metadata: Metadata = {
  title: "Starlink Installations UK | Certified Same-Week Setup",
  description:
    "UK-wide professional Starlink installations by certified engineers. Fixed pricing, same-week fitting, all roof types. Get a free quote — call 020 3397 7003.",
  alternates: { canonical: "/starlink-installations" },
  openGraph: {
    title: "Starlink Installations UK | Certified Same-Week Setup",
    description:
      "UK-wide professional Starlink installations by certified engineers. Same-week scheduling and fixed pricing.",
    url: "/starlink-installations",
  },
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: LANDING_FAQS_ALT.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function StarlinkInstallationsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <StarlinkInstallationsLanding variant="dark" />
    </>
  );
}
