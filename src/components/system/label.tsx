import { cn } from "@/lib/utils";

/**
 * Form label. Always tied to a control through htmlFor — a placeholder is not
 * a label, because it disappears the moment someone starts typing.
 *
 * `required` renders the marker on the label rather than the field, and pairs
 * with aria-required on the input itself.
 */
export function Label({
  children,
  htmlFor,
  required = false,
  hint,
  disabled = false,
  className,
}: {
  children: React.ReactNode;
  htmlFor: string;
  required?: boolean;
  /** Short qualifier shown after the label, e.g. "Optional". */
  hint?: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "mb-2 flex items-baseline gap-2 text-[15px] font-semibold text-foreground",
        disabled && "opacity-50",
        className,
      )}
    >
      <span>
        {children}
        {required && (
          <span aria-hidden className="ml-0.5 text-error">
            *
          </span>
        )}
      </span>
      {hint && <span className="text-[13px] font-normal text-muted-foreground">{hint}</span>}
    </label>
  );
}
