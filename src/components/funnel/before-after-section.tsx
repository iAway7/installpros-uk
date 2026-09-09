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

/** Shared by both panels so the two readings are directly comparable. Same
 *  size either side on purpose: making the good one physically bigger as well
 *  would be counting the same argument twice. Weight and colour carry the
 *  difference instead. */
const NUM = { fontSize: "clamp(52px,7vw,72px)", letterSpacing: "-0.04em" } as const;

const fmt = (mbps: number) => (mbps >= 100 ? String(Math.round(mbps)) : mbps.toFixed(1));

type SpeedResult = { down: number; latency?: number };

/**
 * Cloudflare Speedtest against their edge network. Extracted from the panel it
 * used to live inside, because both variants below run the same test and only
 * differ in what they do with the number.
 */
async function startSpeedTest(handlers: {
  onProgress?: (mbps: number) => void;
  onDone: (r: SpeedResult) => void;
  onError: () => void;
}) {
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
  engine.onResultsChange = () => {
    const bw = engine.results.getDownloadBandwidth();
    if (bw) handlers.onProgress?.(bw / 1e6);
  };
  engine.onError = () => handlers.onError();
  engine.onFinish = (results) => {
    const s = results.getSummary();
    handlers.onDone({ down: s.download ? s.download / 1e6 : 0, latency: s.latency });
  };
  engine.play();
  return engine;
}

/** Which Cloudflare datacenter we are hitting. Runs in parallel with the test.
 *  `colo` is an object: { iata, city, region, cca2, lat, lon }. */
function fetchColo(set: (label: string) => void) {
  fetch("https://speed.cloudflare.com/meta")
    .then((r) => r.json() as Promise<{ colo?: { iata?: string; city?: string } }>)
    .then((meta) => {
      const c = meta?.colo;
      if (!c) return;
      if (c.city) set(c.iata ? `${c.city} (${c.iata})` : c.city);
      else if (c.iata) set(coloLabel(c.iata));
    })
    .catch(() => {});
}

/** The section chrome and the two CTAs, shared so the button spec cannot drift
 *  between the two variants. */
function SectionShell({
  eyebrow, heading, sub, children,
}: { eyebrow: string; heading: string; sub: string; children: React.ReactNode }) {
  return (
    <section id="difference" className="w-full scroll-mt-28 bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-4 h2-section text-foreground">{heading}</h2>
          <p className="mx-auto mt-5 max-w-md text-body text-muted-foreground md:text-lg" style={{ lineHeight: "1.6" }}>
            {sub}
          </p>
        </div>

        {children}

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

/** The speed-test trigger. Identical markup in both variants; only its position
 *  on the page changes. */
function TestButton({ phase, onClick }: { phase: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={phase === "testing"}
      className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-black/15 bg-white/70 px-5 text-caption font-semibold text-foreground transition-colors duration-quick hover:bg-white disabled:cursor-default disabled:opacity-60 sm:h-11"
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
  );
}

/**
 * "Life before. Life after." — typical rural broadband against a
 * professionally installed Starlink, with a real speed test of the visitor's
 * own line.
 *
 * This is the residential argument: the visitor's line is slow, ours is fast.
 * It only works while that first half is true, which is why the commercial page
 * uses the continuity variant below instead.
 *
 * There used to be a drag-to-reveal slider here on desktop. It was removed:
 * a before/after slider earns its keep when both halves are the same thing in
 * two states, aligned, so dragging transforms one into the other. These two
 * halves are different layouts, so dragging only wiped one card out and
 * brought the other in, which is why it read as decoration. Will said as much.
 *
 * Dropping it also removed the matchMedia state this component used to carry
 * purely to choose between slider and stack. That default was the entire CLS
 * of /install-quote (0.163): the server emitted the desktop slider and React
 * swapped in the stacked cards after hydration. The layout is now plain CSS
 * grid, identical on the server and the client, so there is nothing to shift.
 */
function SpeedVariant() {
  // Live-meter refs — mutated directly in the rAF loop (no re-render per frame).
  const bBar = useRef<HTMLDivElement>(null);
  const bVal = useRef<HTMLSpanElement>(null);
  const bBuf = useRef<HTMLSpanElement>(null);
  const bStatus = useRef<HTMLSpanElement>(null);
  const aBar = useRef<HTMLDivElement>(null);
  const aVal = useRef<HTMLSpanElement>(null);

  const [phase, setPhase] = useState<"idle" | "testing" | "done" | "error">("idle");
  const [result, setResult] = useState<SpeedResult | null>(null);
  const [server, setServer] = useState<string | null>(null);
  const engineRef = useRef<{ pause: () => void } | null>(null);

  const run = async () => {
    if (phase === "testing") return;
    setPhase("testing");
    setResult(null);
    setServer(null);
    fetchColo(setServer);
    if (bStatus.current) bStatus.current.textContent = "Testing your line…";
    if (bBuf.current) bBuf.current.style.opacity = "1";
    if (bBar.current) bBar.current.style.width = "4%";
    try {
      engineRef.current = await startSpeedTest({
        onProgress: (mbps) => {
          if (bVal.current) bVal.current.textContent = fmt(mbps);
          if (bBar.current) bBar.current.style.width = Math.max(4, Math.min(100, mbps)) + "%";
        },
        onDone: (r) => {
          if (bVal.current) bVal.current.textContent = fmt(r.down);
          if (bBar.current) bBar.current.style.width = Math.max(4, Math.min(100, r.down)) + "%";
          if (bBuf.current) bBuf.current.style.opacity = "1";
          if (bStatus.current) bStatus.current.textContent = "Your line · tested just now";
          setResult(r);
          setPhase("done");
        },
        onError: () => {
          setPhase("error");
          if (bStatus.current) bStatus.current.textContent = "Test failed. Try again";
        },
      });
    } catch {
      setPhase("error");
      if (bStatus.current) bStatus.current.textContent = "Test failed. Try again";
    }
  };

  useEffect(() => () => engineRef.current?.pause(), []);

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
    <SectionShell
      eyebrow="The Difference"
      heading="Life before. Life after."
      sub="Test your real speed. This is what a professional install changes."
    >
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
          <div className="mt-7">
            <TestButton phase={phase} onClick={run} />
          </div>
        </div>

        {/* AFTER (dark) */}
        <div className="relative overflow-hidden rounded-xl p-6 md:p-10">
          <EarthBackdrop />

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
    </SectionShell>
  );
}

/** Earth from low orbit, which is where the constellation actually is: the
 *  picture is the argument, not decoration. It sits UNDER the gradient, and
 *  that ordering is the whole trick. The gradient is radial from 85% 110%, so
 *  its most opaque region is the top left, which is exactly where the pill, the
 *  caption, the reading and the small print live. The photograph therefore only
 *  reveals itself in the bottom-right corner, where there is no text. */
function EarthBackdrop() {
  return (
    <>
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
    </>
  );
}

/** TODO(will): NOT HIS NUMBER YET. Nine seconds is our assumption for an
 *  automatic router failover, and it is the only figure in this section that
 *  nobody has confirmed. It renders clean on the page, so the code is the only
 *  place that says so: do not treat it as verified because it looks finished.
 *  Will has been asked how long the switchover really takes and whether it
 *  happens in the router or someone has to do something. */
const FAILOVER_SECONDS = 9;

/** Where the counter starts. Any value works; this one reads as "long enough
 *  that someone has already phoned the provider". */
const OUTAGE_START_SECONDS = 252;

const clock = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/** Bar width tracks the counter, so the two bars are the same argument the two
 *  numbers are making. Capped so it cannot overrun the track. */
const outageBar = (s: number) => Math.min(100, 20 + s / 12);

/**
 * The commercial variant. Same two panels, different axis.
 *
 * The speed comparison argues against us on this page: a visitor on good fibre
 * runs the test, sees 513 Mbps against our 247, and the section has just told
 * him his line is better than what we sell. That is not a copy problem, it is
 * the axis. Mbps is the wrong one.
 *
 * The right axis is one line against two, which is what Will actually sells:
 * Starlink alongside the existing line with 5G behind it, not instead of it. On
 * that axis the fibre visitor stops being an objection and becomes the best
 * prospect on the page, because he is the one with the most to lose when it
 * drops.
 *
 * Three decisions worth keeping:
 *
 * 1. One element moves. The obvious version is a cycle where both panels start
 *    green, the line drops, and you watch what happens. It is cleverer and
 *    worse: anyone landing mid-cycle sees nothing. Here both panels show the
 *    two outcomes of the same failure from the first frame, and the only thing
 *    that animates is the left counter climbing. That asymmetry is the whole
 *    argument: one is still accumulating, the other stopped after nine seconds.
 *
 * 2. No speed test here at all. It first moved above the panels, where the
 *    result set the question up ("that is a good line, it is also the only one
 *    you have") instead of losing an argument to it. Then it came out
 *    altogether: on a page that no longer argues about Mbps, a speed reading is
 *    the one thing that pulls the reader back onto the axis we just left. The
 *    residential variant still has it, which is where it belongs.
 *

 * Server and client render the same first frame (the counter starts at a
 * constant, the interval only starts in an effect), so there is no CLS here
 * either.
 */
function ContinuityVariant() {
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // The single moving element. setInterval rather than rAF: it ticks once a
  // second, so a frame loop would be 60x the work for the same result.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let s = OUTAGE_START_SECONDS;
    const id = window.setInterval(() => {
      s += 1;
      if (counterRef.current) counterRef.current.textContent = clock(s);
      if (barRef.current) barRef.current.style.width = outageBar(s) + "%";
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <SectionShell
      eyebrow="Business Continuity"
      heading="One line is one point of failure."
      sub="Not how fast your line is. What happens to your site when it stops."
    >
      {/* The panels are a simulation, and the counter ticking makes them look
          like a live readout, so they say what they are. Kept after the test
          strip came out: the label is about the panels, not the test. */}
      <div className="mb-3">
        <span className="rounded-full border border-border px-2.5 py-1 text-micro font-semibold uppercase tracking-[0.14em]" style={{ color: VIZ.dim }}>
          Illustration
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* ONE LINE (light) */}
        <div className="rounded-xl border border-border p-6 md:p-10" style={{ background: "var(--before-grad)" }}>
          <span className="inline-block rounded-full border border-black/15 px-[15px] py-[7px] text-micro font-semibold uppercase tracking-[0.18em]" style={{ color: VIZ.ink }}>
            One line
          </span>

          <div className="mt-8 text-caption tracking-[0.06em]" style={{ color: VIZ.ink }}>Your connection, when it drops</div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span ref={counterRef} className="tabular-nums" style={{ ...NUM, fontWeight: 200, color: "hsl(var(--error))" }}>
              {clock(OUTAGE_START_SECONDS)}
            </span>
            <span className="text-body" style={{ color: VIZ.dim }}>offline</span>
          </div>
          <div className="mt-5 h-[3px] w-full overflow-hidden rounded-full bg-black/10">
            <div
              ref={barRef}
              className="h-full rounded-full"
              // 900ms linear against a 1s tick, so the bar creeps rather than
              // stepping. No named duration token is this long, and this is a
              // viz-local value like the VIZ palette above.
              style={{ width: outageBar(OUTAGE_START_SECONDS) + "%", background: "hsl(var(--error))", transition: "width 900ms linear" }}
            />
          </div>
          <div className="mt-3 flex items-center gap-2 text-caption" style={{ color: VIZ.ink }}>
            <span className="h-[7px] w-[7px] rounded-full motion-safe:animate-pulse" style={{ background: "hsl(var(--error))" }} />
            No connection. Nothing to fall back to.
          </div>
          {/* Was the full list of systems. That list is its own section further
              up the page now, so this keeps only the point the panel is making. */}
          <div className="mt-5 text-caption leading-[1.7]" style={{ color: VIZ.ink }}>
            Everything on site runs through it.
            <br />
            There is no second way out of the building.
          </div>
        </div>

        {/* TWO LINES (dark) */}
        <div className="relative overflow-hidden rounded-xl p-6 md:p-10">
          <EarthBackdrop />

          <span
            className="relative inline-block rounded-full px-[15px] py-[7px] text-micro font-semibold uppercase tracking-[0.18em]"
            style={{ border: "1px solid hsl(var(--brand-soft) / 0.4)", color: VIZ.rose4, background: "rgba(60,5,5,.35)" }}
          >
            Two lines
          </span>

          <div className="relative mt-8 text-caption tracking-[0.06em]" style={{ color: VIZ.rose }}>
            Your connection, plus Starlink
          </div>
          <div className="relative mt-2.5 flex items-baseline gap-2">
            <span
              className="tabular-nums"
              style={{ ...NUM, fontWeight: 400, color: "#fff", textShadow: "0 0 40px hsl(var(--brand-soft) / 0.5)" }}
            >
              {clock(FAILOVER_SECONDS)}
            </span>
            <span className="text-body" style={{ color: VIZ.rose2 }}>to switch over</span>
          </div>
          <div className="relative mt-5 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full" style={{ width: "4%", background: "#fff", boxShadow: "0 0 12px hsl(var(--brand-soft) / 0.8)" }} />
          </div>
          <div className="relative mt-3 flex items-center gap-2 text-caption" style={{ color: VIZ.rose2 }}>
            <span className="h-[7px] w-[7px] rounded-full bg-success-bright" style={{ boxShadow: "0 0 10px hsl(var(--success-bright) / 0.9)" }} />
            Site online, running on Starlink.
          </div>
          <div className="relative mt-5 text-caption leading-[1.7]" style={{ color: VIZ.rose3 }}>
            It moves back to your main line on its own when it returns.
            <br />
            Nobody on site has to do anything.
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

/**
 * The section is on three landings. `speed` is the residential argument and is
 * unchanged; `continuity` is the commercial one. It is a prop rather than a
 * rewrite because the residential pages sell a faster connection to a house,
 * where failover, card machines and EPOS mean nothing.
 */
export function BeforeAfterSection({ variant = "speed" }: { variant?: "speed" | "continuity" } = {}) {
  return variant === "continuity" ? <ContinuityVariant /> : <SpeedVariant />;
}
