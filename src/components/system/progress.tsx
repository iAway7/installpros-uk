import { cn } from "@/lib/utils";

/**
 * Determinate progress bar. Only use it when the total is known — an
 * indeterminate bar that never fills is worse than a spinner, because it
 * promises an end it cannot deliver.
 */
export function Progress({
  value,
  max = 100,
  label,
  showValue = false,
  size = "default",
  variant = "brand",
  className,
}: {
  value: number;
  max?: number;
  /** Names what is progressing. Required for assistive tech. */
  label: string;
  showValue?: boolean;
  size?: "sm" | "default";
  variant?: "brand" | "neutral" | "success";
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fill = { brand: "bg-primary", neutral: "bg-selection", success: "bg-success" }[variant];

  return (
    <div className={className}>
      {(showValue || label) && (
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <span className="text-[14px] text-foreground">{label}</span>
          {showValue && (
            <span className="text-[13px] tabular-nums text-muted-foreground">
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn("w-full overflow-hidden rounded-full bg-secondary", size === "sm" ? "h-1" : "h-2")}
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-450 ease-ds", fill)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Step progress for a multi-step form. Shows position in a sequence rather
 * than a percentage — "Step 2 of 4" is more useful than "50%" when the steps
 * are not equal in effort.
 */
export function StepProgress({
  current,
  total,
  label = "Progress",
  className,
}: {
  /** 1-based. */
  current: number;
  total: number;
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)} role="group" aria-label={`${label}: step ${current} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          aria-hidden
          className={cn(
            "h-1 flex-1 rounded-full transition-colors duration-450 ease-ds",
            i < current ? "bg-primary" : "bg-secondary",
          )}
        />
      ))}
    </div>
  );
}
