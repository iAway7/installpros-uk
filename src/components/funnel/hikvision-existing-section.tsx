"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, KeyRound, Plus, Wrench } from "lucide-react";
import { track, EVENTS } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/funnel/contact";
import { WhatsAppIcon } from "./ui/whatsapp-icon";
import type { HikvisionIntent } from "./hikvision-need-step";
import { LazyHikvisionQuoteForm } from "./hikvision-lazy";

/**
 * "Already have cameras?", where the Ajax page has "Moving in?"
 * (security-moving-section.tsx: same nodes on a dashed line, same white
 * cards, the middle one ringed in red).
 *
 * Why it exists: owners of a camera system are nearly as many as buyers in
 * the chats (57 against 81), 39 of them Hikvision or HiLook, and the worst
 * served: 12 of the 41 asking for help never got a reply. What they need
 * repeats: no logins after moving in, an installer who vanished with the
 * admin account, offline after a new router, a dead recorder.
 *
 * THE WHOLE SECTION WAITS ON JORDAN'S QUESTION 4. If they don't take these
 * jobs, it comes out, and "Fix my system" leaves the form. No call-out
 * price, ever. "In your name" and "the admin account" also wait on question 6.
 *
 * Each card's button asks for the postcode right here, the way the planners'
 * "Fix my system" does (Gus, 30 October; it used to scroll down to the
 * closing form): the heading becomes the card's and the form follows, with
 * the card's intent and form_name hikvision_existing. Back returns to the
 * cards. The WhatsApp line under them is for anyone who would rather send a
 * photo of the recorder first.
 */

type Card = {
  icon: ReactNode;
  intent: HikvisionIntent;
  title: string;
  body: ReactNode;
  cta: string;
  ring?: boolean;
  /** The heading and line once its button is tapped. */
  ask: string;
  askLine: string;
};

const ICON = "h-5 w-5";

const CARDS: Card[] = [
  {
    icon: <Plus className={ICON} />,
    intent: "add",
    title: "Add cameras",
    body: "More cameras on the recorder you have, if it has room, or a bigger one if it doesn't.",
    cta: "Add to mine",
    ask: "Let's add to your system.",
    askLine: "On the recorder you have, or a bigger one if it's full.",
  },
  {
    icon: <Wrench className={ICON} />,
    intent: "repair",
    title: "Fix it",
    body: "Offline after a new router, a recorder that died, a camera with no picture.",
    cta: "Fix my system",
    ring: true,
    ask: "Let's get it working.",
    askLine: "We tell you what it needs before anyone comes out.",
  },
  {
    icon: <KeyRound className={ICON} />,
    intent: "repair",
    title: "Take it over",
    body: "Moved in with no logins, or the installer has gone? We reset it, set it up in your name and hand you the admin account.",
    cta: "Take it over",
    ask: "Let's put it in your name.",
    askLine: "We reset it and hand you the admin account.",
  },
];

export function HikvisionExistingSection() {
  const [chosen, setChosen] = useState<Card | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  // The form is shorter than the cards; keep the heading in view, as the
  // planners do on each step.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const el = sectionRef.current;
    if (!el || el.getBoundingClientRect().top >= 0) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [chosen]);

  function choose(c: Card) {
    track(EVENTS.CTA_CLICKED, { cta_id: `existing_${c.intent}`, cta_label: c.title, cta_location: "existing" });
    setChosen(c);
  }

  return (
    // White (Gus, 28 October; it was a dark band), between the grey
    // equipment and business sections, with grey cards like the Ajax
    // "Moving in?" section inverted.
    <section ref={sectionRef} id="existing" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto">
        <div
          key={chosen?.title ?? "cards"}
          className={`mx-auto max-w-2xl text-center ${chosen ? "animate-[slideInRight_0.3s_ease-out] motion-reduce:animate-none" : ""}`}
        >
          <p className="eyebrow">Already have cameras?</p>
          <h2 className="mt-4 text-balance h2-section text-foreground">
            {chosen ? (
              chosen.ask
            ) : (
              <>
                The system you have,
                <br className="hidden sm:block" /> working again.
              </>
            )}
          </h2>
          <p className="mt-5 text-balance text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            {chosen ? chosen.askLine : "Yes, even if someone else fitted it."}
          </p>
        </div>

        {chosen ? (
          <div className="mx-auto mt-8 max-w-md md:mt-10">
            <LazyHikvisionQuoteForm
              key={chosen.title}
              tone="light"
              presetIntent={chosen.intent}
              onBack={() => setChosen(null)}
              showStepLabels={false}
              defaultService="security"
              skipServiceStep
              formName="hikvision_existing"
            />
          </div>
        ) : (
          <>
            <div className="relative mx-auto mt-12 max-w-md md:mt-16 md:max-w-5xl">
              <div
                aria-hidden="true"
                className="absolute left-[16.67%] right-[16.67%] top-6 hidden h-0 border-t border-dashed border-muted-foreground/35 md:block"
              />
              <ol className="md:grid md:grid-cols-3 md:gap-6">
                {CARDS.map((c, i) => (
                  <li
                    key={c.title}
                    className="relative grid grid-cols-[48px_minmax(0,1fr)] gap-4 pb-8 last:pb-0 md:flex md:flex-col md:items-center md:gap-0 md:pb-0"
                  >
                    {i < CARDS.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-[23.5px] top-12 w-0 border-l border-dashed border-muted-foreground/35 md:hidden"
                      />
                    )}
                    <span
                      aria-hidden="true"
                      className={`relative flex h-12 w-12 items-center justify-center rounded-full ${
                        c.ring ? "bg-primary text-primary-foreground shadow-raised" : "border border-border bg-background text-brand-icon"
                      }`}
                    >
                      {c.icon}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`hidden h-5 w-0 border-l border-dashed md:block ${c.ring ? "border-primary/50" : "border-muted-foreground/35"}`}
                    />
                    <div
                      className={`flex flex-col pt-1 md:w-full md:flex-1 md:rounded-3xl md:bg-secondary md:p-7 ${c.ring ? "md:ring-2 md:ring-primary/25" : ""}`}
                    >
                      <h3 className="text-balance text-lg font-bold leading-tight text-foreground">{c.title}</h3>
                      <p className="mt-2 flex-1 text-pretty text-body-sm text-muted-foreground" style={{ lineHeight: "1.55" }}>
                        {c.body}
                      </p>
                      <button
                        type="button"
                        onClick={() => choose(c)}
                        className="focus-ring mt-4 inline-flex min-h-[44px] items-center gap-1.5 self-start rounded-md text-body-sm font-semibold text-primary underline-offset-4 hover:underline"
                      >
                        {c.cta}
                        <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-4 md:mt-12">
              {/* What owners needed before booking (57 threads): to know whether
                  it can be fixed and what it takes before anyone comes. A photo
                  of the label tells the model and the free channels. */}
              <p className="text-balance text-center text-body text-muted-foreground">
                Start with a photo of the label on your recorder. We tell you what it needs before anyone comes out.
              </p>
              <a
                href={whatsappUrl("Hi, I have a Hikvision system and need help with it. Here is a photo of the recorder's label.")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track(EVENTS.CTA_CLICKED, { cta_id: "existing_whatsapp", cta_label: "whatsapp", cta_location: "existing" })}
                className="focus-ring-solid flex h-control-lg w-full items-center justify-center gap-2 rounded-lg border border-foreground/20 bg-transparent px-6 text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-foreground transition-colors duration-quick ease-ds hover:bg-secondary sm:w-auto"
              >
                <WhatsAppIcon className="h-[19px] w-[19px]" />
                Tell us what you have
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
