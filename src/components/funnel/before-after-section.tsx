"use client";

import { useEffect, useRef, useState } from "react";
import { WhatsAppIcon } from "./ui/whatsapp-icon";
import { Button } from "@/components/system/button";

const WHATSAPP_URL = "https://wa.me/447446112343";

/** Cloudflare datacenter (colo) codes → friendly city names. UK + Western
 *  Europe covered; anything else falls back to the raw code. */
const COLO: Record<string, string> = {
  LHR: "London", LCY: "London", MAN: "Manchester", EDI: "Edinburgh", GLA: "Glasgow",
  BHX: "Birmingham", CWL: "Cardiff", DUB: "Dublin", AMS: "Amsterdam", CDG: "Paris",
  MRS: "Marseille", FRA: "Frankfurt", MUC: "Munich", DUS: "Düsseldorf", HAM: "Hamburg",
  BER: "Berlin", TXL: "Berlin", MAD: "Madrid", BCN: "Barcelona", LIS: "Lisbon",
  MXP: "Milan", FCO: "Rome", BRU: "Brussels", VIE: "Vienna", ZRH: "Zurich",
  GVA: "Geneva", CPH: "Copenhagen", ARN: "Stockholm", OSL: "Oslo", HEL: "Helsinki",
  WAW: "Warsaw", PRG: "Prague", ATH: "Athens", OTP: "Bucharest", SOF: "Sofia",
};
const coloLabel = (colo: string) => (COLO[colo] ? `${COLO[colo]} (${colo})` : colo);

/**
 * Palette for the before/after illustration only.
 *
 * This block is a self-contained data-visualisation, not page chrome, so its
 * greys and rose tints stay local instead of polluting the global token set.
 * Anything that IS brand or status (the red ramp, the green "connected" dot)
 * uses the theme tokens.
 */
const VIZ = {
  ink: "#6b7280",      // labels on the light half
  dim: "#9ca3af",      // the slow number + its bar
  warn: "#B45309",     // buffering dot
  rose: "#D9A0A0",     // caption on the dark half
  rose2: "#E8B9B9",    // units + status on the dark half
  rose3: "#C89B9B",    // small print on the dark half
  rose4: "#FFB5B5",    // "After · Starlink" tag
} as const;

/** The idle "before" figures are an illustration, and the three of them have
 *  to move together or the panel stops being believable.
 *
 *  12 Mbps: the UK universal service obligation is 10 Mbps down, so a rural
 *  line sits just above it far more often than it sits at 3.7, which is what
 *  this used to show. Below the legal minimum reads as a straw man, and the
 *  customer whose line does 12 does not recognise himself in it.
 *
 *  ~45 ms: what a British copper line actually does. The 620 ms this used to
 *  claim is geostationary satellite, and next to a 12 Mbps reading it is the
 *  kind of mismatch a technical visitor spots immediately. The real failure is
 *  the spike under load, which is what breaks video calls, and it is true.
 *
 *  4K: Netflix wants about 15 Mbps for it, so the claim survives at 12.
 */

/** Shared by both panels so the two readings are directly comparable. Same
 *  size either side on purpose: the numbers are 3.7 and 247, and making the
 *  good one physically bigger as well would be counting the same argument
 *  twice. Weight and colour carry the difference instead. */
const NUM = { fontSize: "clamp(52px,7vw,72px)", letterSpacing: "-0.04em" } as const;

/**
 * "Life before. Life after." — typical rural broadband against a
 * professionally installed Starlink, with a real speed test of the visitor's
 * own line. The two meters animate live (speeds fluctuate, bars fill, status
 * flickers) until a real test replaces the left-hand one.
 *
 * There used to be a drag-to-reveal slider here on desktop. It was removed:
 * a before/after slider earns its keep when both halves are the same thing in
 * two states, aligned, so dragging transforms one into the other. These two
 * halves are different layouts, so dragging only wiped one card out and
 * brought the other in, which is why it read as decoration. Will said as much.
 *
 * Dropping it also puts the speed-test button back inside the Before card,
 * where the original had it: with no clipping layer there is nothing to cover
 * it, and it belongs to that half because it measures the visitor's own line.
 *
 * Dropping it also removes the matchMedia state this component used to carry
 * purely to choose between slider and stack. That default was the entire CLS
 * of /install-quote (0.163): the server emitted the desktop slider and React
 * swapped in the stacked cards after hydration. The layout is now plain CSS
 * grid, identical on the server and the client, so there is nothing to shift.
 */
export function BeforeAfterSection() {
  // Live-meter refs — mutated directly in the rAF loop (no re-render per frame).
  const bBar = useRef<HTMLDivElement>(null);
  const bVal = useRef<HTMLSpanElement>(null);
  const bBuf = useRef<HTMLSpanElement>(null);
  const bStatus = useRef<HTMLSpanElement>(null);
  const aBar = useRef<HTMLDivElement>(null);
  const aVal = useRef<HTMLSpanElement>(null);

  // Real speed-test state (Cloudflare Speedtest against their edge network).
  const [phase, setPhase] = useState<"idle" | "testing" | "done" | "error">("idle");
  const [result, setResult] = useState<{ down: number; latency?: number } | null>(null);
  const [server, setServer] = useState<string | null>(null);
  const engineRef = useRef<{ pause: () => void } | null>(null);

  const fmt = (mbps: number) => (mbps >= 100 ? String(Math.round(mbps)) : mbps.toFixed(1));

  const runSpeedTest = async () => {
    if (phase === "testing") return;
    setPhase("testing");
    setResult(null);
    setServer(null);
    // Which Cloudflare datacenter we're hitting (runs in parallel with the test).
    // `colo` is an object: { iata, city, region, cca2, lat, lon }.
    fetch("https://speed.cloudflare.com/meta")
      .then((r) => r.json() as Promise<{ colo?: { iata?: string; city?: string } }>)
      .then((meta) => {
        const c = meta?.colo;
        if (!c) return;
        if (c.city) setServer(c.iata ? `${c.city} (${c.iata})` : c.city);
        else if (c.iata) setServer(coloLabel(c.iata));
      })
      .catch(() => {});
    if (bStatus.current) bStatus.current.textContent = "Testing your line…";
    if (bBuf.current) bBuf.current.style.opacity = "1";
    if (bBar.current) bBar.current.style.width = "4%";
    try {
      const SpeedTest = (await import("@cloudflare/speedtest")).default;
      const engine = new SpeedTest({
        autoStart: false,
        measurements: [
          { type: "latency", numPackets: 20 },
          { type: "download", bytes: 1e5, count: 1, bypassMinDuration: true },
          { type: "download", bytes: 1e6, count: 6 },
          { type: "download", bytes: 1e7, count: 4 },
        ],
      });
      engineRef.current = engine;
      engine.onResultsChange = () => {
        const bw = engine.results.getDownloadBandwidth();
        if (bw && bVal.current) {
          const mbps = bw / 1e6;
          bVal.current.textContent = fmt(mbps);
          if (bBar.current) bBar.current.style.width = Math.max(4, Math.min(100, mbps)) + "%";
        }
      };
      engine.onError = () => {
        setPhase("error");
        if (bStatus.current) bStatus.current.textContent = "Test failed. Try again";
      };
      engine.onFinish = (results) => {
        const s = results.getSummary();
        const down = s.download ? s.download / 1e6 : 0;
        if (bVal.current) bVal.current.textContent = fmt(down);
        if (bBar.current) bBar.current.style.width = Math.max(4, Math.min(100, down)) + "%";
        if (bBuf.current) bBuf.current.style.opacity = "1";
        if (bStatus.current) bStatus.current.textContent = "Your line · tested just now";
        setResult({ down, latency: s.latency });
        setPhase("done");
      };
      engine.play();
    } catch {
      setPhase("error");
      if (bStatus.current) bStatus.current.textContent = "Test failed. Try again";
    }
  };

  useEffect(() => () => engineRef.current?.pause(), []);

  // Idle simulation — only runs while no real test is active/complete.
  useEffect(() => {
    if (phase !== "idle") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const m = { p1: 12, p2: 70, mode: "load" as "load" | "stall", until: 900, tv: 0, tv2: 0 };
    let raf = 0;
    let start = 0;
    let last = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = now - start;
      const dt = last ? now - last : 16;
      last = now;
      if (t > m.until) {
        m.mode = m.mode === "load" ? "stall" : "load";
        m.until = t + (m.mode === "load" ? 700 + Math.random() * 900 : 500 + Math.random() * 1100);
        if (bStatus.current) bStatus.current.textContent = m.mode === "stall" ? "Buffering…" : "Loading…";
      }
      if (m.mode === "load") m.p1 += dt * 0.004;
      if (m.p1 >= 100) m.p1 = 0;
      if (bBar.current) bBar.current.style.width = m.p1 + "%";
      if (bBuf.current) bBuf.current.style.opacity = m.mode === "stall" ? String(0.4 + 0.6 * Math.abs(Math.sin(t * 0.008))) : "0.35";
      if (t > m.tv && bVal.current) { m.tv = t + 800; bVal.current.textContent = (10.4 + Math.random() * 3.2).toFixed(1); }
      m.p2 = (m.p2 + dt * 0.028) % 100;
      if (aBar.current) aBar.current.style.width = m.p2 + "%";
      if (t > m.tv2 && aVal.current) { m.tv2 = t + 640; aVal.current.textContent = String(238 + Math.round(Math.random() * 14)); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  return (
    <section id="difference" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="eyebrow">The Difference</p>
          <h2 className="mt-4 h2-section text-foreground">Life before. Life after.</h2>
          <p className="mx-auto mt-5 max-w-md text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            Test your real speed. This is what a professional install changes.
          </p>
        </div>

        {/* Two panels, one grid. Cards stretch to a common height, so the two
            readings sit on the same line and can be compared at a glance. */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* BEFORE (light) */}
          <div className="rounded-xl border border-border p-6 md:p-10" style={{ background: "var(--before-grad)" }}>
            <span className="inline-block rounded-full border border-black/15 px-[15px] py-[7px] text-micro font-semibold uppercase tracking-[0.18em]" style={{ color: VIZ.ink }}>
              Before
            </span>

            <div className="mt-8 text-caption tracking-[0.06em]" style={{ color: VIZ.ink }}>Typical rural broadband</div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span ref={bVal} style={{ ...NUM, fontWeight: 200, color: VIZ.dim }}>12</span>
              <span className="text-body" style={{ color: VIZ.dim }}>Mbps</span>
            </div>
            <div className="mt-5 h-[3px] w-full overflow-hidden rounded-full bg-black/10">
              <div ref={bBar} className="h-full rounded-full" style={{ width: "12%", background: VIZ.dim }} />
            </div>
            <div className="mt-3 flex items-center gap-2 text-caption" style={{ color: VIZ.ink }}>
              <span ref={bBuf} className="h-[7px] w-[7px] rounded-full" style={{ opacity: 0.35, background: VIZ.warn }} />
              <span ref={bStatus}>Loading…</span>
            </div>
            <div className="mt-5 text-caption leading-[1.7]" style={{ color: VIZ.ink }}>
              {phase === "done" && result ? (
                <>
                  Latency {Math.round(result.latency ?? 0)} ms
                  <br />
                  Measured on your connection just now
                </>
              ) : (
                <>
                  Latency ~45 ms, 300 ms+ under load
                  <br />
                  4K streaming: not possible
                </>
              )}
            </div>

            {(phase === "testing" || phase === "done") && server && (
              <div className="mt-2 flex items-center gap-1.5 text-label" style={{ color: VIZ.dim }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="7" rx="1.5" />
                  <rect x="3" y="13" width="18" height="7" rx="1.5" />
                  <path d="M7 7.5h.01M7 16.5h.01" />
                </svg>
                Test server · {server}
              </div>
            )}

            {/* Inside the Before card on purpose: it measures the visitor's own
                line, which is the before. It also keeps the section to one
                primary action at the bottom instead of three stacked buttons. */}
            <button
              type="button"
              onClick={runSpeedTest}
              disabled={phase === "testing"}
              className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-black/15 bg-white/70 px-5 text-caption font-semibold text-foreground transition-colors duration-quick hover:bg-white disabled:cursor-default disabled:opacity-60 sm:h-11 sm:w-auto"
              style={{ cursor: phase === "testing" ? "default" : "pointer" }}
            >
              {phase === "testing" ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" stroke="#9ca3af" strokeWidth="3" opacity="0.3" />
                    <path d="M21 12a9 9 0 0 0-9-9" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Testing…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M13 2 4.5 13.5H12l-1 8.5L19.5 10.5H12l1-8.5Z" />
                  </svg>
                  {phase === "done" ? "Test again" : phase === "error" ? "Retry test" : "Test my current speed"}
                </>
              )}
            </button>
          </div>

          {/* AFTER (dark) */}
          <div className="relative overflow-hidden rounded-xl p-6 md:p-10">
            {/* Earth from low orbit, which is where the constellation actually
                is: the picture is the argument, not decoration. It sits UNDER
                the gradient, and that ordering is the whole trick. The gradient
                is radial from 85% 110%, so its most opaque region is the top
                left, which is exactly where the pill, the caption, the reading
                and the small print live. The photograph therefore only reveals
                itself in the bottom-right corner, where there is no text.
                Alphas softened from .9/1 so it can. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/funnel/starlink-earth-from-orbit.webp"
              alt=""
              aria-hidden="true"
              loading="lazy"
              width={904}
              height={695}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(120% 130% at 85% 110%, hsl(var(--primary) / 0.22) 0%, rgba(20,10,10,.62) 45%, rgba(11,11,12,.9) 100%)" }}
            />

            <span
              className="relative inline-block rounded-full px-[15px] py-[7px] text-micro font-semibold uppercase tracking-[0.18em]"
              style={{ border: "1px solid hsl(var(--brand-soft) / 0.4)", color: VIZ.rose4, background: "rgba(60,5,5,.35)" }}
            >
              After · Starlink
            </span>

            <div className="relative mt-8 text-caption tracking-[0.06em]" style={{ color: VIZ.rose }}>Starlink, professionally installed</div>
            <div className="relative mt-2.5 flex items-baseline gap-2">
              <span ref={aVal} style={{ ...NUM, fontWeight: 400, color: "#fff", textShadow: "0 0 40px hsl(var(--brand-soft) / 0.5)" }}>247</span>
              <span className="text-body" style={{ color: VIZ.rose2 }}>Mbps</span>
            </div>
            <div className="relative mt-5 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
              <div ref={aBar} className="h-full rounded-full" style={{ width: "70%", background: "linear-gradient(90deg, hsl(var(--brand-soft)), hsl(var(--primary)))", boxShadow: "0 0 12px hsl(var(--brand-soft) / 0.8)" }} />
            </div>
            <div className="relative mt-3 flex items-center gap-2 text-caption" style={{ color: VIZ.rose2 }}>
              <span className="h-[7px] w-[7px] rounded-full bg-success-bright" style={{ boxShadow: "0 0 10px hsl(var(--success-bright) / 0.9)" }} />
              Connected · rock solid
            </div>
            <div className="relative mt-5 text-caption leading-[1.7]" style={{ color: VIZ.rose3 }}>
              Latency ~28 ms
              <br />
              4K on every screen, all at once
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {/* Both CTAs go through Button so there is exactly one button
              spec on the page. They used to be hand-rolled <a> tags at 14px
              while every other button rendered at 16px. */}
          <Button asChild>
            <a href="#quote">Check Availability</a>
          </Button>
          <Button asChild variant="outline">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
              Talk on WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
