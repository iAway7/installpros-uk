"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Phone, Mail } from "lucide-react";
import { WhatsAppIcon } from "./ui/whatsapp-icon";
import { GoogleRatingBadge } from "./security-hero-trust-bar";
import { track, EVENTS } from "@/lib/analytics";
import { mailtoUrl, whatsappUrl, SUPPORT_PHONE_HREF } from "@/lib/funnel/contact";

/**
 * Post-submit card for the Ajax alarm and CCTV landing. A copy of the
 * commercial card with the words changed, not a prop on it: same three ways
 * to reach us (WhatsApp filled, call outlined, email as a link) and the same
 * reasoning, in that file.
 *
 * Why not the generic /thank-you: it asks for roof photos, which is a Starlink
 * question. An alarm quote is made of doors, windows, floors and pets.
 *
 * The words are Jordan's structure of 21 October: when we call and from which
 * number, what the call is for, and WhatsApp as the faster way to a price.
 * Cut down the same day (Gus: too busy): the photo request and "Fixed prices,
 * no hidden extras" went, and the Google rating is the hero's badge in its
 * light version rather than typed text. No accreditation line yet: Jordan
 * means Ajax logos once he is through the Ajax portal.
 */
export function SecurityThankYouCard() {
  const [lead, setLead] = useState<{ leadId?: string; name?: string; postcode?: string }>({});

  useEffect(() => {
    // The id is for analytics, so this screen's events join to the lead. The
    // name and postcode are so the message they send identifies them without
    // being asked twice: whoever picks it up should not have to say "which
    // property is this?" to someone who filled a form sixty seconds ago.
    const next: { leadId?: string; name?: string; postcode?: string } = {};
    try {
      const raw = sessionStorage.getItem("quoteFormData");
      if (raw) {
        const parsed = JSON.parse(raw) as { leadId?: string; name?: string; postcode?: string };
        next.leadId = parsed.leadId;
        next.name = parsed.name;
        next.postcode = parsed.postcode;
      }
    } catch {
      /* storage blocked, generic copy still works */
    }
    // The query string wins over the stored copy because it describes this
    // navigation rather than whatever the tab did last.
    try {
      const fromUrl = new URLSearchParams(window.location.search).get("leadId");
      if (fromUrl) next.leadId = fromUrl;
    } catch {
      /* noop */
    }
    setLead(next);
    track(EVENTS.PAGE_VIEW, { cta_location: "thank_you_security", lead_id: next.leadId });
  }, []);

  // One sentence, built once, so the WhatsApp text and the email body cannot
  // drift. Every part is optional: a visitor whose session was cleared still
  // gets a valid link, just without the identifying detail.
  const details = [lead.postcode ? `postcode ${lead.postcode}` : null, lead.name ? `name ${lead.name}` : null]
    .filter(Boolean)
    .join(", ");
  const message = details
    ? `Hi InstallPros, I have just requested an Ajax alarm quote (${details}).`
    : "Hi InstallPros, I have just requested an Ajax alarm quote.";
  const waHref = whatsappUrl(message);
  const emailHref = mailtoUrl(
    lead.postcode ? `Ajax alarm quote (${lead.postcode})` : "Ajax alarm quote",
    `${message}\n\n`,
  );

  return (
    <div className="w-full max-w-[420px] md:max-w-[560px] md:rounded-2xl md:border md:border-border md:bg-card md:px-12 md:py-11 md:shadow-raised">
      <p className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/10 py-1.5 pl-2.5 pr-3.5">
        <CheckCircle2 className="h-[15px] w-[15px] text-success" aria-hidden="true" />
        <span className="text-caption font-semibold text-success md:text-body-sm">Request received</span>
      </p>

      <h1 className="mt-4 md:mt-5 text-[29px] md:text-[36px] font-bold leading-[1.15] md:leading-[1.12] tracking-[-0.02em] md:tracking-[-0.025em] text-foreground [text-wrap:pretty]">
        We&apos;ll call you within 2 hours
      </h1>
      <p className="mt-3.5 text-body md:text-lead leading-[1.55] md:leading-[1.6] text-muted-foreground [text-wrap:pretty]">
        From 020 3397 7003, to help design your system. You&apos;ll get a fixed price the same day.
      </p>

      {/* Real anchors, 56px tall: long-press, open in a new tab and the iOS app
          handoff all behave. tel: and mailto: need it as much as wa.me does. */}
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          track(EVENTS.WHATSAPP_CLICKED, {
            channel: "whatsapp",
            cta_location: "thank_you_security",
            lead_id: lead.leadId,
          })
        }
        className="focus-ring-solid mt-6 md:mt-7 flex h-control-lg items-center justify-center gap-2.5 rounded-lg bg-primary text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-primary-foreground transition-colors duration-quick ease-ds hover:bg-brand-hover"
      >
        <WhatsAppIcon className="h-[19px] w-[19px]" />
        Get your price on WhatsApp
      </a>

      {/* "Call now", Will's own label, in quotes in his message of 8 October.
          This read "Call 020 3397 7003" first, on the reasoning that somebody
          at a desk reads the number off and dials from the deskphone. The
          header already shows it, so nothing is lost by taking it out of the
          button, and the shorter label is the stronger instruction. */}
      <a
        href={SUPPORT_PHONE_HREF}
        onClick={() =>
          track(EVENTS.PHONE_CLICKED, {
            channel: "phone",
            cta_location: "thank_you_security",
            lead_id: lead.leadId,
          })
        }
        className="focus-ring-solid mt-3 flex h-control-lg items-center justify-center gap-2.5 rounded-lg border border-border bg-background text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-foreground transition-colors duration-quick ease-ds hover:bg-secondary"
      >
        <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
        Call now
      </a>

      {/* Email is a text link, not a third button. It is the one people use
          when they want it in writing rather than when they want it now, so it
          does not need to compete for the tap. */}
      <div className="mt-4 flex justify-center">
        <a
          href={emailHref}
          onClick={() =>
            track(EVENTS.EMAIL_CLICKED, {
              channel: "email",
              cta_location: "thank_you_security",
              lead_id: lead.leadId,
            })
          }
          className="focus-ring flex min-h-[44px] items-center gap-1.5 rounded-md px-2 text-body-sm font-medium text-muted-foreground transition-colors duration-quick hover:text-foreground"
        >
          <Mail className="h-4 w-4 md:h-[17px] md:w-[17px]" aria-hidden="true" />
          <span className="border-b border-field">or email us instead</span>
        </a>
      </div>

      <div className="mt-5 flex justify-center">
        <GoogleRatingBadge tone="light" />
      </div>
    </div>
  );
}
