"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Cctv, DoorOpen, ShieldCheck } from "lucide-react";
import { SecurityHeroFunnel } from "./security-hero-funnel";
import type { SecurityNeed } from "./security-need-step";

/**
 * The Ajax hero's inner part: the camera behind the centred copy and form,
 * and the alerts that answer the form. 15 October 2026.
 *
 * Gus tried a split hero first (copy left, camera right with alert cards),
 * liked the treatment, and asked for it centred: the same centred layout as
 * before, with the camera behind it. Then: a side view, at the edge, looking
 * in. So the camera sits at the right edge, part of it off-canvas, its lens
 * turned towards the copy and the form, and the alerts float in the left
 * margin, where it is looking, which a centred layout leaves empty on wide
 * screens. The hero's rings stay centred on the form.
 *
 * The alerts answer "What do you need?": they take turns until the visitor
 * picks, then settle on a person on the drive camera for Cameras, the front
 * door and the arming for Alarm, one of each for Both. Cards only from xl
 * (1280): narrower, the margins are too small and they would cover the
 * headline. Phones get the camera, the glow, the rings and the light.
 * Everything stops for prefers-reduced-motion.
 *
 * PLACEHOLDER IMAGE. The side view here is the one Gus sent first, which is
 * mirrored: the logo reads backwards. It shows the composition until he finds
 * a left-facing render with the logo the right way round; swap the three
 * ajax-turretcam-side-*.webp files and re-check the lens (30% / 78%) and
 * light (15% / 65%) positions. Exported at 400, 640 and 960 px (15, 33 and
 * 69 KB). Ajax's own product render, transparent background.
 *
 * BEFORE THIS GOES LIVE:
 *   - Rights. It is Ajax's image and InstallPros is not an Ajax partner yet.
 *     Confirm with the distributor or Ajax that it can be used.
 *   - Cameras are settled (Jordan, 15 October): with an Ajax alarm the
 *     cameras are Ajax too, one app. Hikvision has its own page, so an Ajax
 *     camera is the right hero for this one.
 */

/**
 * Where to draw the recording light and LIVE on a hero PHOTOGRAPH. The photo
 * is object-fit: cover, so where a point of it lands depends on the screen;
 * these are fractions of the image, and the layer works out the pixels.
 * `position` must match the object-position the section gives the photo.
 */
export type PhotoSpots = {
  desktop: {
    width: number;
    height: number;
    position: [number, number];
    led: [number, number];
    live: [number, number];
    /** The camera's centre. The hero's overlay is lightest here (Gus,
     *  15 October: the camera lighter, the ceiling darker), so the section
     *  gets --cam-x, --cam-y, --cam-rx and --cam-ry in pixels. */
    focus: [number, number];
  };
  mobile: { width: number; height: number; position: [number, number]; led: [number, number] };
};

/** Point (u, v) of a w x h image, object-fit: cover in a W x H box at position (px, py). */
function coverPoint(W: number, H: number, w: number, h: number, [px, py]: [number, number], [u, v]: [number, number]) {
  const scale = Math.max(W / w, H / h);
  const rw = w * scale;
  const rh = h * scale;
  return { x: (W - rw) * px + u * rw, y: (H - rh) * py + v * rh };
}

function PhotoSpotsLayer({ spots, showLive, reduce }: { spots: PhotoSpots; showLive: boolean; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<{ led: { x: number; y: number }; live: { x: number; y: number } | null } | null>(null);

  useEffect(() => {
    const section = ref.current?.closest("section");
    if (!section) return;
    const md = window.matchMedia("(min-width: 768px)");
    const xl = window.matchMedia("(min-width: 1280px)");
    const measure = () => {
      const { width: W, height: H } = section.getBoundingClientRect();
      if (md.matches) {
        const d = spots.desktop;
        const scale = Math.max(W / d.width, H / d.height);
        const focus = coverPoint(W, H, d.width, d.height, d.position, d.focus);
        section.style.setProperty("--cam-x", `${focus.x}px`);
        section.style.setProperty("--cam-y", `${focus.y}px`);
        // The dome is about a quarter of the photograph wide and half of it
        // tall; the light reaches a little past it.
        section.style.setProperty("--cam-rx", `${d.width * 0.2 * scale}px`);
        section.style.setProperty("--cam-ry", `${d.height * 0.42 * scale}px`);
        setGeo({
          led: coverPoint(W, H, d.width, d.height, d.position, d.led),
          live: xl.matches ? coverPoint(W, H, d.width, d.height, d.position, d.live) : null,
        });
      } else {
        const m = spots.mobile;
        setGeo({ led: coverPoint(W, H, m.width, m.height, m.position, m.led), live: null });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(section);
    md.addEventListener("change", measure);
    xl.addEventListener("change", measure);
    return () => {
      ro.disconnect();
      md.removeEventListener("change", measure);
      xl.removeEventListener("change", measure);
    };
  }, [spots]);

  return (
    <div ref={ref} className="absolute inset-0">
      {geo && (
        <>
          <motion.span
            className="absolute block h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff3b30] shadow-[0_0_14px_5px_rgba(255,59,48,0.7)] md:h-3 md:w-3"
            style={{ left: geo.led.x, top: geo.led.y }}
            animate={reduce ? { opacity: 0.9 } : { opacity: [0.35, 1, 0.35] }}
            transition={reduce ? { duration: 0 } : { duration: 1.6, ease: "easeInOut", repeat: Infinity }}
          />
          <AnimatePresence>
            {geo.live && showLive && (
              // Centred on its point; the wrapper does the centring because
              // Motion's own transform would override a translate class.
              <div key="live" className="absolute -translate-x-1/2" style={{ left: geo.live.x, top: geo.live.y }}>
              <motion.div
                {...CARD_MOTION}
                className="flex items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-[#0b1520]/75 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md"
              >
                <motion.span
                  className="block h-2 w-2 rounded-full bg-[#ff3b30]"
                  animate={reduce ? undefined : { opacity: [1, 0.25, 1] }}
                  transition={reduce ? undefined : { duration: 1.2, repeat: Infinity }}
                />
                Live
                <span className="font-medium normal-case tracking-normal text-white/60">Front drive</span>
              </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

type Alert = { key: string; icon: ReactNode; title: string; detail: string; time: string; tone?: "warn" };

const ALERTS: Record<"camera" | "door" | "armed", Alert> = {
  camera: { key: "camera", icon: <Cctv className="h-4 w-4" />, title: "Person detected", detail: "Front drive camera", time: "22:31", tone: "warn" },
  door: { key: "door", icon: <DoorOpen className="h-4 w-4" />, title: "Front door opened", detail: "Disarmed at the keypad", time: "17:46" },
  armed: { key: "armed", icon: <ShieldCheck className="h-4 w-4" />, title: "Armed, away", detail: "Sarah, from the app", time: "08:12" },
};
const CYCLE: Alert[] = [ALERTS.camera, ALERTS.door, ALERTS.armed];

/** Which alerts sit in the two side slots: left, right. */
function alertsFor(need: SecurityNeed | null, tick: number): [Alert | null, Alert | null] {
  if (need === "cameras") return [ALERTS.camera, null];
  if (need === "alarm") return [ALERTS.door, ALERTS.armed];
  if (need === "both") return [ALERTS.camera, ALERTS.door];
  return [CYCLE[tick % CYCLE.length], null];
}

function AlertCard({ alert }: { alert: Alert }) {
  return (
    <div className="flex w-[264px] items-start gap-3 rounded-2xl border border-white/10 bg-[#0b1520]/80 px-3.5 py-3 text-left text-white shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md">
      <span
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          alert.tone === "warn" ? "bg-[#C70505] text-white" : "bg-white/15 text-white"
        }`}
      >
        {alert.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="truncate text-[14px] font-semibold leading-tight">{alert.title}</span>
          <span className="shrink-0 text-[11px] text-white/60">{alert.time}</span>
        </span>
        <span className="mt-0.5 block truncate text-[13px] leading-snug text-white/70">{alert.detail}</span>
      </span>
    </div>
  );
}

const CARD_MOTION = {
  initial: { opacity: 0, y: 12, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.98 },
  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
};

export function SecurityHeroInteractive({
  intro,
  defaultInstallType,
  formName,
  photo = false,
  photoSpots,
}: {
  /** The hero has a photograph with its own camera: drop the drawn camera
   *  and its rings, keep the alerts. */
  photo?: boolean;
  /** Where the photograph's camera is, for the recording light and LIVE. */
  photoSpots?: PhotoSpots;
  /** Badge, H1 and subheadline, rendered by the server component. */
  intro: ReactNode;
  defaultInstallType: string;
  formName: string;
}) {
  const reduce = useReducedMotion();
  const [need, setNeed] = useState<SecurityNeed | null>(null);
  const [tick, setTick] = useState(0);

  // The alerts take turns only until the visitor answers.
  useEffect(() => {
    if (reduce || need !== null) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 3200);
    return () => window.clearInterval(id);
  }, [reduce, need]);

  const [slotA, slotB] = alertsFor(need, tick);
  const showLive = need !== "alarm";

  return (
    <div className="relative z-20 flex flex-1 justify-center pt-28 pb-16 md:pt-36">
      {/* Decoration layer. Clipped so the rings and the camera's off-canvas
          half never cause sideways scroll; the form is outside it, so its
          address dropdown is not clipped. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {photo && photoSpots && <PhotoSpotsLayer spots={photoSpots} showLive={showLive} reduce={Boolean(reduce)} />}
        {!photo && (
          <>
        {/* Static rings centred on the form, as the hero always had. */}
        <svg
          className="absolute left-1/2 top-[62%] h-[1400px] w-[1400px] -translate-x-1/2 -translate-y-1/2 md:top-[64%]"
          viewBox="0 0 1400 1400"
          fill="none"
        >
          {[140, 260, 380, 500, 620, 700].map((r, i) => (
            <circle key={r} cx="700" cy="700" r={r} stroke="white" strokeOpacity={0.07 - i * 0.009} strokeWidth="1" />
          ))}
        </svg>

        {/* The camera at the right edge, part of it off-canvas, its lens
            (30% across, 78% down the image) turned towards the copy and the
            form. */}
        <div className="absolute right-[-96px] top-[13%] w-[230px] sm:right-[-70px] sm:w-[280px] md:right-[-4%] md:top-[30%] md:w-[min(36vw,480px)]">
          <div className="relative">
            {/* Light behind the camera: a black camera on a near-black hero
                needs something to stand against. */}
            <div
              className="absolute -inset-[35%] rounded-full"
              style={{ background: "radial-gradient(closest-side, rgba(90,140,190,0.30), rgba(90,140,190,0.09) 55%, transparent 75%)" }}
            />
            {/* Pulses from the lens. */}
            <div className="absolute left-[30%] top-[78%] h-0 w-0">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="absolute -ml-[130px] -mt-[130px] block h-[260px] w-[260px] rounded-full border border-white/20 md:-ml-[300px] md:-mt-[300px] md:h-[600px] md:w-[600px]"
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={reduce ? { scale: 0.6, opacity: 0.1 } : { scale: [0.2, 1.15], opacity: [0.4, 0] }}
                  transition={reduce ? { duration: 0 } : { duration: 3.6, ease: "easeOut", repeat: Infinity, delay: i * 1.2 }}
                />
              ))}
            </div>
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                animate={reduce ? undefined : { y: [0, -8, 0] }}
                transition={reduce ? undefined : { duration: 7, ease: "easeInOut", repeat: Infinity }}
                className="relative"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/funnel/ajax-turretcam-side-640.webp"
                  srcSet="/funnel/ajax-turretcam-side-400.webp 400w, /funnel/ajax-turretcam-side-640.webp 640w, /funnel/ajax-turretcam-side-960.webp 960w"
                  sizes="(min-width: 768px) min(36vw, 480px), (min-width: 640px) 280px, 230px"
                  width={960}
                  height={1013}
                  alt=""
                  loading="eager"
                  decoding="async"
                  className="block h-auto w-full select-none opacity-60 drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)] md:opacity-90"
                  draggable={false}
                />
                {/* The recording light, in the window above-left of the lens. */}
                <motion.span
                  className="absolute left-[15%] top-[65%] block h-[2%] w-[2%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff3b30] shadow-[0_0_14px_5px_rgba(255,59,48,0.7)]"
                  animate={reduce ? { opacity: 0.9 } : { opacity: [0.35, 1, 0.35] }}
                  transition={reduce ? { duration: 0 } : { duration: 1.6, ease: "easeInOut", repeat: Infinity }}
                />
              </motion.div>
            </motion.div>

            {/* LIVE, on the camera body beside the lens, clear of the
                headline, from xl. */}
            <div className="hidden xl:block">
              <AnimatePresence>
                {showLive && (
                  <motion.div
                    key="live"
                    {...CARD_MOTION}
                    className="absolute left-[46%] top-[56%] flex items-center gap-2 rounded-full border border-white/10 bg-[#0b1520]/75 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md"
                  >
                    <motion.span
                      className="block h-2 w-2 rounded-full bg-[#ff3b30]"
                      animate={reduce ? undefined : { opacity: [1, 0.25, 1] }}
                      transition={reduce ? undefined : { duration: 1.2, repeat: Infinity }}
                    />
                    Live
                    <span className="font-medium normal-case tracking-normal text-white/60">Front drive</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
          </>
        )}

        {/* Alerts in the left margin, where the camera is looking, from xl.
            Low, beside the form: at 1280 the headline and subheadline reach
            within 40px of the edge, so higher up a card would cover them. */}
        <div className="hidden xl:block">
          <div className="absolute left-[3%] top-[61%] 2xl:left-[6%]">
            <AnimatePresence mode="wait">
              {slotB && (
                <motion.div key={slotB.key} {...CARD_MOTION} transition={{ ...CARD_MOTION.transition, delay: 0.12 }}>
                  <AlertCard alert={slotB} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="absolute left-[3%] top-[74%] 2xl:left-[6%]">
            <AnimatePresence mode="wait">
              {slotA && (
                <motion.div key={slotA.key} {...CARD_MOTION}>
                  <AlertCard alert={slotA} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="container relative mx-auto my-auto text-center text-white">
        {intro}
        <div className="animate-slide-up animate-delay-300 mx-auto w-full md:max-w-2xl">
          <SecurityHeroFunnel defaultInstallType={defaultInstallType} skipServiceStep formName={formName} onNeedChange={setNeed} />
        </div>
      </div>
    </div>
  );
}
