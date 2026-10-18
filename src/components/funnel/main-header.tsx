"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { WhatsAppIcon } from "./ui/whatsapp-icon";
import { InstallProsLogo } from "./ui/installpros-logo";
import { track, EVENTS } from "@/lib/analytics";

const WHATSAPP_URL = "https://wa.me/447446112343";

/**
 * Funnel header: logo + WhatsApp + phone only. Transparent white-text overlay
 * while over the dark hero; switches to a solid white bar with dark text and
 * the colored logo once the page scrolls, so it stays readable everywhere.
 */
export function MainHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // min-h/min-w [48px] keeps every tap target at the 48×48 thumb-friendly minimum.
  const linkBase = "flex min-h-[48px] items-center gap-2 text-body font-semibold transition-colors";
  const linkTone = scrolled ? "text-foreground" : "text-white";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-card ease-ds ${
        scrolled ? "border-b border-border/60 bg-white" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4">
        <a href="/install-quote" className="flex min-h-[48px] min-w-0 shrink items-center" aria-label="Install Pros">
          {/* Inline SVG, not <img src>: this is the LCP element and as a file it
              put a network round trip on the critical path. Swapping colour with
              a text-* class also removes the second download that used to happen
              the moment the user scrolled and the header went white.
              Sized by width on mobile: the lockup is wider than its height
              suggests, and at h-8 it left no room for the phone link at 360px.
              w-32 is the footprint the previous logo had there.

              THE LOGO IS WHAT GIVES WAY. Measured 2026-10-18: the row needs
              345px at 375 and has 343, so the phone number wrapped to two
              lines on every 375 and 360 phone (hidden inside the link's 48px
              minimum) and to three at 320, where the header grew to 104px.
              The number now never wraps; this link can shrink (min-w-0) and
              the SVG follows it (max-w-full), so at 375 the logo loses 2px, at
              360 about 17, and under 350 the number steps down to its icon
              before the logo gets too small to read. */}
          <InstallProsLogo
            className={`h-auto w-32 max-w-full transition-colors duration-card ease-ds md:h-10 md:w-auto md:max-w-none ${
              scrolled ? "text-black" : "text-white"
            }`}
          />
        </a>

        <div className="flex shrink-0 items-center gap-5 md:gap-8">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track(EVENTS.WHATSAPP_CLICKED, { channel: "whatsapp", cta_location: "header" })}
            className={`${linkBase} ${linkTone} min-w-[48px] justify-center hover:text-whatsapp sm:min-w-0 sm:justify-start`}
          >
            <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
            {/* Not `hidden sm:inline`: `display:none` drops the text from the
                accessibility tree, leaving this link with no accessible name on
                mobile — where most of the traffic is. `sr-only` keeps it
                announced at every width and shows it from `sm` up. */}
            <span className="sr-only sm:not-sr-only sm:inline">WhatsApp</span>
          </a>
          <a
            href="tel:02033977003"
            onClick={() => track(EVENTS.PHONE_CLICKED, { channel: "phone", cta_location: "header" })}
            className={`${linkBase} ${linkTone} min-w-[48px] justify-center min-[350px]:min-w-0 min-[350px]:justify-start ${
              scrolled ? "hover:text-primary" : "hover:text-white/80"
            }`}
          >
            <Phone className="h-4 w-4 md:h-5 md:w-5" />
            {/* Same pattern as the WhatsApp label: sr-only under 350px keeps
                the number in the accessible name while only the icon shows.
                not-sr-only resets white-space to normal, hence the nowrap
                at the same breakpoint. */}
            <span className="sr-only min-[350px]:not-sr-only min-[350px]:inline min-[350px]:whitespace-nowrap">
              020 3397 7003
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
