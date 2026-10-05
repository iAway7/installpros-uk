"use client";

import type { WeeklyRate } from "@/lib/dashboard/conversion";
import { TrendChart } from "@/components/system/chart";

/** Weekly visitor → lead rate. The last point is the current, partial week.
 *  A rate, so a line rather than an area; weekly, so dots on every point. */
export function ConversionChart({ data }: { data: WeeklyRate[] }) {
  const rows = data.map((d) => ({
    date: d.week,
    pct: d.rate === null ? null : Math.round(d.rate * 1000) / 10,
    leads: d.leads,
    visitors: d.visitors,
  }));

  return (
    <TrendChart
      data={rows}
      series={[{ key: "pct", name: "Conversion", kind: "line", dots: true }]}
      height={240}
      unit="%"
      tooltipLabel={(row) => `Week of ${row.date.slice(5)}`}
      tooltipValue={(v, _k, row) => (v === null ? "—" : `${v}%  (${row.leads} leads / ${row.visitors} visitors)`)}
    />
  );
}
