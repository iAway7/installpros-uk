"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Camera, DoorOpen, Radar, RotateCcw, ShieldCheck, Vibrate } from "lucide-react";

/**
 * The layers of protection, played as one break-in over a full-width room at
 * night, with the cards under it lighting up as their alert arrives. Gus's
 * idea and layout, 15 October 2026.
 *
 * Everything that moves is drawn here, not in the picture: the sensors light
 * up, the motion detector's field opens, the camera frames the person with a
 * flash, and the alerts arrive in the order a break-in sets them off:
 *
 *   window, vibration sensor   "Back window being forced"
 *   window, contact            "Back window opened"
 *   motion detector            "Motion in the living room"
 *   detector with a camera     "Photo attached"
 *
 * No footprints. A first version drew a trail on the floor; flat shapes could
 * not follow the floor's perspective, and the person in the photograph walks
 * towards the window, so a trail from it ran the wrong way. If the break-in
 * is ever animated properly, it is a rendered video, not drawing.
 *
 * GEOMETRY. Points are pixels of the 1376 x 768 photograph. The SVG uses its
 * viewBox with "xMidYMid slice", which is what object-fit: cover at 50% 50%
 * does to the photo, so the drawing stays on it at any size: the full frame
 * from md, a 4:3 centre crop on phones (window, person and door all in). The
 * alert cards are HTML, pinned only from xl, where the box has the photo's
 * proportions and the heading leaves room. On md and lg the latest alert is
 * a toast on the picture; on phones it sits under the picture, so nothing
 * covers the room, and starts as a calm "Armed, away" before the window is
 * tried.
 *
 * A NEW PHOTOGRAPH means new points: the sensors and the person's box.
 *
 * Plays once when the picture is in view, and can be replayed. With
 * prefers-reduced-motion the end state shows straight away.
 */

const IMG_W = 1376;
const IMG_H = 768;
const SRC = "/funnel/ajax-intruder-1376.webp";
const SRCSET = "/funnel/ajax-intruder-960.webp 960w, /funnel/ajax-intruder-1376.webp 1376w";

const SENSOR = {
  camera: [305, 87],
  window: [386, 271],
  door: [999, 187],
  motion: [1255, 97],
} as const;

/** The person, for the camera's frame. */
const PERSON = { x0: 798, y0: 226, x1: 948, y1: 580 };

/** Width of the "Intruder" tag over the frame, in image pixels. */
const TAG_W = 86;

/** The person, cropped for the photo in the last alert: x, y, width, height. */
const THUMB = { x: 760, y: 225, w: 240, h: 338 };

type SceneEvent = { key: string; icon: ReactNode; title: string; detail: string; time: string; photo?: boolean; calm?: boolean };

const EVENTS = {
  armed: { key: "armed", icon: <ShieldCheck className="h-4 w-4" />, title: "Armed, away", detail: "Every door and window closed", time: "21:54", calm: true },
  forced: { key: "forced", icon: <Vibrate className="h-4 w-4" />, title: "Back window being forced", detail: "Vibration sensor", time: "22:30:58" },
  opened: { key: "opened", icon: <DoorOpen className="h-4 w-4" />, title: "Back window opened", detail: "Window contact", time: "22:30:59" },
  motion: { key: "motion", icon: <Radar className="h-4 w-4" />, title: "Motion in the living room", detail: "Motion detector", time: "22:31:01" },
  photo: { key: "photo", icon: <Camera className="h-4 w-4" />, title: "Photo attached", detail: "Tap to check it", time: "22:31:02", photo: true },
} satisfies Record<string, SceneEvent>;

/** Phases: 0 waiting, 1 forced, 2 opened, 3 motion, 4 photo, 5 done. */
const DONE = 5;
/** 22:30:58, the moment the window is first tried. */
const CLOCK_START = 22 * 3600 + 30 * 60 + 58;

function clock(seconds: number) {
  const h = Math.floor(seconds / 3600) % 24;
  const m = Math.floor(seconds / 60) % 60;
  const s = seconds % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

function PersonThumb() {
  return (
    <span
      className="block h-14 w-10 shrink-0 rounded-md bg-no-repeat ring-1 ring-white/15"
      style={{
        backgroundImage: `url(${SRC})`,
        backgroundSize: `${(IMG_W / THUMB.w) * 100}% auto`,
        backgroundPosition: `${(THUMB.x / (IMG_W - THUMB.w)) * 100}% ${(THUMB.y / (IMG_H - THUMB.h)) * 100}%`,
        // A detector's night photo is black and white.
        filter: "grayscale(1) contrast(1.25) brightness(1.4)",
      }}
    />
  );
}

function EventCard({ e, className = "" }: { e: SceneEvent; className?: string }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border border-white/10 bg-[#0b1520]/80 px-3.5 py-3 text-left text-white shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md ${className}`}
    >
      <span
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white ${e.calm ? "bg-white/15" : "bg-[#C70505]"}`}
      >
        {e.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold leading-tight">{e.title}</span>
        <span className="mt-1 flex items-baseline justify-between gap-2 text-[13px] leading-snug text-white/70">
          <span className="truncate">{e.detail}</span>
          <span className="shrink-0 text-[11px] tabular-nums text-white/55">{e.time}</span>
        </span>
      </span>
      {e.photo && <PersonThumb />}
    </div>
  );
}

const CARD_MOTION = {
  initial: { opacity: 0, y: 10, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.98 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
};

/** A sensor's dot; red with a ripple once it has gone off. */
function SensorDot({ at: [cx, cy], active, reduce }: { at: readonly [number, number]; active: boolean; reduce: boolean }) {
  return (
    <g>
      {active &&
        !reduce &&
        [0, 1].map((i) => (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            fill="none"
            stroke="#ff3b30"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
            initial={{ r: 6, opacity: 0.8 }}
            animate={{ r: [6, 34], opacity: [0.8, 0] }}
            transition={{ duration: 1.8, ease: "easeOut", repeat: Infinity, delay: i * 0.9 }}
          />
        ))}
      <circle
        cx={cx}
        cy={cy}
        r={active ? 6.5 : 5}
        fill={active ? "#ff3b30" : "rgba(255,255,255,0.85)"}
        style={{ filter: active ? "drop-shadow(0 0 6px rgba(255,59,48,0.9))" : "drop-shadow(0 0 4px rgba(255,255,255,0.6))" }}
      />
    </g>
  );
}

/** A card under the picture, and the phase whose alert lights it. */
export type LayerCard = { icon: ReactNode; title: string; detail: string; litAt: number };

export function SecurityLayersScene({ heading, cards, band }: { heading: ReactNode; cards: LayerCard[]; band: string }) {
  const reduce = Boolean(useReducedMotion());
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [run, setRun] = useState(0);
  const [phase, setPhase] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (reduce) {
      setPhase(DONE);
      setElapsed(4);
      return;
    }
    if (!inView) return;
    setPhase(0);
    setElapsed(0);
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    at(400, () => setPhase(1));
    at(1700, () => setPhase(2));
    at(3100, () => setPhase(3));
    at(4500, () => setPhase(4));
    at(5400, () => setPhase(DONE));
    const tick = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.clearInterval(tick);
    };
  }, [inView, reduce, run]);

  const latest = phase >= 4 ? EVENTS.photo : phase === 3 ? EVENTS.motion : phase === 2 ? EVENTS.opened : phase === 1 ? EVENTS.forced : null;
  const windowEvent = phase >= 2 ? EVENTS.opened : phase === 1 ? EVENTS.forced : null;
  const { x0, y0, x1, y1 } = PERSON;
  const L = 24;

  return (
    <>
      <div className="relative">
        {/* Up to lg the heading sits above the picture: at md it covered the
            person, at lg the window sensor. From xl it sits on it. */}
        <div className="container relative z-10 mx-auto pb-6 pt-14 md:pb-8 md:pt-20 xl:absolute xl:inset-x-0 xl:top-0 xl:pb-0 xl:pt-20">
          {heading}
        </div>

        <div ref={ref} className="relative aspect-[4/3] w-full overflow-hidden md:aspect-[1376/768]">
          <div
            role="img"
            aria-label="Illustration of a living room at night. Someone forces the back window and opens it, the motion detector picks them up and a detector with a camera sends a photo with the alert."
            className="absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SRC}
              srcSet={SRCSET}
              sizes="100vw"
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Darker and bluer than the photograph; from xl dark on the left
                under the heading; the edges run into the band. */}
            <div aria-hidden="true" className="absolute inset-0 bg-[#0d1b2a]/30 mix-blend-multiply" />
            <div
              aria-hidden="true"
              className="absolute inset-0 hidden xl:block"
              style={{
                background:
                  "linear-gradient(90deg, rgba(5,8,12,0.7) 0%, rgba(5,8,12,0.35) 32%, transparent 55%), linear-gradient(to bottom, rgba(5,8,12,0.55), transparent 30%)",
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: `linear-gradient(to bottom, ${band} 0%, transparent 14%, transparent 82%, ${band} 100%)` }}
            />

            <svg
              aria-hidden="true"
              className="absolute inset-0 h-full w-full"
              viewBox={`0 0 ${IMG_W} ${IMG_H}`}
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <radialGradient id="scene-cone" cx={SENSOR.motion[0]} cy={SENSOR.motion[1]} r="640" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#ff3b30" stopOpacity="0.32" />
                  <stop offset="1" stopColor="#ff3b30" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* The motion detector's field, towards the person. */}
              {phase >= 3 && (
                <motion.polygon
                  points={`${SENSOR.motion[0]},${SENSOR.motion[1]} 700,660 1060,600`}
                  fill="url(#scene-cone)"
                  initial={{ opacity: reduce ? 1 : 0 }}
                  animate={{ opacity: reduce ? 1 : [0, 1, 0.65] }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              )}

              {/* The camera frames the person. */}
              {phase >= 4 && (
                <motion.g
                  initial={{ opacity: reduce ? 1 : 0 }}
                  animate={{ opacity: reduce ? 1 : [0, 1, 0.4, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  <path
                    d={`M${x0} ${y0 + L}V${y0}H${x0 + L}M${x1 - L} ${y0}H${x1}V${y0 + L}M${x1} ${y1 - L}V${y1}H${x1 - L}M${x0 + L} ${y1}H${x0}V${y1 - L}`}
                    fill="none"
                    stroke="white"
                    strokeWidth={2}
                    vectorEffect="non-scaling-stroke"
                  />
                  <g className="hidden md:inline">
                    {/* Centred in the tag, so the padding is the same both sides. */}
                    <rect x={x0} y={y0 - 30} width={TAG_W} height="24" rx="5" fill="#C70505" />
                    <text
                      x={x0 + TAG_W / 2}
                      y={y0 - 18}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="white"
                      fontSize="15"
                      fontWeight="600"
                      letterSpacing="0.3"
                    >
                      Intruder
                    </text>
                  </g>
                </motion.g>
              )}

              {/* The camera's recording light, and the three sensors. */}
              <motion.circle
                cx={SENSOR.camera[0]}
                cy={SENSOR.camera[1]}
                r={5}
                fill="#ff3b30"
                style={{ filter: "drop-shadow(0 0 6px rgba(255,59,48,0.9))" }}
                animate={reduce ? { opacity: 0.9 } : { opacity: [0.35, 1, 0.35] }}
                transition={reduce ? { duration: 0 } : { duration: 1.6, ease: "easeInOut", repeat: Infinity }}
              />
              <SensorDot at={SENSOR.window} active={phase >= 1} reduce={reduce} />
              <SensorDot at={SENSOR.door} active={false} reduce={reduce} />
              <SensorDot at={SENSOR.motion} active={phase >= 3} reduce={reduce} />
            </svg>

            {/* The detector's photo: a flash over the room. */}
            {phase >= 4 && !reduce && (
              <motion.div
                key={`flash-${run}`}
                aria-hidden="true"
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 0.55, times: [0, 0.15, 1] }}
              />
            )}

            {/* xl and up: each alert next to its sensor. */}
            <div aria-hidden="true" className="hidden xl:block">
              <div className="absolute right-[75.5%] top-[36%] w-[272px]">
                <AnimatePresence mode="wait">
                  {windowEvent && (
                    <motion.div key={windowEvent.key} {...CARD_MOTION}>
                      <EventCard e={windowEvent} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="absolute right-[12.5%] top-[6%] w-[272px]">
                <AnimatePresence>
                  {phase >= 3 && (
                    <motion.div key="motion" {...CARD_MOTION}>
                      <EventCard e={EVENTS.motion} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="absolute bottom-[7%] right-[2%] w-[300px]">
                <AnimatePresence>
                  {phase >= 4 && (
                    <motion.div key="photo" {...CARD_MOTION}>
                      <EventCard e={EVENTS.photo} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* md and lg: the latest alert, bottom right, clear of the feed
                label. Phones have it under the picture. */}
            <div aria-hidden="true" className="absolute bottom-6 right-6 hidden w-[320px] md:block xl:hidden">
              <AnimatePresence mode="wait">
                {latest && (
                  <motion.div key={latest.key} {...CARD_MOTION}>
                    <EventCard e={latest} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* The feed's label, clock and replay: top left on phones (the
              heading is above the picture there), bottom left from md. */}
          <div className="absolute left-3 top-3 flex items-center gap-2 md:bottom-6 md:left-6 md:top-auto lg:left-8">
            <div
              aria-hidden="true"
              className="flex items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-[#0b1520]/75 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md"
            >
              <motion.span
                className="block h-2 w-2 rounded-full bg-[#ff3b30]"
                animate={reduce ? undefined : { opacity: [1, 0.25, 1] }}
                transition={reduce ? undefined : { duration: 1.2, repeat: Infinity }}
              />
              Live
              <span className="font-medium normal-case tracking-normal text-white/60">Living room</span>
              <span className="font-medium tabular-nums tracking-normal text-white/80">{clock(CLOCK_START + elapsed)}</span>
            </div>
            {phase === DONE && !reduce && (
              <button
                type="button"
                onClick={() => setRun((r) => r + 1)}
                aria-label="Play the break-in again"
                className="focus-ring-solid flex h-[34px] w-[34px] items-center justify-center rounded-full border border-white/10 bg-[#0b1520]/75 text-white/85 backdrop-blur-md transition-colors hover:text-white"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Phones: the latest alert under the picture, in a slot that holds
          the tallest card's height so nothing below jumps. */}
      <div aria-hidden="true" className="container mx-auto pb-6 pt-3 md:hidden">
        <div className="min-h-[82px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={(latest ?? EVENTS.armed).key} {...CARD_MOTION}>
              <EventCard e={latest ?? EVENTS.armed} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="md:border-y md:border-white/10">
        <div className="container mx-auto">
          {/* Hairlines between the cards: the grid's own background shows
              through a 1px gap. Phones get only the lines between rows, flush with
              the heading and the alert above (a full frame read as double
              borders). Each card's icon turns red when its alert
              arrives (a red line along the top was tried and dropped, Gus). */}
          <ul className="grid grid-cols-1 gap-px bg-white/10 md:grid-cols-2 md:border-x md:border-white/10 lg:grid-cols-4">
            {cards.map((c) => {
              const lit = phase >= c.litAt;
              return (
                <li key={c.title} className="relative flex gap-4 py-5 md:flex-col md:gap-0 md:p-8" style={{ backgroundColor: band }}>
                  <span
                    aria-hidden="true"
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] transition-colors duration-500 md:h-auto md:w-auto md:justify-start md:rounded-none md:bg-transparent ${
                      lit ? "text-[#ff6a5f]" : "text-white/80"
                    }`}
                  >
                    {c.icon}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-body font-semibold text-white md:mt-14">{c.title}</h3>
                    <p className="mt-1 text-body-sm leading-[1.6] text-white/60 md:mt-2">{c.detail}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
