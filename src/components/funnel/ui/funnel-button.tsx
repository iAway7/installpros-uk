import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Funnel button — matches the installpros.io funnel: red fill, uppercase,
 * 12px bold, pill-ish rounded-xl. Kept separate from the Phase-1 Button so the
 * two design languages don't collide.
 */
const funnelButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold uppercase leading-[1.3] tracking-[-0.2px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary/80 text-foreground hover:bg-secondary border border-border/30",
        outline: "border border-border/50 bg-transparent text-foreground hover:bg-secondary/50",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-12 px-[18px] py-[14px]",
        sm: "h-9 px-4 py-2",
        lg: "h-12 px-[18px] py-[14px]",
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
