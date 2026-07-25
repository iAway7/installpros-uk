"use client";

import { Satellite, Phone } from "lucide-react";
import { siteConfig, whatsappLink } from "@/lib/site-config";
import { CtaButton, WhatsAppButton } from "./cta-button";
import { track, EVENTS } from "@/lib/analytics";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-bold" aria-label={`${siteConfig.name} home`}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Satellite className="h-5 w-5" />
          </span>
          <span className="text-lg">
            {siteConfig.name}
            <span className="text-primary">.</span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex" aria-label="Primary">
          <a href="#benefits" className="text-muted-foreground transition-colors hover:text-foreground">
            Why Starlink
          </a>
          <a href="#process" className="text-muted-foreground transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="#coverage" className="text-muted-foreground transition-colors hover:text-foreground">
            Coverage
          </a>
          <a href="#faq" className="text-muted-foreground transition-colors hover:text-foreground">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${siteConfig.phone}`}
            onClick={() => track(EVENTS.PHONE_CLICKED, { channel: "phone", cta_location: "header" })}
            className="hidden items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:flex"
            aria-label="Call us"
          >
            <Phone className="h-4 w-4" /> {siteConfig.phone}
          </a>
          <WhatsAppButton href={whatsappLink()} ctaLocation="header" size="sm" className="hidden sm:inline-flex">
            WhatsApp
          </WhatsAppButton>
          <CtaButton ctaId="header_quote" ctaLabel="Get a quote" ctaLocation="header" href="#quote" size="sm">
            Get a quote
          </CtaButton>
        </div>
      </div>
    </header>
  );
}
