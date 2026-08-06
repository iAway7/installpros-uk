"use client";

import { useEffect, useRef, useState } from "react";
import { WhatsAppIcon } from "./ui/whatsapp-icon";
import { FunnelButton } from "@/components/system/funnel-button";

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

/**
 * "Life before. Life after." — a draggable before/after comparison of typical
 * rural broadband vs a professionally installed Starlink. Ported from the
 * /starlink-installations landing (rebuilt as a self-contained React slider).
 * The two meters animate live (speeds fluctuate, bars fill, status flickers).
 */
export function BeforeAfterSection() {
  // Server-rendered default is the STACKED layout, not the slider.
  //
  // useIsMobile() starts false, so the server used to emit the desktop drag
  // slider and React replaced it with the stacked cards right after hydration.
  // On a phone that swaps a ~460px panel for two much taller cards, and it was
  // the entire CLS of /install-quote: 0.163, attributed by DevTools to the
  // `div.mt-6` that only exists inside the stacked branch.
  //
  // Defaulting to stacked means phones receive their final layout from the
  // server and never shift. Desktop takes the swap instead, which is the right
  // way round: the slider is the enhancement, the stack is the baseline.
  //
  // Deliberately not useIsMobile(): that hook is shared with
  // property-image-upload, and flipping its default there is a separate call.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const onChange = () => setIsDesktop(mql.matches);
    mql.addEventListener("change", onChange);
    onChange();
    return () => mql.removeEventListener("change", onChange);
  }, []);
  const isMobile = !isDesktop;

  const [pos, setPos] = useState(55); // divider position, %
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

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
        if (bStatus.current) bStatus.current.textContent = "Test failed — try again";
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
      if (bStatus.current) bStatus.current.textContent = "Test failed — try again";
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
      if (t > m.tv && bVal.current) { m.tv = t + 800; bVal.current.textContent = (2.6 + Math.random() * 2.4).toFixed(1); }
      m.p2 = (m.p2 + dt * 0.028) % 100;
      if (aBar.current) aBar.current.style.width = m.p2 + "%";
      if (t > m.tv2 && aVal.current) { m.tv2 = t + 640; aVal.current.textContent = String(238 + Math.round(Math.random() * 14)); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const setFromClientX = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100)));
  };

  // Panel content, shared by the stacked and slider layouts so the live meters
  // only ever exist once in the tree — two copies would fight over the refs.
  const beforeBody = (stacked: boolean) => (
    <>
      <div className="text-[13px] tracking-[0.06em]" style={{ color: VIZ.ink }}>Typical rural broadband</div>
      <div className="mt-2.5 flex items-baseline gap-2">
        <span ref={bVal} style={{ fontSize: stacked ? "clamp(52px,14vw,64px)" : "clamp(44px,5.5vw,72px)", fontWeight: 200, letterSpacing: "-0.04em", color: VIZ.dim }}>3.7</span>
        <span className="text-[16px]" style={{ color: VIZ.dim }}>Mbps</span>
      </div>
      <div className="mt-5 h-[3px] max-w-[260px] overflow-hidden rounded-full bg-black/10">
        <div ref={bBar} className="h-full rounded-full" style={{ width: "12%", background: VIZ.dim }} />
      </div>
      <div className="mt-3 flex items-center gap-2 text-[13px]" style={{ color: VIZ.ink }}>
        <span ref={bBuf} className="h-[7px] w-[7px] rounded-full" style={{ opacity: 0.35, background: VIZ.warn }} />
        <span ref={bStatus}>Loading…</span>
      </div>
      <div className="mt-5 text-[13px] leading-[1.7]" style={{ color: VIZ.ink }}>
        {phase === "done" && result ? (
          <>
            Latency {Math.round(result.latency ?? 0)} ms
            <br />
            Measured on your connection just now
          </>
        ) : (
          <>
            Latency ~620 ms
            <br />
            4K streaming: not possible
          </>
        )}
      </div>

      {(phase === "testing" || phase === "done") && server && (
        <div className="mt-2 flex items-center gap-1.5 text-[12px]" style={{ color: VIZ.dim }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="7" rx="1.5" />
            <rect x="3" y="13" width="18" height="7" rx="1.5" />
            <path d="M7 7.5h.01M7 16.5h.01" />
          </svg>
          Test server · {server}
        </div>
      )}

      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={runSpeedTest}
        disabled={phase === "testing"}
        className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-black/15 bg-white/70 px-4 text-[13px] font-semibold text-foreground transition-colors duration-200 hover:bg-white disabled:cursor-default disabled:opacity-60 ${
          stacked ? "h-12 w-full" : "py-2"
        }`}
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
    </>
  );

  const afterBody = (right: boolean) => (
    <>
      <div className="text-[13px] tracking-[0.06em]" style={{ color: VIZ.rose }}>Starlink, professionally installed</div>
      <div className={`mt-2.5 flex items-baseline gap-2.5 ${right ? "justify-end" : ""}`}>
        <span ref={aVal} style={{ fontSize: right ? "clamp(52px,6.5vw,88px)" : "clamp(60px,16vw,76px)", fontWeight: 400, letterSpacing: "-0.04em", color: "#fff", textShadow: "0 0 40px hsl(var(--brand-soft) / 0.5)" }}>247</span>
        <span className="text-[17px]" style={{ color: VIZ.rose2 }}>Mbps</span>
      </div>
      <div className={`mt-5 h-[3px] max-w-[280px] overflow-hidden rounded-full bg-white/10 ${right ? "ml-auto" : ""}`}>
        <div ref={aBar} className="h-full rounded-full" style={{ width: "70%", background: "linear-gradient(90deg, hsl(var(--brand-soft)), hsl(var(--primary)))", boxShadow: "0 0 12px hsl(var(--brand-soft) / 0.8)" }} />
      </div>
      <div className={`mt-3 flex items-center gap-2 text-[13px] ${right ? "justify-end" : ""}`} style={{ color: VIZ.rose2 }}>
        <span className="h-[7px] w-[7px] rounded-full bg-success-bright" style={{ boxShadow: "0 0 10px hsl(var(--success-bright) / 0.9)" }} />
        Connected · rock solid
      </div>
      <div className="mt-5 text-[13px] leading-[1.7]" style={{ color: VIZ.rose3 }}>
        Latency ~28 ms
        <br />
        4K on every screen, all at once
      </div>
    </>
  );

  return (
    <section id="difference" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="eyebrow">The Difference</p>
          <h2
            className="mt-4 h2-section text-foreground"
          >
            Life before. Life after.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            {isMobile
              ? "Test your real speed — this is what a professional install changes."
              : "Drag the handle — or test your real speed. This is what a professional install changes."}
          </p>
        </div>

        {/*
          The two panels share their content between layouts. Below md we stack
          them — before on top, after underneath, which is the order the story
          reads in — because at 375px the drag-slider gives each side ~165px and
          the text clips against the divider and the handle.
        */}
        {isMobile ? (
          <div className="flex flex-col gap-4">
            <div className="rounded-[22px] border border-border p-6" style={{ background: "var(--before-grad)" }}>
              <span className="inline-block rounded-full border border-black/15 px-[15px] py-[7px] text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: VIZ.ink }}>
                Before
              </span>
              <div className="mt-6">{beforeBody(true)}</div>
            </div>

            <div
              className="rounded-[22px] p-6"
              style={{ background: "radial-gradient(120% 130% at 85% 110%, hsl(var(--primary) / 0.28) 0%, rgba(20,10,10,.9) 45%, #0B0B0C 100%)" }}
            >
              <span
                className="inline-block rounded-full px-[15px] py-[7px] text-[11px] font-semibold uppercase tracking-[0.18em]"
                style={{ border: "1px solid hsl(var(--brand-soft) / 0.4)", color: VIZ.rose4, background: "rgba(60,5,5,.35)" }}
              >
                After · Starlink
              </span>
              <div className="mt-6">{afterBody(false)}</div>
            </div>
          </div>
        ) : (
          <div
            ref={ref}
            onPointerDown={(e) => {
              dragging.current = true;
              (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
              setFromClientX(e.clientX);
            }}
            onPointerMove={(e) => dragging.current && setFromClientX(e.clientX)}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
            className="relative w-full select-none overflow-hidden rounded-[30px] border border-border"
            style={{ height: "clamp(400px, 46vw, 520px)", cursor: "ew-resize", touchAction: "pan-y" }}
          >
            {/* BEFORE (light) */}
            <div className="absolute inset-0" style={{ background: "var(--before-grad)" }}>
              <span className="absolute left-[30px] top-[26px] rounded-full border border-black/15 px-[15px] py-[7px] text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: VIZ.ink }}>
                Before
              </span>
              <div className="absolute top-1/2 -translate-y-1/2" style={{ left: "clamp(24px,6vw,80px)", maxWidth: "44%" }}>
                {beforeBody(false)}
              </div>
            </div>

            {/* AFTER (dark, clipped from the divider) */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 130% at 85% 110%, hsl(var(--primary) / 0.28) 0%, rgba(20,10,10,.9) 45%, #0B0B0C 100%)",
                clipPath: `inset(0 0 0 ${pos}%)`,
              }}
            >
              <span
                className="absolute right-[30px] top-[26px] rounded-full px-[15px] py-[7px] text-[11px] font-semibold uppercase tracking-[0.18em]"
                style={{ border: "1px solid hsl(var(--brand-soft) / 0.4)", color: VIZ.rose4, background: "rgba(60,5,5,.35)" }}
              >
                After · Starlink
              </span>
              <div className="absolute top-1/2 -translate-y-1/2 text-right" style={{ right: "clamp(24px,6vw,80px)", maxWidth: "44%" }}>
                {afterBody(true)}
              </div>
            </div>

            {/* HANDLE */}
            <div
              className="absolute bottom-0 top-0"
              style={{ left: `${pos}%`, width: 1, background: "rgba(255,255,255,.5)", boxShadow: "0 0 20px rgba(255,255,255,.4)" }}
            >
              <div
                className="absolute left-1/2 top-1/2 flex h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-[3px] rounded-full"
                style={{ background: "rgba(20,20,20,.85)", border: "1px solid rgba(255,255,255,.35)", backdropFilter: "blur(8px)", boxShadow: "0 10px 34px rgba(0,0,0,.6)" }}
              >
                <svg width="9" height="12" viewBox="0 0 8 12" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M6 1L2 6l4 5" />
                </svg>
                <svg width="9" height="12" viewBox="0 0 8 12" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M2 1l4 5-4 5" />
                </svg>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {/* Both CTAs go through FunnelButton so there is exactly one button
              spec on the page. They used to be hand-rolled <a> tags at 14px
              while every other button rendered at 16px. */}
          <FunnelButton asChild>
            <a href="#quote">Check Availability</a>
          </FunnelButton>
          <FunnelButton asChild variant="outline">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
              Talk on WhatsApp
            </a>
          </FunnelButton>
        </div>
      </div>
    </section>
  );
}
