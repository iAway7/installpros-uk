"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { track, EVENTS } from "@/lib/analytics";
import { HIKVISION_INTENT_EVENT, type HikvisionIntent } from "./hikvision-need-step";
import { savePlan, type HikvisionPlan } from "@/lib/funnel/hikvision-plan";

/**
 * The camera planner, in place of the static "How many cameras?" tiers.
 * Gus, 27 October 2026: an interactive form that recommends the number of
 * cameras from where people want them, chosen over a crime checker like
 * Securico's.
 *
 * Why it is shaped like this (hikvision-research/conversaciones-decision.md):
 *   - Buyers already describe the job as places, not as a count: "Cam on
 *     frnlont of house over looking car parked on road next cam to look down
 *     side of house next one to look at back door n gate". So they tap places
 *     and the count follows, one camera per place.
 *   - Staff had to confirm positions in 28 threads; the plan is that answer,
 *     handed over before the call.
 *   - The median was 3 cameras, so the plan opens on three (front door, drive
 *     and car, back door): the page is complete before anyone taps.
 *   - Inside or not was a question staff asked; it adds one camera.
 *   - No price: the result says how many, never how much.
 *
 * The drawing is a typical British semi seen from above (Gus picked the
 * top-down style, option A, over a 3D one): hipped slate roof with a chimney
 * and a roof window, a bay window and a porch at the front, a conservatory
 * and a patio at the back, the shed, the drive with the car, the hedge, the
 * pavement and a car parked on the street. Each camera draws the area it
 * covers. Colours are the scene's own, not theme tokens: it is a picture.
 *
 * The plan travels in sessionStorage (lib/funnel/hikvision-plan.ts) once
 * someone has touched it, and the thank-you page puts it in the WhatsApp message. It is
 * not stored on the lead: that needs a field in the shared submit path and
 * Will's Zap to map it, which is a separate decision.
 */

type SpotId = "front" | "drive" | "street" | "side" | "back" | "garden";

type Spot = { id: SpotId; label: string; at: [number, number]; dir: number; reach: number };

const SPOTS: Spot[] = [
  { id: "front", label: "Front door", at: [120, 124], dir: 90, reach: 46 },
  { id: "drive", label: "Drive and car", at: [56, 120], dir: 128, reach: 52 },
  { id: "street", label: "Car on the street", at: [176, 124], dir: 98, reach: 60 },
  { id: "side", label: "Side and gate", at: [184, 98], dir: 40, reach: 50 },
  { id: "back", label: "Back door", at: [98, 48], dir: 270, reach: 46 },
  { id: "garden", label: "Garden and shed", at: [184, 50], dir: 318, reach: 52 },
];

const DEFAULT: SpotId[] = ["front", "drive", "back"];

/** The covered area: a 76-degree wedge from the camera. */
function wedge([cx, cy]: [number, number], dir: number, r: number): string {
  const rad = Math.PI / 180;
  const a1 = (dir - 38) * rad;
  const a2 = (dir + 38) * rad;
  const p = (a: number) => `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
  return `M${cx} ${cy}L${p(a1)}A${r} ${r} 0 0 1 ${p(a2)}Z`;
}

const STRIPES = Array.from({ length: 11 }, (_, i) => i * 14);

function HousePlan({ on, onToggle }: { on: Set<SpotId>; onToggle: (id: SpotId) => void }) {
  return (
    <svg viewBox="0 0 240 180" className="block h-auto w-full" role="img" aria-label="A house seen from above, with the cameras you picked and what each one covers">
      {/* Lawn, front and back */}
      <rect x="0" y="0" width="240" height="148" fill="#dce8d1" />
      {STRIPES.map((y) => (
        <rect key={y} x="0" y={y} width="240" height="7" fill="#d4e2c8" />
      ))}
      <rect x="6" y="4" width="228" height="142" fill="none" stroke="#b49c7e" strokeWidth="1.2" />
      {/* Back: patio, conservatory, shed */}
      <rect x="62" y="26" width="62" height="22" fill="#e7e1d5" />
      {[72, 82, 92, 102, 112].map((x) => (
        <line key={x} x1={x} y1="26" x2={x} y2="48" stroke="#d6cebf" strokeWidth=".5" />
      ))}
      <rect x="130" y="28" width="40" height="20" fill="#d4e6f1" stroke="#8aa6b8" strokeWidth=".7" />
      {[138, 146, 154, 162].map((x) => (
        <line key={x} x1={x} y1="28" x2={x} y2="48" stroke="#a9c2d2" strokeWidth=".5" />
      ))}
      <rect x="200" y="9" width="26" height="18" fill="#a07d59" />
      <line x1="200" y1="18" x2="226" y2="18" stroke="#7d5f42" strokeWidth=".8" />
      {/* Front: block-paved drive, path, hedge */}
      <rect x="12" y="64" width="34" height="84" fill="#d9d3c9" />
      {[70, 78, 86, 94, 102, 110, 118, 126, 134, 142].map((y) => (
        <line key={y} x1="12" y1={y} x2="46" y2={y} stroke="#cdc6ba" strokeWidth=".5" />
      ))}
      <rect x="114" y="129" width="12" height="19" fill="#e5ded2" />
      <rect x="46" y="140" width="68" height="8" rx="4" fill="#93b57c" />
      <rect x="126" y="140" width="106" height="8" rx="4" fill="#93b57c" />
      {/* Pavement, road, a car parked on the street */}
      <rect x="0" y="148" width="240" height="10" fill="#eceef1" />
      <line x1="0" y1="158" x2="240" y2="158" stroke="#aab2bb" strokeWidth=".8" />
      <rect x="0" y="158" width="240" height="22" fill="#c2c8cf" />
      <line x1="0" y1="169" x2="240" y2="169" stroke="#ffffff" strokeWidth="1" strokeDasharray="8 6" />
      <rect x="150" y="161" width="40" height="15" rx="5" fill="#6e7c8a" />
      <rect x="159" y="163" width="7" height="11" rx="1.5" fill="#d7e2ea" />
      <rect x="180" y="163" width="5" height="11" rx="1.5" fill="#d7e2ea" />

      {/* What each camera covers, under the house and the car */}
      {SPOTS.map((s) => (
        <path
          key={s.id}
          d={wedge(s.at, s.dir, s.reach)}
          className="fill-primary stroke-primary transition-opacity duration-300 ease-out motion-reduce:transition-none"
          fillOpacity={0.15}
          strokeOpacity={0.4}
          strokeWidth={0.6}
          opacity={on.has(s.id) ? 1 : 0}
        />
      ))}

      {/* The car on the drive */}
      <rect x="17" y="94" width="24" height="40" rx="5" fill="#3f6597" />
      <rect x="20" y="101" width="18" height="8" rx="2" fill="#cfe0ee" />
      <rect x="20" y="111" width="18" height="14" rx="2" fill="#4d74a8" />
      <rect x="20" y="126" width="18" height="5" rx="1.5" fill="#cfe0ee" />

      {/* Hipped slate roof, chimney, roof window, bay and porch */}
      <polygon points="56,48 184,48 147,85 93,85" fill="#7d8792" />
      <polygon points="56,122 184,122 147,85 93,85" fill="#5d6670" />
      <polygon points="56,48 93,85 56,122" fill="#6c7580" />
      <polygon points="184,48 147,85 184,122" fill="#6c7580" />
      <rect x="56" y="48" width="128" height="74" fill="none" stroke="#424a53" strokeWidth=".9" />
      <path d="M93 85H147M56 48L93 85M56 122L93 85M184 48L147 85M184 122L147 85" fill="none" stroke="#4b535c" strokeWidth=".6" />
      <rect x="130" y="80" width="11" height="10" fill="#a26b55" stroke="#7a4d3c" strokeWidth=".6" />
      <rect x="104" y="58" width="10" height="8" fill="#bcd6e8" stroke="#6f8798" strokeWidth=".5" />
      <polygon points="144,122 174,122 168,131 150,131" fill="#6c7580" stroke="#424a53" strokeWidth=".6" />
      <rect x="111" y="122" width="18" height="7" fill="#8d969f" stroke="#424a53" strokeWidth=".6" />

      {/* The camera spots: tap to add or remove. The chips beside the
          drawing are the keyboard and screen reader control. */}
      {SPOTS.map((s) => {
        const active = on.has(s.id);
        return (
          <g key={s.id} onClick={() => onToggle(s.id)} className="cursor-pointer" aria-hidden="true">
            <circle cx={s.at[0]} cy={s.at[1]} r="9" fill="transparent" />
            <circle
              cx={s.at[0]}
              cy={s.at[1]}
              r={active ? 3.8 : 3.2}
              className={active ? "fill-primary" : ""}
              fill={active ? undefined : "#ffffff"}
              stroke={active ? "#ffffff" : "#8a94a0"}
              strokeWidth={active ? 1.4 : 1.2}
            />
          </g>
        );
      })}
    </svg>
  );
}


export function HikvisionCameraPlanner() {
  const [on, setOn] = useState<Set<SpotId>>(() => new Set(DEFAULT));
  const [inside, setInside] = useState(false);
  // Only a plan someone has touched is worth passing on: the default three
  // are the page's suggestion, not theirs.
  const touched = useRef(false);

  const outside = SPOTS.filter((s) => on.has(s.id));
  const count = outside.length + (inside ? 1 : 0);

  function toggle(id: SpotId) {
    touched.current = true;
    setOn((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function chooseInside(value: boolean) {
    touched.current = true;
    setInside(value);
  }

  useEffect(() => {
    if (!touched.current) return;
    const plan: HikvisionPlan = { spots: outside.map((s) => s.label), inside, count };
    savePlan(plan);
    // outside and count derive from on and inside.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, inside]);

  function getPrice() {
    touched.current = true;
    savePlan({ spots: outside.map((s) => s.label), inside, count });
    track(EVENTS.CTA_CLICKED, { cta_id: "planner_quote", cta_label: `${count}_cameras${inside ? "_inside" : ""}`, cta_location: "planner" });
    window.dispatchEvent(new CustomEvent<HikvisionIntent>(HIKVISION_INTENT_EVENT, { detail: "new" }));
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-center lg:gap-10">
      <div className="overflow-hidden rounded-3xl border border-border bg-[#dce8d1]">
        <HousePlan on={on} onToggle={toggle} />
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-2xl font-bold leading-tight text-foreground md:text-3xl">Plan your cameras</h3>
          <p className="mt-2 text-body text-muted-foreground" style={{ lineHeight: "1.6" }}>
            Tap what you want to see. Most homes ask for three or four.
          </p>
        </div>

        <div role="group" aria-labelledby="planner-where" className="flex flex-col gap-2.5">
          <p id="planner-where" className="text-label font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            What do you want to see?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {SPOTS.map((s) => {
              const active = on.has(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggle(s.id)}
                  className={`focus-ring-solid flex min-h-[48px] items-center gap-2 rounded-lg border-[length:var(--border-control)] px-3 text-left text-body-sm font-semibold transition-colors duration-quick ease-ds ${
                    active
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-field bg-background text-foreground hover:border-selection-border hover:bg-card"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      active ? "border-primary bg-primary text-primary-foreground" : "border-field bg-background"
                    }`}
                  >
                    {active && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        <div role="radiogroup" aria-labelledby="planner-inside" className="flex flex-col gap-2.5">
          <p id="planner-inside" className="text-label font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Inside too?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: false, label: "Outside only" },
              { value: true, label: "Inside too" },
            ].map((o) => (
              <button
                key={o.label}
                type="button"
                role="radio"
                aria-checked={inside === o.value}
                onClick={() => chooseInside(o.value)}
                className={`focus-ring-solid min-h-[48px] rounded-lg border-[length:var(--border-control)] px-3 text-body-sm font-semibold transition-colors duration-quick ease-ds ${
                  inside === o.value
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-field bg-background text-foreground hover:border-selection-border hover:bg-card"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-secondary p-5" aria-live="polite">
          {count > 0 ? (
            <>
              <p className="text-label font-semibold uppercase tracking-[0.14em] text-muted-foreground">Your plan</p>
              <p className="mt-1 text-3xl font-bold leading-none text-foreground">
                {count} camera{count === 1 ? "" : "s"}
              </p>
              <p className="mt-2 text-body-sm text-muted-foreground">
                {outside.length} outside{inside ? ", 1 inside" : ""}, with the recorder and the app on your phone.
              </p>
            </>
          ) : (
            <p className="text-body text-muted-foreground">Tap a place on the house or in the list to start your plan.</p>
          )}
          <a
            href="#quote"
            onClick={getPrice}
            className="focus-ring-solid mt-4 flex h-control-lg w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-primary-foreground transition-colors duration-quick ease-ds hover:bg-brand-hover"
          >
            {count > 0 ? "Get the price for this plan" : "Get my free quote"}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </a>
          <p className="mt-2.5 text-center text-body-sm text-muted-foreground">Your price the same day. Nothing to pay monthly.</p>
        </div>
      </div>
    </div>
  );
}
