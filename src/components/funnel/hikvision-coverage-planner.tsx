"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Cctv, House, Plus, Sofa, Trees, Wrench } from "lucide-react";
import { track, EVENTS } from "@/lib/analytics";
import { HIKVISION_INTENT_EVENT, HIKVISION_INTENT_LABEL, type HikvisionIntent } from "./hikvision-need-step";
import { savePlan, type HikvisionPlan } from "@/lib/funnel/hikvision-plan";

/**
 * A step-by-step version of the camera planner (hikvision-camera-planner.tsx),
 * built as a copy below it so the original is kept while this one is worked
 * on (Gus, 28 October). Light, everything centred, and each question is
 * the section's heading: no card behind the options, no "Step 1 of 3".
 *
 *   1. What do you need? The hero's three answers. "Fix my system" skips the
 *      plan: there is nothing to cover, only a system to look at.
 *   2. Outside, inside or both.
 *   3. Tap what you want covered. Outside shows the aerial photo; inside and
 *      both show the same house with the roof off, so the rooms can be
 *      tapped. The difference between them: inside offers only the rooms,
 *      both offers the rooms and the outside areas.
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

type Step = "need" | "where" | "areas" | "fix";
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
  { id: "front", short: "Front door", label: "Front door", at: [480, 565], r: 75 },
  { id: "drive", short: "Drive", label: "Drive and car", at: [330, 540], r: 105 },
  { id: "street", short: "Street", label: "Car on the street", at: [765, 772], r: 95 },
  { id: "side", short: "Side gate", label: "Side and gate", at: [912, 560], r: 70 },
  { id: "back", short: "Back door", label: "Back door", at: [490, 150], r: 90 },
  { id: "garden", short: "Garden", label: "Garden and shed", at: [835, 140], r: 95 },
];

// Provisional: placed over the house until the roofless photo exists (same
// framing, roof off), then moved onto the rooms it shows.
const ROOMS: Area[] = [
  { id: "hall", short: "Hall", label: "Hall", at: [470, 455], r: 55 },
  { id: "living", short: "Living room", label: "Living room", at: [575, 400], r: 65 },
  { id: "kitchen", short: "Kitchen", label: "Kitchen", at: [520, 285], r: 65 },
  { id: "garage", short: "Garage", label: "Garage", at: [730, 330], r: 65 },
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

const NEED: { value: HikvisionIntent; icon: React.ReactNode }[] = [
  { value: "new", icon: <Cctv className="h-5 w-5" /> },
  { value: "add", icon: <Plus className="h-5 w-5" /> },
  { value: "repair", icon: <Wrench className="h-5 w-5" /> },
];

const WHERE: { value: Where; label: string; icon: React.ReactNode }[] = [
  { value: "outside", label: "Outside", icon: <Trees className="h-5 w-5" /> },
  { value: "inside", label: "Inside", icon: <Sofa className="h-5 w-5" /> },
  { value: "both", label: "Both", icon: <House className="h-5 w-5" /> },
];

const QUESTION: Record<Step, string> = {
  need: "What do you need?",
  where: "Where do you want cameras?",
  areas: "Tap what you want covered.",
  fix: "Let's get it working.",
};

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
}: {
  areas: Area[];
  on: Set<string>;
  onToggle: (id: string) => void;
  roofOff: boolean;
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
  const [step, setStep] = useState<Step>("need");
  const [intent, setIntent] = useState<HikvisionIntent>("new");
  const [where, setWhere] = useState<Where>("outside");
  const [on, setOn] = useState<Set<string>>(() => new Set());
  const touched = useRef(false);

  const areas = where === "outside" ? OUTSIDE : where === "inside" ? ROOMS : [...OUTSIDE, ...ROOMS];
  const chosen = areas.filter((a) => on.has(a.id));
  const outside = chosen.filter((a) => OUTSIDE.includes(a));
  const rooms = chosen.filter((a) => ROOMS.includes(a));
  const count = chosen.length;

  function chooseIntent(value: HikvisionIntent) {
    setIntent(value);
    track(EVENTS.CTA_CLICKED, { cta_id: `coverage_intent_${value}`, cta_label: value, cta_location: "coverage" });
    setStep(value === "repair" ? "fix" : "where");
  }

  function chooseWhere(value: Where) {
    setWhere(value);
    track(EVENTS.CTA_CLICKED, { cta_id: `coverage_where_${value}`, cta_label: value, cta_location: "coverage" });
    setStep("areas");
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

  function getPrice() {
    if (step === "areas") {
      touched.current = true;
      savePlan(plan());
    }
    track(EVENTS.CTA_CLICKED, { cta_id: "coverage_quote", cta_label: `${intent}_${where}_${count}`, cta_location: "coverage" });
    window.dispatchEvent(new CustomEvent<HikvisionIntent>(HIKVISION_INTENT_EVENT, { detail: intent }));
  }

  const summary = chosen.length > 0 ? `${sentence(chosen.map((a) => a.label))}.` : "Tap an area on the photo.";
  const anim = "animate-[slideInRight_0.3s_ease-out] motion-reduce:animate-none";

  return (
    <section id="coverage" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto text-center">
        <p className="eyebrow">Plan your cameras</p>
        <div key={step} className={anim}>
          <h2 id="coverage-question" className="mx-auto mt-4 max-w-3xl text-balance h2-section text-foreground">
            {QUESTION[step]}
          </h2>

          {step === "need" && (
            <div role="group" aria-labelledby="coverage-question" className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-2 sm:gap-3 md:mt-12">
              {NEED.map((o) => (
                <button key={o.value} type="button" onClick={() => chooseIntent(o.value)} className={OPTION}>
                  <span aria-hidden="true" className="text-brand-icon">{o.icon}</span>
                  {HIKVISION_INTENT_LABEL[o.value]}
                </button>
              ))}
            </div>
          )}

          {step === "where" && (
            <>
              <div role="group" aria-labelledby="coverage-question" className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-2 sm:gap-3 md:mt-12">
                {WHERE.map((o) => (
                  <button key={o.value} type="button" onClick={() => chooseWhere(o.value)} className={OPTION}>
                    <span aria-hidden="true" className="text-brand-icon">{o.icon}</span>
                    {o.label}
                  </button>
                ))}
              </div>
              <div className="mt-5">
                <BackButton onClick={() => setStep("need")} />
              </div>
            </>
          )}

          {step === "areas" && (
            <>
              <div className="mx-auto mt-10 max-w-5xl md:mt-12">
                <CoverageMap areas={areas} on={on} onToggle={toggle} roofOff={where !== "outside"} />
                <AreaChips areas={areas} on={on} onToggle={toggle} />
              </div>

              <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-5">
                <div aria-live="polite">
                  <p className="flex items-baseline justify-center gap-2">
                    <span className="text-6xl font-bold leading-none tabular-nums text-foreground">{count}</span>
                    <span className="text-xl font-semibold text-foreground">camera{count === 1 ? "" : "s"}</span>
                  </p>
                  <p className="mt-3 text-pretty text-body-sm text-muted-foreground" style={{ lineHeight: "1.55" }}>
                    {summary}
                  </p>
                </div>
                <div className="w-full">
                  <a
                    href="#quote"
                    onClick={getPrice}
                    className="focus-ring-solid flex h-control-lg w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-primary-foreground transition-colors duration-quick ease-ds hover:bg-brand-hover"
                  >
                    {count > 0 ? "Get the price for this plan" : "Get my free quote"}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </a>
                  <p className="mt-2.5 text-body-sm text-muted-foreground">Your price the same day. Nothing to pay monthly.</p>
                </div>
                <BackButton onClick={() => setStep("where")} />
              </div>
            </>
          )}

          {step === "fix" && (
            <div className="mx-auto max-w-md">
              <p className="mt-5 text-pretty text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
                Start with a photo of the label on your recorder. We tell you what it needs before anyone comes out.
              </p>
              <a
                href="#quote"
                onClick={getPrice}
                className="focus-ring-solid mt-8 flex h-control-lg w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-primary-foreground transition-colors duration-quick ease-ds hover:bg-brand-hover"
              >
                Get my free quote
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
              <div className="mt-5">
                <BackButton onClick={() => setStep("need")} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
