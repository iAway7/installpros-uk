"use client";

import { Star, ShieldCheck, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CoverageChecker } from "./coverage-checker";
import { WhatsAppButton } from "./cta-button";
import { useQuote } from "./quote-context";
import { whatsappLink } from "@/lib/site-config";

export function Hero() {
  const { set } = useQuote();

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-secondary/60 to-background">
      {/* subtle starfield */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20px 30px, hsl(var(--foreground)) 50%, transparent), radial-gradient(1px 1px at 120px 80px, hsl(var(--foreground)) 50%, transparent), radial-gradient(1.5px 1.5px at 200px 150px, hsl(var(--foreground)) 50%, transparent)",
          backgroundSize: "240px 240px",
        }}
      />
      <div className="container relative grid gap-10 py-12 lg:grid-cols-2 lg:items-center lg:gap-12 lg:py-20">
        <div className="animate-fade-up">
          <Badge variant="success" className="mb-4 gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" /> Accredited UK installers
          </Badge>
          <h1 className="text-balance text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Fast Starlink internet, <span className="text-primary">professionally installed</span> anywhere in the UK
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-lg text-muted-foreground">
            Get speeds up to 250 Mbps where fibre and 4G can&apos;t reach. Check your coverage in seconds and book a fully-fitted
            install — homes, businesses and rural properties.
          </p>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-accent" /> Same-day setup
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-success" /> 12-month guarantee
            </li>
            <li className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 4.9/5 from 2,400+ installs
            </li>
          </ul>

          <div className="mt-6">
            <WhatsAppButton href={whatsappLink()} ctaLocation="hero" size="lg">
              Prefer to chat? WhatsApp us
            </WhatsAppButton>
          </div>
        </div>

        <div className="animate-fade-up lg:pl-4" style={{ animationDelay: "120ms" }}>
          <CoverageChecker onProceed={(ctx) => set({ postcode: ctx.postcode, installType: ctx.installType })} />
        </div>
      </div>
    </section>
  );
}
