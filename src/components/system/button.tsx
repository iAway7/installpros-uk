import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Funnel button — red fill, uppercase, bold, radius 12px. This is the agreed
 * button spec: it stays exactly as /install-quote has it today.
 *
 * Two things changed from v1:
 *  · `size="lg"` used to be a byte-for-byte copy of `default`. It is now
 *    genuinely larger, so the variant means something.
 *  · Hover darkens (--brand-hover, #9E0404) instead of going translucent, so
 *    the button keeps its weight over any background.
 *
 * The focus ring is --ring, which in .theme-editorial is the neutral
 * --selection, not brand red — a red ring on a red button is unreadable.
 */
const buttonVariants = cva(
  // text-button, not one of Tailwind's own size names: those used to be
  // overridden to 16px project-wide, which is why buttons kept rendering at 16
  // instead of the 12px spec. The override is gone; the token stays because the
  // button's size is per-density, 12px Editorial and 13px Product.
  // which is why the buttons kept rendering at 16 instead of the 12px spec.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-button [font-weight:var(--button-weight)] [letter-spacing:var(--button-tracking)] [text-transform:var(--button-case)] transition-all duration-quick ease-ds focus-ring-solid disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-brand-hover",
        secondary: "bg-secondary/80 text-foreground hover:bg-secondary border border-border/30",
        outline: "border border-border/50 bg-transparent text-foreground hover:bg-secondary/50",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        // No vertical padding on any of these. The height is fixed, the content
        // is centred and whitespace-nowrap stops it wrapping, so py cannot move
        // anything — it only looked like a decision. Height is the token that
        // controls the box; padding here was a second, silent answer to the
        // same question.
        //
        // px-[18px] is the one deliberate off-grid value left in the system: it
        // is the button's designed horizontal padding, and snapping it to 16 or
        // 20 would resize every button on the site. Off the grid on purpose
        // beats on the grid by accident.
        default: "h-control rounded-lg px-[18px]",
        sm: "h-control-sm rounded-md px-4",
        lg: "h-control-lg rounded-lg px-6",
        icon: "h-control-aux w-control-aux rounded-md",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
  },
);
Button.displayName = "Button";

export { buttonVariants };
