"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { FunnelInput } from "./funnel-input";

export interface AddressSelection {
  address: string;
  postcode: string;
  town: string;
}

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSelect: (sel: AddressSelection) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

interface Prediction {
  placeId: string;
  primary: string;
  secondary: string;
  full: string;
}

/** Random session token so autocomplete + details bill as one Google session. */
function newSessionToken() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * UK address field with type-ahead suggestions from Google Places (via our
 * /api/address proxy). Debounces input, renders a custom dropdown, and on
 * selection resolves the full address + postcode + town via Place Details.
 */
export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Start typing your address…",
  disabled,
  className,
}: Props) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const [resolving, setResolving] = useState(false);

  const sessionRef = useRef<string>(newSessionToken());
  const justSelected = useRef(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  // Debounced fetch of predictions as the user types.
  useEffect(() => {
    if (justSelected.current) {
      justSelected.current = false;
      return;
    }
    const q = value.trim();
    if (q.length < 3) {
      setPredictions([]);
      setOpen(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch("/api/address/autocomplete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: q, sessionToken: sessionRef.current }),
          signal: ctrl.signal,
        });
        const json = (await res.json()) as { suggestions?: Prediction[] };
        setPredictions(json.suggestions ?? []);
        setOpen((json.suggestions ?? []).length > 0);
        setActive(-1);
      } catch {
        /* ignore aborted/failed lookups */
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [value]);

  // Close the dropdown on outside click.
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  async function choose(p: Prediction) {
    justSelected.current = true;
    onChange(p.full || `${p.primary}, ${p.secondary}`.trim());
    setOpen(false);
    setPredictions([]);
    setResolving(true);
    try {
      const res = await fetch("/api/address/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId: p.placeId, sessionToken: sessionRef.current }),
      });
      const d = (await res.json()) as { address?: string; postcode?: string; town?: string };
      if (d.address) {
        justSelected.current = true;
        onChange(d.address);
      }
      onSelect({ address: d.address || p.full, postcode: d.postcode || "", town: d.town || "" });
    } catch {
      onSelect({ address: p.full, postcode: "", town: "" });
    } finally {
      // Start a fresh billing session for the next lookup.
      sessionRef.current = newSessionToken();
      setResolving(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || predictions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % predictions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? predictions.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      if (active >= 0) {
        e.preventDefault();
        void choose(predictions[active]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={boxRef} className="relative">
      <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
      <FunnelInput
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => predictions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        disabled={disabled || resolving}
        inputSize="lg"
        aria-label="Address"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        autoComplete="off"
        className={`pl-12 ${className ?? ""}`}
      />
      {(loading || resolving) && (
        <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-primary" />
      )}

      {open && predictions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-border bg-white py-1 text-left shadow-xl"
        >
          {predictions.map((p, i) => (
            <li
              key={p.placeId}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                void choose(p);
              }}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-start gap-3 px-4 py-3 ${
                i === active ? "bg-neutral-100" : "hover:bg-neutral-100"
              }`}
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-foreground">{p.primary}</span>
                {p.secondary && <span className="block truncate text-xs text-muted-foreground">{p.secondary}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
