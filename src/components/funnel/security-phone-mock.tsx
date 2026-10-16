"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Camera, Flashlight, ShieldCheck, TriangleAlert } from "lucide-react";

/**
 * The phone in the Ajax page's "Easy for the whole family" section, animated.
 *
 * 16 October 2026: drawn in the look of Ajax's own app screenshots, which Gus
 * shared: a dark lock screen, and the alerts as iPhone notifications from the
 * Ajax app, in Ajax's wording ("Home: motion detected, MotionCam in
 * Hallway"), a red "Critical" line when it is an alarm, the cards spilling
 * over the edge of the phone and narrower the older they are. It stays our
 * drawing: the app icon is a plain shield, not the Ajax mark, and nothing is
 * a screenshot.
 *
 * The four alerts are one day in one house, so they arrive as a day would:
 * each drops in at the top, the earlier ones slide down, and the clock moves
 * to its time, 08:12, 10:02, 17:46, 22:31. The two text versions of the
 * section quote the first two (Sarah at 08:12, Maria at 10:02), so those keep
 * their names and times.
 *
 * It loops (Gus, 16 October): once the day is in, it holds for a few seconds,
 * the alerts clear, the clock goes back to the morning and the day starts
 * again. Only while the phone is on screen; scrolled away it stops, and it
 * starts from the morning when it comes back. The phone never changes size
 * while it plays: an invisible copy of the full stack, laid out exactly like
 * the last frame, holds the space. With prefers-reduced-motion the final state
 * shows straight away and stays.
 */

type Alert = { message: string; time: string; critical?: boolean };

const ALERTS: Alert[] = [
  { message: "Home: armed by Sarah, from the app", time: "08:12" },
  { message: "Home: disarmed by Maria, temporary access", time: "10:02" },
  { message: "Home: disarmed by Tom, key fob", time: "17:46" },
  { message: "Home: motion detected, MotionCam in Hallway. Photo attached", time: "22:31", critical: true },
];

/** Before the first alert lands. */
const START_TIME = "07:58";
const FIRST_DELAY = 450;
const STEP = 1150;
/** How long the whole day stays on screen before the next one starts. */
const HOLD = 3500;
/** How much narrower each older card is, per side, in px. */
const STEP_IN = 12;

function Notice({ alert, pulse }: { alert: Alert; pulse?: boolean }) {
  return (
    <div className="flex items-start gap-2.5 rounded-[18px] bg-[#2a2b2d]/90 px-3 py-2.5 text-left text-white shadow-[0_12px_30px_-12px_rgba(0,0,0,0.7)] ring-1 ring-white/10 backdrop-blur-md">
      {/* The app icon: white like Ajax's, with a plain shield, not their mark. */}
      <span className="relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-white text-[#111]">
        {pulse && (
          <motion.span
            className="absolute inset-0 rounded-[9px]"
            animate={{ boxShadow: ["0 0 0 0 rgba(255,69,58,0.6)", "0 0 0 8px rgba(255,69,58,0)"] }}
            transition={{ duration: 1.6, ease: "easeOut", repeat: Infinity }}
          />
        )}
        <ShieldCheck className="h-5 w-5" strokeWidth={2.25} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          {alert.critical ? (
            <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-[#ff453a]">
              <TriangleAlert className="h-3 w-3" strokeWidth={2.5} />
              Critical
            </span>
          ) : (
            <span className="text-[13px] font-semibold leading-tight">Ajax</span>
          )}
          <span className="shrink-0 text-[11px] tabular-nums text-white/55">{alert.time}</span>
        </span>
        {alert.critical && <span className="block text-[13px] font-semibold leading-tight">Ajax</span>}
        <span className="mt-0.5 block text-[12.5px] leading-snug text-white/85">{alert.message}</span>
      </span>
    </div>
  );
}

/** Newest on top at full width, each older one a step narrower. */
const inset = (i: number) => ({ marginLeft: i * STEP_IN, marginRight: i * STEP_IN });

export function SecurityPhoneMock() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.45 });
  const [shown, setShown] = useState(0);
  const [day, setDay] = useState(0);

  useEffect(() => {
    if (reduce) {
      setShown(ALERTS.length);
      return;
    }
    if (!inView) return;
    setShown(0);
    const timers = ALERTS.map((_, i) => window.setTimeout(() => setShown(i + 1), FIRST_DELAY + i * STEP));
    // The next day, once this one has been on screen for a while.
    timers.push(window.setTimeout(() => setDay((d) => d + 1), FIRST_DELAY + (ALERTS.length - 1) * STEP + HOLD));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [inView, reduce, day]);

  const visible = ALERTS.slice(0, shown).reverse();
  const finalStack = [...ALERTS].reverse();
  const clock = shown > 0 ? ALERTS[shown - 1].time : START_TIME;
  const done = shown === ALERTS.length;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Illustration of a phone lock screen with four Ajax app notifications: armed by Sarah from the app, disarmed by Maria with temporary access, disarmed by Tom with a key fob, and a critical alert for motion in the hallway with a photo attached."
      className="relative mx-auto w-full max-w-[280px] md:max-w-[320px]"
    >
      {/* A soft halo so the dark phone does not sit on white like a hole. */}
      <div aria-hidden="true" className="absolute -inset-10 rounded-[4rem] bg-[radial-gradient(closest-side,rgba(13,27,42,0.10),transparent)]" />

      {/* The phone. Not clipped, so the notifications can spill over its
          edges; the wallpaper is clipped on its own layer. */}
      <div
        aria-hidden="true"
        className="relative rounded-[2.75rem] border-[9px] border-[#0c100e] shadow-raised ring-1 ring-[#5ce0a4]/25"
      >
        <div
          className="absolute inset-0 overflow-hidden rounded-[2.2rem]"
          style={{
            background:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 26px), repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0 2px, transparent 2px 26px), radial-gradient(120% 70% at 50% 0%, #26292c 0%, #121416 55%, #050607 100%)",
          }}
        />

        <div className="relative">
          <div className="mx-auto mt-2.5 h-[22px] w-[92px] rounded-full bg-[#0c100e]" />

          <div className="px-4 pb-5 pt-5 text-center text-white">
            <p className="text-body-sm font-medium text-white/65">Tuesday</p>
            <div className="relative mt-0.5 h-[56px] overflow-hidden">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.p
                  key={clock}
                  className="absolute inset-x-0 text-[56px] font-semibold leading-none tracking-[-0.03em] text-white/85 tabular-nums"
                  initial={reduce ? false : { y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -18, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  {clock}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* The stack runs past the phone on each side, like the cards in
              Ajax's own screenshots. The invisible copy and the live list
              span exactly the same width. */}
          <div className="relative px-3 pb-4">
            <ul className="invisible -mx-[32px] space-y-2">
              {finalStack.map((a, i) => (
                <li key={a.time} style={inset(i)}>
                  <Notice alert={a} />
                </li>
              ))}
            </ul>

            <ul className="absolute -inset-x-[20px] top-0 space-y-2">
              <AnimatePresence initial={false}>
                {visible.map((a, i) => (
                  <motion.li
                    key={a.time}
                    layout={!reduce}
                    style={inset(i)}
                    initial={reduce ? false : { opacity: 0, y: -18, scale: 0.96 }}
                    animate={{ opacity: 1 - i * 0.08, y: 0, scale: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.35 } }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  >
                    <Notice alert={a} pulse={done && !reduce && a.critical} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>

          {/* The lock screen's two buttons. */}
          <div className="flex items-center justify-between px-7 pb-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/75">
              <Flashlight className="h-4 w-4" />
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/75">
              <Camera className="h-4 w-4" />
            </span>
          </div>

          <div className="mx-auto mb-2.5 h-[5px] w-[110px] rounded-full bg-white/50" />
        </div>
      </div>
    </div>
  );
}
