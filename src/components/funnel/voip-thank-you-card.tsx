"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Phone, Mail } from "lucide-react";
import { WhatsAppIcon } from "./ui/whatsapp-icon";
import { GoogleRatingBadge } from "./security-hero-trust-bar";
import { track, EVENTS } from "@/lib/analytics";
import { mailtoUrl, whatsappUrl, SUPPORT_PHONE_HREF } from "@/lib/funnel/contact";

/**
 * Post-submit card for the digital landline page. A copy of
 * hikvision-thank-you-card.tsx (the live Hikvision page), on the structure
 * Jordan approved for Ajax: the call within 2 hours, the number it comes
 * from, WhatsApp first.
 *
 * Changed: it asks for a photo of the latest phone bill, the first thing a
 * number transfer needs (name, address and number on it), and repeats the
 * one instruction that saves the number: don't cancel the old line yet.
 * The need comes in the query string from the form, for analytics.
 */
export function VoipThankYouCard() {
  const [lead, setLead] = useState<{ leadId?: string; name?: string; postcode?: string; need?: string }>({});

  useEffect(() => {
    const next: { leadId?: string; name?: string; postcode?: string; need?: string } = {};
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
    try {
      const params = new URLSearchParams(window.location.search);
      const fromUrl = params.get("leadId");
      if (fromUrl) next.leadId = fromUrl;
      next.need = params.get("need") ?? undefined;
    } catch {
      /* noop */
    }
    setLead(next);
    track(EVENTS.PAGE_VIEW, { cta_location: "thank_you_voip", lead_id: next.leadId });
  }, []);

  const details = [lead.postcode ? `postcode ${lead.postcode}` : null, lead.name ? `name ${lead.name}` : null]
    .filter(Boolean)
    .join(", ");
  const subject = "a new phone that keeps my landline number";
  const ask = " Here is a photo of my latest phone bill.";
  const message = details
    ? `Hi InstallPros, I have just asked about ${subject} (${details}).${ask}`
    : `Hi InstallPros, I have just asked about ${subject}.${ask}`;
  const waHref = whatsappUrl(message);
  const emailHref = mailtoUrl(lead.postcode ? `Digital landline (${lead.postcode})` : "Digital landline", `${message}\n\n`);

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
        From 020 3397 7003, to set up your phone and your number. You&apos;ll
        get your price the same day.
      </p>

      <p className="mt-4 rounded-xl border border-primary/25 bg-primary/[0.06] px-4 py-3 text-body-sm text-foreground">
        <strong>Don&apos;t cancel your old line yet.</strong> We move the number first.
      </p>

      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          track(EVENTS.WHATSAPP_CLICKED, {
            channel: "whatsapp",
            cta_location: "thank_you_voip",
            lead_id: lead.leadId,
          })
        }
        className="focus-ring-solid mt-6 md:mt-7 flex h-control-lg items-center justify-center gap-2.5 rounded-lg bg-primary text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-primary-foreground transition-colors duration-quick ease-ds hover:bg-brand-hover"
      >
        <WhatsAppIcon className="h-[19px] w-[19px]" />
        Send your phone bill
      </a>

      <a
        href={SUPPORT_PHONE_HREF}
        onClick={() =>
          track(EVENTS.PHONE_CLICKED, {
            channel: "phone",
            cta_location: "thank_you_voip",
            lead_id: lead.leadId,
          })
        }
        className="focus-ring-solid mt-3 flex h-control-lg items-center justify-center gap-2.5 rounded-lg border border-border bg-background text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-foreground transition-colors duration-quick ease-ds hover:bg-secondary"
      >
        <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
        Call now
      </a>

      <div className="mt-4 flex justify-center">
        <a
          href={emailHref}
          onClick={() =>
            track(EVENTS.EMAIL_CLICKED, {
              channel: "email",
              cta_location: "thank_you_voip",
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
