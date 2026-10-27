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
 * The look is the third attempt. A coloured cartoon of a house, then a
 * thin-line plan, both read as flat and cheap (Gus: "parece hecho en
 * Paint"). Now the base is a real-looking aerial photo of a semi at dusk,
 * with glowing coverage beams and glass labels over it, like a monitoring
 * app. The places are labels you tap on the photo, so the photo is the
 * control. The
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

// Positions are pixels on the aerial photo (1264 x 848): a British semi at
// dusk, generated in Figma on 27 October (prompt 10 in
// hikvision-research/prompts-imagenes.md). Move them if the photo changes.
const SPOTS: Spot[] = [
  { id: "front", short: "Front door", label: "Front door", at: [483, 482], dir: 90, reach: 170, tag: [445, 592] },
  { id: "drive", short: "Drive", label: "Drive and car", at: [414, 446], dir: 135, reach: 230, tag: [262, 612] },
  { id: "street", short: "Street", label: "Car on the street", at: [736, 490], dir: 95, reach: 300, tag: [880, 786] },
  { id: "side", short: "Side gate", label: "Side and gate", at: [882, 440], dir: 70, reach: 170, tag: [930, 560] },
  { id: "back", short: "Back door", label: "Back door", at: [520, 214], dir: 245, reach: 180, tag: [392, 92] },
  { id: "garden", short: "Garden", label: "Garden and shed", at: [872, 214], dir: 305, reach: 170, tag: [905, 182] },
];

const DEFAULT: SpotId[] = ["front", "drive", "back"];

/** Inside works like outside: one camera per room (Gus, 27 October: "inside"
 *  should not be a single camera). The hall opens ticked. */
type RoomId = "hall" | "living" | "kitchen" | "garage";
const ROOMS: { id: RoomId; label: string }[] = [
  { id: "hall", label: "Hall" },
  { id: "living", label: "Living room" },
  { id: "kitchen", label: "Kitchen" },
  { id: "garage", label: "Garage" },
];

const W = 1264;
const H = 848;

function wedge([cx, cy]: [number, number], dir: number, r: number): string {
  const rad = Math.PI / 180;
  const p = (a: number) => `${(cx + r * Math.cos(a * rad)).toFixed(1)} ${(cy + r * Math.sin(a * rad)).toFixed(1)}`;
  return `M${cx} ${cy}L${p(dir - 34)}A${r} ${r} 0 0 1 ${p(dir + 34)}Z`;
}

/** "Front door, drive and car and back door". */
function sentence(items: string[]): string {
  const words = items.map((s, i) => (i === 0 ? s : s.toLowerCase()));
  if (words.length <= 1) return words.join("");
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

/** The photo, and over it what each chosen camera covers: a red beam that
 *  fades with distance, edged so it reads on light and dark parts alike. */
function Plan({ on, onToggle }: { on: Set<SpotId>; onToggle: (id: SpotId) => void }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/funnel/hikvision-planner-aerial-1264.webp"
        srcSet="/funnel/hikvision-planner-aerial-828.webp 828w, /funnel/hikvision-planner-aerial-1264.webp 1264w"
        sizes="(min-width: 1024px) 60vw, 100vw"
        alt="A British semi-detached house at dusk, seen from above, with its drive, gardens and the street"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_55%,rgba(13,27,42,0.55))]" />
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          {SPOTS.map((s) => (
            <radialGradient key={s.id} id={`beam-${s.id}`} gradientUnits="userSpaceOnUse" cx={s.at[0]} cy={s.at[1]} r={s.reach}>
              <stop offset="0%" stopColor="#ff3b30" stopOpacity="0.7" />
              <stop offset="65%" stopColor="#ff3b30" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#ff3b30" stopOpacity="0.12" />
            </radialGradient>
          ))}
        </defs>
        <g>
          {SPOTS.map((s) => (
            <path
              key={s.id}
              d={wedge(s.at, s.dir, s.reach)}
              fill={`url(#beam-${s.id})`}
              stroke="#ff6a5f"
              strokeOpacity={0.85}
              strokeWidth={2}
              opacity={on.has(s.id) ? 1 : 0}
              className="transition-opacity duration-500 ease-out motion-reduce:transition-none"
            />
          ))}
        </g>
        {SPOTS.map((s) => {
          const active = on.has(s.id);
          return (
            <g key={s.id} onClick={() => onToggle(s.id)} className="cursor-pointer">
              <circle cx={s.at[0]} cy={s.at[1]} r="26" fill="transparent" />
              {active && <circle cx={s.at[0]} cy={s.at[1]} r="18" fill="#ff3b30" fillOpacity="0.3" />}
              <circle
                cx={s.at[0]}
                cy={s.at[1]}
                r={active ? 9 : 7}
                fill={active ? "#ff3b30" : "rgba(255,255,255,0.85)"}
                stroke={active ? "#ffffff" : "rgba(13,27,42,0.7)"}
                strokeWidth={active ? 3 : 2}
              />
            </g>
          );
        })}
      </svg>
    </>
  );
}

export function HikvisionCameraPlanner() {
  const [on, setOn] = useState<Set<SpotId>>(() => new Set(DEFAULT));
  const [inside, setInside] = useState(false);
  const [rooms, setRooms] = useState<Set<RoomId>>(() => new Set<RoomId>(["hall"]));
  // Only a plan someone has touched is passed on: the default three are the
  // page's suggestion, not theirs.
  const touched = useRef(false);

  const chosen = SPOTS.filter((s) => on.has(s.id));
  const indoors = inside ? ROOMS.filter((r) => rooms.has(r.id)) : [];
  const count = chosen.length + indoors.length;

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

  function toggleRoom(id: RoomId) {
    touched.current = true;
    setRooms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const plan = (): HikvisionPlan => ({
    spots: chosen.map((s) => s.label),
    inside: indoors.length > 0,
    rooms: indoors.map((r) => r.label),
    count,
  });

  useEffect(() => {
    if (!touched.current) return;
    savePlan(plan());
    // The plan derives from on, inside and rooms.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, inside, rooms]);

  function getPrice() {
    touched.current = true;
    savePlan(plan());
    track(EVENTS.CTA_CLICKED, { cta_id: "planner_quote", cta_label: `${count}_cameras_${indoors.length}_inside`, cta_location: "planner" });
    window.dispatchEvent(new CustomEvent<HikvisionIntent>(HIKVISION_INTENT_EVENT, { detail: "new" }));
  }

  const places = [...chosen.map((s) => s.label), ...indoors.map((r) => r.label)];
  const summary = places.length > 0 ? `${sentence(places)}.` : "Tap a place on the plan to start.";

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
          <div className="relative w-full overflow-hidden rounded-3xl bg-[#0b1520] ring-1 ring-white/10 lg:rounded-r-none" style={{ aspectRatio: `${W} / ${H}` }}>
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
                        ? "border-transparent bg-[#c70505]/95 text-white shadow-[0_6px_18px_-6px_rgba(199,5,5,0.8)]"
                        : "border-white/25 bg-black/45 text-white/90 backdrop-blur-md hover:border-white/60 hover:text-white"
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

            {inside && (
              <div role="group" aria-label="Rooms inside" className="-mt-2 flex flex-wrap gap-2">
                {ROOMS.map((r) => {
                  const active = rooms.has(r.id);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleRoom(r.id)}
                      className={`focus-ring-solid inline-flex min-h-[36px] items-center gap-1 rounded-full border px-3 text-body-sm font-semibold transition-colors duration-quick ease-ds ${
                        active ? "border-transparent bg-[#c70505] text-white" : "border-white/25 text-white/80 hover:border-white/60 hover:text-white"
                      }`}
                    >
                      <span aria-hidden="true">{active ? "✓" : "+"}</span>
                      {r.label}
                    </button>
                  );
                })}
              </div>
            )}

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
