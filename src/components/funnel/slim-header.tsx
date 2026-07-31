"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { WhatsAppIcon } from "./ui/whatsapp-icon";
import { track, EVENTS } from "@/lib/analytics";

const WHATSAPP_URL = "https://wa.me/447446112343";

/**
 * A/B variant header for /starlink-installation: logo + phone number ONLY.
 * On /install-quote, nav links are among the top-5 most-clicked elements —
 * i.e. an exit route out of the funnel. This variant removes them entirely.
 */
export function SlimHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-white transition-shadow ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3" style={{ maxWidth: "1140px" }}>
        <a href="/starlink-installation" className="flex items-center" aria-label="InstallPros">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/funnel/installpros-logo-colored-new.svg" alt="Install Pros" className="h-8 md:h-10" />
        </a>
        <div className="flex items-center gap-2 md:gap-6">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track(EVENTS.WHATSAPP_CLICKED, { channel: "whatsapp", cta_location: "header_slim" })}
            className="flex items-center justify-center rounded-xl bg-[#25D366] p-3 text-white md:gap-2 md:rounded-none md:bg-transparent md:p-0 md:text-base md:font-semibold md:text-foreground md:hover:text-whatsapp"
            aria-label="Message us on WhatsApp"
          >
            <WhatsAppIcon className="h-5 w-5 md:h-5 md:w-5 md:text-whatsapp" />
            <span className="hidden md:inline">WhatsApp</span>
          </a>
          <a
            href="tel:02033977003"
            onClick={() => track(EVENTS.PHONE_CLICKED, { channel: "phone", cta_location: "header_slim" })}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground md:bg-transparent md:px-0 md:py-0 md:text-base md:font-semibold md:text-foreground md:hover:text-primary"
            aria-label="Call InstallPros"
          >
            <Phone className="h-4 w-4 md:h-5 md:w-5 md:text-primary" /> <span className="md:inline">020 3397 7003</span>
          </a>
        </div>
      </div>
    </header>
  );
}
