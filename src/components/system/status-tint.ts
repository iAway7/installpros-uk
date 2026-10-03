/**
 * The tint, border and ink for a status surface, in one place.
 *
 * `note` and `project-banner` render the same idea — a bordered block tinted by
 * meaning — and each had invented its own numbers: 6% vs 7% fill, 30% vs 25%
 * border, for the same three states. Nobody would ever notice side by side,
 * which is exactly why it drifts.
 *
 * Warning used to borrow --gold, the review-star yellow, and carried a heavier
 * 40% / 8% to make up for it sitting at L* 80. That was compensating for the
 * wrong colour: as text gold was 1.7:1. It has its own --warning now (amber-800,
 * near the same lightness as error and success), so all three share one recipe.
 */
export const STATUS_TINT = {
  success: { border: "border-success/30", fill: "bg-success/[0.06]", ink: "text-success" },
  warning: { border: "border-warning/30", fill: "bg-warning/[0.06]", ink: "text-warning" },
  error: { border: "border-error/30", fill: "bg-error/[0.06]", ink: "text-error" },
} as const;

export type StatusTone = keyof typeof STATUS_TINT;
