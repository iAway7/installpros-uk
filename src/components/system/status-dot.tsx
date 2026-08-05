import { cn } from "@/lib/utils";

type State = "neutral" | "active" | "success" | "warning" | "error";

const TONE: Record<State, string> = {
  neutral: "bg-muted-foreground",
  active:  "bg-primary",
  success: "bg-success",
  warning: "bg-gold",
  error:   "bg-error",
};

/**
 * A coloured dot with a label. The dot is decoration — the label carries the
 * meaning, because a dot alone is unreadable to anyone who cannot see the hue.
 */
export function StatusDot({
  state = "neutral",
  children,
  pulse = false,
  className,
}: {
  state?: State;
  /** The label. Omitting it needs a very good reason. */
  children?: React.ReactNode;
  /** Only for genuinely live states — an install happening right now. */
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-[14px] text-foreground", className)}>
      <span className="relative flex h-[7px] w-[7px] shrink-0">
        {pulse && (
          <span
            aria-hidden
            className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60", TONE[state])}
          />
        )}
        <span aria-hidden className={cn("relative inline-flex h-[7px] w-[7px] rounded-full", TONE[state])} />
      </span>
      {children}
    </span>
  );
}
