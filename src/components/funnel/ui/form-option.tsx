import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface FormOptionProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
  icon?: ReactNode;
}

/** Selectable card used for the installation-type step. */
export function FormOption({ label, selected, onClick, className, icon }: FormOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "w-full rounded-xl border-2 p-4 font-semibold text-foreground transition-all duration-200",
        icon ? "flex flex-col items-center gap-2 text-center" : "text-left",
        selected
          ? "border-[#1A1512] bg-card ring-1 ring-[#1A1512]"
          : "border-neutral-300 bg-secondary hover:border-neutral-500 hover:bg-card",
        className,
      )}
    >
      {icon && <span className={cn(selected ? "text-[#1A1512]" : "text-muted-foreground")}>{icon}</span>}
      {label}
    </button>
  );
}
