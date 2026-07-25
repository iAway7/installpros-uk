"use client";

import { useEffect, useRef, useState } from "react";
import { WhatsAppIcon } from "./ui/whatsapp-icon";

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
 * "Life before. Life after." — a draggable before/after comparison of typical
 * rural broadband vs a professionally installed Starlink. Ported from the
 * /starlink-installations landing (rebuilt as a self-contained React slider).
 * The two meters animate live (speeds fluctuate, bars fill, status flickers).
 */
export function BeforeAfterSection() {
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

  return (
    <section id="difference" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-primary">The Difference</p>
          <h2
            className="mt-4 text-[2.5rem] font-bold text-foreground md:text-[3.25rem]"
            style={{ fontWeight: 600, lineHeight: "1.06em", letterSpacing: "-0.035em" }}
          >
            Life before. Life after.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            Drag the handle — or test your real speed. This is what a professional install changes.
          </p>
        </div>

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
          <div className="absolute inset-0" style={{ background: "linear-gradient(160deg,#eef0f4,#e2e5ec)" }}>
            <span className="absolute left-[30px] top-[26px] rounded-full border border-black/15 px-[15px] py-[7px] text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b7280]">
              Before
            </span>
            <div
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: "clamp(24px,6vw,80px)", maxWidth: "44%" }}
            >
              <div className="text-[13px] tracking-[0.06em] text-[#6b7280]">Typical rural broadband</div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span ref={bVal} style={{ fontSize: "clamp(44px,5.5vw,72px)", fontWeight: 200, letterSpacing: "-0.04em", color: "#9ca3af" }}>3.7</span>
                <span className="text-[16px] text-[#9ca3af]">Mbps</span>
              </div>
              <div className="mt-5 h-[3px] max-w-[260px] overflow-hidden rounded-full bg-black/10">
                <div ref={bBar} className="h-full rounded-full bg-[#9ca3af]" style={{ width: "12%" }} />
              </div>
              <div className="mt-3 flex items-center gap-2 text-[13px] text-[#6b7280]">
                <span ref={bBuf} className="h-[7px] w-[7px] rounded-full bg-[#B45309]" style={{ opacity: 0.35 }} />
                <span ref={bStatus}>Loading…</span>
              </div>
              <div className="mt-5 text-[13px] leading-[1.7] text-[#6b7280]">
                {phase === "done" && result ? (
                  <>
                    Latency ~{Math.round(result.latency ?? 0)} ms
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
                <div className="mt-2 flex items-center gap-1.5 text-[12px] text-[#9ca3af]">
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
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/70 px-4 py-2 text-[13px] font-semibold text-[#374151] transition-colors hover:bg-white disabled:cursor-default disabled:opacity-60"
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
          </div>

          {/* AFTER (dark, clipped from the divider) */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(120% 130% at 85% 110%,rgba(199,5,5,.28) 0%,rgba(20,10,10,.9) 45%,#0B0B0C 100%)",
              clipPath: `inset(0 0 0 ${pos}%)`,
            }}
          >
            <span
              className="absolute right-[30px] top-[26px] rounded-full px-[15px] py-[7px] text-[11px] font-semibold uppercase tracking-[0.18em]"
              style={{ border: "1px solid rgba(255,120,120,.4)", color: "#FFB5B5", background: "rgba(60,5,5,.35)" }}
            >
              After · Starlink
            </span>
            <div
              className="absolute top-1/2 -translate-y-1/2 text-right"
              style={{ right: "clamp(24px,6vw,80px)", maxWidth: "44%" }}
            >
              <div className="text-[13px] tracking-[0.06em] text-[#D9A0A0]">Starlink, professionally installed</div>
              <div className="mt-2.5 flex items-baseline justify-end gap-2.5">
                <span ref={aVal} style={{ fontSize: "clamp(52px,6.5vw,88px)", fontWeight: 400, letterSpacing: "-0.04em", color: "#fff", textShadow: "0 0 40px rgba(255,80,80,.5)" }}>247</span>
                <span className="text-[17px] text-[#E8B9B9]">Mbps</span>
              </div>
              <div className="ml-auto mt-5 h-[3px] max-w-[280px] overflow-hidden rounded-full bg-white/10">
                <div ref={aBar} className="h-full rounded-full" style={{ width: "70%", background: "linear-gradient(90deg,#FF6B6B,#C70505)", boxShadow: "0 0 12px rgba(255,80,80,.8)" }} />
              </div>
              <div className="mt-3 flex items-center justify-end gap-2 text-[13px] text-[#E8B9B9]">
                <span className="h-[7px] w-[7px] rounded-full bg-[#34D399]" style={{ boxShadow: "0 0 10px rgba(52,211,153,.9)" }} />
                Connected · rock solid
              </div>
              <div className="mt-5 text-[13px] leading-[1.7] text-[#C89B9B]">
                Latency ~28 ms
                <br />
                4K on every screen, all at once
              </div>
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

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#quote"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-[22px] font-bold uppercase leading-none tracking-[-0.2px] text-primary-foreground transition-all hover:bg-primary/90"
            style={{ fontSize: "14px" }}
          >
            Check Availability
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2.5 rounded-xl border border-border bg-transparent px-[22px] font-bold uppercase leading-none tracking-[-0.2px] text-foreground transition-all hover:bg-secondary/50"
            style={{ fontSize: "14px" }}
          >
            <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
            Talk on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
