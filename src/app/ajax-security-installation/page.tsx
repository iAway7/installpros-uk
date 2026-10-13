import type { Metadata } from "next";
import { MainHeader } from "@/components/funnel/main-header";
import { SecurityHeroSection } from "@/components/funnel/security-hero-section";
import { WhatsAppFab } from "@/components/funnel/whatsapp-fab";
import { SecurityLayersSection } from "@/components/funnel/security-layers-section";
import { SecurityAppSection } from "@/components/funnel/security-app-section";
import { SecurityCompareSection } from "@/components/funnel/security-compare-section";
import { WhyInstallProsSection } from "@/components/funnel/why-installpros-section";
import { SECURITY_FEATURES } from "@/components/funnel/security-features";
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
 *     2. support costs, no monthly fee         SecurityCompareSection, FAQ
 *     3. smart vs standard alarm companies     SecurityCompareSection
 *     4. what the upfront price buys after     WhyInstallProsSection
 *     5. app, keypad, fob, users, temporary users, panic
 *                                              SecurityAppSection
 * He also said monthly support plans could come later for recurring revenue.
 * If they do, the H1, the compare table and two FAQs all say "no monthly fee"
 * and have to change with it.
 *
 * Alarm and CCTV together in the H1 is Gus's call (the old page's title);
 * Will's answers are about the alarm, so the cameras live inside the system
 * (photo verification, the FAQ) rather than as a section of their own.
 *
 * ── STILL MISSING ───────────────────────────────────────────────────────────
 *   - Photographs. The hero is a dark surface and the one picture is a drawn
 *     phone. Will's AI renders, or real installs, go in the hero `image`.
 *   - Keywords. Research running (ajax-research/keywords-and-serp.md); the H1
 *     says what the ad says once the ad groups exist.
 *   - The compare table's right-hand column, checked against what ADT and
 *     Verisure actually sell (ajax-research/competitors.md).
 *   - After-install services, warranty, which hub (SIM backup claim).
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
 * page and this subdomain is for paid clicks. Not in sitemap.ts.
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

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: SECURITY_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function AjaxSecurityInstallationPage() {
  return (
    <div className="theme-editorial min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <MainHeader />
      <ExperimentProvider>
        <main id="main" tabIndex={-1} className="flex flex-col outline-none">
          <SecurityHeroSection
            // The two process facts a homeowner would not assume, both Will's.
            badge="No survey needed. Fitted in a day."
            badgeNarrow="No survey. Fitted in a day."
            // Brand and product first, for whoever searched "Ajax alarm";
            // then Will's main selling point. Provisional until the keyword
            // research says what the ads will say.
            headline="Ajax alarm and CCTV for your home, with no monthly fees"
            // Own key, so a headline test here cannot rewrite any other H1.
            headlineConfigKey="headlineSecurity"
            // Entry points and family, in Will's sales language, then the lead time.
            subheadline="Every door and window protected, the whole family on one app, alerts wherever you are. Usually fitted within 7 days."
            defaultInstallType="security"
            // Postcode, not address: Will's call for commercial on 7 October,
            // and the funnel /install-quote runs on.
            formName="ajax_security"
          />
          <WhatsAppFab />
          {/* Will's five questions, in the order a buyer gets to them: how it
              protects, how it fits the household, what it costs against the
              alternative, what the upfront price buys. */}
          <SecurityLayersSection />
          <SecurityAppSection />
          <SecurityCompareSection />
          <WhyInstallProsSection
            features={SECURITY_FEATURES}
            heading="What the upfront price pays for."
            intro="With no monthly fee, the value is in the install and in what comes after it. One team supplies it, fits it and answers for it."
          />
          {/* Proof before process, as on every segment landing. */}
          <TrustpilotSection />
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
