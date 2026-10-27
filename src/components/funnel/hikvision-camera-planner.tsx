"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { track, EVENTS } from "@/lib/analytics";
import { HIKVISION_INTENT_EVENT, type HikvisionIntent } from "./hikvision-need-step";
import { savePlan, type HikvisionPlan } from "@/lib/funnel/hikvision-plan";

/**
 * The camera planner, a full-width dark band of its own after "Where cameras
 * go". Gus, 27 October 2026: an interactive way to land on a camera count
 * from the places people want covered, chosen over a crime checker like
 * Securico's.
 *
 * The look is the second attempt. The first, a coloured cartoon of a house
 * with chips beside it, Gus did not like at all. This one is a plan in thin
 * lines on the page's night navy, like a monitoring screen, and the places
 * are labels you tap on the plan itself, so the drawing is the control. The
 * panel only carries the result: the count, the places in words, inside or
 * not, and the button.
 *
 * Why it works this way (hikvision-research/conversaciones-decision.md):
 *   - Buyers describe the job as places, not a count: "Cam on frnlont of
 *     house over looking car parked on road next cam to look down side of
 *     house next one to look at back door n gate". One camera per place.
 *   - Staff had to confirm positions in 28 threads; the plan is that answer,
 *     handed over before the call.
 *   - It opens on three (front door, drive, back door), the median, so the
 *     band is complete before anyone taps.
 *   - Inside or not was a question staff asked; it adds one camera.
 *   - No price: how many, never how much.
 *
 * The plan travels in sessionStorage (lib/funnel/hikvision-plan.ts) once
 * someone has touched it, and the thank-you page puts it in the WhatsApp
 * message. It is not stored on the lead: that needs a field in the shared
 * submit path and Will's Zap to map it, a separate decision.
 */

type SpotId = "front" | "drive" | "street" | "side" | "back" | "garden";

type Spot = {
  id: SpotId;
  /** On the plan's label. */
  short: string;
  /** In the summary and the WhatsApp message. */
  label: string;
  /** Camera position on the 360 x 240 plan, direction it faces, how far it sees. */
  at: [number, number];
  dir: number;
  reach: number;
  /** Top-left of the tappable label on the plan. */
  tag: [number, number];
};

const SPOTS: Spot[] = [
  { id: "front", short: "Front door", label: "Front door", at: [180, 150], dir: 90, reach: 46, tag: [150, 166] },
  { id: "drive", short: "Drive", label: "Drive and car", at: [110, 148], dir: 130, reach: 50, tag: [12, 84] },
  { id: "street", short: "Street", label: "Car on the street", at: [242, 150], dir: 95, reach: 62, tag: [262, 170] },
  { id: "side", short: "Side gate", label: "Side and gate", at: [250, 108], dir: 25, reach: 46, tag: [264, 96] },
  { id: "back", short: "Back door", label: "Back door", at: [160, 70], dir: 270, reach: 44, tag: [58, 36] },
  { id: "garden", short: "Garden", label: "Garden and shed", at: [250, 72], dir: 315, reach: 48, tag: [264, 56] },
];

const DEFAULT: SpotId[] = ["front", "drive", "back"];

const W = 360;
const H = 240;

function wedge([cx, cy]: [number, number], dir: number, r: number): string {
  const rad = Math.PI / 180;
  const p = (a: number) => `${(cx + r * Math.cos(a * rad)).toFixed(1)} ${(cy + r * Math.sin(a * rad)).toFixed(1)}`;
  return `M${cx} ${cy}L${p(dir - 36)}A${r} ${r} 0 0 1 ${p(dir + 36)}Z`;
}

/** "Front door, drive and car and back door". */
function sentence(items: string[]): string {
  const words = items.map((s, i) => (i === 0 ? s : s.toLowerCase()));
  if (words.length <= 1) return words.join("");
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

const LINE = "rgba(255,255,255,0.18)";

function Plan({ on, onToggle }: { on: Set<SpotId>; onToggle: (id: SpotId) => void }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
      {/* The street, the kerb and a car parked on it */}
      <rect x="0" y="198" width={W} height="42" fill="rgba(255,255,255,0.05)" />
      <line x1="0" y1="198" x2={W} y2="198" stroke={LINE} />
      <line x1="0" y1="219" x2={W} y2="219" stroke="rgba(255,255,255,0.22)" strokeDasharray="10 8" />
      <rect x="232" y="205" width="44" height="18" rx="5" fill="none" stroke="rgba(255,255,255,0.4)" />
      <line x1="244" y1="207" x2="244" y2="221" stroke="rgba(255,255,255,0.25)" />
      <line x1="264" y1="207" x2="264" y2="221" stroke="rgba(255,255,255,0.25)" />
      {/* The plot, the drive with the car, the path, the shed */}
      <rect x="20" y="16" width="320" height="176" fill="none" stroke={LINE} strokeDasharray="3 4" />
      <rect x="40" y="108" width="56" height="86" fill="rgba(255,255,255,0.03)" stroke={LINE} />
      <rect x="52" y="130" width="32" height="54" rx="7" fill="none" stroke="rgba(255,255,255,0.45)" />
      <line x1="54" y1="146" x2="82" y2="146" stroke="rgba(255,255,255,0.3)" />
      <line x1="54" y1="170" x2="82" y2="170" stroke="rgba(255,255,255,0.3)" />
      <rect x="172" y="150" width="16" height="48" fill="rgba(255,255,255,0.04)" />
      <rect x="288" y="26" width="36" height="24" fill="none" stroke="rgba(255,255,255,0.3)" />

      {/* What each chosen camera covers, under the house */}
      {SPOTS.map((s) => (
        <path
          key={s.id}
          d={wedge(s.at, s.dir, s.reach)}
          fill="#ff3b30"
          fillOpacity={0.16}
          stroke="#ff6a5f"
          strokeOpacity={0.6}
          strokeWidth={0.8}
          opacity={on.has(s.id) ? 1 : 0}
          className="transition-opacity duration-300 ease-out motion-reduce:transition-none"
        />
      ))}

      {/* The house, a hipped roof seen from above */}
      <rect x="110" y="70" width="140" height="80" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.75)" strokeWidth="1.4" />
      <path d="M110 70L150 110H210L250 70M110 150L150 110M210 110L250 150" fill="none" stroke="rgba(255,255,255,0.25)" />

      {/* Camera spots: tap to add or remove (the labels are the keyboard control) */}
      {SPOTS.map((s) => {
        const active = on.has(s.id);
        return (
          <g key={s.id} onClick={() => onToggle(s.id)} className="cursor-pointer">
            <circle cx={s.at[0]} cy={s.at[1]} r="10" fill="transparent" />
            {active ? (
              <circle cx={s.at[0]} cy={s.at[1]} r="5" fill="#ff3b30" stroke="#ffffff" strokeWidth="1.5" />
            ) : (
              <circle cx={s.at[0]} cy={s.at[1]} r="3.5" fill="rgba(255,255,255,0.55)" />
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function HikvisionCameraPlanner() {
  const [on, setOn] = useState<Set<SpotId>>(() => new Set(DEFAULT));
  const [inside, setInside] = useState(false);
  // Only a plan someone has touched is passed on: the default three are the
  // page's suggestion, not theirs.
  const touched = useRef(false);

  const chosen = SPOTS.filter((s) => on.has(s.id));
  const count = chosen.length + (inside ? 1 : 0);

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
    const plan: HikvisionPlan = { spots: chosen.map((s) => s.label), inside, count };
    savePlan(plan);
    // chosen and count derive from on and inside.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, inside]);

  function getPrice() {
    touched.current = true;
    savePlan({ spots: chosen.map((s) => s.label), inside, count });
    track(EVENTS.CTA_CLICKED, { cta_id: "planner_quote", cta_label: `${count}_cameras${inside ? "_inside" : ""}`, cta_location: "planner" });
    window.dispatchEvent(new CustomEvent<HikvisionIntent>(HIKVISION_INTENT_EVENT, { detail: "new" }));
  }

  const summary =
    chosen.length > 0
      ? `${sentence(chosen.map((s) => s.label))}${inside ? ", plus one inside" : ""}.`
      : inside
        ? "One inside. Tap the plan to add the outside."
        : "Tap a place on the plan to start.";

  return (
    <section id="planner" className="w-full scroll-mt-28 bg-[#0d1b2a] py-16 text-white md:py-24">
      <div className="container mx-auto">
        <div className="max-w-2xl">
          <p className="eyebrow !text-[#ff6a5f]">Plan your cameras</p>
          <h2 className="mt-4 h2-section text-white">Tap what you want to see.</h2>
          <p className="mt-4 text-pretty text-body text-white/70 md:mt-5 md:text-lg" style={{ lineHeight: "1.6" }}>
            One camera for each place. Most homes ask for three or four.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:mt-12 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:items-stretch lg:gap-0">
          {/* The plan, with its labels as real buttons laid over it */}
          <div className="relative w-full overflow-hidden rounded-3xl bg-white/[0.02] ring-1 ring-white/10 lg:rounded-r-none" style={{ aspectRatio: `${W} / ${H}` }}>
            <Plan on={on} onToggle={toggle} />
            <div role="group" aria-label="Places to cover" className="absolute inset-0">
              {SPOTS.map((s) => {
                const active = on.has(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={active}
                    aria-label={s.label}
                    onClick={() => toggle(s.id)}
                    style={{ left: `${(s.tag[0] / W) * 100}%`, top: `${(s.tag[1] / H) * 100}%` }}
                    className={`focus-ring-solid absolute inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-semibold leading-5 transition-colors duration-quick ease-ds sm:px-2.5 sm:py-1 sm:text-xs md:text-[13px] ${
                      active
                        ? "border-[#c70505] bg-[#c70505] text-white"
                        : "border-white/35 bg-[#0d1b2a]/80 text-white/85 hover:border-white/70 hover:text-white"
                    }`}
                  >
                    <span aria-hidden="true">{active ? "✓" : "+"}</span>
                    {s.short}
                  </button>
                );
              })}
            </div>
          </div>

          {/* The result */}
          <div className="flex flex-col justify-center gap-5 rounded-3xl bg-white/[0.04] p-6 ring-1 ring-white/10 md:p-8 lg:rounded-l-none">
            <div aria-live="polite">
              <p className="text-label font-semibold uppercase tracking-[0.14em] text-white/60">Your plan</p>
              <p className="mt-2 flex items-baseline gap-2">
                <span className="text-6xl font-bold leading-none tabular-nums text-white">{count}</span>
                <span className="text-xl font-semibold text-white">camera{count === 1 ? "" : "s"}</span>
              </p>
              <p className="mt-3 text-pretty text-body-sm text-white/70" style={{ lineHeight: "1.55" }}>
                {summary}
              </p>
            </div>

            <div role="radiogroup" aria-label="Inside too?" className="grid grid-cols-2 rounded-full bg-white/[0.08] p-1">
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
                  className={`focus-ring-solid min-h-[40px] rounded-full text-body-sm font-semibold transition-colors duration-quick ease-ds ${
                    inside === o.value ? "bg-white text-[#0d1b2a]" : "text-white/70 hover:text-white"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>

            <div>
              <a
                href="#quote"
                onClick={getPrice}
                className="focus-ring-solid flex h-control-lg w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-primary-foreground transition-colors duration-quick ease-ds hover:bg-brand-hover"
              >
                {count > 0 ? "Get the price for this plan" : "Get my free quote"}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
              <p className="mt-2.5 text-center text-body-sm text-white/55">Your price the same day. Nothing to pay monthly.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
