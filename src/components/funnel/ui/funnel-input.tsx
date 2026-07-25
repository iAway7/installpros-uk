import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** Funnel input — white field with sm / default / lg sizing, like the original. */
const funnelInputVariants = cva(
  "flex w-full rounded-md border bg-white text-black ring-offset-background placeholder:text-gray-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
  {
    variants: {
      inputSize: {
        sm: "h-9 px-4 py-1 text-sm",
        default: "h-12 px-5 py-2 text-base",
        lg: "h-14 px-6 py-3 text-base",
      },
      state: {
        default: "border-[1.5px] border-neutral-300 focus-visible:border-[#404040] focus-visible:ring-2 focus-visible:ring-[#1A1512]/15",
        error: "border-[1.5px] border-destructive focus-visible:ring-2 focus-visible:ring-destructive/20",
      },
    },
    defaultVariants: { inputSize: "default", state: "default" },
  },
);

export interface FunnelInputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof funnelInputVariants> {}

export const FunnelInput = React.forwardRef<HTMLInputElement, FunnelInputProps>(
  ({ className, type, inputSize, state, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(funnelInputVariants({ inputSize, state }), className)}
      {...props}
    />
  ),
);
FunnelInput.displayName = "FunnelInput";
