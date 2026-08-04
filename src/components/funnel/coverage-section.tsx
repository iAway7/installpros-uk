import { MapPin, CalendarCheck, Boxes } from "lucide-react";
import { WhatsAppIcon } from "./ui/whatsapp-icon";
import { FunnelButton } from "@/components/system/funnel-button";

const WHATSAPP_URL = "https://wa.me/447446112343";

const FEATURES = [
  {
    icon: MapPin,
    title: "Nationwide Coverage",
    description:
      "Certified engineers right across the UK — mainland, islands and the rural sites others won't reach.",
  },
  {
    icon: CalendarCheck,
    title: "Same-Week Installation",
    description:
      "Book today and we're often at your door within the week, with clear communication every step.",
  },
  {
    icon: Boxes,
    title: "Every Install Type",
    description:
      "Residential, commercial, marine and mobile installations — one team handles them all.",
  },
];

export function CoverageSection() {
  return (
    <section className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          <p className="eyebrow">What We Offer</p>
          <h2
            className="mx-auto mt-4 max-w-[760px] h2-section text-foreground"
          >
            Any property, anywhere — connected this week.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            One certified team for residential, commercial, marine and mobile installs across the UK.
          </p>
        </div>

        <div className="mt-12 grid gap-3.5 md:mt-[70px] md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-[22px] border border-border bg-secondary/40 p-8 transition-all duration-450 ease-ds hover:-translate-y-[5px] hover:border-brand-soft/35"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-[13px] border border-brand-soft/25 bg-primary/10 text-brand-icon"
              >
                <f.icon className="h-[21px] w-[21px]" strokeWidth={1.6} />
              </div>
              <h3 className="mt-5 text-[17px] font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2.5 text-[14px] text-muted-foreground" style={{ lineHeight: "1.6" }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {/* Both CTAs go through FunnelButton so there is exactly one button
              spec on the page. They used to be hand-rolled <a> tags at 14px
              while every other button rendered at 16px. */}
          <FunnelButton asChild>
            <a href="#quote">Check Availability</a>
          </FunnelButton>
          <FunnelButton asChild variant="outline">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
              Talk on WhatsApp
            </a>
          </FunnelButton>
        </div>
      </div>
    </section>
  );
}
