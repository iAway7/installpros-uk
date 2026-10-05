"use client";

import { TrendChart } from "@/components/system/chart";

export interface DayPoint {
  date: string;
  clicks: number;
  impressions: number;
}

/** Clicks over impressions, on two axes. Clicks are what the chart is about,
 *  so they come first and take the strong blue; impressions are context. */
export function SearchConsoleChart({ data }: { data: DayPoint[] }) {
  return (
    <TrendChart
      data={data.map((d) => ({ date: d.date, clicks: d.clicks, impressions: d.impressions }))}
      series={[
        { key: "clicks", name: "Clicks" },
        { key: "impressions", name: "Impressions", rightAxis: true },
      ]}
      height={260}
    />
  );
}
