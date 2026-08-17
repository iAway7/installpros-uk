import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textareaVariants = cva(
  "flex w-full rounded-md border bg-background text-field text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-quick",
  {
    variants: {
      state: {
        default:
          "border-[length:var(--border-field)] border-field focus-visible:border-selection-border focus-ring",
        error:
          "border-[length:var(--border-field)] border-error focus-visible:border-error focus-visible:ring-2 focus-visible:ring-error/20",
      },
      resize: {
        none: "resize-none",
        vertical: "resize-y",
      },
    },
    defaultVariants: { state: "default", resize: "vertical" },
  },
);

export interface TextareaProps
  extends React.ComponentProps<"textarea">,
    VariantProps<typeof textareaVariants> {}

/**
 * Multi-line free text. The moment content can wrap to a second line this is
 * the right control, not an Input.
 *
 * Resizes vertically by default — taking that away forces people to write in a
 * four-line window. Horizontal resize is never allowed, because it breaks the
 * layout around it.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, state, resize, rows = 4, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={state === "error" ? true : undefined}
      className={cn(textareaVariants({ state, resize }), "px-4 py-3", className)}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
