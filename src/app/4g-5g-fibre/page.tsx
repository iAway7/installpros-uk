import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MainHeader } from "@/components/funnel/main-header";
import { WhatsAppFab } from "@/components/funnel/whatsapp-fab";
import { ConnectivityHeroSection } from "@/components/funnel/connectivity-hero-section";
import { ConnectivityOptionsSection } from "@/components/funnel/connectivity-options-section";
import { ConnectivityCheckSection } from "@/components/funnel/connectivity-check-section";
import { ConnectivityAntennaSection } from "@/components/funnel/connectivity-antenna-section";
import { ConnectivityBackupSection } from "@/components/funnel/connectivity-backup-section";
import { ConnectivityFibreSection } from "@/components/funnel/connectivity-fibre-section";
import { ReviewsPairedSection } from "@/components/funnel/reviews-paired-section";
import { ConnectivityBusinessSection } from "@/components/funnel/connectivity-business-section";
import { ConnectivityHowItWorksSection } from "@/components/funnel/connectivity-how-it-works-section";
import { FaqSectionAlt } from "@/components/funnel/faq-section-alt";
import { CONNECTIVITY_FAQS } from "@/lib/funnel/connectivity-faqs";
import { ConnectivityCtaSection } from "@/components/funnel/connectivity-cta-section";
import { FunnelFooter } from "@/components/funnel/funnel-footer";
import { ExperimentProvider } from "@/components/experiments/experiment-provider";
import { ScrollReveal } from "@/components/funnel/scroll-reveal";

/**
 * 4G/5G and fibre. The last landing in Will's P02 quote ("4G/5G installations
 * and fibre lines"), built 9 November 2026 on the VoIP page without touching
 * it: every section that changes is a connectivity-* copy; the header, trust
 * bar, reviews, FAQ accordion, how-it-works shell and footer are imported as
 * they are.
 *
 * ── WHAT THE RESEARCH SAID, 8 NOVEMBER 2026 ─────────────────────────────────
 * 4g-5g-fibre-research/4g-5g-fibre-research.md (outside the repo): 259
 * Superchat threads read, 15 competitors, Ofcom, Openreach and Starlink facts.
 *   - Nobody asks InstallPros to install 4G/5G or fibre (8 of 5,202 chats,
 *     and half of those meant "fast broadband"). About 380 describe the
 *     4G/5G box or missing fibre they want to leave. So the page sells the
 *     connection that works at an address, not a technology (Gus's pick,
 *     9 November, over "a backup line" and "as Will asked").
 *   - The demand next to it is a backup line (8 threads) and "what if fibre
 *     comes?" (8), with 25 lost to fibre or a 4G/5G box: both have a section.
 *   - No competitor recommends across Starlink, a 4G/5G antenna and fibre,
 *     shows the check, or says what a failover switch feels like.
 *   - Nothing the facts disprove: no speeds, "booster", "Ofcom approved",
 *     "instant" failover, uptime, vouchers, "we can get you fibre", prices.
 *
 * ── STILL MISSING ───────────────────────────────────────────────────────────
 *   - Will's answers (4g-5g-fibre-research/preguntas-will.md). The copy
 *     assumes them: the kit (1), the SIM (2), the signal check (3), fibre
 *     lines (4), the switch time and test (5), homes as well as businesses
 *     (6), the battery (7), boosters (8), listed buildings (9), fibre later
 *     (10).
 *   - Migration 0027 (install_type connectivity, the new needs, the Starlink
 *     endpoint). Until it runs, the form's insert fails.
 *   - A Path for "4G/5G and fibre" in Will's Starlink Zap (question 11).
 *   - Real photographs. The hero, antenna, router shelf, lane and closing
 *     band are Gus's Gemini renders of 9 November (prompts-imagenes.md).
 *     On desktop the hero's antenna pole sits behind the centred headline.
 *   - Ofcom's annual report (due about 19 November 2026): re-check the
 *     figures in connectivity-fibre-section.tsx before launch.
 *
 * ── THE LEAD ────────────────────────────────────────────────────────────────
 * install_type `connectivity`, labelled "4G/5G and fibre"; need slow_line,
 * mobile, no_line or fibre_drops from the first tap; form_name
 * connectivity_4g5g. After the form, /thank-you-connectivity.
 *
 * noindex like every segment landing, not in sitemap.ts.
 *
 * DRAFT GUARD: 404 in production (VERCEL_ENV), so a push of main for
 * anything else cannot show it before the migration and Will's answers.
 * Remove it, and the one in /thank-you-connectivity, at launch.
 */

export const metadata: Metadata = {
  title: "No Fibre or Weak 4G? Starlink, 4G/5G or Both",
  description:
    "We check your address, then fit what works there: Starlink, an outdoor 4G/5G antenna, or both with a backup line. Same-day quote.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/4g-5g-fibre" },
  openGraph: {
    title: "No Fibre or Weak 4G? Starlink, 4G/5G or Both",
    description: "We check your address and fit what works there. Same-day quote.",
    url: "/4g-5g-fibre",
  },
};

export default function ConnectivityPage() {
  if (process.env.VERCEL_ENV === "production") notFound();
  return (
    <div className="theme-editorial min-h-screen bg-background text-foreground">
      <MainHeader />
      <ExperimentProvider>
        <main id="main" tabIndex={-1} className="flex flex-col outline-none">
          <ConnectivityHeroSection
            // Gus's Gemini render, 9 November (prompt 1): a stone farmhouse
            // at dusk, an antenna on a pole facing a mast on the hill, a dish
            // on the roof. Phones get a 3:4 crop of the right edge.
            image="/funnel/connectivity-hero-2000.webp"
            imageSrcSet="/funnel/connectivity-hero-1280.webp 1280w, /funnel/connectivity-hero-2000.webp 2000w"
            imageMobile="/funnel/connectivity-hero-phone-640.webp 640w, /funnel/connectivity-hero-phone-828.webp 828w"
            badge="Same-day quote"
            // Option A of three in estructura-y-borrador.md. B: "Internet that
            // works where fibre doesn't reach". C: "4G that drops. Fibre that
            // never comes."
            // Non-breaking spaces keep "Weak 4G?" and "what works." whole on
            // phones, where the line otherwise broke after "Weak".
            headline={"No fibre? Weak\u00a04G? We\u00a0fit what\u00a0works."}
            headlineConfigKey="headlineConnectivity"
            subheadline="We check your address, then fit Starlink, a 4G/5G antenna, or both."
            formName="connectivity_4g5g"
          />
          <WhatsAppFab />
          <ScrollReveal />
          <ConnectivityOptionsSection />
          <ConnectivityCheckSection />
          <ConnectivityAntennaSection />
          <ConnectivityBackupSection />
          <ConnectivityFibreSection />
          <ReviewsPairedSection />
          <ConnectivityBusinessSection />
          <ConnectivityHowItWorksSection />
          <FaqSectionAlt faqs={CONNECTIVITY_FAQS} />
          <ConnectivityCtaSection formName="connectivity_4g5g" />
        </main>
      </ExperimentProvider>
      <FunnelFooter />
    </div>
  );
}
