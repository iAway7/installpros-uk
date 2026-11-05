"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { track, EVENTS } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/funnel/contact";
import { WhatsAppIcon } from "./ui/whatsapp-icon";
import { LazyHikvisionQuoteForm } from "./hikvision-lazy";

/**
 * "Already have cameras?", for owners who want more cameras on their system.
 *
 * Why it exists: owners of a camera system are nearly as many as buyers in
 * the chats (57 against 81), 39 of them Hikvision or HiLook, and an owner
 * who sees nothing for them below the hero leaves.
 *
 * It had three cards on a dashed line (Add cameras, Fix it, Take it over),
 * like the Ajax page's "Moving in?". Fix it and Take it over went on 5
 * November (Gus): Jordan said repair and takeover call-outs price them out,
 * since the engineer has to earn enough on the job and margin goes on top.
 * Adding cameras is an install with kit, so it stays, and with one thing
 * left the cards became a heading and two buttons.
 *
 * "Add to mine" asks for the postcode right here, as the planners do: the
 * heading changes and the form follows, with intent add and form_name
 * hikvision_existing. Back returns to the buttons. WhatsApp is for anyone
 * who would rather send a photo of the recorder's label first, which tells
 * the team the model and how many channels are free.
 */

const CTA =
  "focus-ring-solid flex h-control-lg w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-primary-foreground transition-colors duration-quick ease-ds hover:bg-brand-hover sm:w-auto";

const SECONDARY =
  "focus-ring-solid flex h-control-lg w-full items-center justify-center gap-2 rounded-lg border border-foreground/20 bg-transparent px-6 text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-foreground transition-colors duration-quick ease-ds hover:bg-secondary sm:w-auto";

export function HikvisionExistingSection() {
  const [open, setOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  // The form is a different height from the buttons; keep the heading in
  // view, as the planners do on each step.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const el = sectionRef.current;
    if (!el || el.getBoundingClientRect().top >= 0) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [open]);

  function start() {
    track(EVENTS.CTA_CLICKED, { cta_id: "existing_add", cta_label: "Add to mine", cta_location: "existing" });
    setOpen(true);
  }

  return (
    <section ref={sectionRef} id="existing" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto">
        <div
          key={open ? "form" : "intro"}
          className={`mx-auto max-w-2xl text-center ${open ? "animate-[slideInRight_0.3s_ease-out] motion-reduce:animate-none" : ""}`}
        >
          <p className="eyebrow">Already have cameras?</p>
          <h2 className="mt-4 text-balance h2-section text-foreground">
            {open ? "Let's add to your system." : "More cameras on the system you have."}
          </h2>
          <p className="mt-5 text-balance text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            On your recorder if it has room, or a bigger one if it&apos;s full.
          </p>
        </div>

        {open ? (
          <div className="mx-auto mt-8 max-w-md md:mt-10">
            <LazyHikvisionQuoteForm
              tone="light"
              presetIntent="add"
              onBack={() => setOpen(false)}
              showStepLabels={false}
              defaultService="security"
              skipServiceStep
              formName="hikvision_existing"
            />
          </div>
        ) : (
          <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-3 sm:max-w-none sm:flex-row sm:justify-center md:mt-10">
            <button type="button" onClick={start} className={CTA}>
              Add to mine
              <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
            </button>
            <a
              href={whatsappUrl("Hi, I have a Hikvision system and I'd like to add cameras. Here is a photo of the recorder's label.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track(EVENTS.CTA_CLICKED, { cta_id: "existing_whatsapp", cta_label: "whatsapp", cta_location: "existing" })}
              className={SECONDARY}
            >
              <WhatsAppIcon className="h-[19px] w-[19px]" />
              Send the label on WhatsApp
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
