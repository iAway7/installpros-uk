import { AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Inline error message. Formalises the red <p> both lead forms already emit,
 * so the icon, colour and ARIA wiring stop being retyped per form.
 *
 * Always pair with the field: give the message an id and point the input at it
 * with aria-describedby. Colour alone is not an error state.
 */
export function ErrorMessage({
  children,
  label,
  size = "default",
  id,
  className,
}: {
  children: React.ReactNode;
  /** Optional bold prefix, e.g. "Email error". */
  label?: string;
  size?: "sm" | "default" | "lg";
  id?: string;
  className?: string;
}) {
  const text = { sm: "text-caption", default: "text-body", lg: "text-lead" }[size];
  const icon = { sm: "h-3.5 w-3.5", default: "h-4 w-4", lg: "h-5 w-5" }[size];

  return (
    <p id={id} role="alert" className={cn("flex items-start gap-2 text-error", text, className)}>
      <AlertOctagon className={cn("mt-0.5 shrink-0", icon)} aria-hidden />
      <span>
        {label && <strong className="font-semibold">{label}: </strong>}
        {children}
      </span>
    </p>
  );
}
