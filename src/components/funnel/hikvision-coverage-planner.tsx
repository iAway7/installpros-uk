"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Cctv, Plus, Wrench } from "lucide-react";
import { track, EVENTS } from "@/lib/analytics";
import { HIKVISION_INTENT_LABEL, type HikvisionIntent } from "./hikvision-need-step";
import { savePlan, type HikvisionPlan } from "@/lib/funnel/hikvision-plan";
import { HikvisionQuoteForm } from "./hikvision-quote-form";

/**
 * A step-by-step camera planner, first built as a copy of the dark map
 * planner (hikvision-camera-planner.tsx, removed 30 October; see git) so
 * the original was kept while this one was worked on (Gus, 28 October).
 * Light, everything centred, and each question is the section's heading:
 * no card behind the options, no "Step 1 of 3".
 *
 * The order (Gus, 28 October), map first because every funnel loses
 * 76 to 89% of its leavers on the first question, so the first one has to
 * be the most inviting; a plan someone has built makes the postcode feel
 * like the way to its price rather than a gate:
 *   1. Tap what you want covered, with Outside / Inside / Both as tabs over
 *      the photo (outside first: inside came up 5 times among homes).
 *      Outside shows the aerial photo; inside and both show the same house
 *      with the roof off. Inside offers only the rooms, both offers the rooms
 *      and the outside areas. "Fix my system" is a link under the map that
 *      opens the form right here as a repair: there is nothing to plan.
 *   2. New cameras or add to mine, one tap, for the lead's intent.
 *   3. The closing form's own steps, embedded light from the postcode on
 *      (hikvision-quote-form.tsx), with form_name hikvision_planner_steps so
 *      its leads can be told from the original planner's (hikvision_planner).
 *
 * The change from the original: no camera dots and no cones. A cone says
 * where a camera goes and which way it points, and a guess at that from a
 * photo can read as a wrong position. Here a tap marks the area to cover,
 * a soft circle on the area itself, and the label sits in its middle; where
 * the camera goes is agreed later from the customer's photos.
 *
 * Counting, the plan in sessionStorage and the closing form's chip work as
 * in the original: one camera per area, no price.
 */

type Step = "areas" | "type" | "details" | "fix";
type Where = "outside" | "inside" | "both";

type Area = {
  id: string;
  /** On the label over the photo. */
  short: string;
  /** In the summary and the WhatsApp message. */
  label: string;
  /** Centre and radius of the area, in pixels of the 1264 x 848 photo. */
  at: [number, number];
  r: number;
};

// Pixels on the aerial photo (prompt 10 in hikvision-research/
// prompts-imagenes.md). Centred on what is covered, not on a camera.
const OUTSIDE: Area[] = [
  { id: "front", short: "Front door", label: "Front door", at: [492, 572], r: 75 },
  { id: "drive", short: "Drive", label: "Drive and car", at: [305, 530], r: 105 },
  { id: "street", short: "Street", label: "Car on the street", at: [765, 772], r: 95 },
  { id: "side", short: "Side gate", label: "Side and gate", at: [912, 560], r: 70 },
  { id: "back", short: "Back door", label: "Back door", at: [490, 150], r: 90 },
  { id: "garden", short: "Garden", label: "Garden and shed", at: [835, 140], r: 95 },
];

// The rooms people asked to cover inside (hikvision-research/coded): the
// living room ("to check on the dog"), the landing and upstairs, the hall,
// the kitchen. No bedroom: nobody asked for one inside, and it is the room
// where people most expect privacy; the landing covers the way to the
// bedrooms without looking into them. No garage either: it was asked for
// as an outside camera over the door, and the photo has none (Gus, 28
// October).
// Provisional: placed over the house until the roofless photo exists (same
// framing, roof off), then moved onto the rooms it shows.
const ROOMS: Area[] = [
  { id: "hall", short: "Hall", label: "Hall", at: [470, 455], r: 55 },
  { id: "living", short: "Living room", label: "Living room", at: [575, 400], r: 65 },
  { id: "kitchen", short: "Kitchen", label: "Kitchen", at: [470, 270], r: 65 },
  { id: "stairs", short: "Stairs", label: "Stairs and landing", at: [650, 305], r: 55 },
];

const AERIAL = {
  src: "/funnel/hikvision-planner-aerial-1264.webp",
  srcSet: "/funnel/hikvision-planner-aerial-828.webp 828w, /funnel/hikvision-planner-aerial-1264.webp 1264w",
  alt: "A British semi-detached house at dusk, seen from above, with its drive, gardens and the street",
};
// The roofless photo, when it exists. Until then inside and both use the
// aerial as it is.
const ROOFLESS: typeof AERIAL | null = null;

const W = 1264;
const H = 848;

/** "Front door, drive and car and back door". */
function sentence(items: string[]): string {
  const words = items.map((s, i) => (i === 0 ? s : s.toLowerCase()));
  if (words.length <= 1) return words.join("");
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

const OPTION =
  "focus-ring-solid flex h-[76px] flex-col items-center justify-center gap-1.5 rounded-lg border-[length:var(--border-control)] border-field bg-background px-1 text-center text-body-sm font-semibold min-[350px]:text-body leading-tight text-foreground transition-all duration-quick ease-ds hover:border-selection-border hover:bg-card sm:h-20";

const TYPE: { value: HikvisionIntent; icon: React.ReactNode }[] = [
  { value: "new", icon: <Cctv className="h-5 w-5" /> },
  { value: "add", icon: <Plus className="h-5 w-5" /> },
];

const WHERE: { value: Where; label: string }[] = [
  { value: "outside", label: "Outside" },
  { value: "inside", label: "Inside" },
  { value: "both", label: "Both" },
];

const QUESTION: Record<Step, string> = {
  areas: "Tap what you want covered.",
  type: "New cameras, or adding to yours?",
  details: "Get the price for your plan.",
  fix: "Let's get it working.",
};

const CTA =
  "focus-ring-solid flex h-control-lg w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-primary-foreground transition-colors duration-quick ease-ds hover:bg-brand-hover disabled:pointer-events-none disabled:opacity-50";

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

/** The photo, a soft circle on every chosen area, and the labels as buttons
 *  in the middle of each area. On phones the photo is too small for labels
 *  that close together (Drive ran into Front door), so there they sit as a
 *  row of chips under it and the circles stay on the photo. */
function CoverageMap({
  areas,
  on,
  onToggle,
  roofOff,
  count,
}: {
  areas: Area[];
  on: Set<string>;
  onToggle: (id: string) => void;
  roofOff: boolean;
  /** Shown in the photo's top-left corner, white on a dark gradient (Gus,
   *  28 October), so the count sits on the plan it counts. */
  count: number;
}) {
  const photo = roofOff && ROOFLESS ? ROOFLESS : AERIAL;
  return (
    <div className="relative w-full overflow-hidden rounded-3xl ring-1 ring-border" style={{ aspectRatio: `${W} / ${H}` }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.src}
        srcSet={photo.srcSet}
        sizes="(min-width: 1024px) 1024px, 100vw"
        alt={photo.alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(70% 60% at 0% 0%, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.38) 45%, transparent 75%)" }}
      />
      <p aria-live="polite" className="pointer-events-none absolute left-4 top-3 z-10 flex items-baseline gap-1.5 text-white sm:left-6 sm:top-5">
        <span className="text-3xl font-bold leading-none tabular-nums sm:text-5xl">{count}</span>
        <span className="text-body font-semibold sm:text-lg">camera{count === 1 ? "" : "s"}</span>
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <radialGradient id="coverage-fill">
            <stop offset="0%" stopColor="#ff3b30" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#ff3b30" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ff3b30" stopOpacity="0.18" />
          </radialGradient>
        </defs>
        {areas.map((a) => (
          <circle
            key={a.id}
            cx={a.at[0]}
            cy={a.at[1]}
            r={a.r}
            fill="url(#coverage-fill)"
            stroke="#ff6a5f"
            strokeWidth={2.5}
            opacity={on.has(a.id) ? 1 : 0}
            className="transition-opacity duration-500 ease-out motion-reduce:transition-none"
          />
        ))}
      </svg>
      <div role="group" aria-label="Areas to cover" className="absolute inset-0 hidden sm:block">
        {areas.map((a) => {
          const active = on.has(a.id);
          return (
            <button
              key={a.id}
              type="button"
              aria-pressed={active}
              aria-label={a.label}
              onClick={() => onToggle(a.id)}
              style={{ left: `${(a.at[0] / W) * 100}%`, top: `${(a.at[1] / H) * 100}%` }}
              className={`focus-ring-solid absolute inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-semibold leading-5 transition-colors duration-quick ease-ds sm:px-2.5 sm:py-1 sm:text-xs md:text-[13px] ${
                active
                  ? "border-transparent bg-[#c70505]/95 text-white shadow-[0_6px_18px_-6px_rgba(199,5,5,0.8)]"
                  : "border-white/25 bg-black/45 text-white/90 backdrop-blur-md hover:border-white/60 hover:text-white"
              }`}
            >
              <span aria-hidden="true">{active ? "✓" : "+"}</span>
              {a.short}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** The same labels as a row under the photo, for phones. */
function AreaChips({ areas, on, onToggle }: { areas: Area[]; on: Set<string>; onToggle: (id: string) => void }) {
  return (
    <div role="group" aria-label="Areas to cover" className="mt-4 flex flex-wrap justify-center gap-2 sm:hidden">
      {areas.map((a) => {
        const active = on.has(a.id);
        return (
          <button
            key={a.id}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(a.id)}
            className={`focus-ring-solid inline-flex min-h-[40px] items-center gap-1 rounded-full border px-3.5 text-body-sm font-semibold transition-colors duration-quick ease-ds ${
              active ? "border-transparent bg-[#c70505] text-white" : "border-field bg-background text-foreground hover:border-selection-border"
            }`}
          >
            <span aria-hidden="true">{active ? "✓" : "+"}</span>
            {a.short}
          </button>
        );
      })}
    </div>
  );
}

export function HikvisionCoveragePlanner() {
  const [step, setStep] = useState<Step>("areas");
  const [intent, setIntent] = useState<HikvisionIntent>("new");
  const [where, setWhere] = useState<Where>("outside");
  const [on, setOn] = useState<Set<string>>(() => new Set());
  const touched = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);
  const firstStep = useRef(true);

  // Each step is a different height (the map goes, the form comes), and the
  // page used to stay put, so the next question opened off screen with the
  // next section in view (Gus, 28 October). Back to the top of the section
  // on every change, unless it is already in view.
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

  const areas = where === "outside" ? OUTSIDE : where === "inside" ? ROOMS : [...OUTSIDE, ...ROOMS];
  const chosen = areas.filter((a) => on.has(a.id));
  const outside = chosen.filter((a) => OUTSIDE.includes(a));
  const rooms = chosen.filter((a) => ROOMS.includes(a));
  const count = chosen.length;

  function chooseWhere(value: Where) {
    setWhere(value);
    track(EVENTS.CTA_CLICKED, { cta_id: `coverage_where_${value}`, cta_label: value, cta_location: "coverage" });
  }

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
    spots: outside.map((a) => a.label),
    inside: rooms.length > 0,
    rooms: rooms.map((a) => a.label),
    count,
  });

  useEffect(() => {
    if (!touched.current) return;
    savePlan(plan());
    // The plan derives from on and where.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, where]);

  function toType() {
    touched.current = true;
    savePlan(plan());
    track(EVENTS.CTA_CLICKED, { cta_id: "coverage_plan", cta_label: `${where}_${count}`, cta_location: "coverage" });
    setStep("type");
  }

  function chooseType(value: HikvisionIntent) {
    setIntent(value);
    track(EVENTS.CTA_CLICKED, { cta_id: `coverage_intent_${value}`, cta_label: value, cta_location: "coverage" });
    setStep("details");
  }

  // Opens the form right here as a repair, from the postcode (Gus, 28
  // October), rather than sending people down to the closing form.
  function fixMySystem() {
    setIntent("repair");
    track(EVENTS.CTA_CLICKED, { cta_id: "coverage_fix", cta_label: "repair", cta_location: "coverage" });
    setStep("fix");
  }

  // Nothing until something is chosen: "Tap an area on the photo" was wrong
  // on phones, where the chips under the photo are what gets tapped.
  // In the chips' words: the long labels ("Drive and car", "Stairs and
  // landing") ran into each other here ("drive and car and car on the
  // street"). The long ones still go in the plan for the WhatsApp message.
  const summary = chosen.length > 0 ? `${sentence(chosen.map((a) => a.short))}.` : "";
  const anim = "animate-[slideInRight_0.3s_ease-out] motion-reduce:animate-none";

  return (
    <section ref={sectionRef} id="coverage" className="w-full scroll-mt-28 bg-background py-16 md:pb-24 md:pt-16">
      <div className="container mx-auto text-center">
        <p className="eyebrow">Plan your cameras</p>
        <div key={step} className={anim}>
          <h2 id="coverage-question" className="mx-auto mt-4 max-w-3xl text-balance h2-section text-foreground">
            {QUESTION[step]}
          </h2>

          {step === "areas" && (
            <>
              <div role="radiogroup" aria-label="Where" className="mx-auto mt-6 inline-grid grid-cols-3 rounded-full bg-secondary p-1">
                {WHERE.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    role="radio"
                    aria-checked={where === o.value}
                    onClick={() => chooseWhere(o.value)}
                    className={`focus-ring-solid min-h-[40px] min-w-[92px] rounded-full px-4 text-body-sm font-semibold transition-colors duration-quick ease-ds sm:min-w-[110px] ${
                      where === o.value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>

              {/* The photo at 680px, so the photo, the count and the button
                  fit a 1440x900 screen together, centred and stacked: under
                  a 1024px photo the button fell off the screen, and Gus
                  turned down both the button beside the photo and a bar
                  fixed to the bottom of the screen (28 October). */}
              <div className="mx-auto mt-5 max-w-[680px]">
                <CoverageMap areas={areas} on={on} onToggle={toggle} roofOff={where !== "outside"} count={count} />
                <AreaChips areas={areas} on={on} onToggle={toggle} />
              </div>

              {summary && (
                <p className="mx-auto mt-4 max-w-md text-pretty text-body-sm text-muted-foreground" style={{ lineHeight: "1.55" }}>
                  {summary}
                </p>
              )}

              <div className="mx-auto mt-4 max-w-md">
                <button type="button" onClick={toType} disabled={count === 0} className={CTA}>
                  Get the price for this plan
                  <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
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
              <div role="group" aria-labelledby="coverage-question" className="mx-auto mt-10 grid max-w-md grid-cols-2 gap-2 sm:gap-3 md:mt-12">
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
                  formName="hikvision_planner_steps"
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
                  formName="hikvision_planner_steps"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
