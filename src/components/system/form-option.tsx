"use client";

import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormOptionProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  /** Radio group name. Options in the same question must share it. */
  name: string;
  className?: string;
  icon?: ReactNode;
}

/**
 * Picture card for a single choice: an icon above a one or two word label, laid
 * out two across. Use it when the icon is what gets read first — on the install
 * type step nobody reads "Marine", they see a boat. Choicebox is the one for
 * options that need explaining, or when more than one can be picked.
 *
 * Selection uses --selection, never brand red: red belongs to the CTA.
 *
 * This used to be a <button aria-pressed>, which is toggle semantics — "this
 * thing is on or off", independently of its neighbours. Every use is a
 * pick-one question, so a screen reader was announcing four independent
 * switches where only one can be on, with no indication they were a set. It is
 * a real radio group now: arrow keys move between options, the group is
 * announced as a group, and only one can be checked by construction rather
 * than by the parent remembering to.
 */
export function FormOption({ label, selected, onSelect, name, className, icon }: FormOptionProps) {
  return (
    <label
      className={cn(
        "relative flex w-full cursor-pointer rounded-lg border-[length:var(--border-control)] p-4 font-semibold text-foreground transition-all duration-quick ease-ds",
        icon ? "flex-col items-center justify-center gap-2 text-center" : "text-left",
        selected
          ? "border-selection bg-card"
          : "border-field bg-secondary hover:border-field-hover hover:bg-card",
        className,
      )}
    >
      <input
        type="radio"
        name={name}
        checked={selected}
        onChange={onSelect}
        className="peer sr-only"
      />

      {/* Round, with a tick rather than a dot. The shape is what says "pick one"
          — Choicebox's checkbox is square for the same reason — so the tick is
          free to mean nothing more than "this is the one". */}
      <span
        aria-hidden
        className={cn(
          "absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border-[length:var(--border-control)] transition-colors",
          selected ? "border-selection bg-selection" : "border-field bg-background",
        )}
      >
        {/* white, not a surface token: this mark sits ON the dark --selection
            fill, so it is that swatch's contrasting foreground rather than a
            page surface. */}
        {selected && <Check className="h-3 w-3 text-white" strokeWidth={3.5} />}
      </span>

      {icon && <span className={cn("contents", selected ? "text-selection" : "text-muted-foreground")}>{icon}</span>}
      {label}

      {/* Focus lives on the visually-hidden input, so mirror it onto the card. */}
      <span className="pointer-events-none absolute inset-0 rounded-lg ring-offset-2 peer-focus-visible:ring-2 peer-focus-visible:ring-selection" />
    </label>
  );
}
