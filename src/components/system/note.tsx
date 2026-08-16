import { AlertOctagon, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS_TINT } from "./status-tint";

type Variant = "default" | "success" | "warning" | "error" | "secondary";

const ICON = {
  default: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertOctagon,
  secondary: Info,
} as const;

const TONE: Record<Variant, { border: string; fill: string; icon: string }> = {
  default:   { border: "border-border",       fill: "bg-secondary",      icon: "text-muted-foreground" },
  secondary: { border: "border-border",       fill: "bg-secondary",      icon: "text-muted-foreground" },
  success:   { border: STATUS_TINT.success.border, fill: STATUS_TINT.success.fill, icon: STATUS_TINT.success.ink },
  warning:   { border: STATUS_TINT.warning.border, fill: STATUS_TINT.warning.fill, icon: STATUS_TINT.warning.ink },
  error:     { border: STATUS_TINT.error.border, fill: STATUS_TINT.error.fill, icon: STATUS_TINT.error.ink },
};

/**
 * Inline contextual message, sitting next to the thing it describes.
 *
 * A Note is persistent — it stays until the underlying state changes. If the
 * message is page-level, use Banner. If it is transient, use a toast. There is
 * no dismiss control here on purpose: a dismissable note competes with its own
 * message.
 */
export function Note({
  children,
  variant = "default",
  label,
  action,
  size = "default",
  fill = false,
  icon,
  className,
}: {
  children: React.ReactNode;
  variant?: Variant;
  /** 1–2 word Title Case prefix naming the topic: "Coverage", "Rate limit". */
  label?: string;
  /** A single inline CTA. Never two. */
  action?: React.ReactNode;
  size?: "sm" | "default";
  fill?: boolean;
  /** Pass null to render no icon at all. */
  icon?: React.ReactNode | null;
  className?: string;
}) {
  const tone = TONE[variant];
  const Icon = ICON[variant];
  const text = size === "sm" ? "text-body-sm" : "text-body";

  return (
    <div
      role="note"
      className={cn(
        "flex items-start gap-3 rounded-lg border",
        size === "sm" ? "px-3.5 py-2.5" : "px-4 py-3.5",
        tone.border,
        fill ? tone.fill : "bg-transparent",
        className,
      )}
    >
      {icon !== null &&
        (icon ?? <Icon className={cn("mt-0.5 h-[18px] w-[18px] shrink-0", tone.icon)} aria-hidden />)}
      <div className={cn("min-w-0 flex-1 leading-[1.55] text-foreground", text)}>
        {label && <strong className="font-semibold">{label}: </strong>}
        {children}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
