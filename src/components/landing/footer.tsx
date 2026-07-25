"use client";

import { Satellite, Mail, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { track, EVENTS } from "@/lib/analytics";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Satellite className="h-4 w-4" />
            </span>
            {siteConfig.name}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Accredited Starlink installation across the UK. Homes, businesses and rural properties.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Services</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href="#benefits" className="hover:text-foreground">Home installation</a></li>
            <li><a href="#benefits" className="hover:text-foreground">Business &amp; failover</a></li>
            <li><a href="#coverage" className="hover:text-foreground">Rural &amp; off-grid</a></li>
            <li><a href="#coverage" className="hover:text-foreground">Marine &amp; mobile</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Company</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href="#process" className="hover:text-foreground">How it works</a></li>
            <li><a href="#faq" className="hover:text-foreground">FAQ</a></li>
            <li><a href="/privacy" className="hover:text-foreground">Privacy policy</a></li>
            <li><a href="/terms" className="hover:text-foreground">Terms</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Get in touch</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href={`tel:${siteConfig.phone}`}
                onClick={() => track(EVENTS.PHONE_CLICKED, { channel: "phone", cta_location: "footer" })}
                className="flex items-center gap-2 hover:text-foreground"
              >
                <Phone className="h-4 w-4" /> {siteConfig.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                onClick={() => track(EVENTS.EMAIL_CLICKED, { channel: "email", cta_location: "footer" })}
                className="flex items-center gap-2 hover:text-foreground"
              >
                <Mail className="h-4 w-4" /> {siteConfig.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Starlink is a trademark of SpaceX. We are an independent installer.</p>
          <p>{siteConfig.domain}</p>
        </div>
      </div>
    </footer>
  );
}
