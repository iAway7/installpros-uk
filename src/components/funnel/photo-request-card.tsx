"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, CloudSun, House, Mail, Router } from "lucide-react";
import { Button } from "@/components/system/button";
import { WhatsAppIcon } from "./ui/whatsapp-icon";
import { track, EVENTS } from "@/lib/analytics";
import { mailtoUrl, photoRequestMessage, whatsappUrl } from "@/lib/funnel/contact";

interface LeadContext {
  name?: string;
  postcode?: string;
  leadId?: string;
}

/** What to photograph. Naming the three shots is the whole point of this step:
 *  "send us some photos" stalls, "the roof or wall" does not. */
const SHOTS = [
  { icon: House, label: "The roof or wall" },
  { icon: Router, label: "Where the router sits" },
  { icon: CloudSun, label: "The clearest sky view" },
];

/**
 * Post-submit card that hands the lead into the WhatsApp photo funnel.
 *
 * The lead is already converted, so this screen has exactly one job: get three
 * photos back without a site visit. It reads the context the funnel already
 * persisted (sessionStorage `quoteFormData`, written by submitLead) plus the
 * `leadId` the redirect carries, and uses them to prefill the message.
 *
 * Both links render valid on the server pass, before any of that context
 * exists, and are upgraded once the effect runs. There is no state in which the
 * buttons are dead or open an empty chat.
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
  }, []);

  const message = photoRequestMessage(lead);
  const waHref = whatsappUrl(message);
  const emailHref = mailtoUrl(
    lead.postcode ? `Photos for my Starlink quote (${lead.postcode})` : "Photos for my Starlink quote",
    `${message}\n\n`,
  );

  return (
    <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-xl border border-border bg-card shadow-raised">
      {/* Dark header. The confirmation lives here so the reassurance reads as
          settled before the page asks for one more thing. */}
      <div className="bg-[#0A0A0A] px-6 py-7">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
          <CheckCircle2 className="h-4 w-4 text-success-bright" aria-hidden="true" />
          <span className="text-body-sm font-medium text-white">Request received</span>
        </p>
        <h1 className="mt-5 text-title font-bold leading-tight text-white">
          One step left for a same-day quote
        </h1>
        <p className="mt-3 text-body-sm leading-relaxed text-white/70">
          Send us a couple of photos of where the dish will go, and we&apos;ll price it and get back to you today.
        </p>
      </div>

      <div className="px-6 py-7">
        <ul className="grid grid-cols-3 gap-3">
          {SHOTS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex flex-col items-center gap-2.5 rounded-lg border border-border bg-secondary p-3 text-center"
            >
              <Icon className="h-5 w-5 text-brand-icon" aria-hidden="true" />
              <span className="text-caption leading-snug text-muted-foreground">{label}</span>
            </li>
          ))}
        </ul>

        {/* size="lg" is the 56px control, comfortably over the 44px iOS
            minimum, and both links are real anchors so long-press, open in new
            tab and the iOS app handoff all behave. */}
        <Button asChild size="lg" className="mt-6 w-full">
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
          >
            <WhatsAppIcon className="h-5 w-5" />
            Send photos on WhatsApp
          </a>
        </Button>

        <Button asChild variant="outline" size="lg" className="mt-3 w-full">
          <a
            href={emailHref}
            onClick={() =>
              track(EVENTS.EMAIL_CLICKED, {
                channel: "email",
                cta_location: "thank_you_photos",
                lead_id: lead.leadId,
              })
            }
          >
            <Mail className="h-5 w-5" />
            Send images by email
          </a>
        </Button>

        <p className="mt-5 text-center text-caption text-muted-foreground">
          No obligation. Most quotes go out within a few hours.
        </p>
      </div>
    </div>
  );
}
