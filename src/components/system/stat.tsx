import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "./card";

export interface StatDelta {
  /** Already formatted: "+12% vs previous 30 days". */
  text: string;
  direction: "up" | "down" | "flat";
  /**
   * Which way is good. Defaults to "up". Set "down" for figures where less is
   * better — time to first contact, cost per lead — so a fall reads green.
   */
  good?: "up" | "down";
}

/**
 * One figure on a dashboard: what it is, the number, and how it moved.
 *
 * The dashboard had three of these written out by hand — Kpi on Overview,
 * another Kpi on Marketing, Stat on Landings — with two layouts, two paddings
 * and the number at Tailwind's text-2xl, outside the type scale. This is the
 * one, on tokens: the number is text-metric (24px Product, 28px Editorial),
 * with tabular figures so a refreshing value does not jitter sideways.
 *
 * The label comes first in reading order and the icon is decoration, so a
 * screen reader hears "Today, 14" rather than an icon name. A delta is never
 * colour alone: it carries an arrow and its text says the number.
 */
export function Stat({
  label,
  value,
  icon,
  delta,
  hint,
  attention = false,
  className,
}: {
  label: string;
  value: React.ReactNode;
  /** A lucide icon. Rendered at 16px in the muted colour, whatever size it was given. */
  icon?: React.ReactNode;
  delta?: StatDelta;
  /** One short line of context, e.g. "carries a gclid" or "Connect PostHog". */
  hint?: string;
  /** Marks a figure that asks for action (new, unworked leads): a dot by the label. */
  attention?: boolean;
  className?: string;
}) {
  const good = delta?.good ?? "up";
  // Outlined, not tinted: success and error measure 4.44 and 4.13:1 on their own
  // 10% tint — under AA — and 5.08 / 4.80 on the card's white.
  const tone =
    !delta || delta.direction === "flat"
      ? "text-muted-foreground"
      : delta.direction === good
        ? "text-success"
        : "text-error";
  const Arrow = delta?.direction === "up" ? TrendingUp : delta?.direction === "down" ? TrendingDown : Minus;

  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="flex min-w-0 items-center gap-2 text-body-sm text-muted-foreground">
          <span className="truncate">{label}</span>
          {attention && (
            <>
              <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span className="sr-only">(needs action)</span>
            </>
          )}
        </p>
        {icon && (
          <span aria-hidden className="shrink-0 text-muted-foreground [&_svg]:size-4">
            {icon}
          </span>
        )}
      </div>

      <p className="mt-2 text-metric font-semibold tabular-nums text-card-foreground">{value}</p>

      {(delta || hint) && (
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-label">
          {delta && (
            <span className={cn("inline-flex items-center gap-1 rounded-md border border-border px-1.5 py-0.5 font-medium", tone)}>
              <Arrow aria-hidden className="size-3" />
              {delta.text}
            </span>
          )}
          {hint && <span className="text-muted-foreground">{hint}</span>}
        </div>
      )}
    </Card>
  );
}
