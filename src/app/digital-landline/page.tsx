import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MainHeader } from "@/components/funnel/main-header";
import { WhatsAppFab } from "@/components/funnel/whatsapp-fab";
import { VoipHeroSection } from "@/components/funnel/voip-hero-section";
import { VoipNumberSection } from "@/components/funnel/voip-number-section";
import { VoipPhoneSection } from "@/components/funnel/voip-phone-section";
import { VoipPowerSection } from "@/components/funnel/voip-power-section";
import { VoipParentSection } from "@/components/funnel/voip-parent-section";
import { TrustpilotSection } from "@/components/funnel/trustpilot-section";
import { CustomerStoriesSection } from "@/components/funnel/customer-stories-section";
import { VoipSwitchoffSection } from "@/components/funnel/voip-switchoff-section";
import { VoipBusinessSection } from "@/components/funnel/voip-business-section";
import { VoipHowItWorksSection } from "@/components/funnel/voip-how-it-works-section";
import { FaqSectionAlt } from "@/components/funnel/faq-section-alt";
import { VOIP_FAQS } from "@/lib/funnel/voip-faqs";
import { VoipCtaSection } from "@/components/funnel/voip-cta-section";
import { FunnelFooter } from "@/components/funnel/funnel-footer";
import { ExperimentProvider } from "@/components/experiments/experiment-provider";

/**
 * Digital landline (VoIP). Built 3 November 2026 as "Managed services &
 * VoIP"; Will asked the same day for two separate pages, so managed service
 * (fixed IP, 4G/5G backup, one team to call) left this one and gets its own.
 *
 * Built on the Hikvision page without touching it: every section that
 * changes is a voip-* copy, and only the header, trust bar, reviews, FAQ
 * accordion, how-it-works shell and footer are imported as they are.
 *
 * ── WHAT THE RESEARCH SAID, 2 NOVEMBER 2026 ─────────────────────────────────
 * voip-research/voip-research.md (outside the repo): 209 Superchat threads,
 * 12 competitor VoIP pages, 10 managed Starlink sellers, Ofcom and Starlink
 * rules, and Will's two WordPress VoIP pages. The plan and copy are
 * voip-research/estructura-y-borrador.md.
 *   - All 14 VoIP buyers were already Starlink customers, and nobody speaks
 *     to them, so Starlink is in the H1 (Gus, 2 November).
 *   - 23 of 28 buyers wanted to keep their number, and it is what went
 *     wrong most, so "Keep your number" comes straight after the hero.
 *   - Old phones, every handset calling out, and power cuts with 999 are
 *     the questions staff answered inconsistently; each has a section.
 *   - The buyer is often a son or daughter, so the form asks who the phone
 *     is for and a section speaks to them.
 *   - Nothing the chats disproved: no transfer time, "plug and play",
 *     uptime figures, "24/7", "subscription included" or prices.
 *
 * ── STILL MISSING ───────────────────────────────────────────────────────────
 *   - Will's answers (voip-research/preguntas-will.md). The copy assumes
 *     them (voip-research/supuestos-para-will.md).
 *   - Migration 0025 (install_type voip, the new needs, the Starlink
 *     endpoint). Until it runs, the form's insert fails.
 *   - A Path for "VoIP" in Will's Starlink Zap.
 *   - Real photographs. The hero, the two handsets, the parents and the
 *     closing band are Gus's Gemini renders of 3 November
 *     (voip-research/prompts-imagenes.md); the handsets are generic until
 *     Will names the model (question 7).
 *
 * ── THE LEAD ────────────────────────────────────────────────────────────────
 * install_type `voip`, labelled "VoIP"; need self, relative or business
 * from the first tap; form_name voip_landline. After the form,
 * /thank-you-voip.
 *
 * noindex like every segment landing, not in sitemap.ts.
 *
 * DRAFT GUARD: 404 in production (VERCEL_ENV), so a push of main for
 * anything else cannot show it before the migration and Will's answers.
 * Remove it, and the one in /thank-you-voip, at launch.
 */

export const metadata: Metadata = {
  title: "Keep Your Landline Number on Starlink | Digital Landline",
  description:
    "Copper landlines close by 31 January 2027. Keep your number on an internet phone line, set up for you and fitted on your Starlink day. Home and business phones.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/digital-landline" },
  openGraph: {
    title: "Keep Your Landline Number on Starlink | Digital Landline",
    description: "Keep your number on an internet phone line, set up for you. Same-day quote.",
    url: "/digital-landline",
  },
};

export default function DigitalLandlinePage() {
  if (process.env.VERCEL_ENV === "production") notFound();
  return (
    <div className="theme-editorial min-h-screen bg-background text-foreground">
      <MainHeader />
      <ExperimentProvider>
        <main id="main" tabIndex={-1} className="flex flex-col outline-none">
          <VoipHeroSection
            // Gemini render, 3 November: the phone by the router on a
            // farmhouse hall table. Phones get a 3:4 crop of the right edge.
            image="/funnel/voip-hero-2000.webp"
            imageSrcSet="/funnel/voip-hero-1280.webp 1280w, /funnel/voip-hero-2000.webp 2000w"
            imageMobile="/funnel/voip-hero-phone-640.webp 640w, /funnel/voip-hero-phone-828.webp 828w"
            badge="Same-day quote"
            // Gus's pick, 2 November. If Will says the page is for anyone
            // losing a copper line, not only Starlink (question 1): "Keep your
            // landline number when the copper line goes".
            headline="Keep your landline number on Starlink"
            headlineConfigKey="headlineVoip"
            // "Fit it on your Starlink day" waits on question 6.
            subheadline="Copper landlines close by 31 January 2027. We move your number to an internet phone line, set up the phone before it arrives, and can fit it on your Starlink day."
            subheadlineNarrow="We move your number to an internet phone line and set up the phone before it arrives."
            formName="voip_landline"
          />
          <WhatsAppFab />
          <VoipNumberSection />
          <VoipPhoneSection />
          <VoipPowerSection />
          <VoipParentSection />
          {/* The company's reviews, Trustpilot then Google, as on the
              Hikvision page (the Google block was missing until 3 November).
              About its engineers and service; same rule as the other pages:
              no copy presenting them as phone reviews. Diana Rosser's landline review sat above them until
              Gus removed it, 3 November. */}
          <TrustpilotSection />
          <CustomerStoriesSection />
          <VoipSwitchoffSection />
          <VoipBusinessSection />
          <VoipHowItWorksSection />
          <FaqSectionAlt faqs={VOIP_FAQS} />
          <VoipCtaSection formName="voip_landline" />
        </main>
      </ExperimentProvider>
      <FunnelFooter />
    </div>
  );
}
