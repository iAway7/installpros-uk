"use client";

/**
 * WeatherHero: the vehicle landing hero from weather-hero-kit, ported to the
 * funnel. Three scenes (same vehicle, three kinds of weather), copy that swaps
 * with the scene, and a canvas particle layer that morphs between snow, rain
 * and wind instead of cutting. The canvas engine and the `fx` presets are the
 * kit's, untouched. See public/hero/ for the plates and
 * weather-hero.module.css for the styles.
 *
 * What changed from the kit's React port:
 *  - No top bar. The page keeps its fixed MainHeader (real logo, WhatsApp,
 *    phone, analytics); the hero clears it with padding.
 *  - The postcode form is wired to the funnel's own `checkUkPostcode`, so the
 *    "Check availability" button does what it says: validates the postcode,
 *    echoes the area back ("We cover Cumbria.") and fires COVERAGE_CHECKED.
 *    From there "Get a quote" jumps to the CtaSection at #quote, which is the
 *    full lead form. It does not carry the postcode down: the CTA form on the
 *    vehicle page asks for an address, not a postcode.
 *  - The kit's strip under the hero is gone. The page passes the site's
 *    HeroTrustBar through `bar` instead (Google, Trustpilot, installs, The
 *    Times, Authorised Installer), pinned inside the hero like HeroSection.
 *  - The plates are the kit's graded finals, three widths each (960, 1280,
 *    1600) served through srcset. Only the first scene is in the critical
 *    path; see the img block at the foot of the file.
 *
 * Placeholders inherited from the kit, flagged in its README: the Connection
 * card figures (184 Mbps, 31 ms) and the copy claims (self-heating dish,
 * sealed roof entry, motorway-speed mount) are unconfirmed by Will.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { isValidUkPostcode, normalisePostcode } from "@/lib/utils";
import { checkUkPostcode } from "@/lib/funnel/check-postcode";
import { track, EVENTS } from "@/lib/analytics";
import styles from "./weather-hero.module.css";

export type SceneFx = {
  density: number; angle: number; speed: number; length: number;
  size: number; sway: number; swayFreq: number; alpha: number;
  gust: number; gustT: number; r: number; g: number; b: number;
};

export type Scene = {
  src: string;
  srcSet: string;
  alt: string;
  eyebrow: string;
  titleLines: [string, string];
  lede: string;
  place: string;
  fx: SceneFx;
};

export type HeroStats = { download: string; latency: string; mount: string };

const DWELL = 7200;
const SWAP_MS = 420;

/* The kit's demo scenes, with the plates moved to public/hero/. */
export const VEHICLE_SCENES: Scene[] = [
  {
    src: "/hero/snow.webp",
    srcSet: "/hero/snow-960.webp 960w, /hero/snow-1280.webp 1280w, /hero/snow.webp 1600w",
    alt: "4x4 with a roof-mounted Starlink dish climbing a snow-covered Lake District pass",
    eyebrow: "Snow · Kirkstone Pass",
    titleLines: ["Online in", "the snowfall."],
    lede: "The dish heats itself to shed snow and ice. Fitted properly to your campervan or 4x4, it keeps streaming while the valley below loses its signal.",
    place: "Kirkstone Pass",
    fx: { density: .85, angle: .10, speed: 150, length: .6, size: 2.7, sway: 24, swayFreq: .65, alpha: .85, gust: 0, gustT: 8, r: 255, g: 255, b: 255 },
  },
  {
    src: "/hero/storm.webp",
    srcSet: "/hero/storm-960.webp 960w, /hero/storm-1280.webp 1280w, /hero/storm.webp 1600w",
    alt: "The same vehicle crossing wet Pennine moorland under storm clouds",
    eyebrow: "Storm · Pennine crossing",
    titleLines: ["Online through", "the storm."],
    lede: "Heavy rain costs a satellite link a little speed, never the connection. A properly sealed roof entry means no drilled leaks and nothing to dry out later.",
    place: "Pennines",
    fx: { density: 1, angle: .22, speed: 1500, length: 28, size: 1.1, sway: 0, swayFreq: 0, alpha: .42, gust: .3, gustT: 9, r: 230, g: 236, b: 242 },
  },
  {
    src: "/hero/wind.webp",
    srcSet: "/hero/wind-960.webp 960w, /hero/wind-1280.webp 1280w, /hero/wind.webp 1600w",
    alt: "The same vehicle on a single-track coastal road on the North Coast 500",
    eyebrow: "Crosswind · North Coast 500",
    titleLines: ["Online in", "the crosswind."],
    lede: "Low profile mounts that stay put at motorway speed, with cable routing that never rattles or slaps the roof. Fitted once, forgotten after.",
    place: "North Coast 500",
    fx: { density: .55, angle: 1.32, speed: 1850, length: 110, size: .9, sway: 12, swayFreq: 1.5, alpha: .3, gust: .8, gustT: 5.5, r: 240, g: 236, b: 228 },
  },
];

type CheckStatus = "idle" | "checking" | "available" | "invalid" | "error";

const cleanPostcode = (v: string) => v.toUpperCase().replace(/[^A-Z0-9 ]/g, "").slice(0, 8);

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function WeatherHero({
  scenes = VEHICLE_SCENES,
  stats = { download: "184 Mbps", latency: "31 ms", mount: "Roof rack, low profile" },
  quoteHref = "#quote",
  bar,
}: {
  scenes?: Scene[];
  stats?: HeroStats;
  /** Where "Get a quote" goes once the postcode has checked out. */
  quoteHref?: string;
  /** Rendered at the foot of the hero, inside the 100svh, the way HeroSection
   *  pins HeroTrustBar. Pass `<HeroTrustBar />` for the site's badges. */
  bar?: React.ReactNode;
} = {}) {
  // No ReactDOM.preload here, unlike HeroSection. There the photo is a CSS
  // background the preload scanner cannot see, so the link buys a round trip.
  // This plate is an <img> in the HTML with fetchPriority="high", which the
  // scanner already finds, and a preload keyed on the 1600px src alone would
  // land on top of the 960px candidate srcset picks: two hero images on a
  // phone. See the FCP note in hero-section.tsx for what a competing
  // high-priority preload costs on a slow connection.

  const [index, setIndex] = useState(0);   // active scene (plate, tabs, fx)
  const [shown, setShown] = useState(0);   // scene whose copy is on screen
  const [out, setOut] = useState(false);   // text swap state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const targetRef = useRef<SceneFx>(scenes[0].fx);

  targetRef.current = scenes[index].fx;

  /* scenes 2 and 3 out of the critical path: no src until load + idle */
  const [rest, setRest] = useState(false);
  useEffect(() => {
    const idle = (cb: () => void) =>
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(cb)          // Safari only got this in 17
        : window.setTimeout(cb, 200);
    const arm = () => idle(() => setRest(true));
    if (document.readyState === "complete") { arm(); return; }
    window.addEventListener("load", arm, { once: true });
    return () => window.removeEventListener("load", arm);
  }, []);

  /* copy swap: 420ms out, then in */
  useEffect(() => {
    if (index === shown) return;
    if (reduced()) { setShown(index); return; }
    setOut(true);
    const t = setTimeout(() => { setShown(index); setOut(false); }, SWAP_MS);
    return () => clearTimeout(t);
  }, [index, shown]);

  /* autoplay; re-arms on every change, so a tab click resets the clock */
  useEffect(() => {
    if (reduced() || scenes.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % scenes.length), DWELL);
    return () => window.clearInterval(id);
  }, [index, scenes.length]);

  const go = useCallback((i: number) => setIndex(i), []);

  /* weather engine: identical to the kit's vanilla build */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced()) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const BANDS = 3, MAX_DPR = 1.5;
    const coarse = matchMedia("(pointer: coarse)").matches;
    let w = 0, h = 0, pool: { x: number; y: number; z: number; phase: number }[] = [];
    let maxCount = 0, raf = 0, last = 0;
    const cur: SceneFx = { ...targetRef.current };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      const dpr = Math.min(devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      maxCount = Math.round(Math.min(340, (w * h) / 5200) * (coarse ? .55 : 1));
      pool = Array.from({ length: maxCount }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        z: Math.random(), phase: Math.random() * 6.283,
      }));
    };
    resize();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, .05); last = now;

      const tgt = targetRef.current;
      const k = 1 - Math.exp(-1.5 * dt);
      (Object.keys(cur) as (keyof SceneFx)[]).forEach((key) => {
        cur[key] += (tgt[key] - cur[key]) * k;
      });

      ctx.clearRect(0, 0, w, h);
      if (cur.alpha < .004) return;

      const t = now / 1000;
      /* gusts: weather arrives in windows, not as a constant stream */
      const pulse = Math.pow(.5 + .5 * Math.sin(t * 6.283 / Math.max(cur.gustT, .5)), 3);
      const gust = (1 - cur.gust) + cur.gust * pulse;
      const surge = 1 + cur.gust * .55 * pulse;
      const vx = Math.sin(cur.angle) * cur.speed * surge;
      const vy = Math.cos(cur.angle) * cur.speed * surge;
      const visible = Math.round(maxCount * cur.density);

      ctx.lineCap = "round";
      ctx.strokeStyle = `rgb(${cur.r | 0},${cur.g | 0},${cur.b | 0})`;

      for (let b = 0; b < BANDS; b++) {
        const depth = (b + 1) / BANDS;
        ctx.globalAlpha = cur.alpha * gust * (.3 + .7 * depth);
        ctx.lineWidth = Math.max(.5, cur.size * (.55 + .45 * depth));
        ctx.beginPath();
        for (let i = b; i < visible; i += BANDS) {
          const p = pool[i], f = .35 + .65 * p.z;
          p.x += vx * f * dt;
          p.y += vy * f * dt;
          if (p.y > h + cur.length) { p.y = -cur.length; p.x = Math.random() * w; }
          if (p.x > w + cur.length) p.x = -cur.length;
          else if (p.x < -cur.length) p.x = w + cur.length;
          const sx = cur.sway > .1 ? Math.sin(t * cur.swayFreq * 6.283 + p.phase) * cur.sway : 0;
          const len = Math.max(.4, cur.length * f);
          ctx.moveTo(p.x + sx, p.y);
          ctx.lineTo(p.x + sx - Math.sin(cur.angle) * len, p.y - Math.cos(cur.angle) * len);
        }
        ctx.stroke();
      }
    };

    const start = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; ctx.clearRect(0, 0, w, h); } };

    const ro = new ResizeObserver(resize); ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: .01 });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    return () => { stop(); ro.disconnect(); io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  /* postcode check, on the funnel's own endpoint */
  const [postcode, setPostcode] = useState("");
  const [status, setStatus] = useState<CheckStatus>("idle");
  const [region, setRegion] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "checking") return;
    if (!isValidUkPostcode(postcode)) { setStatus("invalid"); return; }
    const pc = normalisePostcode(postcode);
    setStatus("checking");
    const res = await checkUkPostcode(pc);
    if (res.status === "available") {
      setRegion(res.region);
      setStatus("available");
      track(EVENTS.COVERAGE_CHECKED, { postcode: pc, coverage_result: "available", location_name: res.region, form_name: "starlink_vehicle_weather" });
    } else if (res.status === "invalid") {
      setStatus("invalid");
      track(EVENTS.COVERAGE_CHECKED, { postcode: pc, coverage_result: "invalid", form_name: "starlink_vehicle_weather" });
    } else {
      setStatus("error");
    }
  }

  const s = scenes[shown];
  const swapCls = styles.swap + (out ? " " + styles.isOut : "");
  const readout = `${stats.download} · ${stats.latency} · ${s.place}`;

  return (
    <section className={styles.hero} style={{ "--dwell": `${DWELL}ms` } as React.CSSProperties}>
      {scenes.map((sc, i) => {
        // The first plate is the LCP candidate and ships with the page. The
        // other two sit in the viewport at opacity 0, where loading="lazy"
        // postpones nothing, so they carry no src at all until load + idle —
        // or until a tab click asks for one before that.
        const load = i === 0 || rest || i === index;
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={sc.src}
            className={styles.plate + (i === index ? " " + styles.isOn : "")}
            src={load ? sc.src : undefined}
            srcSet={load ? sc.srcSet : undefined}
            sizes={load ? "100vw" : undefined}
            alt={i === index ? sc.alt : ""}
            aria-hidden={i === index ? undefined : true}
            loading={i === 0 ? "eager" : undefined}
            decoding={i === 0 ? "sync" : "async"}
            fetchPriority={i === 0 ? "high" : undefined}
          />
        );
      })}
      <canvas ref={canvasRef} className={styles.weather} aria-hidden="true" />
      <div className={styles.scrim} />

      <div className={styles.inner}>
        <div className={styles.middle}>
          <div className={styles.card}>
            <div className={`${styles.cardHead} ${styles.label}`}><span>Connection</span><b>{s.place}</b></div>
            <div className={styles.cardRow}><span className={styles.cardK}>Download</span><span className={`${styles.cardV} ${styles.num}`}>{stats.download}</span></div>
            <div className={styles.cardRow}><span className={styles.cardK}>Latency</span><span className={`${styles.cardV} ${styles.num}`}>{stats.latency}</span></div>
            <div className={styles.cardRow}><span className={styles.cardK}>Mount</span><span className={styles.cardV}>{stats.mount}</span></div>
          </div>
        </div>

        <div className={styles.stack}>
          <p className={`${styles.eyebrow} ${styles.label} ${swapCls}`}><i /><span>{s.eyebrow}</span></p>
          <h1 className={`${styles.title} ${swapCls}`}>{s.titleLines[0]}<br />{s.titleLines[1]}</h1>
          <p className={`${styles.lede} ${swapCls}`}>{s.lede}</p>
          <p className={`${styles.cardInline} ${swapCls}`}>{readout}</p>

          <form className={styles.check} onSubmit={onSubmit} noValidate>
            <label className={styles.checkLabel} htmlFor="wh-postcode">Check if we cover your postcode</label>
            <div className={styles.checkRow}>
              <input
                id="wh-postcode"
                name="postcode"
                value={postcode}
                onChange={(e) => { setPostcode(cleanPostcode(e.target.value)); if (status !== "idle") setStatus("idle"); }}
                inputMode="text"
                autoComplete="postal-code"
                maxLength={8}
                placeholder="e.g. LA22 9JY"
                aria-invalid={status === "invalid" ? true : undefined}
                aria-describedby="wh-postcode-msg"
              />
              {status === "available" ? (
                <a className={styles.btnRed} href={quoteHref}>Get a quote</a>
              ) : (
                <button className={styles.btnRed} type="submit" disabled={status === "checking"}>
                  {status === "checking" ? "Checking…" : "Check availability"}
                </button>
              )}
            </div>
            <p id="wh-postcode-msg" className={styles.checkMicro} role={status === "invalid" || status === "error" ? "alert" : undefined}>
              {status === "invalid" && <span className={styles.checkError}>That doesn&apos;t look like a valid UK postcode. Please check and try again.</span>}
              {status === "error" && <span className={styles.checkError}>We couldn&apos;t check your postcode just now. Please try again.</span>}
              {status === "available" && <span className={styles.checkOk}><i /><span><b>We cover {region}.</b> Fixed quote from two photos.</span></span>}
              {(status === "idle" || status === "checking") && "No obligation. Takes 10 seconds."}
            </p>
          </form>

          <div className={styles.switch} role="tablist" aria-label="Conditions">
            {scenes.map((sc, i) => (
              <button key={sc.place} className={styles.tab} role="tab" type="button"
                aria-selected={i === index} onClick={() => go(i)}>
                {/* keyed on index so the bar remounts and its CSS animation restarts */}
                <span className={styles.tabBar}><span key={`${i}-${index}`} /></span>
                <span className={styles.label}>{sc.eyebrow.split(" ·")[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {bar && <div className={styles.bar}>{bar}</div>}
    </section>
  );
}
