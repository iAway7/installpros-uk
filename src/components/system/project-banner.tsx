import { AlertTriangle, Info, ShieldCheck, XOctagon } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "gray" | "success" | "warning" | "error";

const ICON = { gray: Info, success: ShieldCheck, warning: AlertTriangle, error: XOctagon } as const;

const TONE: Record<Variant, string> = {
  gray:    "border-border bg-secondary text-foreground",
  success: "border-success/25 bg-success/[0.07] text-foreground",
  warning: "border-gold/40 bg-gold/[0.10] text-foreground",
  error:   "border-error/25 bg-error/[0.07] text-foreground",
};
const ICON_TONE: Record<Variant, string> = {
  gray: "text-muted-foreground",
  success: "text-success",
  warning: "text-gold",
  error: "text-error",
};

/**
 * Site-wide state that needs resolving — a paused service area, a payment
 * problem, a booking freeze.
 *
 * Deliberately NOT dismissible. If the message can be dismissed without the
 * underlying state changing, it was never banner-worthy: use a Note. And it
 * always carries a call to action, because a banner with no route out is a
 * dead end.
 */
export function ProjectBanner({
  label,
  callToAction,
  variant = "gray",
  icon,
  className,
}: {
  /** One sentence, sentence case, naming the impact. */
  label: React.ReactNode;
  /** Required. The thing that resolves the state. */
  callToAction: { label: string; href?: string; onClick?: () => void };
  variant?: Variant;
  icon?: React.ReactNode;
  className?: string;
}) {
  const Icon = ICON[variant];

  const cta =
    "shrink-0 rounded-lg border border-border bg-card px-3.5 py-2 text-body-sm font-medium text-foreground transition-colors duration-200 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--selection)/0.15)]";

  return (
    <div
      role="region"
      aria-label="Project notice"
      className={cn("flex items-center gap-3 border-b px-6 py-3", TONE[variant], className)}
    >
      <span className={cn("shrink-0", ICON_TONE[variant])}>
        {icon ?? <Icon className="h-[18px] w-[18px]" aria-hidden />}
      </span>
      <p className="min-w-0 flex-1 text-body leading-[1.5]">{label}</p>
      {callToAction.href ? (
        <a href={callToAction.href} className={cta}>
          {callToAction.label}
        </a>
      ) : (
        <button type="button" onClick={callToAction.onClick} className={cta}>
          {callToAction.label}
        </button>
      )}
    </div>
  );
}
