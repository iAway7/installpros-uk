"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { CHART, CHART_ACTIVE_DOT, CHART_AXIS_TICK, CHART_TOOLTIP } from "@/components/system/chart-theme";

export interface DayPoint {
  date: string;
  clicks: number;
  impressions: number;
}

/** Clicks + impressions over time (dual-axis area chart). Clicks are what the
 *  chart is about, so they take --chart-1; impressions are the context. */
export function SearchConsoleChart({ data }: { data: DayPoint[] }) {
  const formatted = data.map((d) => ({ ...d, label: d.date.slice(5) }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={formatted} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="clicks" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART.series1} stopOpacity={0.35} />
            <stop offset="95%" stopColor={CHART.series1} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="impr" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART.series2} stopOpacity={0.2} />
            <stop offset="95%" stopColor={CHART.series2} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
        <XAxis dataKey="label" tick={CHART_AXIS_TICK} tickLine={false} axisLine={false} minTickGap={24} />
        <YAxis yAxisId="left" tick={CHART_AXIS_TICK} tickLine={false} axisLine={false} width={40} />
        <YAxis yAxisId="right" orientation="right" tick={CHART_AXIS_TICK} tickLine={false} axisLine={false} width={44} />
        <Tooltip
          {...CHART_TOOLTIP}
        />
        <Area yAxisId="right" type="monotone" dataKey="impressions" name="Impressions" stroke={CHART.series2} fill="url(#impr)" strokeWidth={1.5} activeDot={CHART_ACTIVE_DOT} />
        <Area yAxisId="left" type="monotone" dataKey="clicks" name="Clicks" stroke={CHART.series1} fill="url(#clicks)" strokeWidth={2} activeDot={CHART_ACTIVE_DOT} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
