"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { WhatsAppIcon } from "./ui/whatsapp-icon";
import { track, EVENTS } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/funnel/contact";

/**
 * Post-submit card for the commercial funnel.
 *
 * It says thank you and offers one way to reach us. Nothing is asked for.
 *
 * Residential gets a different screen because it has something to ask: photos
 * of the roof, which replace a site visit and are what the quote waits on. A
 * commercial job gets a survey either way, so there is no equivalent task to
 * hand the visitor here, and a page that invents one would be asking a
 * customer to do work for us right after they converted.
 *
 * The WhatsApp link is the only control, and it is deliberately not framed as
 * a next step: the team is already going to call. It is there for somebody who
 * wants to reach us first.
 */
export function CommercialThankYouCard() {
  const [leadId, setLeadId] = useState<string | undefined>();

  useEffect(() => {
    // Only for analytics, so this screen's events can be joined to the lead.
    // Nothing on the page depends on it, which is why there is no fallback
    // state when it is missing: the copy and the button are identical either
    // way. The query string wins over the stored copy because it describes
    // this navigation rather than whatever the tab did last.
    let id: string | undefined;
    try {
      id = new URLSearchParams(window.location.search).get("leadId") ?? undefined;
    } catch {
      /* noop */
    }
    if (!id) {
      try {
        const raw = sessionStorage.getItem("quoteFormData");
        if (raw) id = (JSON.parse(raw) as { leadId?: string }).leadId;
      } catch {
        /* storage blocked */
      }
    }
    setLeadId(id);
    track(EVENTS.PAGE_VIEW, { cta_location: "thank_you_commercial", lead_id: id });
  }, []);

  const waHref = whatsappUrl("Hi, I have just requested a commercial Starlink quote.");

  return (
    <div className="w-full max-w-[420px] md:max-w-[560px] md:rounded-2xl md:border md:border-border md:bg-card md:px-12 md:py-11 md:shadow-raised">
      <p className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/10 py-1.5 pl-2.5 pr-3.5">
        <CheckCircle2 className="h-[15px] w-[15px] text-success" aria-hidden="true" />
        <span className="text-caption font-semibold text-success md:text-body-sm">Request received</span>
      </p>

      <h1 className="mt-4 md:mt-5 text-[29px] md:text-[36px] font-bold leading-[1.15] md:leading-[1.12] tracking-[-0.02em] md:tracking-[-0.025em] text-foreground [text-wrap:pretty]">
        Thanks, we have your request
      </h1>
      <p className="mt-3.5 text-body md:text-lead leading-[1.55] md:leading-[1.6] text-muted-foreground [text-wrap:pretty]">
        One of the team will be in touch to talk through the site and arrange a survey. Your quote is fixed once we have
        seen it.
      </p>
      <p className="mt-4 text-body md:text-lead leading-[1.55] md:leading-[1.6] text-muted-foreground [text-wrap:pretty]">
        If you would rather reach us first, WhatsApp is the quickest way.
      </p>

      {/* A real anchor, 56px tall: long-press, open in a new tab and the iOS
          app handoff all behave. */}
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          track(EVENTS.WHATSAPP_CLICKED, {
            channel: "whatsapp",
            cta_location: "thank_you_commercial",
            lead_id: leadId,
          })
        }
        className="focus-ring-solid mt-6 md:mt-7 flex h-control-lg items-center justify-center gap-2.5 rounded-lg bg-primary text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-primary-foreground transition-colors duration-quick ease-ds hover:bg-brand-hover"
      >
        <WhatsAppIcon className="h-[19px] w-[19px]" />
        Message us on WhatsApp
      </a>

      {/* "No obligation" is what the rest of the funnel says, on the residential
          post-submit card and in the hero. Nothing on the site states what a
          survey costs, so this page does not either. */}
      <p className="mt-3.5 text-center text-caption md:text-body-sm leading-[1.5] text-muted-foreground">
        No obligation. Monday to Friday, 8am to 6pm.
      </p>
    </div>
  );
}
