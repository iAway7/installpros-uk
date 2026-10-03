"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { CHART, CHART_ACTIVE_DOT, CHART_AXIS_TICK, CHART_SERIES, CHART_TOOLTIP } from "@/components/system/chart-theme";

export interface TrendSeries {
  /** Key in each data row. */
  key: string;
  name: string;
  /** Override the token. Defaults: first series --chart-1, second --chart-2. */
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
            const color = s.color ?? CHART_SERIES[i % CHART_SERIES.length];
            return (
              <linearGradient key={s.key} id={`${id}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={i === 0 ? 0.35 : 0.2} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            );
          })}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
        <XAxis dataKey="label" tick={CHART_AXIS_TICK} tickLine={false} axisLine={false} minTickGap={24} />
        <YAxis yAxisId="left" tick={CHART_AXIS_TICK} tickLine={false} axisLine={false} width={40} allowDecimals={false} />
        {hasRight && (
          <YAxis yAxisId="right" orientation="right" tick={CHART_AXIS_TICK} tickLine={false} axisLine={false} width={44} allowDecimals={false} />
        )}
        <Tooltip
          {...CHART_TOOLTIP}
          labelFormatter={(_l, payload) => String(payload?.[0]?.payload?.date ?? _l)}
        />
        {series.length > 1 && <Legend iconType="plainline" wrapperStyle={{ fontSize: "var(--text-caption)" }} />}
        {/* Reverse so the first series draws on top. */}
        {[...series].reverse().map((s) => {
          const i = series.indexOf(s);
          const color = s.color ?? CHART_SERIES[i % CHART_SERIES.length];
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
              activeDot={CHART_ACTIVE_DOT}
            />
          );
        })}
      </AreaChart>
    </ResponsiveContainer>
  );
}
