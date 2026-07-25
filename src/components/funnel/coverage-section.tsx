import { MapPin, CalendarCheck, Boxes } from "lucide-react";
import { WhatsAppIcon } from "./ui/whatsapp-icon";

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
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-primary">What We Offer</p>
          <h2
            className="mx-auto mt-4 max-w-[760px] text-[2.5rem] font-bold text-foreground md:text-[3.25rem]"
            style={{ fontWeight: 600, lineHeight: "1.06em", letterSpacing: "-0.035em" }}
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
              className="rounded-[22px] border border-border bg-secondary/40 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-[13px]"
                style={{ background: "rgba(199,5,5,0.10)", border: "1px solid rgba(255,90,90,0.25)", color: "#e5484d" }}
              >
                <f.icon className="h-[21px] w-[21px]" strokeWidth={1.6} />
              </div>
              <h3 className="mt-5 text-[17px] font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2.5 text-[14.5px] text-muted-foreground" style={{ lineHeight: "1.6" }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#quote"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-[22px] font-bold uppercase leading-none tracking-[-0.2px] text-primary-foreground transition-all hover:bg-primary/90"
            style={{ fontSize: "14px" }}
          >
            Check Availability
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2.5 rounded-xl border border-border bg-transparent px-[22px] font-bold uppercase leading-none tracking-[-0.2px] text-foreground transition-all hover:bg-secondary/50"
            style={{ fontSize: "14px" }}
          >
            <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
            Talk on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
