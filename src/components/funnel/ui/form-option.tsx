import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface FormOptionProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
  icon?: ReactNode;
}

/**
 * Selectable card used for the installation-type step.
 * Selection is the neutral --selection token, never brand red.
 */
export function FormOption({ label, selected, onClick, className, icon }: FormOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "w-full rounded-xl border-2 p-4 font-semibold text-foreground transition-all duration-200 ease-ds",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-selection focus-visible:ring-offset-2",
        icon ? "flex flex-col items-center justify-center gap-2 text-center" : "text-left",
        selected
          ? "border-selection bg-card"
          : "border-field bg-secondary hover:border-field-hover hover:bg-card",
        className,
      )}
    >
      {icon && <span className={cn("contents", selected ? "text-selection" : "text-muted-foreground")}>{icon}</span>}
      {label}
    </button>
  );
}
