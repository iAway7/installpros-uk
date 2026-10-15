"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Camera, KeyRound, ShieldCheck, UserRound } from "lucide-react";

/**
 * The phone in the Ajax page's "Easy for the whole family" section, animated.
 * 15 October 2026: Gus liked the hero's alert cards and asked for the phone's
 * notifications to move the same way.
 *
 * The four alerts are one day in one house, so they arrive as a day would:
 * when the phone scrolls into view, each drops in at the top, the earlier
 * ones slide down, and the lock-screen clock moves to its time, 08:12, 10:02,
 * 17:46, 22:31. Newest on top, the way a phone stacks them. The last one, the
 * photo to check, keeps a soft pulse on its icon.
 *
 * It plays once. The phone never changes size while it plays: an invisible
 * copy of the full list holds the space and the animated list sits over it.
 * With prefers-reduced-motion the final state shows straight away.
 *
 * THE PHONE IS AN ILLUSTRATION, not a screenshot of the Ajax app: no Ajax logo,
 * no copy of their interface, a generic lock screen with the kind of alert the
 * system sends. Each alert is one of the sales-call points: armed from the
 * app, a temporary user, a key fob, a photo to check before anyone panics.
 */

type Alert = { icon: ReactNode; title: string; detail: string; time: string; tone?: "warn" };

const ALERTS: Alert[] = [
  { icon: <ShieldCheck className="h-4 w-4" />, title: "Armed, away", detail: "Sarah, from the app", time: "08:12" },
  { icon: <UserRound className="h-4 w-4" />, title: "Disarmed", detail: "Maria, temporary access", time: "10:02" },
  { icon: <KeyRound className="h-4 w-4" />, title: "Front door opened", detail: "Tom, key fob", time: "17:46" },
  { icon: <Camera className="h-4 w-4" />, title: "Motion in the hallway", detail: "Photo attached, tap to check", time: "22:31", tone: "warn" },
];

/** Before the first alert lands. */
const START_TIME = "07:58";
const FIRST_DELAY = 450;
const STEP = 1150;

function AlertRow({ alert, pulse }: { alert: Alert; pulse?: boolean }) {
  return (
    <>
      <span
        className={`relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          alert.tone === "warn" ? "bg-[#C70505] text-white" : "bg-white/15 text-white"
        }`}
      >
        {pulse && (
          <motion.span
            className="absolute inset-0 rounded-lg"
            animate={{ boxShadow: ["0 0 0 0 rgba(199,5,5,0.55)", "0 0 0 8px rgba(199,5,5,0)"] }}
            transition={{ duration: 1.6, ease: "easeOut", repeat: Infinity }}
          />
        )}
        {alert.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="truncate text-[14px] font-semibold leading-tight">{alert.title}</span>
          <span className="shrink-0 text-[11px] text-white/60">{alert.time}</span>
        </span>
        <span className="mt-0.5 block truncate text-[13px] leading-snug text-white/75">{alert.detail}</span>
      </span>
    </>
  );
}

const ROW = "flex items-start gap-3 rounded-2xl bg-white/[0.12] px-3 py-2.5 text-left text-white backdrop-blur";

export function SecurityPhoneMock() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (reduce) {
      setShown(ALERTS.length);
      return;
    }
    if (!inView) return;
    const timers = ALERTS.map((_, i) => window.setTimeout(() => setShown(i + 1), FIRST_DELAY + i * STEP));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [inView, reduce]);

  const visible = ALERTS.slice(0, shown).reverse();
  const clock = shown > 0 ? ALERTS[shown - 1].time : START_TIME;
  const done = shown === ALERTS.length;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Illustration of a phone lock screen with four alarm alerts: armed away by Sarah from the app, disarmed by Maria with temporary access, front door opened by Tom with a key fob, and motion in the hallway with a photo to check."
      className="relative mx-auto w-full max-w-[280px] md:max-w-[320px]"
    >
      {/* A soft halo so the dark phone does not sit on white like a hole. */}
      <div aria-hidden="true" className="absolute -inset-10 rounded-[4rem] bg-[radial-gradient(closest-side,rgba(13,27,42,0.10),transparent)]" />
      <div
        aria-hidden="true"
        className="relative overflow-hidden rounded-[2.75rem] border-[9px] border-[#111] shadow-raised"
        style={{ background: "radial-gradient(120% 60% at 50% 0%, #1d3045 0%, #0d1b2a 55%, #05080c 100%)" }}
      >
        <div className="mx-auto mt-2.5 h-[22px] w-[92px] rounded-full bg-[#111]" />

        <div className="px-4 pb-6 pt-6 text-center text-white">
          <p className="text-body-sm font-medium text-white/70">Tuesday</p>
          <div className="relative mt-0.5 h-[56px] overflow-hidden">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.p
                key={clock}
                className="absolute inset-x-0 text-[56px] font-semibold leading-none tracking-[-0.03em] tabular-nums"
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

        <div className="relative px-3 pb-8">
          {/* Holds the space of the full stack, so the phone keeps its size. */}
          <ul className="invisible space-y-2">
            {ALERTS.map((a) => (
              <li key={a.title} className={ROW}>
                <AlertRow alert={a} />
              </li>
            ))}
          </ul>

          <ul className="absolute inset-x-3 top-0 space-y-2">
            <AnimatePresence initial={false}>
              {visible.map((a) => (
                <motion.li
                  key={a.title}
                  layout={!reduce}
                  className={ROW}
                  initial={reduce ? false : { opacity: 0, y: -18, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                >
                  <AlertRow alert={a} pulse={done && !reduce && a.tone === "warn"} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>

        <div className="mx-auto mb-2.5 h-[5px] w-[110px] rounded-full bg-white/50" />
      </div>
    </div>
  );
}
