import type { Metadata } from "next";
import { StarlinkInstallationsLanding } from "../landing-client";
import { LANDING_FAQS_ALT } from "../landing-data";
import { getGoogleReviews } from "@/lib/reviews/google-reviews";

/**
 * Light-theme variant of /starlink-installations. Same layout, copy and
 * interactions — the theme is a CSS-variable override (.ipx-light) plus
 * variant-aware canvas palettes. Useful as an A/B contrast to the dark page.
 */

export const metadata: Metadata = {
  title: "Starlink Installations UK | Certified Same-Week Setup (Light)",
  description:
    "UK-wide professional Starlink installations by certified engineers. Fixed pricing, same-week fitting, all roof types. Get a free quote — call 020 3397 7003.",
  alternates: { canonical: "/starlink-installations/light" },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Starlink Installations UK | Certified Same-Week Setup",
    description:
      "UK-wide professional Starlink installations by certified engineers. Same-week scheduling and fixed pricing.",
    url: "/starlink-installations/light",
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

export default async function StarlinkInstallationsLightPage() {
  const { reviews } = await getGoogleReviews();
  const mapped = reviews.slice(0, 6).map((r) => ({
    q: r.q,
    name: r.name,
    initial: r.initial,
    rating: r.rating,
    photo: r.photo,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <StarlinkInstallationsLanding variant="light" reviews={mapped} />
    </>
  );
}
