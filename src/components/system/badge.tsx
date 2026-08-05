import { cn } from "@/lib/utils";

type Variant = "brand" | "neutral" | "success" | "warning" | "error";

const TONE: Record<Variant, string> = {
  brand:   "border-brand-soft/30 text-brand-icon",
  neutral: "border-border text-muted-foreground",
  success: "border-success/30 text-success",
  warning: "border-gold/40 text-gold",
  error:   "border-error/30 text-error",
};

const FILLED: Record<Variant, string> = {
  brand:   "bg-primary text-primary-foreground border-transparent",
  neutral: "bg-secondary text-foreground border-transparent",
  success: "bg-success text-success-foreground border-transparent",
  warning: "bg-gold text-foreground border-transparent",
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
        "text-[10.5px] font-semibold uppercase tracking-[1.5px]",
        fill ? FILLED[variant] : TONE[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Status pill — a dot plus a word. Sentence case, not uppercase, because it
 * reads as state rather than as a label.
 */
export function Pill({
  children,
  variant = "neutral",
  className,
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const dot: Record<Variant, string> = {
    brand: "bg-primary",
    neutral: "bg-muted-foreground",
    success: "bg-success",
    warning: "bg-gold",
    error: "bg-error",
  };
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-border px-2.5 py-1",
        "text-[13px] font-medium text-foreground",
        className,
      )}
    >
      <span aria-hidden className={cn("h-[6px] w-[6px] rounded-full", dot[variant])} />
      {children}
    </span>
  );
}
