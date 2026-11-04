"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Which density the docs show: Product (the dashboard) or Editorial (the
 * funnel). One switch for the whole site, so every preview and every colour
 * swatch answers the same question at once. Product by default: this site is
 * the dashboard's design system first.
 *
 * Remembered per browser. Storage can throw (private windows, blocked site
 * data), so every read and write is guarded and the page works without it.
 */
export type Density = "product" | "editorial";

const KEY = "ds-density";
const DensityContext = createContext<{ density: Density; setDensity: (d: Density) => void }>({
  density: "product",
  setDensity: () => {},
});

export function DensityProvider({ children }: { children: ReactNode }) {
  const [density, setDensityState] = useState<Density>("product");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "product" || saved === "editorial") setDensityState(saved);
    } catch {}
  }, []);

  const setDensity = (d: Density) => {
    setDensityState(d);
    try {
      localStorage.setItem(KEY, d);
    } catch {}
  };

  return <DensityContext.Provider value={{ density, setDensity }}>{children}</DensityContext.Provider>;
}

export const useDensity = () => useContext(DensityContext);

/** A wrapper that renders its children in the chosen density. */
export function DensityScope({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { density } = useDensity();
  return <div className={`theme-${density} ${className}`}>{children}</div>;
}

const OPTIONS: { value: Density; label: string }[] = [
  { value: "product", label: "Product" },
  { value: "editorial", label: "Editorial" },
];

/** Two-option segmented control. A radio group, so arrow keys move between the two. */
export function DensityToggle({ className = "" }: { className?: string }) {
  const { density, setDensity } = useDensity();
  return (
    <div role="radiogroup" aria-label="Density shown in previews" className={`inline-flex rounded-lg bg-neutral-100 p-0.5 ${className}`}>
      {OPTIONS.map((o) => {
        const on = density === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => setDensity(o.value)}
            onKeyDown={(e) => {
              if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
                e.preventDefault();
                const next = OPTIONS.find((x) => x.value !== density)!;
                setDensity(next.value);
                (e.currentTarget.parentElement?.querySelector(`[data-value="${next.value}"]`) as HTMLElement | null)?.focus();
              }
            }}
            data-value={o.value}
            className={`rounded-md px-3 py-1 text-[13px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-neutral-900 ${
              on ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
