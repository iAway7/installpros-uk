"use client";

import { Phone } from "lucide-react";
import { WhatsAppIcon } from "./ui/whatsapp-icon";
import { InstallProsLogo } from "./ui/installpros-logo";
import { track, EVENTS } from "@/lib/analytics";
import { SUPPORT_PHONE, SUPPORT_PHONE_HREF, WHATSAPP_URL } from "@/lib/funnel/contact";

/**
 * The funnel header in its light state, as a static bar.
 *
 * MainHeader is the same anatomy but it is fixed, transparent over the hero and
 * only turns white on scroll. Post-submit pages have no hero to sit over, so
 * they need the resting state without the scroll listener or the overlay
 * positioning. Same logo, same two contact links, same 48px tap targets.
 */
export function FunnelHeaderLight({ ctaLocation = "thank_you" }: { ctaLocation?: string }) {
  const linkBase =
    "flex min-h-[48px] items-center gap-2 text-body font-semibold text-foreground transition-colors duration-quick";

  return (
    <header className="border-b border-border/60 bg-white">
      <div className="container mx-auto flex items-center justify-between gap-4 py-3 md:py-4" style={{ maxWidth: "1140px" }}>
        <a href="/install-quote" className="flex min-h-[48px] items-center" aria-label="Install Pros">
          <InstallProsLogo className="h-7 w-auto text-black md:h-10" />
        </a>

        <div className="flex items-center gap-4 md:gap-8">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track(EVENTS.WHATSAPP_CLICKED, { channel: "whatsapp", cta_location: `${ctaLocation}_header` })}
            className={`${linkBase} min-w-[48px] justify-center hover:text-whatsapp sm:min-w-0 sm:justify-start`}
          >
            <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
            {/* sr-only rather than hidden, so the link keeps an accessible name
                on mobile where the label has no room. */}
            <span className="sr-only sm:not-sr-only sm:inline">WhatsApp</span>
          </a>
          <a
            href={SUPPORT_PHONE_HREF}
            onClick={() => track(EVENTS.PHONE_CLICKED, { channel: "phone", cta_location: `${ctaLocation}_header` })}
            className={`${linkBase} hover:text-primary`}
          >
            <Phone className="h-4 w-4 md:h-5 md:w-5" />
            <span>{SUPPORT_PHONE}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
