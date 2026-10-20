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
 * Three looks for the same section, 20 October: Gus liked the layout but not
 * the black card, the colours or the sizes. TEMPORARY until he picks one; then
 * the other two, the `variant` and `label` props and this table go.
 *
 *   a  light cards, the keys step in brand red (filled icon, red outline)
 *   b  no cards, bigger icons in a soft red tint, larger type, white section
 *   c  numbered steps, soft white cards, the keys card ringed in red
 */
type Variant = "a" | "b" | "c";

type Look = {
  section: string;
  node: string;
  nodeIdle: string;
  nodeKeys: string;
  /** Phones: icon column width, same as the node. */
  cols: string;
  /** md and up: the line through the nodes (position at node centre, style). */
  railMd: string;
  /** Phones: the line down to the next node (x at node centre, starts under it). */
  railSm: string;
  content: string;
  contentKeys: string;
  whenKeys: string;
  title: string;
  body: string;
  /** Number in the node, icon moved into the text. */
  numbered?: boolean;
};

const LOOKS: Record<Variant, Look> = {
  a: {
    section: "bg-secondary",
    node: "h-12 w-12 rounded-full",
    nodeIdle: "border border-border bg-background text-brand-icon",
    nodeKeys: "bg-primary text-primary-foreground shadow-raised",
    cols: "grid-cols-[48px_minmax(0,1fr)]",
    railMd: "top-6 h-0 border-t border-dashed border-border",
    railSm: "left-[23.5px] top-12 w-0 border-l border-dashed border-border",
    content: "md:mt-6 md:rounded-2xl md:border md:border-border md:bg-background md:p-7",
    contentKeys: "md:mt-6 md:rounded-2xl md:border-2 md:border-brand-soft md:bg-background md:p-7 md:shadow-raised",
    whenKeys: "text-brand-deep",
    title: "text-xl",
    body: "text-body",
  },
  b: {
    section: "bg-background",
    node: "h-16 w-16 rounded-full [&>svg]:h-6 [&>svg]:w-6",
    nodeIdle: "bg-primary/10 text-primary",
    nodeKeys: "bg-primary text-primary-foreground ring-8 ring-primary/10",
    cols: "grid-cols-[64px_minmax(0,1fr)]",
    railMd: "top-8 h-0.5 bg-primary/15",
    railSm: "left-[31px] top-16 w-0.5 bg-primary/15",
    content: "md:mx-auto md:mt-7 md:max-w-[17rem] md:text-center",
    contentKeys: "md:mx-auto md:mt-7 md:max-w-[17rem] md:text-center",
    whenKeys: "text-brand-deep",
    title: "text-2xl",
    body: "text-body",
  },
  c: {
    section: "bg-secondary",
    node: "h-11 w-11 rounded-full text-body font-bold tabular-nums",
    nodeIdle: "border border-border bg-background text-foreground",
    nodeKeys: "bg-primary text-primary-foreground",
    cols: "grid-cols-[44px_minmax(0,1fr)]",
    railMd: "top-[22px] h-px bg-border",
    railSm: "left-[21.5px] top-11 w-px bg-border",
    content: "md:mt-5 md:rounded-3xl md:bg-background md:p-7",
    contentKeys: "md:mt-5 md:rounded-3xl md:bg-background md:p-7 md:ring-2 md:ring-primary/25",
    whenKeys: "text-brand-deep",
    title: "text-lg",
    body: "text-body-sm",
    numbered: true,
  },
};

export function SecurityMovingSection({ variant = "a", label }: { variant?: Variant; label?: string }) {
  const L = LOOKS[variant];
  return (
    <section id={variant === "a" ? "moving" : `moving-${variant}`} className={`w-full scroll-mt-28 py-16 md:py-24 ${L.section}`}>
      <div className="container mx-auto">
        {label && (
          <p className="mx-auto mb-8 w-fit rounded-full border border-dashed border-border px-3 py-1 text-caption font-semibold text-muted-foreground">
            {label}
          </p>
        )}
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
          {/* md and up: one line through the three nodes. */}
          <div aria-hidden="true" className={`absolute left-[16.67%] right-[16.67%] hidden md:block ${L.railMd}`} />

          <ol className="md:grid md:grid-cols-3 md:gap-6">
            {STEPS.map((s, i) => (
              <li
                key={s.when}
                className={`relative grid gap-4 pb-8 last:pb-0 md:flex md:flex-col md:items-center md:gap-0 md:pb-0 ${L.cols}`}
              >
                {/* Phones: the line runs down to the next node. */}
                {i < STEPS.length - 1 && <span aria-hidden="true" className={`absolute bottom-0 md:hidden ${L.railSm}`} />}
                <span
                  aria-hidden="true"
                  className={`relative flex items-center justify-center ${L.node} ${s.keys ? L.nodeKeys : L.nodeIdle}`}
                >
                  {L.numbered ? i + 1 : s.icon}
                </span>
                <div className={`pt-1 md:w-full md:flex-1 ${s.keys ? L.contentKeys : L.content}`}>
                  {L.numbered && (
                    <span aria-hidden="true" className="mb-3 hidden text-brand-icon md:block">
                      {s.icon}
                    </span>
                  )}
                  <p
                    className={`text-label font-semibold uppercase tracking-[0.14em] ${
                      s.keys ? L.whenKeys : "text-muted-foreground/80"
                    }`}
                  >
                    {s.when}
                  </p>
                  <h3 className={`mt-1.5 text-balance font-bold leading-tight text-foreground ${L.title}`}>{s.title}</h3>
                  <p className={`mt-2 text-pretty text-muted-foreground ${L.body}`} style={{ lineHeight: "1.55" }}>
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
