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
 * The focus ring is --ring, which in .theme-funnel is the neutral
 * --selection, not brand red — a red ring on a red button is unreadable.
 */
const funnelButtonVariants = cva(
  // text-[12px] (arbitrary) NOT text-sm: this project overrides text-sm to 16px,
  // which is why the buttons kept rendering at 16 instead of the 12px spec.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-[12px] font-bold uppercase leading-[1.3] tracking-[-0.2px] transition-all duration-200 ease-ds focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-brand-hover",
        secondary: "bg-secondary/80 text-foreground hover:bg-secondary border border-border/30",
        outline: "border border-border/50 bg-transparent text-foreground hover:bg-secondary/50",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-12 px-[18px] py-[14px]",
        sm: "h-9 px-4 py-2",
        lg: "h-14 px-6 py-4",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface FunnelButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof funnelButtonVariants> {
  asChild?: boolean;
}

export const FunnelButton = React.forwardRef<HTMLButtonElement, FunnelButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(funnelButtonVariants({ variant, size, className }))} {...props} />;
  },
);
FunnelButton.displayName = "FunnelButton";

export { funnelButtonVariants };
