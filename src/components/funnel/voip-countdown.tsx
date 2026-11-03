"use client";

import { Fragment, useEffect, useState, type CSSProperties } from "react";
import Counter from "@/components/Counter";

/** Midnight UK time on the day copper lines close (GMT in January). */
const SWITCH_OFF = Date.UTC(2027, 0, 31);

type Left = { days: number; hours: number; minutes: number; seconds: number };

function timeLeft(now: number): Left | null {
  const ms = SWITCH_OFF - now;
  if (ms <= 0) return null;
  const total = Math.floor(ms / 1000);
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3_600),
    minutes: Math.floor((total % 3_600) / 60),
    seconds: total % 60,
  };
}

const UNITS: { key: keyof Left; label: string }[] = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
];

/**
 * Each digit as its own light tile, as in the demo's light theme: white
 * fading to pale grey, a hairline border and a small shadow.
 */
const TILE: CSSProperties = {
  background: "linear-gradient(to bottom, #ffffff 0%, #f1f2f4 100%)",
  border: "1px solid #e3e4e8",
  borderRadius: "0.16em",
  padding: "0.14em 0.16em",
  boxShadow: "0 0.03em 0.08em rgba(15,17,21,0.06)",
};

/**
 * Countdown to 31 January 2027 for the switch-off section, in the shape of
 * React Bits' own Counter demo (Gus, 3 November: "tal cual lo tienen ellos,
 * ese diseño tipo almanaque", in its light version): a white card, days, hours, minutes and seconds
 * as pairs of digit tiles with colons between, labels under each. The demo's
 * layout is not part of the component, so it is built here around four
 * Counters (src/components/Counter.tsx, React Bits, free) with Gus's
 * settings; each digit rolls with a little motion blur as it changes.
 *
 * The card clips its overflow: each Counter keeps an invisible row of all
 * ten digits for measuring, which otherwise stuck out past the right edge
 * and let a 320px phone scroll sideways. Below 350px the digits shrink a
 * little so the four pairs fit.
 *
 * Counted in the browser, once a second: the page is static, so a value
 * rendered at build time would be stale. Until the first tick the tiles hold
 * their space empty, so nothing jumps. Once the date has passed the card
 * says so instead of showing zeros.
 */
export function VoipCountdown() {
  const [left, setLeft] = useState<Left | null>(null);
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    const tick = () => {
      const next = timeLeft(Date.now());
      setLeft(next);
      setPassed(next === null);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      role="timer"
      aria-label="Time left until copper landlines close on 31 January 2027"
      className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-[#e8e9ed] bg-gradient-to-b from-white to-[#f7f7f9] px-4 pb-6 pt-6 text-foreground shadow-[0_24px_60px_-20px_rgba(15,17,21,0.22)] sm:px-8 sm:pb-8 sm:pt-7"
    >
      <p className="text-body-sm text-muted-foreground md:text-body">Copper landlines close in</p>

      {passed ? (
        <p className="mt-4 text-[32px] font-semibold leading-tight md:text-[48px]">31 January 2027</p>
      ) : (
        <div className="mt-4 flex items-start justify-center gap-1 text-[26px] font-semibold leading-none min-[350px]:gap-1.5 min-[350px]:text-[30px] min-[400px]:text-[36px] sm:gap-3 sm:text-[52px] md:text-[64px]">
          {UNITS.map((u, i) => (
            <Fragment key={u.key}>
              {i > 0 && (
                <span aria-hidden="true" className="pt-[0.22em] text-[0.55em] text-muted-foreground/50">
                  :
                </span>
              )}
              <div className="flex flex-col items-center">
                {left === null ? (
                  <span aria-hidden="true" className="flex gap-[0.08em]">
                    <span style={TILE} className="invisible inline-block leading-none">0</span>
                    <span style={TILE} className="invisible inline-block leading-none">0</span>
                  </span>
                ) : (
                  <Counter
                    value={left[u.key]}
                    fontSize="inherit"
                    fontWeight={600}
                    direction="auto"
                    duration={0.7}
                    bounce={0.2}
                    stagger={0.04}
                    // 0, not Gus's 0.3: the fade band sits outside the
                    // digit, so on a tile the rolling numbers showed above
                    // and below it. At 0 they clip at the tile's edge.
                    fade={0}
                    gap={5}
                    decimals={0}
                    minDigits={2}
                    motionBlur
                    intro
                    tabular
                    digitStyle={TILE}
                  />
                )}
                <span className="mt-3 text-[11px] text-muted-foreground sm:text-caption md:text-body">
                  {u.label}
                </span>
              </div>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
