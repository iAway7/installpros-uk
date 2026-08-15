"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
}

/**
 * Filters a long list down to what matches. The generic form of what
 * AddressAutocomplete does for Google Places — same keyboard model, no data
 * source baked in.
 *
 * Keyboard: ↑/↓ move, Enter picks, Escape closes. The active option is
 * reported through aria-activedescendant rather than by moving focus, so the
 * input keeps it and typing never breaks.
 */
export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Search…",
  emptyMessage = "No matches",
  className,
}: {
  options: ComboboxOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
}) {
  const selected = options.find((o) => o.value === value) ?? null;
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q) || o.description?.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function pick(o: ComboboxOption) {
    onChange(o.value);
    setQuery("");
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return setOpen(true);
      setActive((i) => (e.key === "ArrowDown" ? (i + 1) % filtered.length : i <= 0 ? filtered.length - 1 : i - 1));
    } else if (e.key === "Enter" && open && filtered[active]) {
      e.preventDefault();
      pick(filtered[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={boxRef} className={cn("relative", className)}>
      <div
        className={cn(
          "flex h-12 items-center gap-2 rounded-md border-[1.5px] bg-background px-4 transition-colors duration-200",
          open ? "border-selection-border ring-2 ring-[hsl(var(--selection)/0.15)]" : "border-field",
        )}
      >
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        <input
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && filtered[active] ? `${listId}-${active}` : undefined}
          value={open ? query : selected?.label ?? ""}
          placeholder={selected ? selected.label : placeholder}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setActive(0); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 bg-transparent text-[16px] text-foreground outline-none placeholder:text-muted-foreground"
        />
        {selected && !open ? (
          <button
            type="button"
            aria-label="Clear selection"
            onClick={() => { onChange(null); setQuery(""); }}
            className="shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180")} aria-hidden />
        )}
      </div>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-border bg-card py-1 shadow-xl"
        >
          {filtered.length === 0 && (
            <li className="px-4 py-3 text-[15px] text-muted-foreground">{emptyMessage}</li>
          )}
          {filtered.map((o, i) => (
            <li
              key={o.value}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={o.value === value}
              onMouseDown={(e) => { e.preventDefault(); pick(o); }}
              onMouseEnter={() => setActive(i)}
              className={cn("cursor-pointer px-4 py-2.5", i === active && "bg-secondary")}
            >
              <div className="text-[15px] font-medium text-foreground">{o.label}</div>
              {o.description && <div className="text-[13px] text-muted-foreground">{o.description}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
