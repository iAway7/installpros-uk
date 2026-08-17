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
  const linkBase = "flex min-h-[48px] items-center gap-2 text-sm font-semibold transition-colors md:text-base";
  const linkTone = scrolled ? "text-foreground" : "text-white";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-card ease-ds ${
        scrolled ? "border-b border-border/60 bg-white" : "bg-transparent"
      }`}
    >
      <div
        className="container mx-auto flex items-center justify-between py-4"
        style={{ maxWidth: "1140px" }}
      >
        <a href="/install-quote" className="flex min-h-[48px] items-center" aria-label="Install Pros">
          {/* Inline SVG, not <img src>: this is the LCP element and as a file it
              put a network round trip on the critical path. Swapping colour with
              a text-* class also removes the second download that used to happen
              the moment the user scrolled and the header went white. */}
          <InstallProsLogo
            className={`h-8 w-auto transition-colors duration-card ease-ds md:h-10 ${
              scrolled ? "text-black" : "text-white"
            }`}
          />
        </a>

        <div className="flex items-center gap-5 md:gap-8">
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
            className={`${linkBase} ${linkTone} ${scrolled ? "hover:text-primary" : "hover:text-white/80"}`}
          >
            <Phone className="h-4 w-4 md:h-5 md:w-5" />
            <span>020 3397 7003</span>
          </a>
        </div>
      </div>
    </header>
  );
}
