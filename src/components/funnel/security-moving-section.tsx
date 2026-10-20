"use client";

import type { ReactNode } from "react";
import { ArrowRight, CalendarCheck, KeyRound, ScanSearch } from "lucide-react";
import { track, EVENTS } from "@/lib/analytics";
import { SECURITY_REPAIR_EVENT } from "./security-need-step";

/**
 * "Moving in?" for the Ajax landing: a three-step line from before completion
 * to the week of the keys to the previous owner's system.
 *
 * Moving is the largest stated reason to get in touch: 13 of the 53 security
 * buyers who said why were moving in, buying or finishing a new build, 17
 * with renovations (ajax-research/superchat-security-insights.md, sections 8
 * and 9). They ask about timing around completion, marks on fresh paint and
 * Wi-Fi that is not in yet, and 7 of the 39 help requests had moved into a
 * home with the previous owner's system. Added 19 October 2026 next to the
 * comparison, not instead of it: that one answers why chats die (price),
 * this one says who the page is for.
 *
 * The keys step is the dark card, the same language as "Fitted by us". On
 * phones the line runs down the left and the cards lose their boxes.
 *
 * PENDING JORDAN (19 October): "Book it now / around your completion date",
 * "the week you get the keys" and "We take it over or take it out" are not in
 * his answers yet. The page elsewhere says "usually fitted within 7 days".
 * Wi-Fi is left out until he confirms the hub works without it. No "few
 * hours" or "one visit" (Jordan, 20 October: some jobs run over a day).
 */

type Step = { icon: ReactNode; when: string; title: string; body: string; keys?: boolean };

const ICON = "h-5 w-5";

const STEPS: Step[] = [
  {
    icon: <CalendarCheck className={ICON} />,
    when: "Before you complete",
    title: "Book it now",
    body: "We plan the visit around your completion date.",
  },
  {
    icon: <KeyRound className={ICON} />,
    when: "The week you get the keys",
    title: "Fitted and handed over",
    body: "Wireless, so no cables in your walls and nothing on the fresh paint.",
    keys: true,
  },
  {
    icon: <ScanSearch className={ICON} />,
    when: "Found an old system?",
    title: "We take it over or take it out",
    body: "The previous owner's alarm or cameras, sorted.",
  },
];

/**
 * The look, 20 October: Gus saw three side by side and asked for a mix. The
 * nodes are version A's (white circles with a brand icon on a dashed line,
 * the keys step filled red), the cards are version C's (white, no border,
 * rounded, the keys card ringed in red). No black card: he did not like it.
 * Then a short dashed drop joins each icon to its card (his ask, same day).
 */
export function SecurityMovingSection() {
  return (
    <section id="moving" className="w-full scroll-mt-28 bg-secondary py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Moving in?</p>
          <h2 className="mt-4 h2-section text-foreground">
            Secure from the week
            <br className="hidden sm:block" /> you get the keys.
          </h2>
          <p className="mt-5 text-balance text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            Book it around your completion date, and we fit it as you move in.
          </p>
        </div>

        <div className="relative mx-auto mt-12 max-w-md md:mt-16 md:max-w-5xl">
          {/* md and up: one dashed line through the centre of the three icons. */}
          <div
            aria-hidden="true"
            className="absolute left-[16.67%] right-[16.67%] top-6 hidden h-0 border-t border-dashed border-muted-foreground/35 md:block"
          />

          <ol className="md:grid md:grid-cols-3 md:gap-6">
            {STEPS.map((s, i) => (
              <li
                key={s.when}
                className="relative grid grid-cols-[48px_minmax(0,1fr)] gap-4 pb-8 last:pb-0 md:flex md:flex-col md:items-center md:gap-0 md:pb-0"
              >
                {/* Phones: the line runs down to the next icon. */}
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-[23.5px] top-12 w-0 border-l border-dashed border-muted-foreground/35 md:hidden"
                  />
                )}
                <span
                  aria-hidden="true"
                  className={`relative flex h-12 w-12 items-center justify-center rounded-full ${
                    s.keys ? "bg-primary text-primary-foreground shadow-raised" : "border border-border bg-background text-brand-icon"
                  }`}
                >
                  {s.icon}
                </span>
                {/* md and up: a short dashed drop from the icon to its card, red
                    on the keys step to tie the red icon to the red ring. */}
                <span
                  aria-hidden="true"
                  className={`hidden h-5 w-0 border-l border-dashed md:block ${s.keys ? "border-primary/50" : "border-muted-foreground/35"}`}
                />
                <div
                  className={`pt-1 md:w-full md:flex-1 md:rounded-3xl md:bg-background md:p-7 ${
                    s.keys ? "md:ring-2 md:ring-primary/25" : ""
                  }`}
                >
                  <p
                    className={`text-label font-semibold uppercase tracking-[0.14em] ${
                      s.keys ? "text-brand-deep" : "text-muted-foreground/80"
                    }`}
                  >
                    {s.when}
                  </p>
                  <h3 className="mt-1.5 text-balance text-lg font-bold leading-tight text-foreground">{s.title}</h3>
                  <p className="mt-2 text-pretty text-body-sm text-muted-foreground" style={{ lineHeight: "1.55" }}>
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-2 md:mt-12">
          <a
            href="#quote"
            onClick={() => track(EVENTS.CTA_CLICKED, { cta_id: "moving_quote", cta_label: "quote", cta_location: "moving" })}
            className="focus-ring-solid flex h-control-lg w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-primary-foreground transition-colors duration-quick ease-ds hover:bg-brand-hover sm:w-auto"
          >
            Get my free quote
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </a>
          {/* Opens the closing form on its repair path (security-quote-form.tsx). */}
          <a
            href="#quote"
            onClick={() => {
              track(EVENTS.CTA_CLICKED, { cta_id: "moving_inherited", cta_label: "inherited_system", cta_location: "moving" });
              window.dispatchEvent(new Event(SECURITY_REPAIR_EVENT));
            }}
            className="focus-ring inline-flex min-h-[44px] items-center rounded-md px-2 text-body-sm font-medium text-muted-foreground underline underline-offset-4 transition-colors duration-quick ease-ds hover:text-foreground"
          >
            Inherited a system that isn&apos;t working?
          </a>
        </div>
      </div>
    </section>
  );
}
