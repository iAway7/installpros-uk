"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export interface DayPoint {
  date: string;
  clicks: number;
  impressions: number;
}

/** Clicks + impressions over time (dual-axis area chart). */
export function SearchConsoleChart({ data }: { data: DayPoint[] }) {
  const formatted = data.map((d) => ({ ...d, label: d.date.slice(5) }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={formatted} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="clicks" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(221 83% 53%)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="hsl(221 83% 53%)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="impr" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(199 89% 48%)" stopOpacity={0.2} />
            <stop offset="95%" stopColor="hsl(199 89% 48%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={24} />
        <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={40} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={44} />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: "1px solid hsl(214 32% 91%)", fontSize: 12 }}
          labelStyle={{ fontWeight: 600 }}
        />
        <Area yAxisId="right" type="monotone" dataKey="impressions" name="Impressions" stroke="hsl(199 89% 48%)" fill="url(#impr)" strokeWidth={1.5} />
        <Area yAxisId="left" type="monotone" dataKey="clicks" name="Clicks" stroke="hsl(221 83% 53%)" fill="url(#clicks)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
