"use client";

import { useState } from "react";
import { ukRegions, UK_MAP_VIEWBOX } from "@/lib/funnel/uk-regions";

/**
 * Real UK map (NUTS1 region geometry) with one pin per region.
 *
 * It used to carry twenty-three hand-picked town dots, which read as a list of
 * the only places we go: Will pointed out that Surrey, one of our biggest
 * markets, looked uncovered because no dot happened to land there. One pin per
 * region says the true thing instead, that we work in all twelve, and it cannot
 * develop a new hole every time someone scans the map for their own county.
 *
 * Pins come straight from the region geometry, so they cannot drift out of sync
 * with the shapes underneath them and there is no coordinate list to maintain.
 */
const PINS = Object.entries(ukRegions).map(([id, r]) => ({
  id,
  n: r.name,
  x: r.labelX,
  y: r.labelY,
}));

const VB = { w: 760, h: 836 };

// London is where most of our traffic is — show its tooltip by default, but
// only until the user first interacts. After any hover it behaves normally.
const DEFAULT_PIN = PINS.find((p) => p.id === "London") ?? PINS[0];

export function UkCoverageMap({ baseColor = "var(--primary)" }: { baseColor?: string } = {}) {
  const [hover, setHover] = useState<(typeof PINS)[number] | null>(DEFAULT_PIN);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <style>{`
        @keyframes ipxPulse {
          0%   { r: 5;  opacity: .55; }
          70%  { r: 20; opacity: 0; }
          100% { r: 20; opacity: 0; }
        }
        .ipx-pulse { animation: ipxPulse 3.4s cubic-bezier(.2,.6,.3,1) infinite; transform-box: fill-box; }
        @media (prefers-reduced-motion: reduce) { .ipx-pulse { animation: none; opacity: .25; } }
        .ipx-region { transition: fill .35s ease; }
        .ipx-city:hover .ipx-dot { r: 6.5; }
      `}</style>

      <svg
        viewBox={UK_MAP_VIEWBOX}
        style={{ width: "100%", height: "auto", display: "block", color: baseColor }}
        role="img"
        aria-label="Map of the United Kingdom showing our installation coverage"
      >
        {/* Region landmass */}
        <g>
          {Object.entries(ukRegions).map(([id, r]) => (
            <path
              key={id}
              className="ipx-region"
              d={r.dimensions}
              fill="currentColor"
              fillOpacity={0.07}
              stroke="currentColor"
              strokeOpacity={0.18}
              strokeWidth={1}
              strokeLinejoin="round"
            />
          ))}
        </g>

        {/* One pulse per region */}
        <g>
          {PINS.map((p, i) => (
            <g
              key={p.id}
              className="ipx-city"
              onMouseEnter={() => setHover(p)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Generous invisible hit area. 16 rather than 18: London and the
                  South East sit 41 units apart, the closest pair on the map, and
                  at 18 their targets would start to fight over the pointer. */}
              <circle cx={p.x} cy={p.y} r={16} fill="transparent" />
              <circle
                className="ipx-pulse"
                cx={p.x}
                cy={p.y}
                r={5}
                fill="none"
                stroke="#FF5A5A"
                strokeWidth={1.4}
                style={{ animationDelay: `${(i * 0.37) % 3.4}s` }}
              />
              <circle className="ipx-dot" cx={p.x} cy={p.y} r={4.5} fill="#FF5A5A" />
            </g>
          ))}
        </g>
      </svg>

      {/* Hover tooltip */}
      <div
        style={{
          position: "absolute",
          left: `${((hover?.x ?? 0) / VB.w) * 100}%`,
          top: `${((hover?.y ?? 0) / VB.h) * 100}%`,
          transform: "translate(-50%,-140%)",
          background: "var(--tip-bg, rgba(255,255,255,0.96))",
          border: "1px solid rgba(255,90,90,.4)",
          borderRadius: 10,
          padding: "7px 13px",
          fontSize: 12.5,
          fontWeight: 500,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          opacity: hover ? 1 : 0,
          transition: "opacity .25s, left .25s, top .25s",
          backdropFilter: "blur(8px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
          color: baseColor,
        }}
      >
        {hover ? `${hover.n}  ·  covered` : ""}
      </div>
    </div>
  );
}
