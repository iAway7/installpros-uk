"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Cctv, CookingPot, DoorOpen, Footprints, Plus, Sofa, Wrench } from "lucide-react";
import { track, EVENTS } from "@/lib/analytics";
import { HIKVISION_INTENT_LABEL, type HikvisionIntent } from "./hikvision-need-step";
import { savePlan, type HikvisionPlan } from "@/lib/funnel/hikvision-plan";
import { HikvisionQuoteForm } from "./hikvision-quote-form";

/**
 * The third planner, alternative A from 28 October (Gus picked it to build
 * below the other two, so there are three to choose from): the places as
 * photo tiles instead of labels on an aerial photo. Light, centred.
 *
 * Why tiles: most visitors are on phones, where a label on a small aerial
 * photo is a small target and the labels crowd; a tile the size of a photo
 * is easy to hit and shows the place itself. It still says nothing about
 * where a camera goes, only what is covered.
 *
 *   1. Tap the places: six outside tiles (crops of the placement renders),
 *      and "Add rooms inside" opens four room tiles (icons until there are
 *      photos of rooms). One camera per tile, no price.
 *   2. New cameras or add to mine.
 *   3. The closing form's steps from the postcode, light, form_name
 *      hikvision_planner_tiles.
 *
 * The plan goes to sessionStorage like the other two, so the thank-you page
 * puts it in the WhatsApp message.
 */

type Step = "areas" | "type" | "details" | "fix";

type Tile = { id: string; short: string; label: string; img?: string; icon?: React.ReactNode };

const OUTSIDE: Tile[] = [
  { id: "front", short: "Front door", label: "Front door", img: "/funnel/hikvision-tile-front.webp" },
  { id: "drive", short: "Drive", label: "Drive and car", img: "/funnel/hikvision-tile-drive.webp" },
  { id: "street", short: "Street", label: "Car on the street", img: "/funnel/hikvision-tile-street.webp" },
  { id: "side", short: "Side gate", label: "Side and gate", img: "/funnel/hikvision-tile-side.webp" },
  { id: "back", short: "Back door", label: "Back door", img: "/funnel/hikvision-tile-back.webp" },
  { id: "garden", short: "Garden", label: "Garden and shed", img: "/funnel/hikvision-tile-garden.webp" },
];

// The same rooms as the step-by-step copy: no bedroom, no garage.
const ROOMS: Tile[] = [
  { id: "hall", short: "Hall", label: "Hall", icon: <DoorOpen className="h-7 w-7" strokeWidth={1.5} /> },
  { id: "living", short: "Living room", label: "Living room", icon: <Sofa className="h-7 w-7" strokeWidth={1.5} /> },
  { id: "kitchen", short: "Kitchen", label: "Kitchen", icon: <CookingPot className="h-7 w-7" strokeWidth={1.5} /> },
  { id: "stairs", short: "Stairs", label: "Stairs and landing", icon: <Footprints className="h-7 w-7" strokeWidth={1.5} /> },
];

const TYPE: { value: HikvisionIntent; icon: React.ReactNode }[] = [
  { value: "new", icon: <Cctv className="h-5 w-5" /> },
  { value: "add", icon: <Plus className="h-5 w-5" /> },
];

const QUESTION: Record<Step, string> = {
  areas: "What do you want covered?",
  type: "New cameras, or adding to yours?",
  details: "Get the price for your plan.",
  fix: "Let's get it working.",
};

const OPTION =
  "focus-ring-solid flex h-[76px] flex-col items-center justify-center gap-1.5 rounded-lg border-[length:var(--border-control)] border-field bg-background px-1 text-center text-body-sm font-semibold min-[350px]:text-body leading-tight text-foreground transition-all duration-quick ease-ds hover:border-selection-border hover:bg-card sm:h-20";

const CTA =
  "focus-ring-solid flex h-control-lg w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-primary-foreground transition-colors duration-quick ease-ds hover:bg-brand-hover disabled:pointer-events-none disabled:opacity-50";

/** "Front door, drive and back door". */
function sentence(items: string[]): string {
  const words = items.map((s, i) => (i === 0 ? s : s.toLowerCase()));
  if (words.length <= 1) return words.join("");
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-md px-2 text-body-sm font-medium text-muted-foreground transition-colors duration-quick ease-ds hover:text-foreground"
    >
      <ArrowLeft aria-hidden="true" className="h-4 w-4" />
      Back
    </button>
  );
}

/** A place as a tile: its photo (or an icon for rooms), the name at the
 *  bottom, a red ring and a tick once chosen. */
function TileButton({ tile, active, onToggle }: { tile: Tile; active: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onToggle}
      className={`focus-ring-solid group relative aspect-[4/3] overflow-hidden rounded-xl text-left transition-shadow duration-quick ease-ds ${
        active ? "ring-[3px] ring-[#c70505] ring-offset-2 ring-offset-background" : "ring-1 ring-border hover:ring-foreground/30"
      } ${tile.img ? "bg-[#1b2430]" : "bg-secondary"}`}
    >
      {tile.img ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tile.img}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.03]"
          />
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
        </>
      ) : (
        <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center pb-6 text-brand-icon">
          {tile.icon}
        </span>
      )}
      <span
        aria-hidden="true"
        className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-[15px] font-bold ${
          active ? "bg-[#c70505] text-white" : "bg-black/45 text-white backdrop-blur-sm"
        }`}
      >
        {active ? "✓" : "+"}
      </span>
      <span className={`absolute inset-x-0 bottom-0 px-3 pb-2.5 text-body-sm font-semibold sm:text-body ${tile.img ? "text-white" : "text-center text-foreground"}`}>
        {tile.short}
      </span>
    </button>
  );
}

export function HikvisionTilesPlanner() {
  const [step, setStep] = useState<Step>("areas");
  const [intent, setIntent] = useState<HikvisionIntent>("new");
  const [showRooms, setShowRooms] = useState(false);
  const [on, setOn] = useState<Set<string>>(() => new Set());
  const touched = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);
  const firstStep = useRef(true);

  // Each step is a different height; keep the question in view.
  useEffect(() => {
    if (firstStep.current) {
      firstStep.current = false;
      return;
    }
    const el = sectionRef.current;
    if (!el || el.getBoundingClientRect().top >= 0) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [step]);

  const outside = OUTSIDE.filter((t) => on.has(t.id));
  const rooms = showRooms ? ROOMS.filter((t) => on.has(t.id)) : [];
  const chosen = [...outside, ...rooms];
  const count = chosen.length;

  function toggle(id: string) {
    touched.current = true;
    setOn((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const plan = (): HikvisionPlan => ({
    spots: outside.map((t) => t.label),
    inside: rooms.length > 0,
    rooms: rooms.map((t) => t.label),
    count,
  });

  useEffect(() => {
    if (!touched.current) return;
    savePlan(plan());
    // The plan derives from on and showRooms.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, showRooms]);

  function toType() {
    touched.current = true;
    savePlan(plan());
    track(EVENTS.CTA_CLICKED, { cta_id: "tiles_plan", cta_label: `${count}_cameras_${rooms.length}_inside`, cta_location: "tiles" });
    setStep("type");
  }

  function chooseType(value: HikvisionIntent) {
    setIntent(value);
    track(EVENTS.CTA_CLICKED, { cta_id: `tiles_intent_${value}`, cta_label: value, cta_location: "tiles" });
    setStep("details");
  }

  // Opens the form right here as a repair, from the postcode (Gus, 28
  // October), rather than sending people down to the closing form.
  function fixMySystem() {
    setIntent("repair");
    track(EVENTS.CTA_CLICKED, { cta_id: "tiles_fix", cta_label: "repair", cta_location: "tiles" });
    setStep("fix");
  }

  const summary = count > 0 ? `${sentence(chosen.map((t) => t.short))}.` : "";
  const anim = "animate-[slideInRight_0.3s_ease-out] motion-reduce:animate-none";

  return (
    <section ref={sectionRef} id="tiles" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto text-center">
        <p className="eyebrow">Plan your cameras</p>
        <div key={step} className={anim}>
          <h2 id="tiles-question" className="mx-auto mt-4 max-w-3xl text-balance h2-section text-foreground">
            {QUESTION[step]}
          </h2>

          {step === "areas" && (
            <>
              <div role="group" aria-label="Places outside" className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 md:mt-10 md:grid-cols-3 md:gap-4">
                {OUTSIDE.map((t) => (
                  <TileButton key={t.id} tile={t} active={on.has(t.id)} onToggle={() => toggle(t.id)} />
                ))}
              </div>

              {showRooms ? (
                <div role="group" aria-label="Rooms inside" className="mx-auto mt-3 grid max-w-3xl grid-cols-2 gap-3 md:mt-4 md:grid-cols-4 md:gap-4">
                  {ROOMS.map((t) => (
                    <TileButton key={t.id} tile={t} active={on.has(t.id)} onToggle={() => toggle(t.id)} />
                  ))}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowRooms(true)}
                  className="focus-ring-solid mt-5 inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-field bg-background px-4 text-body-sm font-semibold text-foreground transition-colors duration-quick ease-ds hover:border-selection-border"
                >
                  <Plus aria-hidden="true" className="h-4 w-4" />
                  Add rooms inside
                </button>
              )}

              {summary && (
                <p aria-live="polite" className="mx-auto mt-6 max-w-md text-pretty text-body-sm text-muted-foreground" style={{ lineHeight: "1.55" }}>
                  {summary}
                </p>
              )}

              {/* The count lives in the button (Gus, 28 October: a count beside
                  it read cramped). */}
              <div className="mx-auto mt-4 max-w-md">
                <button type="button" onClick={toType} disabled={count === 0} className={CTA}>
                  {count > 0 ? `Get the price for ${count} camera${count === 1 ? "" : "s"}` : "Pick what to cover"}
                  {count > 0 && <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />}
                </button>
              </div>

              <button
                type="button"
                onClick={fixMySystem}
                className="focus-ring mt-4 inline-flex min-h-[44px] items-center gap-1.5 rounded-md px-2 text-body-sm font-medium text-muted-foreground underline-offset-4 transition-colors duration-quick ease-ds hover:text-foreground hover:underline"
              >
                <Wrench aria-hidden="true" className="h-4 w-4" />
                Something not working? Fix my system
              </button>
            </>
          )}

          {step === "type" && (
            <>
              <div role="group" aria-labelledby="tiles-question" className="mx-auto mt-10 grid max-w-md grid-cols-2 gap-2 sm:gap-3 md:mt-12">
                {TYPE.map((o) => (
                  <button key={o.value} type="button" onClick={() => chooseType(o.value)} className={OPTION}>
                    <span aria-hidden="true" className="text-brand-icon">{o.icon}</span>
                    {HIKVISION_INTENT_LABEL[o.value]}
                  </button>
                ))}
              </div>
              <div className="mt-5">
                <BackButton onClick={() => setStep("areas")} />
              </div>
            </>
          )}

          {step === "fix" && (
            <>
              <p className="mx-auto mt-4 max-w-md text-pretty text-body text-muted-foreground md:text-lg">
                We tell you what it needs before anyone comes out.
              </p>
              <div className="mx-auto mt-8 max-w-md text-left md:mt-10">
                <HikvisionQuoteForm
                  tone="light"
                  presetIntent="repair"
                  onBack={() => setStep("areas")}
                  showStepLabels={false}
                  defaultService="security"
                  skipServiceStep
                  formName="hikvision_planner_tiles"
                />
              </div>
            </>
          )}

          {step === "details" && (
            <>
              <p className="mx-auto mt-4 max-w-md text-pretty text-body text-muted-foreground md:text-lg">
                {count} camera{count === 1 ? "" : "s"}: {summary.charAt(0).toLowerCase() + summary.slice(1)}
              </p>
              <div className="mx-auto mt-8 max-w-md text-left md:mt-10">
                <HikvisionQuoteForm
                  tone="light"
                  presetIntent={intent}
                  onBack={() => setStep("type")}
                  showStepLabels={false}
                  defaultService="security"
                  skipServiceStep
                  formName="hikvision_planner_tiles"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
