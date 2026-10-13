import type { Metadata } from "next";
import { MainHeader } from "@/components/funnel/main-header";
import { SecurityHeroSection } from "@/components/funnel/security-hero-section";
import { WhatsAppFab } from "@/components/funnel/whatsapp-fab";
import { SecurityAppSection } from "@/components/funnel/security-app-section";
import { SecurityPackagesSection } from "@/components/funnel/security-packages-section";
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
 * Ajax wireless alarms and CCTV, supplied and fitted. Homes and businesses,
 * from a flat to a warehouse.
 *
 * The first landing that does not sell Starlink. Asked for by Will on
 * 13 October 2026 to replace installpros.co.uk/ajax-vision-installation/, and
 * written from scratch rather than from that page, which is the Starlink
 * template with the words swapped: a CCTV headline over alarm copy, "the only
 * UK-based company using all-metal mounts", the Starlink disclaimer, a closing
 * "Ready To Get Your CCTV Installed?". What it does give, and this page keeps:
 * the audience (homes and businesses, flats to warehouses), the product
 * (wireless, app control and alerts, intrusion, fire and leak sensors,
 * pet-friendly), the promise (quote, supply and install, usually within 7
 * days) and six FAQs, rewritten plainly in lib/funnel/security-faqs.ts.
 *
 * Alarm and CCTV together, the old page's own title and Gus's call: one Ajax
 * system on one app, the alarm first and the cameras part of it.
 *
 * Built on the chassis, and none of it changed: MainHeader, the
 * ZipAvailabilityChecker and ServiceQuoteForm funnels, the H1 with its own
 * experiment key, the review sections, the FAQ and the footer. Everything that
 * said Starlink was duplicated instead (hero, trust bar, closing form), because
 * those files render on /install-quote.
 *
 * ── WHAT THIS PAGE IS MISSING ───────────────────────────────────────────────
 * Five questions went to Will before this was written. It was built without
 * the answers, on his ask, so each one has a slot that holds a conservative
 * default and says so in its own file:
 *   1. PRICE. "From", packages, or quote only. Nothing on the page names a
 *      figure; the system cards end on "Fitted price on your quote".
 *      (security-packages-section.tsx, security-faqs.ts)
 *   2. MONITORING. A monitoring centre with a monthly fee, or the app alerts.
 *      The page claims only the app alerts, which every Ajax system sends.
 *      (security-app-section.tsx, security-faqs.ts)
 *   3. AJAX PARTNER. If authorised, it is the badge in the trust bar and the
 *      closing section. Until then the page claims no relationship.
 *      (security-hero-trust-bar.tsx, security-cta-section.tsx)
 *   4. PHOTOGRAPHS AND WHO ANSWERS. No picture of an Ajax install exists, so
 *      the hero is a dark surface and the one visual is a drawn phone, not
 *      stock. Who takes these leads decides who the thank-you page names.
 *   5. KEYWORDS. The H1 says "Ajax alarm and CCTV" because that is the old
 *      page's title. When the ad groups exist, the H1 says what the ad says.
 * Also assumed: the kit lists on the system cards, the SIM backup in the
 * power-cut answer, and "24/7 support" left out until someone says what it
 * means for alarms.
 *
 * NO PROOF OF ITS OWN. The reviews are the company's, and they are about
 * engineers and service; a few name Starlink. There is not one review of an
 * alarm install, so nothing here says there is. Left out on purpose:
 * TrackRecordSection ("3,500+ installations", "start to speed test") and the
 * coverage map, whose numbers are Starlink's.
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
  title: "Ajax Alarm & CCTV Installation | Supplied and Fitted Across the UK",
  description:
    "Ajax wireless alarm and CCTV, supplied and fitted. Intruder, fire and leak detectors and cameras on one app, pet-friendly, usually fitted within 7 days. Call 020 3397 7003.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Ajax Alarm & CCTV Installation | Supplied and Fitted Across the UK",
    description:
      "One wireless system for intruders, fire, leaks and cameras, run from your phone. Usually fitted within 7 days.",
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
            // Both products in the pill so the H1 can sell the outcome. The
            // short one drops the audience on phones, where the long one wraps.
            badge="Ajax alarms & CCTV for homes and businesses"
            badgeNarrow="Ajax alarms & CCTV"
            // Brand and product first, for whoever searched "Ajax alarm
            // installer"; then what they get, which is the app.
            headline="Ajax alarm and CCTV, fitted and running from your phone"
            // Own key, so a headline test here cannot rewrite any other H1.
            headlineConfigKey="headlineSecurity"
            // The four jobs, the two objections, and Will's seven days.
            subheadline="One wireless system for intruders, fire, leaks and cameras. Pet-friendly, no rewiring, usually fitted within 7 days."
            defaultInstallType="security"
            // Postcode, not address: Will's call for commercial on 7 October,
            // and the funnel /install-quote runs on.
            formName="ajax_security"
          />
          <WhatsAppFab />
          {/* What it does, before what it costs: a visitor who does not yet
              know Ajax covers fire and leaks too has not seen what the quote
              is for. */}
          <SecurityAppSection />
          {/* Then which system is theirs. The cards scroll to the closing
              form and log which property was picked. */}
          <SecurityPackagesSection />
          <WhyInstallProsSection
            features={SECURITY_FEATURES}
            heading="One team supplies it, fits it and answers for it."
            intro="We supply the Ajax kit, fit it, test it and set it up on your phone. The same team picks up when you call afterwards."
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
