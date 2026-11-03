"use client";

import { useEffect, useState } from "react";
import Counter from "@/components/Counter";

/** Midnight UK time on the day copper lines close (GMT in January). */
const SWITCH_OFF = Date.UTC(2027, 0, 31);

function daysLeft(now: number): number {
  return Math.ceil((SWITCH_OFF - now) / 86_400_000);
}

/**
 * Days until 31 January 2027, for the switch-off section.
 *
 * Counted in the browser: the page is static, so a number rendered at build
 * time would be days out of date by the time anyone reads it. Until the
 * effect runs, an invisible "000" holds the space so nothing jumps. Once the
 * date has passed it shows the date instead of a zero or a negative number.
 *
 * The number is React Bits' Counter (free, installed with the shadcn CLI as
 * src/components/Counter.tsx), with Gus's settings of 3 November: the digits
 * roll in once the counter is half on screen, with a little motion blur. It
 * snaps straight to the number for anyone who asks for reduced motion. Its
 * size comes from the wrapper (fontSize inherit), so the breakpoints stay in
 * the class names.
 */
export function VoipCountdown() {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(daysLeft(Date.now()));
  }, []);

  if (days !== null && days <= 0) {
    return <p className="text-[56px] font-bold leading-none tracking-tight text-foreground md:text-[88px]">31 January 2027</p>;
  }

  return (
    <div>
      <p className="text-[120px] font-semibold leading-none tracking-[-0.04em] text-foreground md:text-[200px]">
        {days === null ? (
          <span className="invisible">000</span>
        ) : (
          <Counter
            value={days}
            fontSize="inherit"
            fontWeight={600}
            direction="auto"
            duration={0.7}
            bounce={0.2}
            stagger={0.04}
            fade={0.3}
            gap={0}
            decimals={0}
            minDigits={1}
            motionBlur
            intro
            tabular
          />
        )}
      </p>
      <p className="mt-3 text-lead font-semibold text-foreground md:mt-4 md:text-xl">
        {days === 1 ? "day" : "days"} until copper landlines close
      </p>
      <p className="mt-1 text-body text-muted-foreground md:text-lg">31 January 2027</p>
    </div>
  );
}
