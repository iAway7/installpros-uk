"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

export interface Tab {
  title: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  /** Names the constraint when disabled. Shown as a native tooltip. */
  tooltip?: string;
  /** Count or status. Drop it at zero rather than rendering "0". */
  badge?: React.ReactNode;
}

/**
 * Switches between sibling views inside one page.
 *
 * Tabs imply the views share a scope, a URL parent and a data model. For
 * navigation between unrelated pages this is the wrong control — use a
 * sub-menu.
 */
export function Tabs({
  tabs,
  selected,
  onSelect,
  variant = "primary",
  disabled = false,
  label,
  className,
}: {
  tabs: Tab[];
  selected: string;
  onSelect: (value: string) => void;
  /** primary underlines; secondary fills a pill. */
  variant?: "primary" | "secondary";
  disabled?: boolean;
  /** Required when no visible heading sits above the row. */
  label?: string;
  className?: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const usable = tabs.map((t, i) => (t.disabled || disabled ? -1 : i)).filter((i) => i >= 0);

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const pos = usable.indexOf(index);
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = usable[(pos + dir + usable.length) % usable.length];
    refs.current[next]?.focus();
    onSelect(tabs[next].value);
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        "flex items-center overflow-x-auto",
        variant === "primary"
          ? "gap-1 border-b border-border"
          : "gap-1 rounded-lg bg-secondary p-1",
        className,
      )}
    >
      {tabs.map((t, i) => {
        const off = t.disabled || disabled;
        const active = t.value === selected;
        return (
          <button
            key={t.value}
            ref={(el) => { refs.current[i] = el; }}
            role="tab"
            type="button"
            aria-selected={active}
            aria-disabled={off || undefined}
            tabIndex={active ? 0 : -1}
            title={off ? t.tooltip : undefined}
            disabled={off}
            onClick={() => onSelect(t.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "relative flex shrink-0 items-center gap-2 whitespace-nowrap text-body transition-colors duration-200",
              "focus-ring",
              variant === "primary"
                ? "-mb-px border-b-2 px-4 py-3"
                : "rounded-lg px-3.5 py-2",
              off
                ? "cursor-not-allowed text-muted-foreground/50 border-transparent"
                : variant === "primary"
                  ? active
                    ? "border-selection font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                  : active
                    ? "bg-background font-medium text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.icon && <span className="shrink-0 [&_svg]:h-4 [&_svg]:w-4">{t.icon}</span>}
            {t.title}
            {t.badge != null && (
              <span className="rounded-full bg-secondary px-1.5 py-0.5 text-label tabular-nums text-muted-foreground">
                {t.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
