import type { ReactNode } from "react";
import { Building2, Cctv, Check, Headset, Network, Satellite } from "lucide-react";

/**
 * The hand-over nobody covers (managed-research, sections 1.4 and 4.3): in
 * the chats, CCTV fitters waited on site while the "IT department" was in a
 * meeting, and the monitoring company (ARC) was who actually needed the
 * address. No competitor page mentions the ARC or the customer's IT company.
 *
 * Drawn as a hub, on React Bits Pro's features-10 ("integration map with
 * orbiting nodes", rebuilt here: no Pro licence). InstallPros sits in the
 * middle with a radar pulse; the monitoring company, the IT company, Starlink
 * and the site are around it, joined by short red signals moving inwards.
 * Gus picked it from several versions on 5 November 2026: graphite and red,
 * on white, with the pulse.
 */

const POINTS = [
  "We speak to your monitoring company and check the cameras get through.",
  "Your IT company gets the details for the VPN or remote access.",
  "If something stops working, we find out whose end it's on.",
];

const NODES: { icon: ReactNode; label: string; x: number; y: number }[] = [
  { icon: <Cctv className="h-5 w-5" />, label: "Monitoring company", x: 50, y: 8 },
  { icon: <Network className="h-5 w-5" />, label: "IT company", x: 92, y: 50 },
  { icon: <Satellite className="h-5 w-5" />, label: "Starlink", x: 50, y: 92 },
  { icon: <Building2 className="h-5 w-5" />, label: "Your site", x: 8, y: 50 },
];

const GRAPHITE = "#15181e";
const RING = "rgba(21,24,30,0.15)";
const GRID = "rgba(21,24,30,0.06)";

// Kept with the section rather than in globals.css: nothing else uses them.
const KEYFRAMES = `
@keyframes partners-spin { to { transform: rotate(360deg); } }
@keyframes partners-dash { to { stroke-dashoffset: -24; } }
@keyframes partners-ping { 0% { transform: scale(1); opacity: 0.45; } 100% { transform: scale(1.6); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .partners-anim { animation: none !important; } }
`;

export function ManagedPartnersSection() {
  return (
    <section id="partners" className="relative w-full scroll-mt-28 overflow-hidden bg-background pb-16 md:pb-24">
      <style>{KEYFRAMES}</style>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${GRID} 1px, transparent 1px), linear-gradient(90deg, ${GRID} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(60% 60% at 70% 50%, black, transparent)",
        }}
      />
      <div className="container relative mx-auto">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div data-reveal>
            <p className="eyebrow">Your other suppliers</p>
            <h2 className="mt-4 text-balance h2-section text-foreground">We work with your IT and alarm companies.</h2>
            <p className="mt-4 text-pretty text-body text-muted-foreground md:mt-5 md:text-lg" style={{ lineHeight: "1.6" }}>
              You don&apos;t have to pass messages between us.
            </p>
            <ul className="mt-8 space-y-3">
              {POINTS.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <Check aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  <span className="text-pretty text-body text-foreground md:text-lg" style={{ lineHeight: "1.5" }}>
                    {p}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* The hub. Decorative: the list beside it says the same in words. */}
          <div
            data-reveal
            style={{ transitionDelay: "120ms" }}
            className="relative mx-auto aspect-square w-full max-w-[460px]"
            aria-hidden="true"
          >
            <div
              className="partners-anim absolute inset-[8%] rounded-full border border-dashed"
              style={{ borderColor: RING, animation: "partners-spin 60s linear infinite" }}
            />
            <div className="absolute inset-[28%] rounded-full border" style={{ borderColor: RING }} />
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
              {NODES.map((n) => (
                <line
                  key={n.label}
                  x1={n.x}
                  y1={n.y}
                  x2="50"
                  y2="50"
                  stroke="hsl(var(--primary))"
                  strokeOpacity="0.75"
                  strokeWidth="0.3"
                  strokeLinecap="round"
                  strokeDasharray="0.8 3.2"
                  className="partners-anim"
                  style={{ animation: "partners-dash 1.6s linear infinite" }}
                />
              ))}
            </svg>

            {/* InstallPros, exactly where the lines meet; the name hangs below
                without pushing the disc up. */}
            <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2">
              {[0, 1, 2].map((k) => (
                <span
                  key={k}
                  className="partners-anim absolute inset-0 rounded-full border border-primary"
                  style={{ animation: `partners-ping 3s ease-out ${k}s infinite` }}
                />
              ))}
              <span
                className="relative flex h-16 w-16 items-center justify-center rounded-full text-white"
                style={{ background: GRAPHITE }}
              >
                <Headset className="h-6 w-6" />
              </span>
              <span className="absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded-full bg-background px-2 font-mono text-caption font-semibold uppercase tracking-[0.14em] text-foreground">
                InstallPros
              </span>
            </div>

            {NODES.map((n) => (
              <div
                key={n.label}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border bg-background shadow-raised"
                  style={{ borderColor: "rgba(21,24,30,0.12)", color: GRAPHITE }}
                >
                  {n.icon}
                </span>
                <span className="whitespace-nowrap rounded-full bg-background px-2 text-caption font-semibold text-foreground">
                  {n.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
