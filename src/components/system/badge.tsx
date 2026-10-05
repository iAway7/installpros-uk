import { cn } from "@/lib/utils";

type Variant = "brand" | "neutral" | "success" | "warning" | "error";

const TONE: Record<Variant, string> = {
  brand:   "border-brand-soft/25 text-brand-icon",
  neutral: "border-border text-muted-foreground",
  success: "border-success/30 text-success",
  warning: "border-warning/30 text-warning",
  error:   "border-error/30 text-error",
};

const FILLED: Record<Variant, string> = {
  brand:   "bg-primary text-primary-foreground border-transparent",
  neutral: "bg-secondary text-foreground border-transparent",
  success: "bg-success text-success-foreground border-transparent",
  warning: "bg-warning text-warning-foreground border-transparent",
  error:   "bg-error text-error-foreground border-transparent",
};

/**
 * Small uppercase tag. Labels a thing — it is not a button and never
 * interactive. For a status that changes over time, use `Pill`.
 */
export function Badge({
  children,
  variant = "brand",
  fill = false,
  className,
}: {
  children: React.ReactNode;
  variant?: Variant;
  fill?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 py-1",
        "text-micro font-semibold uppercase tracking-[1.5px]",
        fill ? FILLED[variant] : TONE[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export type PillVariant = Variant | "muted";

/** The dot alone, for places that show a status without the pill around it (a Select item). */
export const PILL_DOT: Record<PillVariant, string> = {
  brand: "bg-primary",
  neutral: "bg-muted-foreground",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
  muted: "bg-border",
};

/**
 * Status pill — a dot plus a word. Sentence case, not uppercase, because it
 * reads as state rather than as a label.
 *
 * The word stays in the text colour and only the dot carries the hue. The
 * dashboard's own pills tinted both — text-success on bg-success/10 and so on
 * — which put success and error text at 4.44 and 4.13:1, under AA, and made
 * the colour do the reading. Here the word reads at full contrast and the dot
 * is decoration.
 *
 * `muted` is for states that are over or not started — lost, draft, not
 * enough data: a pale dot and muted text, so they recede in a list.
 */
export function Pill({
  children,
  variant = "neutral",
  className,
}: {
  children: React.ReactNode;
  variant?: PillVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-border px-2.5 py-1",
        "text-caption font-medium",
        variant === "muted" ? "text-muted-foreground" : "text-foreground",
        className,
      )}
    >
      <span aria-hidden className={cn("h-[6px] w-[6px] shrink-0 rounded-full", PILL_DOT[variant])} />
      {children}
    </span>
  );
}
