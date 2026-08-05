import { cn } from "@/lib/utils";

/**
 * Groups related controls under one name.
 *
 * The name is not decoration: without it a screen reader reads each option
 * with no idea what is being chosen. min-w-0 is mandatory — a <fieldset>
 * defaults to min-width:min-content and will not shrink inside a flex row.
 */
export function Fieldset({
  legend,
  showLegend = true,
  description,
  error,
  required = false,
  disabled = false,
  children,
  className,
}: {
  legend: string;
  /** Hide it visually when a heading above already names the group. */
  showLegend?: boolean;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const errorId = error ? `${legend.replace(/\s+/g, "-").toLowerCase()}-error` : undefined;

  return (
    <fieldset
      disabled={disabled}
      aria-required={required || undefined}
      aria-invalid={error ? true : undefined}
      aria-describedby={errorId}
      className={cn("min-w-0", disabled && "opacity-50", className)}
    >
      <legend className={cn("text-[15px] font-semibold text-foreground", !showLegend && "sr-only")}>
        {legend}
        {required && showLegend && (
          <span aria-hidden className="ml-0.5 text-error">
            *
          </span>
        )}
      </legend>
      {description && showLegend && (
        <p className="mt-1 text-[14px] leading-[1.5] text-muted-foreground">{description}</p>
      )}
      <div className={cn(showLegend && "mt-3")}>{children}</div>
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-[14px] text-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}
