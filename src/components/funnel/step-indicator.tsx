import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step {
  number: number;
  label: string;
  completed: boolean;
}

/** Numbered progress indicator with connecting lines (light/dark variants). */
export function StepIndicator({
  steps,
  currentStep,
  variant = "light",
}: {
  steps: Step[];
  currentStep: number;
  variant?: "light" | "dark";
}) {
  const dark = variant === "dark";
  return (
    <div className="mb-10 flex w-full justify-center">
      <div className="flex items-start">
        {steps.map((step, i) => {
          const isCurrent = step.number === currentStep;
          const isCompleted = step.completed;
          const activeOrDone = isCompleted || isCurrent;
          return (
            <div key={step.number} className="flex items-start">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full text-body font-semibold transition-all",
                    activeOrDone && (dark ? "bg-white text-black" : "bg-black text-white"),
                    !activeOrDone &&
                      (dark
                        ? "border border-white/30 bg-transparent text-white/50"
                        : "border border-black/20 bg-transparent text-black/40"),
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : step.number}
                </div>
                <p
                  className={cn(
                    "mt-2 max-w-[120px] text-center text-body font-medium leading-tight",
                    activeOrDone ? (dark ? "text-white" : "text-black") : dark ? "text-white/50" : "text-black/40",
                  )}
                >
                  {step.label}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 mt-6 h-0.5 w-16 md:w-24",
                    isCompleted ? (dark ? "bg-white" : "bg-black") : dark ? "bg-white/20" : "bg-black/10",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
