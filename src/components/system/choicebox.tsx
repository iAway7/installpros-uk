"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A larger radio or checkbox: bigger tap target, room for a description.
 *
 * This is the generalised form of FormOption — same visual language, but it
 * takes a description and can behave as either single or multi select.
 * Selection uses --selection, never brand red: red belongs to the CTA.
 */
export function Choicebox({
  title,
  description,
  selected,
  onSelect,
  multi = false,
  disabled = false,
  name,
  className,
}: {
  title: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  /** Renders a square indicator and reports checkbox semantics. */
  multi?: boolean;
  disabled?: boolean;
  /** Radio group name. Required when multi is false. */
  name?: string;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "relative flex min-w-0 flex-1 cursor-pointer items-start gap-3 rounded-lg border-[length:var(--border-control)] p-4 transition-all duration-quick ease-ds",
        selected ? "border-selection bg-card ring-1 ring-selection" : "border-field bg-secondary hover:border-field-hover hover:bg-card",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <input
        type={multi ? "checkbox" : "radio"}
        name={name}
        checked={selected}
        disabled={disabled}
        onChange={onSelect}
        className="peer sr-only"
      />
      <span className="min-w-0 flex-1">
        <span className="block text-body font-semibold text-foreground">{title}</span>
        {description && (
          <span className="mt-0.5 block text-body-sm text-muted-foreground">{description}</span>
        )}
      </span>
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-[length:var(--border-control)] transition-colors",
          // rounded-xs, not rounded-md: md is 10px and this box is 20px, so the
          // "square" checkbox was rendering as a perfect circle and looked
          // identical to the radio. The shape is what tells someone whether they
          // can pick one or several, so it has to actually differ.
          multi ? "rounded-xs" : "rounded-full",
          selected ? "border-selection bg-selection" : "border-field bg-background",
        )}
      >
        {/* white, not a surface token: this mark sits ON the dark --selection
            fill, so it is the contrasting foreground of that swatch rather than
            a page surface. Swapping it for bg-background would only look right
            today because --background happens to be white, and would turn the
            mark invisible the moment it is not. */}
        {/* A tick in both, rather than a tick for multi and a dot for single.
            The shape already answers "one or several?", so the mark only has to
            say "this one is chosen" — and saying it two different ways for the
            same meaning is what made FormOption and this component look like
            unrelated patterns. The dot is the more canonical radio affordance,
            but these are large selectable cards rather than bare radios, and
            the border and fill carry the state as much as the mark does. */}
        {selected && <Check className="h-3 w-3 text-white" strokeWidth={3.5} />}
      </span>
      {/* Focus lives on the visually-hidden input, so mirror it onto the card. */}
      <span className="pointer-events-none absolute inset-0 rounded-lg ring-offset-2 peer-focus-visible:ring-2 peer-focus-visible:ring-selection" />
    </label>
  );
}

// min-w-0 on the fieldset is not cosmetic: a <fieldset> defaults to
// min-width:min-content and refuses to shrink inside a flex row, which pushes
// the whole page wider and creates horizontal scroll.
export function ChoiceboxGroup({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <fieldset className={cn("min-w-0", className)}>
      <legend className="sr-only">{label}</legend>
      <div className="flex flex-wrap gap-3">{children}</div>
    </fieldset>
  );
}
