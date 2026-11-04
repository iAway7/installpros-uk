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
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:items-center md:gap-14">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-reveal
            src="/funnel/managed-support-1400.webp"
            srcSet="/funnel/managed-support-900.webp 900w, /funnel/managed-support-1400.webp 1400w"
            sizes="(min-width: 768px) 50vw, 100vw"
            alt="An engineer on the phone beside his van in a muddy farmyard"
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full rounded-2xl object-cover md:order-2 md:aspect-auto md:h-full"
          />
          <div data-reveal style={{ transitionDelay: "120ms" }}>
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

            <div className="mt-8 rounded-2xl bg-[#0e1013] p-6 text-white sm:p-8">
              <p className="text-body-sm font-medium text-white/60">Your number for everything</p>
              <a
                href={SUPPORT_PHONE_HREF}
                className="focus-ring mt-2 inline-flex items-center gap-3 rounded-md text-[28px] font-bold tabular-nums tracking-[-0.01em] text-white sm:text-[34px]"
              >
                <Phone aria-hidden="true" className="h-6 w-6 text-[#ff6a5f]" />
                {SUPPORT_PHONE}
              </a>
              <p className="mt-3 text-pretty text-body-sm text-white/70" style={{ lineHeight: "1.55" }}>
                Not a chat bot, not a ticket. The same team, on the phone or on WhatsApp.
              </p>
              <a
                href={whatsappUrl("Hi, I'd like to talk about managed Starlink for my business.")}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring-solid mt-6 flex h-control-lg w-full items-center justify-center gap-2 rounded-lg bg-white px-6 text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-foreground transition-colors duration-quick ease-ds hover:bg-white/90"
              >
                <WhatsAppIcon className="h-[19px] w-[19px]" />
                Message us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
