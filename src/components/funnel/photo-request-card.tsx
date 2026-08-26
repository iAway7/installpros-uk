"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Check, CloudSun, House, Mail, Router } from "lucide-react";
import { WhatsAppIcon } from "./ui/whatsapp-icon";
import { track, EVENTS } from "@/lib/analytics";
import { mailtoUrl, photoRequestMessage, whatsappUrl } from "@/lib/funnel/contact";
import { fireGoogleAdsConversion } from "@/lib/funnel/google-ads-conversion";

interface LeadContext {
  name?: string;
  postcode?: string;
  leadId?: string;
}

/** What to photograph. Naming the three shots is the whole point of this step:
 *  "send us some photos" stalls, "the roof or wall" does not. */
const SHOTS = [
  { icon: House, label: "Roof or wall" },
  { icon: Router, label: "Router spot" },
  { icon: CloudSun, label: "Sky view" },
];

/**
 * Post-submit card that hands the lead into the WhatsApp photo funnel.
 *
 * The lead is already converted, so this screen has exactly one job: get three
 * photos back without a site visit. Everything here serves that. The two beats
 * below say which step is done and which is live, and email is a text link
 * rather than a second button so a single tap dominates.
 *
 * Lead context comes from what the funnel already persisted (sessionStorage
 * `quoteFormData`, written by submitLead) plus the `leadId` on the redirect.
 * Both links render valid on the server pass, before any of that exists, and
 * are upgraded once the effect runs: there is no state in which a button is
 * dead or opens an empty chat.
 *
 * One component covers both widths. Mobile sits directly on the page; from md
 * up it becomes a white panel on the off-white surface, because desktop earns
 * air rather than more content.
 */
export function PhotoRequestCard() {
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

    track(EVENTS.PAGE_VIEW, { cta_location: "thank_you_photos", lead_id: next.leadId });

    // This page is now the first stop for a converted lead, so it owns the
    // Google Ads conversion that used to fire on the upload step. The helper
    // is once-per-session, so a lead who reaches both still counts once.
    return fireGoogleAdsConversion();
  }, []);

  const message = photoRequestMessage(lead);
  const waHref = whatsappUrl(message);
  const emailHref = mailtoUrl(
    lead.postcode ? `Photos for my Starlink quote (${lead.postcode})` : "Photos for my Starlink quote",
    `${message}\n\n`,
  );

  return (
    <div className="w-full max-w-[420px] md:max-w-[560px] md:rounded-2xl md:border md:border-border md:bg-card md:px-12 md:py-11 md:shadow-raised">
      <p className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/10 py-1.5 pl-2.5 pr-3.5">
        <CheckCircle2 className="h-[15px] w-[15px] text-success" aria-hidden="true" />
        <span className="text-caption font-semibold text-success md:text-body-sm">Request received</span>
      </p>

      <h1 className="mt-4 md:mt-5 text-[29px] md:text-[36px] font-bold leading-[1.15] md:leading-[1.12] tracking-[-0.02em] md:tracking-[-0.025em] text-foreground [text-wrap:pretty]">
        Your photos are the last step
      </h1>
      <p className="mt-3.5 text-body md:text-lead leading-[1.55] md:leading-[1.6] text-muted-foreground [text-wrap:pretty]">
        Send three quick shots and your fixed price lands today. No site visit, no waiting in for an engineer.
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
          {/* 26px overall, same footprint as the completed step. The halo is the
              outer ring inside that 26px and the core shrinks to make room, so
              the depth costs no space. */}
          <div className="relative flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-primary/15">
            <span className="step-live-ring absolute inset-0 rounded-full border-[1.5px] border-primary/50" aria-hidden="true" />
            <span className="relative flex h-4 w-4 items-center justify-center rounded-full bg-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          </div>
          <div>
            <p className="text-body md:text-lead font-bold text-foreground">Send us three photos</p>
            <p className="mt-0.5 text-body-sm leading-[1.5] text-muted-foreground">
              It takes about a minute on your phone.
            </p>
          </div>
        </div>
      </div>

      <ul className="mt-4 md:mt-5 grid grid-cols-3 gap-2.5 md:gap-3">
        {SHOTS.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="flex flex-col items-center gap-2.5 rounded-lg border border-border bg-secondary p-3.5 md:px-2.5 md:py-4 text-center"
          >
            <Icon className="h-[22px] w-[22px] md:h-6 md:w-6 text-brand-icon" aria-hidden="true" />
            <span className="text-caption md:text-body-sm leading-[1.35] text-muted-foreground">{label}</span>
          </li>
        ))}
      </ul>

      {/* Real anchors, 56px tall: long-press, open in a new tab and the iOS app
          handoff all behave. */}
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          track(EVENTS.WHATSAPP_CLICKED, {
            channel: "whatsapp",
            cta_location: "thank_you_photos",
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
              cta_location: "thank_you_photos",
              lead_id: lead.leadId,
            })
          }
          className="focus-ring flex min-h-[44px] items-center gap-1.5 rounded-md px-2 text-body-sm font-medium text-muted-foreground transition-colors duration-quick hover:text-foreground"
        >
          <Mail className="h-4 w-4 md:h-[17px] md:w-[17px]" aria-hidden="true" />
          <span className="border-b border-field">or email them instead</span>
        </a>
      </div>

      <p className="mt-3.5 text-center text-caption md:text-body-sm leading-[1.5] text-muted-foreground">
        No obligation. Most quotes go out within a few hours.
      </p>
    </div>
  );
}
