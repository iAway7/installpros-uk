"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Search field. Clears on Escape, which is the shortcut people already expect
 * and the reason this exists rather than an Input with an icon glued on.
 *
 * It filters what is already on screen — it does not navigate. If pressing
 * Enter takes you somewhere, that is a form, not this.
 */
export const SearchInput = React.forwardRef<
  HTMLInputElement,
  Omit<React.ComponentProps<"input">, "type" | "value" | "onChange"> & {
    value: string;
    onValueChange: (v: string) => void;
    /** Names the scope: "Search leads", not "Search". */
    placeholder?: string;
    size?: "sm" | "default";
  }
>(({ value, onValueChange, placeholder = "Search…", size = "default", className, ...props }, ref) => {
  // Radius follows height: 36px takes 10px, 48px takes 12px. Same rule as the
  // button, so a search field sitting next to one lines up.
  const h = size === "sm" ? "h-control-sm rounded-md" : "h-control rounded-lg";

  return (
    <div className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <input
        ref={ref}
        type="search"
        role="searchbox"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            onValueChange("");
          }
        }}
        className={cn(
          "w-full border-[length:var(--border-field)] border-field bg-background pl-11 pr-10 text-field text-foreground",
          "placeholder:text-muted-foreground transition-colors duration-quick",
          "focus-visible:border-selection-border focus-ring",
          // Kill the native clear affordance — we render our own, which is
          // keyboard-reachable and consistent across browsers.
          "[&::-webkit-search-cancel-button]:appearance-none",
          h,
        )}
        {...props}
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onValueChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xs p-1 text-muted-foreground transition-colors hover:text-foreground focus-ring"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
});
SearchInput.displayName = "SearchInput";
