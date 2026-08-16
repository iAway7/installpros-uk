"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const DOW = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const sameDay = (a: Date, b: Date) => iso(a) === iso(b);
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/**
 * Month grid for picking an install date.
 *
 * Weeks start Monday — this is a UK product and a Sunday-first calendar reads
 * wrong here. Dates are compared as local Y-M-D strings rather than
 * timestamps, so a booking on the 3rd stays the 3rd regardless of timezone.
 */
export function Calendar({
  value,
  onChange,
  minDate,
  maxDate,
  disabledDates = [],
  className,
}: {
  value: Date | null;
  onChange: (d: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  /** Days that cannot be booked — fully-booked days, holidays. */
  disabledDates?: Date[];
  className?: string;
}) {
  const today = startOfDay(new Date());
  const [cursor, setCursor] = useState(() => {
    const base = value ?? today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const blocked = useMemo(() => new Set(disabledDates.map(iso)), [disabledDates]);

  const days = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    // getDay() is Sunday-based; shift so Monday is 0.
    const lead = (first.getDay() + 6) % 7;
    const count = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const cells: (Date | null)[] = Array(lead).fill(null);
    for (let i = 1; i <= count; i++) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), i));
    return cells;
  }, [cursor]);

  const isDisabled = (d: Date) =>
    blocked.has(iso(d)) || (minDate && d < startOfDay(minDate)) || (maxDate && d > startOfDay(maxDate));

  const shift = (n: number) => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + n, 1));

  return (
    <div className={cn("w-[320px] rounded-lg border border-border bg-card p-4", className)}>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => shift(-1)}
          aria-label="Previous month"
          className="flex h-control-sm w-control-sm items-center justify-center rounded-md text-foreground transition-colors duration-200 hover:bg-secondary focus-ring"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div aria-live="polite" className="text-body font-semibold text-foreground">
          {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
        </div>
        <button
          type="button"
          onClick={() => shift(1)}
          aria-label="Next month"
          className="flex h-control-sm w-control-sm items-center justify-center rounded-md text-foreground transition-colors duration-200 hover:bg-secondary focus-ring"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1">
        {DOW.map((d) => (
          <div key={d} className="flex h-8 items-center justify-center text-label font-semibold text-muted-foreground">
            {d}
          </div>
        ))}

        {days.map((d, i) => {
          if (!d) return <div key={`pad-${i}`} />;
          const selected = value != null && sameDay(d, value);
          const disabled = isDisabled(d);
          return (
            <button
              key={iso(d)}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              aria-label={`${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`}
              onClick={() => onChange(d)}
              className={cn(
                "flex h-control-aux items-center justify-center rounded-md text-body-sm transition-colors duration-200",
                "focus-ring",
                selected && "bg-selection font-semibold text-white",
                !selected && !disabled && "text-foreground hover:bg-secondary",
                !selected && sameDay(d, today) && "ring-1 ring-inset ring-field",
                disabled && "cursor-not-allowed text-muted-foreground/40",
              )}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
