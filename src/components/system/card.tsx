import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Card — the surface the dashboard is built out of.
 *
 * Moved here from components/ui with three changes, all of them things the
 * 37 call sites were already working around:
 *
 *  1. CardContent used to hardcode `pt-0`, which assumes a CardHeader always
 *     sits above it. Nine call sites had no header and wrote `p-6` back to
 *     undo it. It is now `p-6` with the top padding collapsing only when the
 *     content is not the first child, so a headerless card is right by default
 *     and a card with a header is spaced exactly as before.
 *
 *  2. Sizes come from the type tokens instead of Tailwind's core classes, so
 *     they resolve per density rather than per class name. This is what let
 *     .theme-product rewrite text-sm globally for months.
 *
 *  3. CardFooter is gone. Zero uses in 37 cards.
 *
 * rounded-xl is 16px against 24px of padding, which is the ratio agreed for
 * cards; it needs no override here.
 */
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-xl border border-border bg-card text-card-foreground shadow-sm", className)}
      {...props}
    />
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-title font-semibold leading-none tracking-tight", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-body-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

/**
 * `[&:not(:first-child)]:pt-0` rather than a plain `pt-0`: it keeps the header
 * owning the gap when there is one, and gives the content its own top padding
 * when there is not. A `p-0` override still wins for the bleed cards, because
 * the collapsed value and the override are both zero.
 */
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 [&:not(:first-child)]:pt-0", className)} {...props} />
  ),
);
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
