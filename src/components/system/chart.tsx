"use client";

import { useId } from "react";
import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { CHART, CHART_ACTIVE_DOT, CHART_AXIS_TICK, CHART_SERIES, CHART_TOOLTIP } from "./chart-theme";

export interface TrendSeries {
  /** Key in each data row. */
  key: string;
  name: string;
  /**
   * "area" (default) for a quantity that accumulates — leads, visitors,
   * clicks. "line" for a rate, where a filled area would suggest a volume
   * that is not there.
   */
  kind?: "area" | "line";
  /** Override the token. Defaults: first series chart-2 (the mid blue), second chart-1. */
  color?: string;
  /** Plot on a second axis on the right; for a series on a different scale. */
  rightAxis?: boolean;
  /** Dots on every point. For sparse series (weekly), where the line alone hides how few points there are. */
  dots?: boolean;
}

export interface TrendPoint {
  /** ISO date, YYYY-MM-DD. Shown as MM-DD on the axis. */
  date: string;
  [key: string]: string | number | null;
}

/**
 * A time series, area or line, one axis or two. Every chart in the dashboard.
 *
 * There were three: TrendChart (areas), a hand-built LineChart for the weekly
 * conversion rate, and another AreaChart for Search Console with its own
 * gradient ids — "clicks" and "impr", global, so two of them on one page would
 * have shared a fill. One component now, on the chart tokens, with ids from
 * useId.
 *
 * Series order is meaning: the first is what the chart is about and takes the
 * strong blue; the second is context and takes the light one. It draws on top
 * because it is drawn last.
 */
export function TrendChart({
  data,
  series,
  height = 220,
  unit,
  tooltipLabel,
  tooltipValue,
}: {
  data: TrendPoint[];
  series: TrendSeries[];
  height?: number;
  /** Appended to the left axis ticks, e.g. "%". */
  unit?: string;
  /** Tooltip heading for a row. Defaults to the full date. */
  tooltipLabel?: (row: TrendPoint) => string;
  /** Tooltip value for one series on one row. Defaults to the number as is. */
  tooltipValue?: (value: number | null, seriesKey: string, row: TrendPoint) => string;
}) {
  const uid = useId().replace(/:/g, "");
  const rows = data.map((d) => ({ ...d, label: d.date.slice(5) }));
  const hasRight = series.some((s) => s.rightAxis);
  const colorOf = (s: TrendSeries, i: number) => s.color ?? CHART_SERIES[i % CHART_SERIES.length];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={rows} margin={{ top: 8, right: hasRight ? 0 : 8, left: -8, bottom: 0 }}>
        <defs>
          {series.map((s, i) => (
            <linearGradient key={s.key} id={`${uid}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colorOf(s, i)} stopOpacity={i === 0 ? 0.35 : 0.2} />
              <stop offset="95%" stopColor={colorOf(s, i)} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
        <XAxis dataKey="label" tick={CHART_AXIS_TICK} tickLine={false} axisLine={false} minTickGap={24} />
        <YAxis yAxisId="left" tick={CHART_AXIS_TICK} tickLine={false} axisLine={false} width={44} unit={unit} allowDecimals={false} />
        {hasRight && (
          <YAxis yAxisId="right" orientation="right" tick={CHART_AXIS_TICK} tickLine={false} axisLine={false} width={44} allowDecimals={false} />
        )}
        <Tooltip
          {...CHART_TOOLTIP}
          // Series order, not draw order: the series are drawn reversed so the
          // first one sits on top, and Recharts would list them that way too.
          itemSorter={(item) => series.findIndex((s) => s.key === item.dataKey)}
          labelFormatter={(l, payload) => {
            const row = payload?.[0]?.payload as TrendPoint | undefined;
            return row ? (tooltipLabel ? tooltipLabel(row) : row.date) : String(l);
          }}
          formatter={(value, _name, item) => {
            if (!tooltipValue) return value as number;
            return tooltipValue((value as number | null) ?? null, String(item.dataKey), item.payload as TrendPoint);
          }}
        />
        {series.length > 1 && (
          <Legend
            wrapperStyle={{ fontSize: "var(--text-caption)" }}
            // A hand-built payload must carry payload.strokeDasharray: Recharts'
            // plainline icon reads it and throws (taking the page down) without it.
            payload={series.map((s, i) => ({
              id: s.key,
              value: s.name,
              type: "plainline" as const,
              color: colorOf(s, i),
              payload: { strokeDasharray: "0" },
            }))}
          />
        )}
        {/* Reversed so the first series draws on top. */}
        {[...series].reverse().map((s) => {
          const i = series.indexOf(s);
          const color = colorOf(s, i);
          const common = {
            yAxisId: s.rightAxis ? "right" : "left",
            type: "monotone" as const,
            dataKey: s.key,
            name: s.name,
            stroke: color,
            strokeWidth: i === 0 ? 2 : 1.5,
            dot: s.dots ? { r: 3, fill: color, strokeWidth: 0 } : false,
            activeDot: CHART_ACTIVE_DOT,
            connectNulls: false,
          };
          return s.kind === "line" ? (
            <Line key={s.key} {...common} />
          ) : (
            <Area key={s.key} {...common} fill={`url(#${uid}-${s.key})`} />
          );
        })}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
