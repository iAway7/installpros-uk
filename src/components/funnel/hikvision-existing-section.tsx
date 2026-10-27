"use client";

import type { ReactNode } from "react";
import { ArrowRight, KeyRound, Plus, Wrench } from "lucide-react";
import { track, EVENTS } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/funnel/contact";
import { WhatsAppIcon } from "./ui/whatsapp-icon";
import { HIKVISION_INTENT_EVENT, type HikvisionIntent } from "./hikvision-need-step";
import { Gap } from "./hikvision-gap";

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
 * Each card's button opens the closing form on its chip
 * (HIKVISION_INTENT_EVENT); the WhatsApp line under them is for anyone who
 * would rather send a photo of the recorder first.
 */

type Card = { icon: ReactNode; intent: HikvisionIntent; title: string; body: ReactNode; cta: string; ring?: boolean };

const ICON = "h-5 w-5";

const CARDS: Card[] = [
  {
    icon: <Plus className={ICON} />,
    intent: "add",
    title: "Add cameras",
    body: "More cameras on the recorder you have, if it has room, or a bigger one if it doesn't.",
    cta: "Add to mine",
  },
  {
    icon: <Wrench className={ICON} />,
    intent: "repair",
    title: "Fix it",
    body: "Offline after a new router, a recorder that died, a camera with no picture.",
    cta: "Fix my system",
    ring: true,
  },
  {
    icon: <KeyRound className={ICON} />,
    intent: "repair",
    title: "Take it over",
    body: (
      <Gap q="Q6" tone="dark">
        Moved in with no logins, or the installer has gone? We reset it, set it up in your name and hand you the admin
        account.
      </Gap>
    ),
    cta: "Take it over",
  },
];

function openForm(intent: HikvisionIntent, title: string) {
  track(EVENTS.CTA_CLICKED, { cta_id: `existing_${intent}`, cta_label: title, cta_location: "existing" });
  window.dispatchEvent(new CustomEvent<HikvisionIntent>(HIKVISION_INTENT_EVENT, { detail: intent }));
}

export function HikvisionExistingSection() {
  return (
    // Full width and dark, like the hero, the night section and the wired
    // section (Gus, 27 October). "For businesses" sits between this and the
    // wired section so two dark bands never run together.
    <section id="existing" className="w-full scroll-mt-28 bg-[#0d1b2a] py-16 text-white md:py-24">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow !text-[#ff6a5f]">Already have cameras?</p>
          <h2 className="mt-4 h2-section text-white">
            The system you have,
            <br className="hidden sm:block" /> working again.
          </h2>
          <p className="mt-5 text-balance text-body text-white/70 md:text-lg" style={{ lineHeight: "1.6" }}>
            <Gap q="Q4" tone="dark">Yes, even if someone else fitted it.</Gap>
          </p>
        </div>

        <div className="relative mx-auto mt-12 max-w-md md:mt-16 md:max-w-5xl">
          <div
            aria-hidden="true"
            className="absolute left-[16.67%] right-[16.67%] top-6 hidden h-0 border-t border-dashed border-white/20 md:block"
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
                    className="absolute bottom-0 left-[23.5px] top-12 w-0 border-l border-dashed border-white/20 md:hidden"
                  />
                )}
                <span
                  aria-hidden="true"
                  className={`relative flex h-12 w-12 items-center justify-center rounded-full ${
                    c.ring ? "bg-primary text-primary-foreground shadow-raised" : "border border-white/15 bg-white/[0.06] text-white"
                  }`}
                >
                  {c.icon}
                </span>
                <span
                  aria-hidden="true"
                  className={`hidden h-5 w-0 border-l border-dashed md:block ${c.ring ? "border-primary/70" : "border-white/20"}`}
                />
                <div
                  className={`flex flex-col pt-1 md:w-full md:flex-1 md:rounded-3xl md:bg-white/[0.05] md:p-7 md:ring-1 md:ring-white/10 ${c.ring ? "md:!ring-2 md:!ring-primary/70" : ""}`}
                >
                  <h3 className="text-balance text-lg font-bold leading-tight text-white">{c.title}</h3>
                  <p className="mt-2 flex-1 text-pretty text-body-sm text-white/70" style={{ lineHeight: "1.55" }}>
                    {c.body}
                  </p>
                  <a
                    href="#quote"
                    onClick={() => openForm(c.intent, c.title)}
                    className="focus-ring mt-4 inline-flex min-h-[44px] items-center gap-1.5 self-start rounded-md text-body-sm font-semibold text-[#ff8a80] underline-offset-4 hover:underline"
                  >
                    {c.cta}
                    <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-4 md:mt-12">
          {/* What owners needed before booking (57 threads): to know whether
              it can be fixed and what it takes before anyone comes. A photo
              of the label tells the model and the free channels. */}
          <p className="text-balance text-center text-body text-white/70">
            <Gap q="Q4" tone="dark">
              Start with a photo of the label on your recorder. We tell you what it needs before anyone comes out.
            </Gap>
          </p>
          <a
            href={whatsappUrl("Hi, I have a Hikvision system and need help with it. Here is a photo of the recorder's label.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track(EVENTS.CTA_CLICKED, { cta_id: "existing_whatsapp", cta_label: "whatsapp", cta_location: "existing" })}
            className="focus-ring-solid flex h-control-lg w-full items-center justify-center gap-2 rounded-lg border border-white/25 bg-transparent px-6 text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-white transition-colors duration-quick ease-ds hover:bg-white/10 sm:w-auto"
          >
            <WhatsAppIcon className="h-[19px] w-[19px]" />
            Tell us what you have
          </a>
        </div>
      </div>
    </section>
  );
}
