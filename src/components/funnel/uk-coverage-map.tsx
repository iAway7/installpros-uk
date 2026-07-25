"use client";

import { useState } from "react";
import { ukRegions, UK_MAP_VIEWBOX } from "@/lib/funnel/uk-regions";

/**
 * Real UK map (NUTS1 region geometry) with live-install city pulses.
 * City coordinates were projected into the map's coordinate space with an
 * affine fit against the region centroids, so dots land on real locations.
 */
// Real InstallPros coverage areas (England from the coverage page) plus the
// Scotland / Wales / NI spread. Coordinates projected into the map space.
const CITIES = [
  { n: "London", x: 615.7, y: 716.3 },
  { n: "Birmingham", x: 481.5, y: 641.4 },
  { n: "Cheltenham", x: 471.1, y: 685.2 },
  { n: "Leeds", x: 501.0, y: 543.1 },
  { n: "Manchester", x: 451.2, y: 566.5 },
  { n: "Nottingham", x: 533.5, y: 606.9 },
  { n: "Peak District", x: 484.4, y: 576.7 },
  { n: "Lake District", x: 383.8, y: 493.1 },
  { n: "Cotswolds", x: 487.4, y: 690.6 },
  { n: "Northumberland", x: 457.7, y: 434.0 },
  { n: "Devon", x: 352.2, y: 772.2 },
  { n: "Cumbria", x: 398.0, y: 483.5 },
  { n: "Cornwall", x: 276.2, y: 795.3 },
  { n: "Bristol", x: 434.6, y: 718.2 },
  { n: "Bath", x: 451.8, y: 723.9 },
  { n: "Plymouth", x: 324.7, y: 797.7 },
  { n: "Norwich", x: 715.9, y: 633.3 },
  { n: "Glasgow", x: 292.7, y: 386.1 },
  { n: "Edinburgh", x: 370.7, y: 380.3 },
  { n: "Aberdeen", x: 446.1, y: 291.5 },
  { n: "Inverness", x: 287.7, y: 265.1 },
  { n: "Cardiff", x: 390.9, y: 715.6 },
  { n: "Belfast", x: 174.6, y: 479.6 },
];

const VB = { w: 760, h: 836 };

export function UkCoverageMap({ baseColor = "var(--primary)" }: { baseColor?: string } = {}) {
  const [hover, setHover] = useState<(typeof CITIES)[number] | null>(null);

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

        {/* Live install pulses */}
        <g>
          {CITIES.map((c, i) => (
            <g
              key={c.n}
              className="ipx-city"
              onMouseEnter={() => setHover(c)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer" }}
            >
              {/* generous invisible hit area */}
              <circle cx={c.x} cy={c.y} r={18} fill="transparent" />
              <circle
                className="ipx-pulse"
                cx={c.x}
                cy={c.y}
                r={5}
                fill="none"
                stroke="#FF5A5A"
                strokeWidth={1.4}
                style={{ animationDelay: `${(i * 0.37) % 3.4}s` }}
              />
              <circle className="ipx-dot" cx={c.x} cy={c.y} r={4.5} fill="#FF5A5A" />
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
