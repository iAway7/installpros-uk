"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FunnelButton } from "./funnel-button";

export interface MenuItem {
  label: string;
  onSelect?: () => void;
  href?: string;
  /** Destructive actions render in --error and sit last. */
  destructive?: boolean;
  disabled?: boolean;
}

/**
 * Dropdown menu opened by a button. Keyboard: ↑/↓ move, Enter picks, Escape
 * closes and returns focus to the trigger, Tab closes.
 *
 * Focus moves into the list rather than being tracked with
 * aria-activedescendant — a menu has no text input to keep focus in, so the
 * simpler model is also the more correct one here.
 */
export function Menu({
  label,
  items,
  chevron = false,
  align = "start",
  className,
}: {
  label: string;
  items: MenuItem[];
  chevron?: boolean;
  align?: "start" | "end";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<(HTMLElement | null)[]>([]);
  const id = useId();

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (open && active >= 0) itemsRef.current[active]?.focus();
  }, [open, active]);

  const close = (refocus = true) => {
    setOpen(false);
    setActive(-1);
    if (refocus) triggerRef.current?.focus();
  };

  const enabled = items.map((i, idx) => (i.disabled ? -1 : idx)).filter((i) => i >= 0);
  const step = (dir: 1 | -1) => {
    const pos = enabled.indexOf(active);
    const next = pos === -1 ? (dir === 1 ? 0 : enabled.length - 1) : (pos + dir + enabled.length) % enabled.length;
    setActive(enabled[next]);
  };

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); if (!open) setOpen(true); step(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); if (!open) setOpen(true); step(-1); }
    else if (e.key === "Escape") { e.preventDefault(); close(); }
    else if (e.key === "Tab") close(false);
  }

  return (
    <div ref={boxRef} className={cn("relative inline-block", className)} onKeyDown={onKeyDown}>
      <FunnelButton
        ref={triggerRef}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        {label}
        {chevron && (
          <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform duration-200", open && "rotate-180")} aria-hidden />
        )}
      </FunnelButton>

      {open && (
        <div
          id={id}
          role="menu"
          aria-label={label}
          className={cn(
            "absolute z-30 mt-2 min-w-[200px] overflow-hidden rounded-xl border border-border bg-card py-1 shadow-xl",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          {items.map((item, i) => {
            const cls = cn(
              "block w-full px-4 py-2.5 text-left text-body transition-colors duration-200",
              "focus:bg-secondary focus:outline-none",
              item.disabled
                ? "cursor-not-allowed text-muted-foreground/50"
                : item.destructive
                  ? "text-error hover:bg-error/[0.06]"
                  : "text-foreground hover:bg-secondary",
            );
            const commit = () => { item.onSelect?.(); close(); };

            return item.href && !item.disabled ? (
              <a
                key={item.label}
                role="menuitem"
                href={item.href}
                ref={(el) => { itemsRef.current[i] = el; }}
                className={cls}
                onClick={() => close(false)}
              >
                {item.label}
              </a>
            ) : (
              <button
                key={item.label}
                role="menuitem"
                type="button"
                disabled={item.disabled}
                ref={(el) => { itemsRef.current[i] = el; }}
                className={cls}
                onClick={commit}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
