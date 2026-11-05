import { Check, Phone } from "lucide-react";
import { SUPPORT_PHONE, SUPPORT_PHONE_HREF, whatsappUrl } from "@/lib/funnel/contact";
import { WhatsAppIcon } from "./ui/whatsapp-icon";

/**
 * The page's main promise (managed-research, sections 1 and 4): what managed
 * customers bought was one company that answers and owns the fault, and what
 * went wrong was exactly that: "We have a paid managed service but can't find
 * a contact number?", "I thought your fully managed service included sorting
 * problems out". 14 of 15 competitor pages give no real hours or person.
 *
 * Assumes Will's question 12 (a support line, its hours, who answers): no
 * hours and no "24/7" until he says. The number is the company's main line,
 * the one on every page. Photograph: Gus's render, 4 November (prompt 2,
 * second round): an engineer on the phone by his van in a farmyard, cropped
 * to 4:3 around him.
 */

const POINTS = [
  "Call or message the team that fitted it.",
  "When it drops, we find out if it's Starlink, the router or the WiFi.",
  "If it needs a visit, we come out.",
];

export function ManagedPersonSection() {
  return (
    <section id="support" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-6">
          {/* The number sits on the bottom of the photo over a dark gradient,
              instead of in a dark box of its own (Gus, 4 November). */}
          <div
            data-reveal
            className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#0e1013] sm:aspect-[16/10] lg:order-2 lg:aspect-auto lg:min-h-[660px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/funnel/managed-support-1400.webp"
              srcSet="/funnel/managed-support-900.webp 900w, /funnel/managed-support-1400.webp 1400w"
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt="An engineer on the phone beside his van in a muddy farmyard"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(14,16,19,0.55) 65%, rgba(14,16,19,0.9))" }}
            />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
              <p className="text-body-sm font-medium text-white/75">Your number for everything</p>
              <a
                href={SUPPORT_PHONE_HREF}
                className="focus-ring mt-1.5 inline-flex items-center gap-2.5 whitespace-nowrap rounded-md text-[26px] font-bold tabular-nums tracking-[-0.01em] text-white sm:gap-3 sm:text-[34px]"
              >
                <Phone aria-hidden="true" className="h-6 w-6 text-[#ff6a5f]" />
                {SUPPORT_PHONE}
              </a>
            </div>
          </div>

          {/* Its own card, as tall as the photo and with the same radius (Gus,
              4 November). Side by side from lg: between 768 and 1024 the
              columns were too narrow and the heading broke into four lines. */}
          <div
            data-reveal
            style={{ transitionDelay: "120ms" }}
            className="flex flex-col rounded-2xl bg-secondary p-5 sm:p-8 md:p-10"
          >
            <p className="eyebrow">Support</p>
            <h2 className="mt-4 text-balance h2-section text-foreground">One number. A person answers.</h2>
            <ul className="mt-6 space-y-3">
              {POINTS.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <Check aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  <span className="text-pretty text-body text-foreground md:text-lg" style={{ lineHeight: "1.5" }}>
                    {p}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-pretty text-body text-muted-foreground lg:mt-auto lg:pt-8" style={{ lineHeight: "1.55" }}>
              Not a chat bot, not a ticket. The same team, on the phone or on WhatsApp.
            </p>
            <a
              href={whatsappUrl("Hi, I'd like to talk about managed Starlink for my business.")}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring-solid mt-5 flex h-control-lg w-full items-center justify-center gap-2 rounded-lg border border-foreground/20 bg-background px-6 text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-foreground transition-colors duration-quick ease-ds hover:bg-background/70 sm:w-auto sm:self-start"
            >
              <WhatsAppIcon className="h-[19px] w-[19px]" />
              Message us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
