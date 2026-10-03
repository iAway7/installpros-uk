/**
 * The data-viz tokens as the strings Recharts wants.
 *
 * Recharts takes colours and sizes as props rather than classes, which is how
 * three charts ended up with sixteen hand-written hsl() values between them.
 * These read the CSS variables instead, so a chart follows the density it
 * renders under like every other primitive. The rules for which series gets
 * which colour live next to the tokens in globals.css.
 */
export const CHART = {
  /** The series the chart is about. */
  series1: "hsl(var(--chart-1))",
  /** Context behind it. */
  series2: "hsl(var(--chart-2))",
  /** The one point to look at. Never a whole series. */
  accent: "hsl(var(--chart-accent))",
  grid: "hsl(var(--chart-grid))",
  axis: "hsl(var(--muted-foreground))",
} as const;

/** Two entries on purpose: a third series is a different chart. */
export const CHART_SERIES = [CHART.series1, CHART.series2] as const;

export const CHART_AXIS_TICK = { fontSize: "var(--text-label)", fill: CHART.axis };

export const CHART_TOOLTIP = {
  contentStyle: {
    borderRadius: "calc(var(--radius) - 4px)",
    border: `1px solid ${CHART.grid}`,
    background: "hsl(var(--card))",
    boxShadow: "var(--shadow-popover)",
    fontSize: "var(--text-caption)",
  },
  labelStyle: { fontWeight: 600, color: "hsl(var(--foreground))" },
};

/** Hover marker: the accent, ringed in the card colour so it lifts off the line. */
export const CHART_ACTIVE_DOT = { r: 4, fill: CHART.accent, stroke: "hsl(var(--card))", strokeWidth: 2 };
