import type { Metadata } from "next";
import { MainHeader } from "@/components/funnel/main-header";
import { SecurityHeroSection } from "@/components/funnel/security-hero-section";
import { WhatsAppFab } from "@/components/funnel/whatsapp-fab";
import { SecurityLayersSection } from "@/components/funnel/security-layers-section";
import { SecurityHomeSection } from "@/components/funnel/security-home-section";
import { SecurityAppSection } from "@/components/funnel/security-app-section";
import { SecurityEquipmentSection } from "@/components/funnel/security-equipment-section";
import { SecurityCompareSection } from "@/components/funnel/security-compare-section";
import { TrustpilotSection } from "@/components/funnel/trustpilot-section";
import { CustomerStoriesSection } from "@/components/funnel/customer-stories-section";
import { SecurityHowItWorksSection } from "@/components/funnel/security-how-it-works-section";
import { FaqSectionAlt } from "@/components/funnel/faq-section-alt";
import { SECURITY_FAQS } from "@/lib/funnel/security-faqs";
import { SecurityCtaSection } from "@/components/funnel/security-cta-section";
import { FunnelFooter } from "@/components/funnel/funnel-footer";
import { ExperimentProvider } from "@/components/experiments/experiment-provider";

/**
 * Ajax smart alarm and CCTV, supplied and fitted, for homes.
 *
 * The first landing that does not sell Starlink. Asked for by Will on
 * 13 October 2026 to replace installpros.co.uk/ajax-vision-installation/, and
 * written from scratch rather than from that page, which is the Starlink
 * template with the words swapped (a CCTV headline over alarm copy, "the only
 * UK-based company using all-metal mounts", the Starlink disclaimer).
 *
 * ── WHAT WILL SAID, 13 OCTOBER 2026 ─────────────────────────────────────────
 *   Who:      "let's target residential first as we do not hold all of the
 *             accreditations to be able to do commercial alarm systems at
 *             scale". So no business copy anywhere.
 *   What:     Ajax kit supply plus install. No monitoring. Quote only.
 *   Process:  usually no survey, install complete within a day, 7 days lead.
 *   Proof:    no Ajax install photos yet (engineer photos "not great", he
 *             offers AI renders of a system); not an Ajax partner yet, will
 *             apply; reviews that mention the alarm, if any exist.
 *   Sell on:  "our big win for residential is no monthly costs which justify
 *             our larger upfront". Language: protect vulnerable entry and exit
 *             points, family protection, peace of mind, clarity, app
 *             convenience.
 *   Asked by buyers, in his order, and where each is answered:
 *     1. how the devices protect, contacts vs vibration, verification
 *                                              SecurityLayersSection
 *     2. support costs, no monthly fee         H1, FAQ
 *     3. smart vs standard alarm companies     FAQ
 *     4. what the upfront price buys after     SecurityCompareSection
 *     5. app, keypad, fob, users, temporary users, panic
 *                                              SecurityAppSection
 * He also said monthly support plans could come later for recurring revenue.
 * If they do, the H1, the CTA and two FAQs all say "no monthly fee" and have
 * to change with it.
 *
 * ── WHAT THE RESEARCH CHANGED, 14 OCTOBER 2026 ──────────────────────────────
 * ajax-research/ holds three reports and the summary for Gus (informe-ajax):
 * 125 security purchase chats from Superchat, UK search results, and ten
 * Ajax installers plus the monitored and DIY alternatives.
 *   - Buyers compare with a kit they could fit themselves, a local installer
 *     and other Ajax installers. ADT came up in 0 purchase chats. So the
 *     table is fitted-by-us against a DIY kit, and the ADT question is an FAQ.
 *   - Customers say "cameras", "alarm" and "CCTV"; nobody says "vulnerable".
 *   - Moving in or renovating is the biggest stated trigger (17 of 53).
 *   - The honest answer to who responds when it goes off is in the FAQ: a
 *     self-monitored alarm gets no automatic police response.
 *   - Every high-intent search carries an installation word, so the H1 does.
 *
 * Alarm and CCTV together in the H1 is Gus's call (the old page's title).
 * The chats back it: 83 of 125 buyers wanted cameras, 64 an alarm.
 *
 * ── JORDAN'S ANSWERS, 15 OCTOBER 2026 ───────────────────────────────────────
 * To the questions sent on 14 October. On the page now: price the same day,
 * alarm and cameras priced separately, the warranty (manufacturer's on the
 * kit, 2 or 5 years on the workmanship), engineers DBS checked and insured,
 * Hub 2 as standard, Ajax cameras with an Ajax alarm, a visit on request.
 * Kept off on purpose:
 *   - Monitoring. Not until the SSAIB accreditation, so the FAQ no longer
 *     says it can be added on request.
 *   - Accreditation. Not SSAIB accredited yet. Staff told 12 customers the
 *     install was accredited, 9 naming SSAIB. The page claims none.
 *   - Ajax training or partner. Only a couple of engineers would have it,
 *     and the page cannot promise who turns up.
 *   - Finance. To be handled carefully, and a finance line is a regulated
 *     promotion; it waits for wording their provider approves.
 *   - Price figures and a camera package. Jordan prices each job himself.
 *   - The Handover & Support Plan. They want fewer of those leads.
 *   - Checkatrade, TrustATrader: not on either.
 *   - Hikvision. Fitted on camera-only jobs, but it has its own page on
 *     installpros.co.uk; this page is Ajax only (Gus, 15 October).
 *
 * ── STILL MISSING ───────────────────────────────────────────────────────────
 *   - Photographs. Ajax's own camera render is the hero, pending the rights.
 *   - MotionCam as standard or extra (unanswered). Copy says "where a
 *     detector has a camera", which is true either way.
 *   - Proof of its own. The reviews are the company's, about engineers and
 *     service; a few name Starlink. None mentions an alarm. TrackRecordSection
 *     and the coverage map stay out because their numbers are Starlink's.
 *
 * ── THE LEAD ────────────────────────────────────────────────────────────────
 * install_type `security`, new in migration 0021, which has to be applied
 * before this ships or the form is refused. The webhooks label it
 * "Ajax Security", and Will's Zap needs a branch for that label or the leads
 * reach Superchat untagged. Same GTM, same Ads conversion and same webhook as
 * every other page: the split is his, on purpose. Post-submit goes to
 * /thank-you-security, not the generic page that asks for roof photos.
 * ────────────────────────────────────────────────────────────────────────────
 *
 * noindex, like every segment landing: installpros.co.uk ranks its own Ajax
 * page and this subdomain is for paid clicks. Not in sitemap.ts. For the
 * same reason no FAQPage JSON-LD (removed 16 October): a page that is never
 * indexed never gets rich results, and Google has shown FAQ rich results only
 * for government and health sites since 2023.
 */

export const metadata: Metadata = {
  title: "Ajax Alarm & CCTV Installation for Homes | No Monthly Fees",
  description:
    "Ajax smart alarm and CCTV, supplied and fitted in a day. Every door and window protected, alerts on your phone, no monthly contract. Call 020 3397 7003.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Ajax Alarm & CCTV Installation for Homes | No Monthly Fees",
    description:
      "Every door and window protected, the whole family on one app. Fitted in a day, one upfront price, no monthly contract.",
    url: "/ajax-security-installation",
  },
};

export default function AjaxSecurityInstallationPage() {
  return (
    <div className="theme-editorial min-h-screen bg-background text-foreground">
      <MainHeader />
      <ExperimentProvider>
        <main id="main" tabIndex={-1} className="flex flex-col outline-none">
          <SecurityHeroSection
            // Prototype, 15 October 2026: Ajax's own ceiling-mounted DomeCam
            // render, from the Ajax site, which Gus sent as the look he wants
            // (a camera fixed to a surface, not floating). Rights to be
            // confirmed before this goes live; InstallPros is not an Ajax
            // partner yet. Desktop: the full 2.4:1 frame, camera right of
            // centre. Phones: a 3:4 crop centred on the camera.
            image="/funnel/ajax-ceiling-1920.webp"
            imageSrcSet="/funnel/ajax-ceiling-1280.webp 1280w, /funnel/ajax-ceiling-1920.webp 1920w, /funnel/ajax-ceiling-2560.webp 2560w"
            imageMobile="/funnel/ajax-ceiling-phone-640.webp 640w, /funnel/ajax-ceiling-phone-828.webp 828w"
            // Slides the camera right, so the end of the subheadline does not
            // sit over the lens, without cutting it off at 1440. Phones use
            // their own crop. Must match photoSpots.desktop.position.
            imagePosition="44% 0%"
            // Fractions of each image: the recording light in the small window
            // on the right of the camera's band, LIVE on the ceiling above the
            // camera (beside it, it ran off the right edge at 1440). The
            // phone crop is x 2130 to 3330 of the 3840 frame, full height.
            photoSpots={{
              desktop: { width: 3840, height: 1600, position: [0.44, 0], led: [0.779, 0.475], live: [0.7, 0.18], focus: [0.71, 0.5] },
              mobile: { width: 1200, height: 1600, position: [0.5, 0], led: [0.7175, 0.475] },
            }}
            // The two process facts a homeowner would not assume, both Will's.
            badge="No survey needed. Fitted in a day."
            badgeNarrow="No survey. Fitted in a day."
            // Brand, product and an installation word: every high-intent
            // query in the keyword research carries one ("installer",
            // "installation", "fitted"). Then Will's main selling point.
            // Provisional until the ad groups exist; then one H1 per group.
            headline="Ajax alarm and CCTV installation, with no monthly fees"
            // Own key, so a headline test here cannot rewrite any other H1.
            headlineConfigKey="headlineSecurity"
            // In the customers' words: "cameras" and "alarm" (70 and 42 of 125
            // chats), not "security system" or "vulnerable entry points".
            subheadline="Alarm and cameras on one app, every door and window covered, alerts wherever you are. Usually fitted within 7 days."
            defaultInstallType="security"
            // Postcode, not address: Will's call for commercial on 7 October,
            // and the funnel /install-quote runs on.
            formName="ajax_security"
          />
          <WhatsAppFab />
          {/* How it protects (Will's Q1), how it fits the household (Q5),
              then what the installation pays for against fitting a kit
              yourself (Q4, and the DIY and labour objections in the chats).
              Monthly fees and standard alarm companies (Q2, Q3) live in the
              FAQ: buyers in the chats never compared us with ADT. */}
          <SecurityLayersSection />
          <SecurityHomeSection />
          <SecurityAppSection />
          <SecurityEquipmentSection />
          <SecurityCompareSection />
          {/* Proof before process, as on every segment landing.
              The reviews are the company's, about its installation service,
              and none of them mentions an alarm yet, so one line says what
              they are before anyone reads them as proof of alarm work
              (16 October). Both review sections are shared with
              /install-quote, so the line lives here, and the wrapper only
              trims the first section's top padding so the two read as one. */}
          <div className="bg-background pt-16 md:pt-24">
            <div className="container mx-auto">
              <p className="text-body-sm text-muted-foreground">
                Reviews of our installation service, across every kind of install we do.
              </p>
            </div>
          </div>
          <div className="[&>section]:pt-5 md:[&>section]:pt-6">
            <TrustpilotSection />
          </div>
          <CustomerStoriesSection />
          <SecurityHowItWorksSection />
          <FaqSectionAlt faqs={SECURITY_FAQS} />
          <SecurityCtaSection defaultService="security" formName="ajax_security" />
        </main>
      </ExperimentProvider>
      <FunnelFooter />
    </div>
  );
}
