"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { WeeklyRate } from "@/lib/dashboard/conversion";
import { CHART, CHART_ACTIVE_DOT, CHART_AXIS_TICK, CHART_TOOLTIP } from "@/components/system/chart-theme";

/** Weekly visitor → lead rate. The last point is the current, partial week. */
export function ConversionChart({ data }: { data: WeeklyRate[] }) {
  const formatted = data.map((d) => ({
    ...d,
    label: d.week.slice(5),
    pct: d.rate === null ? null : Math.round(d.rate * 1000) / 10,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={formatted} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
        <XAxis dataKey="label" tick={CHART_AXIS_TICK} tickLine={false} axisLine={false} minTickGap={16} />
        <YAxis tick={CHART_AXIS_TICK} tickLine={false} axisLine={false} width={44} unit="%" />
        <Tooltip
          {...CHART_TOOLTIP}
          labelFormatter={(l) => `Week of ${l}`}
          formatter={(value, _name, item) => {
            const p = item.payload as { visitors: number; leads: number };
            return [value === null ? "—" : `${value}%  (${p.leads} leads / ${p.visitors} visitors)`, "Conversion"];
          }}
        />
        <Line
          type="monotone"
          dataKey="pct"
          name="Conversion"
          stroke={CHART.series1}
          strokeWidth={2}
          dot={{ r: 3, fill: CHART.series1, strokeWidth: 0 }}
          activeDot={CHART_ACTIVE_DOT}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
