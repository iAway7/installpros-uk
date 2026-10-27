import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MainHeader } from "@/components/funnel/main-header";
import { WhatsAppFab } from "@/components/funnel/whatsapp-fab";
import { HikvisionHeroSection } from "@/components/funnel/hikvision-hero-section";
import { HikvisionNightSection } from "@/components/funnel/hikvision-night-section";
import { HikvisionAppSection } from "@/components/funnel/hikvision-app-section";
import { HikvisionPlacesSection } from "@/components/funnel/hikvision-places-section";
import { HikvisionEquipmentSection } from "@/components/funnel/hikvision-equipment-section";
import { HikvisionExistingSection } from "@/components/funnel/hikvision-existing-section";
import { HikvisionIncludedSection } from "@/components/funnel/hikvision-included-section";
import { TrustpilotSection } from "@/components/funnel/trustpilot-section";
import { CustomerStoriesSection } from "@/components/funnel/customer-stories-section";
import { HikvisionHowItWorksSection } from "@/components/funnel/hikvision-how-it-works-section";
import { FaqSectionAlt } from "@/components/funnel/faq-section-alt";
import { HIKVISION_FAQS } from "@/lib/funnel/hikvision-faqs";
import { HikvisionCtaSection } from "@/components/funnel/hikvision-cta-section";
import { FunnelFooter } from "@/components/funnel/funnel-footer";
import { ExperimentProvider } from "@/components/experiments/experiment-provider";

/**
 * Hikvision CCTV, supplied and fitted. DRAFT, 27 October 2026.
 *
 * Built on the Ajax page (/ajax-security-installation) without touching it:
 * that page is live in Google Ads, so every section that changes is a copy
 * named hikvision-*, and only the parts that say nothing about the product
 * are imported as they are (header, trust bar, reviews, FAQ accordion,
 * footer).
 *
 * ── DRAFT GUARD ─────────────────────────────────────────────────────────────
 * The page 404s on the production deployment until Jordan has answered: the
 * amber [Jordan Qn] marks are holes in the copy, and a push of main for any
 * other change must not put them in front of a visitor. Local dev and
 * preview deployments render it. Remove the guard with the last Gap.
 *
 * ── WHAT THE RESEARCH SAID, 27 OCTOBER 2026 ─────────────────────────────────
 * hikvision-research/ (outside the repo) holds it: 261 Superchat threads
 * re-read for cameras, eleven UK installers with a Hikvision page, the
 * restrictions with sources, the ICO guidance, the plan and the copy.
 *   - Two audiences of a similar size: 81 want to buy cameras (median 3,
 *     front, drive, back, and the car on the street), 57 already own a
 *     system, 39 of them Hikvision or HiLook, and 12 of the 41 asking for
 *     help never got a reply. So the form's first tap is New cameras / Add
 *     to mine / Fix my system, and "Already have cameras?" is a section.
 *   - Phone viewing (23), recording (16) and colour at night (13) are what
 *     buyers ask for, so the night section and the app come first.
 *   - Paid surveys lost leads; quotes from photos worked. No competitor
 *     offers that, states days of recording, explains the neighbours, takes
 *     over another installer's system or answers "is Hikvision safe".
 *
 * ── STILL MISSING ───────────────────────────────────────────────────────────
 *   - Jordan's answers (hikvision-research/preguntas-jordan-will.md). Each
 *     amber mark names its question.
 *   - Will: the Superchat options for intent new and add (option A), or no
 *     Zap change (option B, see hikvision-need-step.tsx); and the tag.
 *   - Images: hero, night scene, the four places, the kit
 *     (hikvision-research/prompts-imagenes.md). No Hikvision logo or product
 *     shot unless InstallPros is an authorised partner (question 12).
 *   - The night scene's animation, once its picture exists.
 *
 * ── THE LEAD ────────────────────────────────────────────────────────────────
 * install_type `security`, like Ajax, so it reaches Will's security Zap with
 * no backend change; form_name `hikvision_cctv` and landing_page tell the
 * two pages apart. The first step goes in leads.intent with no need. After
 * the form, /thank-you-hikvision.
 *
 * noindex like every segment landing: installpros.co.uk ranks its own
 * Hikvision page and this subdomain is for paid clicks. Not in sitemap.ts.
 * No FAQPage JSON-LD, for the reason on the Ajax page.
 */

export const metadata: Metadata = {
  title: "Hikvision CCTV Installation | Same-Day Quote",
  description:
    "Hikvision CCTV supplied and fitted by DBS checked engineers. Wired cameras, colour at night, live on your phone, no monthly fee. Call 020 3397 7003.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/hikvision-cctv-installation" },
  openGraph: {
    title: "Hikvision CCTV Installation | Same-Day Quote",
    description: "Wired cameras, colour at night, live on your phone. One upfront price the same day, no monthly fee.",
    url: "/hikvision-cctv-installation",
  },
};

export default function HikvisionCctvInstallationPage() {
  if (process.env.VERCEL_ENV === "production") notFound();

  return (
    <div className="theme-editorial min-h-screen bg-background text-foreground">
      <MainHeader />
      <ExperimentProvider>
        <main id="main" tabIndex={-1} className="flex flex-col outline-none">
          <HikvisionHeroSection
            badge="Same-day quote, one upfront price"
            badgeNarrow="Same-day quote"
            // Brand, product and an installation word, which every high-intent
            // search carries. ColorVu as the promise waits on question 2; if
            // it is not standard, "Hikvision CCTV installation for your home".
            headline="Hikvision CCTV installation, in colour day and night"
            headlineConfigKey="headlineHikvision"
            // "Around the clock" and "7 days" wait on questions 2 and 11.
            subheadline="Wired cameras that record around the clock, with the drive, the door and the car on the street on your phone. Usually fitted within 7 days."
            subheadlineNarrow="Wired cameras, recording 24/7, live on your phone."
            defaultInstallType="security"
            formName="hikvision_cctv"
          />
          <WhatsAppFab />
          <HikvisionNightSection />
          <HikvisionAppSection />
          <HikvisionPlacesSection />
          <HikvisionEquipmentSection />
          {/* Before the price section: the first tap already split owners
              from buyers, and an owner who sees nothing for them below the
              hero leaves. */}
          <HikvisionExistingSection />
          <HikvisionIncludedSection />
          {/* The company's reviews, about its engineers and service. Same
              rule as the Ajax page: no copy presenting them as camera
              reviews. */}
          <TrustpilotSection />
          <CustomerStoriesSection />
          <HikvisionHowItWorksSection />
          <FaqSectionAlt faqs={HIKVISION_FAQS} />
          <HikvisionCtaSection defaultService="security" formName="hikvision_cctv" />
        </main>
      </ExperimentProvider>
      <FunnelFooter />
    </div>
  );
}
