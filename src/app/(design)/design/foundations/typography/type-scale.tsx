"use client";

import { SCALES } from "../../_data/tokens";
import { useDensity, DensityScope } from "../../_components/density";

const ROLE: Record<string, string> = {
  "--text-micro": "Badges",
  "--text-label": "Labels, table headers, chart ticks",
  "--text-caption": "Helper text, small errors, legends",
  "--text-body-sm": "Secondary text, table cells",
  "--text-body": "The workhorse: options, menus, modal body",
  "--text-entry": "Text inside form fields",
  "--text-lead": "Empty-state titles, modal titles",
  "--text-title": "Card titles",
  "--text-heading": "A dashboard page title",
  "--text-metric": "The number on a Stat",
};

/**
 * The token type scale, read from the theme, in whichever density the docs
 * header is set to. Each sample is set with the token itself, so what you see
 * is the value the code uses.
 */
export function TypeScale() {
  const { density } = useDensity();
  const rows = SCALES.find((s) => s.family === "Type scale")?.rows ?? [];
  return (
    <DensityScope className="divide-y divide-neutral-200 rounded-xl border border-neutral-200">
      {rows.map((r) => {
        const px = density === "product" ? r.product : r.editorial;
        return (
          <div key={r.name} className="grid gap-2 px-5 py-4 sm:grid-cols-[180px_1fr] sm:items-baseline">
            <div>
              <div className="font-mono text-[12.5px] text-neutral-900">{r.name}</div>
              <div className="text-[12.5px] text-neutral-500">
                {px}
                {r.differs && <span className="text-neutral-400"> · {density === "product" ? r.editorial : r.product} in {density === "product" ? "Editorial" : "Product"}</span>}
              </div>
            </div>
            <div className="min-w-0">
              <div className="truncate text-foreground" style={{ fontSize: `var(${r.name})`, lineHeight: 1.3 }}>
                {ROLE[r.name] ?? "Install in an afternoon"}
              </div>
            </div>
          </div>
        );
      })}
    </DensityScope>
  );
}
