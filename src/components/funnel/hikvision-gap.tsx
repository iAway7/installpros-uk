import type { ReactNode } from "react";

/**
 * A hole in the Hikvision draft, drawn so nobody can miss it: dashed amber,
 * with the number of the question to Jordan it waits on
 * (hikvision-research/preguntas-jordan-will.md). The text inside is the
 * draft's best guess and may be wrong.
 *
 * Draft only. The page 404s in production until every Gap is gone; delete
 * this file with the last one.
 */
export function Gap({ q, children, tone = "light" }: { q: string; children?: ReactNode; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <mark
      className="rounded-[4px] px-1 py-px [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
      style={{
        background: dark ? "rgba(251, 191, 36, 0.18)" : "#fef3c7",
        color: "inherit",
        outline: `1.5px dashed ${dark ? "#fbbf24" : "#d97706"}`,
        outlineOffset: "1px",
      }}
    >
      <span className="text-[0.8em] font-bold uppercase tracking-wide" style={{ color: dark ? "#fcd34d" : "#b45309" }}>
        Jordan {q}
      </span>
      {children ? <> {children}</> : null}
    </mark>
  );
}
