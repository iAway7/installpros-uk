import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MainHeader } from "@/components/funnel/main-header";
import { WhatsAppFab } from "@/components/funnel/whatsapp-fab";
import { ManagedHeroSection } from "@/components/funnel/managed-hero-section";
import { ManagedBreaksSection } from "@/components/funnel/managed-breaks-section";
import { ManagedFixedIpSection } from "@/components/funnel/managed-fixed-ip-section";
import { ManagedPersonSection } from "@/components/funnel/managed-person-section";
import { ManagedIncludedSection } from "@/components/funnel/managed-included-section";
import { TrustpilotSection } from "@/components/funnel/trustpilot-section";
import { CustomerStoriesSection } from "@/components/funnel/customer-stories-section";
import { ManagedPartnersSection } from "@/components/funnel/managed-partners-section";
import { ManagedRuralSection } from "@/components/funnel/managed-rural-section";
import { ManagedHowItWorksSection } from "@/components/funnel/managed-how-it-works-section";
import { FaqSectionAlt } from "@/components/funnel/faq-section-alt";
import { MANAGED_FAQS } from "@/lib/funnel/managed-faqs";
import { ManagedCtaSection } from "@/components/funnel/managed-cta-section";
import { FunnelFooter } from "@/components/funnel/funnel-footer";
import { ScrollReveal } from "@/components/funnel/scroll-reveal";
import { ExperimentProvider } from "@/components/experiments/experiment-provider";

/**
 * Managed service. Will asked on 3 November 2026 for it to be a page of its
 * own, apart from the digital landline one; built 4 November on the VoIP
 * page's components, without touching them.
 *
 * ── WHAT THE RESEARCH SAID, 3 NOVEMBER 2026 ─────────────────────────────────
 * managed-research/managed-research.md (outside the repo): 40 Superchat
 * threads, Starlink's UK terms and help pages, how a fixed IP is actually
 * delivered, 15 UK competitor pages, Will's /starlink-support/ page. The
 * plan is managed-research/estructura.md.
 *   - The buyer is a small business (or one run from a rural property) with
 *     one job Starlink breaks: monitored CCTV, an office VPN, port forwarding,
 *     a shop system. The page names those jobs; no competitor does.
 *   - Many who ask for a fixed IP don't need one, so the form asks what the
 *     connection must run and the page offers to check first.
 *   - What managed customers complained about was not reaching a person, so
 *     "One number. A person answers." is the main promise.
 *   - Nothing the research says to avoid: uptime figures, "24/7", "authorised
 *     installer", "subscription included", "unlimited relocations", prices.
 *
 * ── STILL MISSING ───────────────────────────────────────────────────────────
 *   - Will's answers to questions 11, 12, 15 and 16 (voip-research/
 *     preguntas-will.md). The copy assumes them.
 *   - Migration 0026 (install_type managed, needs cctv, vpn and support, the
 *     Starlink endpoint), after 0025. Until it runs, the form's insert fails.
 *   - A Path for "Managed service" in Will's Starlink Zap.
 *   - Photographs (managed-research/prompts-imagenes.md). The hero and the
 *     closing band are the dark surface until then.
 *
 * ── THE LEAD ────────────────────────────────────────────────────────────────
 * install_type `managed`, labelled "Managed service"; need cctv, vpn or
 * support from the first tap; form_name managed_business. After the form,
 * /thank-you-managed.
 *
 * noindex like every segment landing, not in sitemap.ts.
 *
 * DRAFT GUARD: 404 in production (VERCEL_ENV). Remove it, and the one in
 * /thank-you-managed, at launch.
 */

export const metadata: Metadata = {
  title: "Managed Starlink for Business | Fixed IP, Backup and Support",
  description:
    "Starlink for business, looked after. Monitored CCTV, office VPN and port forwarding set up on Starlink, a 4G/5G backup, and one number to call when it drops.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/starlink-business" },
  openGraph: {
    title: "Managed Starlink for Business | Fixed IP, Backup and Support",
    description: "Monitored CCTV, office VPN and a person to call when it drops.",
    url: "/starlink-business",
  },
};

export default function StarlinkBusinessPage() {
  if (process.env.VERCEL_ENV === "production") notFound();
  return (
    <div className="theme-editorial min-h-screen bg-background text-foreground">
      <MainHeader />
      <ExperimentProvider>
        <main id="main" tabIndex={-1} className="flex flex-col outline-none">
          <ManagedHeroSection
            // Gus's render, 4 November: a stone barn at dusk with the dish and a
            // camera. Phones get a 3:4 crop of the right edge, where it stands.
            image="/funnel/managed-hero-2000.webp"
            imageSrcSet="/funnel/managed-hero-1280.webp 1280w, /funnel/managed-hero-2000.webp 2000w"
            imageMobile="/funnel/managed-hero-phone-640.webp 640w, /funnel/managed-hero-phone-828.webp 828w"
            badge="Same-day reply"
            // Gus's pick, 4 November (managed-research/estructura.md, A).
            headline="Starlink for business, looked after"
            headlineConfigKey="headlineManaged"
            subheadline="CCTV monitoring, office VPN and a person to call when it drops."
            formName="managed_business"
          />
          <WhatsAppFab />
          {/* Fades in the blocks marked data-reveal as they scroll into
              view (Gus, 4 November). */}
          <ScrollReveal />
          <ManagedBreaksSection />
          <ManagedFixedIpSection />
          <ManagedPersonSection />
          <ManagedPartnersSection />
          <ManagedIncludedSection />
          {/* The company's reviews, Trustpilot then Google, as on the other
              pages. About its engineers and service, not managed service. */}
          <TrustpilotSection />
          <CustomerStoriesSection />
          <ManagedRuralSection />
          <ManagedHowItWorksSection />
          <FaqSectionAlt faqs={MANAGED_FAQS} />
          <ManagedCtaSection formName="managed_business" />
        </main>
      </ExperimentProvider>
      <FunnelFooter />
    </div>
  );
}
