"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

export interface TrendSeries {
  /** Key in each data row. */
  key: string;
  name: string;
  /** Any CSS colour. Defaults follow the Search Console chart's blues. */
  color?: string;
  /** Plot on a second axis on the right; for series on a different scale. */
  rightAxis?: boolean;
  strokeWidth?: number;
}

export interface TrendPoint {
  /** ISO date, YYYY-MM-DD. Shown as MM-DD on the axis. */
  date: string;
  [key: string]: string | number | null;
}

const PALETTE = ["hsl(221 83% 53%)", "hsl(199 89% 48%)", "hsl(142 71% 45%)", "hsl(38 92% 50%)"];
const GRID = "hsl(214 32% 91%)";

/** Daily trend as a smoothed area chart with hover tooltip, shared by the
 *  dashboard pages so every time series looks the same. */
export function TrendChart({ data, series, height = 220 }: { data: TrendPoint[]; series: TrendSeries[]; height?: number }) {
  const formatted = data.map((d) => ({ ...d, label: d.date.slice(5) }));
  const hasRight = series.some((s) => s.rightAxis);
  const id = series.map((s) => s.key).join("-");

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={formatted} margin={{ top: 8, right: hasRight ? 0 : 8, left: -8, bottom: 0 }}>
        <defs>
          {series.map((s, i) => {
            const color = s.color ?? PALETTE[i % PALETTE.length];
            return (
              <linearGradient key={s.key} id={`${id}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={i === 0 ? 0.35 : 0.2} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            );
          })}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={24} />
        <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={40} allowDecimals={false} />
        {hasRight && (
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={44} allowDecimals={false} />
        )}
        <Tooltip
          contentStyle={{ borderRadius: 8, border: `1px solid ${GRID}`, fontSize: 12 }}
          labelStyle={{ fontWeight: 600 }}
          labelFormatter={(_l, payload) => String(payload?.[0]?.payload?.date ?? _l)}
        />
        {series.length > 1 && <Legend iconType="plainline" wrapperStyle={{ fontSize: 12 }} />}
        {/* Reverse so the first series draws on top. */}
        {[...series].reverse().map((s) => {
          const i = series.indexOf(s);
          const color = s.color ?? PALETTE[i % PALETTE.length];
          return (
            <Area
              key={s.key}
              yAxisId={s.rightAxis ? "right" : "left"}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={color}
              fill={`url(#${id}-${s.key})`}
              strokeWidth={s.strokeWidth ?? (i === 0 ? 2 : 1.5)}
              dot={false}
              activeDot={{ r: 4 }}
            />
          );
        })}
      </AreaChart>
    </ResponsiveContainer>
  );
}
