/**
 * The tint, border and ink for a status surface, in one place.
 *
 * `note` and `project-banner` render the same idea — a bordered block tinted by
 * meaning — and each had invented its own numbers: 6% vs 7% fill, 30% vs 25%
 * border, for the same three states. Nobody would ever notice side by side,
 * which is exactly why it drifts.
 *
 * The gap between families IS deliberate and stays: --gold sits at L* 80 while
 * --error and --success are near L* 47, so the same opacity reads far weaker on
 * the light one. Warning therefore carries a heavier fill and border.
 */
export const STATUS_TINT = {
  success: { border: "border-success/30", fill: "bg-success/[0.06]", ink: "text-success" },
  warning: { border: "border-gold/40", fill: "bg-gold/[0.08]", ink: "text-gold" },
  error: { border: "border-error/30", fill: "bg-error/[0.06]", ink: "text-error" },
} as const;

export type StatusTone = keyof typeof STATUS_TINT;
