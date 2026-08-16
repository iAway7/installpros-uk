import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Funnel input — white field with sm / default / lg sizing.
 *
 * Focus and error are token-driven: focus uses --selection (the neutral), never
 * brand red, because red is reserved for the primary button. Error uses the
 * single --error token (#DC2626, 4.83:1 on white).
 */
const funnelInputVariants = cva(
  "flex w-full border bg-background text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
  {
    variants: {
      // Explicit 16px, not text-sm/text-base: .theme-admin rewrites those
      // utilities to 13/14px, so a shared input would silently shrink in the
      // dashboard. 16px is also the threshold below which iOS Safari zooms the
      // page on focus — inputs should stay here regardless of density.
      inputSize: {
        sm: "h-control-sm rounded-md px-4 py-1 text-field",
        default: "h-control rounded-lg px-5 py-2 text-field",
        lg: "h-control-lg rounded-lg px-6 py-3 text-field",
      },
      state: {
        default:
          "border-[1.5px] border-field focus-visible:border-selection-border focus-visible:ring-2 focus-visible:ring-[hsl(var(--selection)/0.15)]",
        error:
          "border-[1.5px] border-error focus-visible:border-error focus-visible:ring-2 focus-visible:ring-error/20",
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
      // Keep the visual error state and the accessibility state in sync — a
      // red border alone is invisible to a screen reader.
      aria-invalid={state === "error" ? true : undefined}
      className={cn(funnelInputVariants({ inputSize, state }), className)}
      {...props}
    />
  ),
);
FunnelInput.displayName = "FunnelInput";
