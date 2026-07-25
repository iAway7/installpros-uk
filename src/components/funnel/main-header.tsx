"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { WhatsAppIcon } from "./ui/whatsapp-icon";
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

  const linkBase = "flex items-center gap-2 text-sm font-semibold transition-colors md:text-base";
  const linkTone = scrolled ? "text-foreground" : "text-white";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-200 ${
        scrolled ? "border-b border-border/60 bg-white" : "bg-transparent"
      }`}
    >
      <div
        className="container mx-auto flex items-center justify-between px-4 py-4"
        style={{ maxWidth: "1140px" }}
      >
        <a href="/install-quote" className="flex items-center" aria-label="Install Pros">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={scrolled ? "/funnel/installpros-logo-colored-new.svg" : "/funnel/installpros-logo-new.svg"}
            alt="Install Pros"
            className="h-8 md:h-10"
          />
        </a>

        <div className="flex items-center gap-5 md:gap-8">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track(EVENTS.WHATSAPP_CLICKED, { channel: "whatsapp", cta_location: "header" })}
            className={`${linkBase} ${linkTone} hover:text-[#25D366]`}
          >
            <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
            <span className="hidden sm:inline">WhatsApp</span>
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
