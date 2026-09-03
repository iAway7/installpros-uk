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
const inputVariants = cva(
  "flex w-full border bg-background text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-quick",
  {
    variants: {
      // text-entry, not text-body: --text-entry deliberately stays at 16px in
      // both densities, because 16px is the threshold below which iOS Safari
      // zooms the page when the field takes focus. Everything else in Product
      // steps down a size; a form field must not.
      inputSize: {
        sm: "h-control-sm rounded-md px-4 py-1 text-entry",
        default: "h-control rounded-lg px-5 py-2 text-entry",
        lg: "h-control-lg rounded-lg px-6 py-3 text-entry",
      },
      state: {
        default:
          "border-[length:var(--border-field)] border-field focus-visible:border-selection-border focus-ring",
        error:
          "border-[length:var(--border-field)] border-error focus-visible:border-error focus-visible:ring-2 focus-visible:ring-error/20",
      },
    },
    defaultVariants: { inputSize: "default", state: "default" },
  },
);

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, inputSize, state, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      // Keep the visual error state and the accessibility state in sync — a
      // red border alone is invisible to a screen reader.
      aria-invalid={state === "error" ? true : undefined}
      className={cn(inputVariants({ inputSize, state }), className)}
      {...props}
    />
  ),
);
Input.displayName = "Input";
