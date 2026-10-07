"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Check, Caravan, Sofa, Mail } from "lucide-react";
import { WhatsAppIcon } from "./ui/whatsapp-icon";
import { track, EVENTS } from "@/lib/analytics";
import { mailtoUrl, vehiclePhotoRequestMessage, whatsappUrl } from "@/lib/funnel/contact";

interface LeadContext {
  name?: string;
  postcode?: string;
  leadId?: string;
}

/** Will's list, 29 September: "We need a photo of the roof and the interior of
 *  the vehicle too." Rails, seams and skylights decide the mount, so the roof
 *  shot answers most of the job; the cable run and where the router lands come
 *  off the interior.
 *
 *  Two, because the landing promises "Fixed quote from two photos" three times
 *  over, in the hero, the meta description and the share card. A third tile
 *  here would quietly make that a lie. The campervan electrics, which Will
 *  called "a huge bonus" rather than a requirement, are a line of text below
 *  instead, which is the weight he gave them. */
const SHOTS = [
  { icon: Caravan, label: "The roof, from a step or above" },
  { icon: Sofa, label: "Inside the vehicle" },
];

/**
 * Post-submit card for the vehicle funnel.
 *
 * This segment stalls here and the chat log says so: fifteen of thirty-six
 * vehicle conversations were open waiting on a photo, a mounting proposal or
 * the vehicle itself. So this screen does one thing, which is get two photos
 * and the make and model back in a single message, rather than a second round
 * trip for each missing piece. The make and model is the last thing in the
 * prefilled WhatsApp text, ending on the label, so the customer finishes the
 * sentence instead of being asked later.
 *
 * It is deliberately a near-copy of the residential card rather than a shared
 * component with props. The two ask for different things off different
 * promises, and the residential one sits on /install-quote, which carries the
 * live Ads traffic: parameterising it would put that page's layout at risk to
 * save a file.
 */
export function VehiclePhotoRequestCard() {
  const [lead, setLead] = useState<LeadContext>({});

  useEffect(() => {
    const next: LeadContext = {};
    try {
      const raw = sessionStorage.getItem("quoteFormData");
      if (raw) {
        const parsed = JSON.parse(raw) as { name?: string; postcode?: string; leadId?: string };
        next.name = parsed.name;
        next.postcode = parsed.postcode;
        next.leadId = parsed.leadId;
      }
    } catch {
      /* storage blocked or malformed, generic copy still works */
    }
    // The redirect carries ?leadId=; it wins over the stored copy because it
    // describes this navigation rather than whatever the tab did last.
    try {
      const fromUrl = new URLSearchParams(window.location.search).get("leadId");
      if (fromUrl) next.leadId = fromUrl;
    } catch {
      /* noop */
    }
    setLead(next);

    track(EVENTS.PAGE_VIEW, { cta_location: "thank_you_vehicle_photos", lead_id: next.leadId });
    // No conversion fires here. It lives in GTM on the lead_created dataLayer
    // event, raised at submit, and firing it again would count every lead twice.
  }, []);

  const message = vehiclePhotoRequestMessage(lead);
  const waHref = whatsappUrl(message);
  const emailHref = mailtoUrl(
    lead.postcode ? `Photos for my vehicle Starlink quote (${lead.postcode})` : "Photos for my vehicle Starlink quote",
    `${message} \n\n`,
  );

  return (
    <div className="w-full max-w-[420px] md:max-w-[560px] md:rounded-2xl md:border md:border-border md:bg-card md:px-12 md:py-11 md:shadow-raised">
      <p className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/10 py-1.5 pl-2.5 pr-3.5">
        <CheckCircle2 className="h-[15px] w-[15px] text-success" aria-hidden="true" />
        <span className="text-caption font-semibold text-success md:text-body-sm">Request received</span>
      </p>

      <h1 className="mt-4 md:mt-5 text-[29px] md:text-[36px] font-bold leading-[1.15] md:leading-[1.12] tracking-[-0.02em] md:tracking-[-0.025em] text-foreground [text-wrap:pretty]">
        Two photos and we can price it
      </h1>
      <p className="mt-3.5 text-body md:text-lead leading-[1.55] md:leading-[1.6] text-muted-foreground [text-wrap:pretty]">
        The roof decides the mount and the inside decides the cable run. Send both and your fixed quote covers the Mini,
        the mount and the fitting.
      </p>

      {/* Two beats, one done and one live. The done row is deliberately quiet
          so the eye lands on the live one. */}
      <div className="mt-6 md:mt-7 flex flex-col gap-0.5">
        <div className="flex gap-3.5 md:gap-4">
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-success/10">
              <Check className="h-[13px] w-[13px] text-success" strokeWidth={2.6} aria-hidden="true" />
            </div>
            <div className="w-0.5 flex-grow bg-border" />
          </div>
          <div className="pb-4 md:pb-5">
            <p className="text-body-sm md:text-body font-semibold text-muted-foreground">Details received</p>
            <p className="mt-0.5 text-body-sm text-muted-foreground">Postcode and contact saved.</p>
          </div>
        </div>

        <div className="flex gap-3.5 md:gap-4">
          <div className="relative flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-primary/15">
            <span className="step-live-ring absolute inset-0 rounded-full border-[1.5px] border-primary/50" aria-hidden="true" />
            <span className="relative flex h-4 w-4 items-center justify-center rounded-full bg-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          </div>
          <div>
            <p className="text-body md:text-lead font-bold text-foreground">Send us your photos</p>
            <p className="mt-0.5 text-body-sm leading-[1.5] text-muted-foreground">
              It takes about a minute on your phone.
            </p>
          </div>
        </div>
      </div>

      {/* One column on a phone, two across from sm up. Stacked, each one is a
          line of text with its icon beside it, which is what keeps the longer
          label off a second line at 375px. */}
      <ul className="mt-4 md:mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-2.5 md:gap-3">
        {SHOTS.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="flex items-center gap-3 rounded-lg border border-border bg-secondary px-3.5 py-3 text-left sm:flex-col sm:items-center sm:gap-2.5 sm:px-2.5 sm:py-3.5 sm:text-center md:py-4"
          >
            <Icon className="h-[22px] w-[22px] shrink-0 md:h-6 md:w-6 text-brand-icon" aria-hidden="true" />
            <span className="text-body-sm text-muted-foreground sm:text-caption md:text-body-sm leading-[1.35]">{label}</span>
          </li>
        ))}
      </ul>

      {/* The make and model is in the prefilled message already; it is repeated
          here because somebody who opens the email link instead should see the
          same ask, and because a bonus stated as a bonus gets sent more often
          than one buried in a chat draft. */}
      <p className="mt-3.5 text-body-sm leading-[1.5] text-muted-foreground">
        Tell us the make and model too, and if it is a campervan, a shot of the electrics helps us quote the power side.
      </p>

      {/* Real anchors, 56px tall: long-press, open in a new tab and the iOS app
          handoff all behave. */}
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          track(EVENTS.WHATSAPP_CLICKED, {
            channel: "whatsapp",
            cta_location: "thank_you_vehicle_photos",
            lead_id: lead.leadId,
          })
        }
        className="focus-ring-solid mt-6 md:mt-7 flex h-control-lg items-center justify-center gap-2.5 rounded-lg bg-primary text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-primary-foreground transition-colors duration-quick ease-ds hover:bg-brand-hover"
      >
        <WhatsAppIcon className="h-[19px] w-[19px]" />
        Send photos on WhatsApp
      </a>

      {/* Email is a text link, not a second button: one tap dominates. */}
      <div className="mt-4 flex justify-center">
        <a
          href={emailHref}
          onClick={() =>
            track(EVENTS.EMAIL_CLICKED, {
              channel: "email",
              cta_location: "thank_you_vehicle_photos",
              lead_id: lead.leadId,
            })
          }
          className="focus-ring flex min-h-[44px] items-center gap-1.5 rounded-md px-2 text-body-sm font-medium text-muted-foreground transition-colors duration-quick hover:text-foreground"
        >
          <Mail className="h-4 w-4 md:h-[17px] md:w-[17px]" aria-hidden="true" />
          <span className="border-b border-field">or email them instead</span>
        </a>
      </div>
    </div>
  );
}
