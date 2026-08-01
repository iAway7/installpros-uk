"use client";

import { useEffect, useRef, useState } from "react";
import { LANDING_FAQS_ALT } from "./landing-data";
import { UkCoverageMap } from "@/components/funnel/uk-coverage-map";
import "./landing.css";

/**
 * InstallPros — Starlink Installations landing page.
 * Faithful React port of the design handoff (dark, aerospace-inspired) with a
 * `variant` prop that flips a light-theme token set. All colours are driven by
 * CSS variables in landing.css; the canvas animations adapt to the variant.
 *
 * A/B alternative to /starlink-installation (note the plural route). The 2-step
 * quote modal submit is stubbed — wire it to the leads endpoint where marked.
 */

const WA_TEXT =
  "https://wa.me/442033977003?text=Hi%20InstallPros%20%E2%80%94%20I%27d%20like%20a%20quote%20for%20a%20Starlink%20installation.";
const WA_PLAIN = "https://wa.me/442033977003";
const PHONE = "020 3397 7003";

function WaIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.03a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.12.82.83-3.04-.2-.31a8.13 8.13 0 1 1 6.92 3.84zm4.44-6.07c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.53.06-.24-.12-1.02-.38-1.95-1.2-.72-.64-1.2-1.44-1.35-1.68-.14-.24-.01-.37.11-.5.11-.11.24-.28.37-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.65.3-.22.24-.85.83-.85 2.03s.87 2.36 1 2.52c.12.16 1.72 2.62 4.16 3.68.58.25 1.04.4 1.39.51.58.19 1.12.16 1.54.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.46-.28z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

function GoogleG({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

/** Review card matching the /starlink-installation design, themed with .ipx
 *  tokens (works in light + dark), with "Read more" truncation. */
function StoryCard({ r }: { r: { q: string; name: string; initial: string; rating: number; photo?: string } }) {
  const [open, setOpen] = useState(false);
  const clean = r.q.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*/g, "").trim();
  const long = clean.length > 165;
  const text = open || !long ? clean : clean.slice(0, 165).trimEnd() + "…";
  return (
    <div style={{ display: "flex", flexDirection: "column", background: "var(--surface)", border: "1px solid var(--hair)", borderRadius: 24, padding: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {r.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={r.photo} alt={r.name} referrerPolicy="no-referrer" style={{ width: 44, height: 44, borderRadius: 999, objectFit: "cover" }} />
        ) : (
          <div style={{ width: 44, height: 44, borderRadius: 999, background: "var(--avatar-grad)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 500, color: "var(--primary)" }}>{r.initial}</div>
        )}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
          <div style={{ fontSize: 12.5, color: "var(--secondary)" }}>Google review</div>
        </div>
        <GoogleG size={22} />
      </div>
      <div style={{ marginTop: 16, fontSize: 15, letterSpacing: "3px", color: "var(--gold)" }}>{"★".repeat(Math.min(5, Math.max(4, r.rating)))}</div>
      <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.6, color: "var(--primary)", textWrap: "pretty" }}>&ldquo;{text}&rdquo;</p>
      {long && (
        <button type="button" onClick={() => setOpen((v) => !v)} style={{ marginTop: 8, alignSelf: "flex-start", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, color: "var(--secondary)" }}>
          {open ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

/** Horizontal review slider matching /starlink-installation: 3 cards on desktop
 *  (2 tablet, 1 mobile), arrows advance one card. Themed with .ipx tokens. */
function StoryCarousel({ reviews }: { reviews: { q: string; name: string; initial: string; rating: number; photo?: string }[] }) {
  const track = useRef<HTMLDivElement>(null);
  const scrollByCard = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 14 : el.clientWidth / 3;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };
  const scrollable = reviews.length > 1;
  const arrowStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: 44,
    height: 44,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    background: "var(--surface)",
    border: "1px solid var(--hair)",
    color: "var(--primary)",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(0,0,0,.12)",
    zIndex: 2,
  };
  return (
    <div style={{ position: "relative", marginTop: 64 }}>
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-3.5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((r, i) => (
          <div
            key={r.name + i}
            data-card
            className="shrink-0 basis-full snap-start sm:basis-[calc(50%-7px)] lg:basis-[calc(33.333%-10px)]"
          >
            <StoryCard r={r} />
          </div>
        ))}
      </div>
      {scrollable && (
        <>
          <button type="button" aria-label="Previous reviews" onClick={() => scrollByCard(-1)} style={{ ...arrowStyle, left: -18 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button type="button" aria-label="Next reviews" onClick={() => scrollByCard(1)} style={{ ...arrowStyle, right: -18 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </>
      )}
    </div>
  );
}

const FEATURES = [
  { t: "Professional Installation", d: "Certified, insured engineers on every single job.", i: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
  ) },
  { t: "Optimal Signal Placement", d: "Obstruction scanning finds the perfect line of sight before we drill.", i: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="8" /><path d="M12 2v3" /><path d="M12 19v3" /><path d="M2 12h3" /><path d="M19 12h3" /><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" /></svg>
  ) },
  { t: "Cable Management", d: "Discreet, weatherproofed routing that respects your home.", i: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 15.5c2.5 0 2.5-6 5-6s2.5 6 5 6 2.5-6 5-6 2.5 6 5 6" /><path d="M2 8.5h4" /><path d="M18 8.5h4" /></svg>
  ) },
  { t: "Roof Mounting", d: "All-metal mounts, fitted to any roof — metal, slate, tile or flat.", i: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v10h13V10" /><circle cx="12" cy="14.5" r="2.2" /><path d="M12 16.7V20" /></svg>
  ) },
  { t: "Mesh WiFi Setup", d: "Strong signal in every room, barn and outbuilding.", i: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><circle cx="12" cy="19.5" r="1" fill="currentColor" /></svg>
  ) },
  { t: "Business Installations", d: "Offices, farms, marinas and sites — connectivity that scales.", i: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" /><path d="M16 9h3a1 1 0 0 1 1 1v11" /><path d="M2 21h20" /><path d="M8 7h2" /><path d="M8 11h2" /><path d="M8 15h2" /></svg>
  ) },
  { t: "Post-install Support", d: "Real engineers on the phone, long after we've packed up.", i: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 14a8 8 0 0 1 16 0" /><rect x="3" y="14" width="4.5" height="6.5" rx="1.8" /><rect x="16.5" y="14" width="4.5" height="6.5" rx="1.8" /></svg>
  ) },
  { t: "Warranty", d: "Workmanship guaranteed in writing, for total peace of mind.", i: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /><path d="M9 12l2 2 4-4" /></svg>
  ) },
];

const JOURNEY = [
  { h: "Request your quote", p: "Tell us about your property. You'll get a fixed price — no site visit, no obligation." },
  { h: "Choose your date", p: "Same-week slots in most areas. We arrive when we say we will." },
  { h: "Professional installation", p: "1–3 hours on site. Clean cable runs, all-metal mounts, zero mess." },
  { h: "Signal testing", p: "We verify speeds and an obstruction-free view of the sky before we leave." },
];

const EQUIPMENT = [
  { t: "Starlink Standard", badge: "SUPPLY & FIT", d: "The dish — supplied, mounted and aligned for a clear view of the sky.", img: "/funnel/starlink-standard.png" },
  { t: "Gen 3 Router", badge: "SETUP INCLUDED", d: "Wi-Fi 6, configured and positioned for whole-home coverage.", img: "/funnel/gen-3-router.webp" },
  { t: "Mounts & Masts", badge: "ALL-METAL", d: "Durable roof, wall and pole mounts for any property type.", img: "/funnel/mounts-masts.webp" },
  { t: "Mesh Nodes", badge: "ADD-ON", d: "Seamless coverage across every floor and outbuilding.", img: "/funnel/mesh-nodes.webp" },
];

const REVIEWS = [
  { q: "I was so impressed with the service, knowledge and competence of Summer. She was like a complete breath of fresh air.", n: "Mike H N Fisher", a: "M", red: false },
  { q: "Great service. Super fast and incredibly helpful — very good prices too.", n: "Andreas Kolezi", a: "A", red: true },
  { q: "I'd like to highly commend Ben at InstallPros. My broadband speed was very low — he was able to identify and fix it quickly.", n: "Mohsin Zahid", a: "M", red: false },
];

const DIY = [
  "Placement by trial and error — obstructions found after mounting",
  "Working at height, without training or insurance",
  "Exposed cable runs and rushed weatherproofing",
  "No speed verification — you find out later",
  "Mistakes cost more to put right afterwards",
];
const PRO = [
  "Obstruction scan before a single hole is drilled",
  "Insured engineers, trained and equipped for roof work",
  "Hidden, weatherproofed cable routing",
  "Speed-tested and verified before we leave",
  "Workmanship warranty, in writing",
];

const NUMBERS = [
  { c: "9163", suffix: "+", label: "Installations completed across the UK" },
  { c: "5", decimals: 1, star: true, label: "Google rating — every review counted" },
  { c: "175", suffix: "+", label: "Towns and cities served, and counting" },
  { hrs: true, label: "Average time on site, start to speed test" },
];

const FAQS = LANDING_FAQS_ALT;

export function StarlinkInstallationsLanding({
  variant = "dark",
  reviews,
}: {
  variant?: "dark" | "light";
  /** Live Google reviews (from the server). Falls back to the built-in list. */
  reviews?: { q: string; name: string; initial: string; rating: number; photo?: string }[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const logo = variant === "light" ? "/funnel/installpros-logo-colored-new.svg" : "/funnel/installpros-logo-white.svg";

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const light = variant === "light";
    const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = matchMedia("(hover:hover)").matches;
    const cleanups: Array<() => void> = [];
    const $ = <T extends Element = HTMLElement>(sel: string) => root.querySelector(sel) as T | null;
    const $$ = (sel: string) => Array.from(root.querySelectorAll(sel));
    const on = (el: EventTarget, ev: string, fn: EventListenerOrEventListenerObject, opts?: AddEventListenerOptions) => {
      el.addEventListener(ev, fn, opts);
      cleanups.push(() => el.removeEventListener(ev, fn, opts));
    };

    /* visibility-gated rAF loop */
    function startLoop(el: Element, fn: (t: number, dt: number) => void) {
      if (rm) { try { fn(0, 16); } catch { /* noop */ } return; }
      let running = false, raf = 0, last = performance.now();
      const tick = () => {
        if (!running || document.hidden) return;
        const now = performance.now(), dt = Math.min(60, now - last); last = now;
        fn(now, dt); raf = requestAnimationFrame(tick);
      };
      const io = new IntersectionObserver((es) => {
        const v = es.some((e) => e.isIntersecting);
        if (v && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(tick); }
        else if (!v && running) { running = false; cancelAnimationFrame(raf); }
      }, { threshold: 0.02 });
      io.observe(el);
      const onVis = () => { if (!document.hidden && running) { last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); } };
      document.addEventListener("visibilitychange", onVis);
      cleanups.push(() => { running = false; cancelAnimationFrame(raf); io.disconnect(); document.removeEventListener("visibilitychange", onVis); });
    }

    /* scroll reveals */
    {
      const els = $$("[data-reveal]");
      if (rm) { els.forEach((el) => el.classList.add("in")); }
      else {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            const el = en.target as HTMLElement;
            const d = parseInt(el.getAttribute("data-reveal-delay") || "0", 10);
            el.style.transitionDelay = d + "ms";
            el.classList.add("in");
            io.unobserve(el);
          });
        }, { threshold: 0.16, rootMargin: "0px 0px -6% 0px" });
        els.forEach((el) => io.observe(el));
        cleanups.push(() => io.disconnect());
      }
    }

    /* hero intro stagger */
    if (!rm) {
      const els = $$("[data-hero]") as HTMLElement[];
      els.forEach((el) => { el.style.opacity = "0"; el.style.transform = "translateY(26px)"; el.style.filter = "blur(6px)"; });
      const to = setTimeout(() => {
        els.forEach((el, i) => {
          el.style.transition = `opacity 1.1s cubic-bezier(.16,1,.3,1) ${i * 120}ms, transform 1.1s cubic-bezier(.16,1,.3,1) ${i * 120}ms, filter 1s ease ${i * 120}ms`;
          el.style.opacity = "1"; el.style.transform = "none"; el.style.filter = "none";
        });
      }, 80);
      cleanups.push(() => clearTimeout(to));
    }

    /* counters */
    if (!rm) {
      const fmt = (v: number, dec: number) => (dec > 0 ? v.toFixed(dec) : Math.round(v).toLocaleString("en-GB"));
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target as HTMLElement; io.unobserve(el);
          const target = parseFloat(el.getAttribute("data-counter") || "0");
          const dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
          const suffix = el.getAttribute("data-suffix") || "";
          const t0 = performance.now(), dur = 1900;
          const step = (now: number) => {
            const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(2, -10 * p);
            el.textContent = fmt(target * (p >= 1 ? 1 : e), dec) + suffix;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      }, { threshold: 0.5 });
      $$("[data-counter]").forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    }

    /* magnetic buttons */
    if (canHover && !rm) {
      $$("[data-magnetic]").forEach((el0) => {
        const el = el0 as HTMLElement;
        on(el, "mousemove", (e) => {
          const me = e as MouseEvent; const r = el.getBoundingClientRect();
          const dx = (me.clientX - (r.left + r.width / 2)) / r.width, dy = (me.clientY - (r.top + r.height / 2)) / r.height;
          el.style.transition = "transform .15s ease-out";
          el.style.transform = `translate(${dx * 12}px,${dy * 10}px)`;
        });
        on(el, "mouseleave", () => { el.style.transition = "transform .55s cubic-bezier(.16,1,.3,1)"; el.style.transform = "translate(0,0)"; });
      });
    }

    /* tilt cards */
    if (canHover && !rm) {
      $$("[data-tilt]").forEach((el0) => {
        const el = el0 as HTMLElement;
        on(el, "mousemove", (e) => {
          const me = e as MouseEvent; const r = el.getBoundingClientRect();
          const dx = (me.clientX - (r.left + r.width / 2)) / r.width, dy = (me.clientY - (r.top + r.height / 2)) / r.height;
          el.style.transition = "transform .18s ease-out";
          el.style.transform = `perspective(900px) rotateX(${-dy * 5}deg) rotateY(${dx * 6}deg) translateY(-4px)`;
        });
        on(el, "mouseleave", () => { el.style.transition = "transform .7s cubic-bezier(.16,1,.3,1)"; el.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateY(0)"; });
      });
    }

    /* hero canvas */
    {
      const wrap = $("#ipx-hero-cvwrap"); const c = $<HTMLCanvasElement>("#ipx-hero-cv");
      if (wrap && c) {
        const ctx = c.getContext("2d")!;
        let W = 0, H = 0, R = 0, cx = 0, cy = 0, crest = 0, aMax = 0.9;
        const stars = Array.from({ length: 210 }, () => ({ x: Math.random(), y: Math.random(), r: 0.4 + Math.random() * 1.1, p: Math.random() * 6.283, s: 0.5 + Math.random() * 1.5 }));
        const sats = Array.from({ length: 5 }, (_, i) => ({ alt: 58 + (i % 4) * 46, sp: (0.000052 + (i % 3) * 0.000017) * (i % 2 === 0 ? 1 : -1), ph: i * 1.37 }));
        const starRGB = light ? "40,44,54" : "255,255,255";
        const starAlphaK = light ? 0.5 : 1;
        const satRGB = light ? "70,74,86" : "255,255,255";
        const fit = () => {
          const dpr = Math.min(devicePixelRatio || 1, 1.5), r = wrap.getBoundingClientRect();
          W = r.width; H = r.height;
          c.width = Math.max(1, W * dpr); c.height = Math.max(1, H * dpr);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          R = Math.max(W * 0.85, 640); crest = H * 0.74; cx = W / 2; cy = crest + R;
          aMax = Math.min(1.1, Math.asin(Math.min(1, (W / 2 + 80) / R)));
        };
        fit(); on(window, "resize", fit);
        startLoop(c, (t) => {
          ctx.clearRect(0, 0, W, H);
          for (const s of stars) {
            ctx.globalAlpha = (0.16 + 0.5 * (0.5 + 0.5 * Math.sin(t * 0.0007 * s.s + s.p))) * starAlphaK;
            ctx.fillStyle = `rgb(${starRGB})`; ctx.fillRect(s.x * W, s.y * crest * 0.97, s.r, s.r);
          }
          ctx.globalAlpha = 1;
          let g = ctx.createRadialGradient(cx, crest + 40, 20, cx, crest + 40, Math.max(W * 0.62, 480));
          g.addColorStop(0, "rgba(255,58,58,.17)"); g.addColorStop(0.45, "rgba(199,5,5,.06)"); g.addColorStop(1, "rgba(199,5,5,0)");
          ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
          g = ctx.createRadialGradient(cx, crest + 12, 4, cx, crest + 12, 260);
          g.addColorStop(0, light ? "rgba(199,5,5,.05)" : "rgba(255,235,235,.10)"); g.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
          for (let k = 0; k < 10; k++) {
            const rr = R + 14 + k * 25, base = 0.3 - k * 0.028;
            if (base <= 0.01) break;
            const stepA = 23 / rr;
            for (let a = -aMax; a <= aMax; a += stepA) {
              const edge = 1 - Math.pow(Math.abs(a) / aMax, 2), al = base * edge;
              if (al < 0.015) continue;
              const x = cx + rr * Math.sin(a), y = cy - rr * Math.cos(a);
              if (y > H + 10 || y < 0) continue;
              const tint = 150 + k * 9;
              ctx.fillStyle = light ? `rgba(${120 - k * 5},20,20,${al * 1.5})` : `rgba(255,${tint},${tint},${al})`;
              ctx.fillRect(x, y, 1.7, 1.7);
            }
          }
          ctx.save(); ctx.strokeStyle = "rgba(255,84,84,.55)"; ctx.lineWidth = 1.2;
          ctx.shadowColor = "rgba(255,40,40,.9)"; ctx.shadowBlur = 16;
          ctx.beginPath(); ctx.arc(cx, cy, R, -Math.PI / 2 - aMax, -Math.PI / 2 + aMax); ctx.stroke(); ctx.restore();
          const gx = cx + Math.min(W * 0.1, 130), ga = Math.asin((gx - cx) / R), gy = cy - R * Math.cos(ga);
          const pp = (t * 0.00045) % 1;
          ctx.strokeStyle = `rgba(255,70,70,${(1 - pp) * 0.5})`; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(gx, gy, 3 + pp * 22, 0, 6.283); ctx.stroke();
          ctx.save(); ctx.shadowColor = "rgba(255,60,60,1)"; ctx.shadowBlur = 10;
          ctx.fillStyle = "#FF5A5A"; ctx.beginPath(); ctx.arc(gx, gy, 2.6, 0, 6.283); ctx.fill(); ctx.restore();
          let best: { x: number; y: number; a: number } | null = null;
          for (const s of sats) {
            const rr2 = R + s.alt, span = aMax * 1.22;
            let a2 = -span + ((t * Math.abs(s.sp) + s.ph) % (2 * span));
            if (s.sp < 0) a2 = -a2;
            const x2 = cx + rr2 * Math.sin(a2), y2 = cy - rr2 * Math.cos(a2);
            if (y2 < -20) continue;
            const ca = a2 - Math.PI / 2, dir = s.sp >= 0 ? 1 : -1;
            ctx.strokeStyle = light ? "rgba(70,74,86,.2)" : "rgba(255,255,255,.13)"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(cx, cy, rr2, dir > 0 ? ca - 0.07 : ca, dir > 0 ? ca : ca + 0.07); ctx.stroke();
            ctx.save(); ctx.shadowColor = light ? "rgba(70,74,86,.7)" : "rgba(255,255,255,.9)"; ctx.shadowBlur = 8;
            ctx.fillStyle = `rgb(${satRGB})`; ctx.beginPath(); ctx.arc(x2, y2, 2, 0, 6.283); ctx.fill(); ctx.restore();
            if (!best || Math.abs(a2 - ga) < Math.abs(best.a - ga)) best = { x: x2, y: y2, a: a2 };
          }
          if (best && Math.abs(best.a - ga) < 0.42) {
            const al2 = (1 - Math.abs(best.a - ga) / 0.42) * 0.4;
            const lg = ctx.createLinearGradient(best.x, best.y, gx, gy);
            lg.addColorStop(0, `rgba(255,255,255,${al2 * 0.8})`); lg.addColorStop(1, `rgba(255,60,60,${al2})`);
            ctx.strokeStyle = lg; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(best.x, best.y); ctx.lineTo(gx, gy); ctx.stroke();
          }
        });
      }
    }

    /* before/after slider + meters */
    {
      const box = $("#ipx-cmp"); const after = $("#ipx-cmp-after"); const handle = $("#ipx-cmp-handle");
      if (box && after && handle) {
        const set = (pct: number) => {
          pct = Math.max(8, Math.min(92, pct));
          (after as HTMLElement).style.clipPath = `inset(0 0 0 ${pct}%)`;
          (handle as HTMLElement).style.left = pct + "%";
        };
        let dragging = false;
        const fromEvent = (e: PointerEvent) => { const r = box.getBoundingClientRect(); set(((e.clientX - r.left) / r.width) * 100); };
        on(box, "pointerdown", (e) => { dragging = true; (box as HTMLElement).setPointerCapture((e as PointerEvent).pointerId); fromEvent(e as PointerEvent); });
        on(box, "pointermove", (e) => { if (dragging) fromEvent(e as PointerEvent); });
        on(box, "pointerup", () => { dragging = false; });
        on(box, "pointercancel", () => { dragging = false; });
        const bBar = $("#ipx-b-bar"), bVal = $("#ipx-b-val"), bBuf = $("#ipx-b-buf"), bSt = $("#ipx-b-status"), aBar = $("#ipx-a-bar"), aVal = $("#ipx-a-val");
        const m = { p1: 12, p2: 70, mode: "load" as "load" | "stall", until: 900, tv: 0, tv2: 0 };
        startLoop(box, (t, dt) => {
          if (t > m.until) {
            m.mode = m.mode === "load" ? "stall" : "load";
            m.until = t + (m.mode === "load" ? 700 + Math.random() * 900 : 500 + Math.random() * 1100);
            if (bSt) bSt.textContent = m.mode === "stall" ? "Buffering…" : "Loading…";
          }
          if (m.mode === "load") m.p1 += dt * 0.004;
          if (m.p1 >= 100) m.p1 = 0;
          if (bBar) (bBar as HTMLElement).style.width = m.p1 + "%";
          if (bBuf) (bBuf as HTMLElement).style.opacity = m.mode === "stall" ? String(0.4 + 0.6 * Math.abs(Math.sin(t * 0.008))) : "0.35";
          if (t > m.tv && bVal) { m.tv = t + 800; bVal.textContent = (2.6 + Math.random() * 2.4).toFixed(1); }
          m.p2 = (m.p2 + dt * 0.028) % 100;
          if (aBar) (aBar as HTMLElement).style.width = m.p2 + "%";
          if (t > m.tv2 && aVal) { m.tv2 = t + 640; aVal.textContent = String(238 + Math.round(Math.random() * 14)); }
        });
      }
    }

    /* nav / parallax / journey line / sticky */
    {
      const nav = $("#ipx-nav"), cvWrap = $("#ipx-hero-cvwrap"), jSec = $("#ipx-journey"), jFill = $("#ipx-jline-fill"), sticky = $("#ipx-sticky"), ctaSec = $("#ipx-cta"), modal = $("#ipx-modal-ov");
      let ctaVis = false, ticking = false;
      const update = () => {
        const y = scrollY, vh = innerHeight;
        nav?.classList.toggle("solid", y > 30);
        if (!rm && cvWrap && y < vh * 1.3) (cvWrap as HTMLElement).style.transform = `translate3d(0,${y * 0.28}px,0)`;
        if (jSec && jFill) {
          const r = jSec.getBoundingClientRect();
          const prog = rm ? 1 : Math.max(0, Math.min(1, (vh * 0.78 - r.top) / Math.max(1, r.height * 0.9)));
          (jFill as HTMLElement).style.height = (prog * 100) + "%";
        }
        sticky?.classList.toggle("show", y > vh * 0.85 && !ctaVis && !(modal?.classList.contains("open")));
      };
      (root as HTMLElement & { _ipUpdate?: () => void })._ipUpdate = update;
      if (ctaSec) {
        const cio = new IntersectionObserver((es) => { ctaVis = es.some((e) => e.isIntersecting); update(); }, { threshold: 0.1 });
        cio.observe(ctaSec); cleanups.push(() => cio.disconnect());
      }
      on(window, "scroll", () => { if (ticking) return; ticking = true; requestAnimationFrame(() => { ticking = false; update(); }); }, { passive: true } as AddEventListenerOptions);
      update();
    }

    /* FAQ accordion */
    $$(".faq-item").forEach((item) => {
      const q = item.querySelector(".faq-q");
      if (!q) return;
      on(q, "click", () => {
        const was = item.classList.contains("open");
        $$(".faq-item.open").forEach((o) => o.classList.remove("open"));
        if (!was) item.classList.add("open");
      });
    });

    /* quote modal (2-step) */
    {
      const ov = $("#ipx-modal-ov");
      const steps = [0, 1, 2].map((i) => $("#ipx-mstep-" + i));
      const state = { step: 0 };
      const show = (i: number) => { state.step = i; steps.forEach((s, j) => { if (s) (s as HTMLElement).style.display = j === i ? "block" : "none"; }); };
      const runUpdate = () => (root as HTMLElement & { _ipUpdate?: () => void })._ipUpdate?.();
      const open = () => {
        if (state.step === 2) { show(0); ["#ipx-q-postcode", "#ipx-q-name", "#ipx-q-phone", "#ipx-q-email"].forEach((id) => { const el = $<HTMLInputElement>(id); if (el) el.value = ""; }); }
        ov?.classList.add("open"); runUpdate();
      };
      const close = () => { ov?.classList.remove("open"); runUpdate(); };
      $$(".js-quote").forEach((b) => on(b, "click", open));
      const closeBtn = ov?.querySelector(".close");
      if (closeBtn) on(closeBtn, "click", close);
      if (ov) on(ov, "click", (e) => { if (e.target === ov) close(); });
      on(document, "keydown", (e) => { if ((e as KeyboardEvent).key === "Escape") close(); });
      ["#ipx-q-property", "#ipx-q-timing"].forEach((id) => {
        const group = $(id); if (!group) return;
        group.querySelectorAll(".chip").forEach((ch) => on(ch, "click", () => {
          group.querySelectorAll(".chip").forEach((o) => o.classList.remove("sel"));
          ch.classList.add("sel");
        }));
      });
      const err = (i: number, msg?: string) => { const el = $("#ipx-err-" + i); if (!el) return; el.textContent = msg || ""; el.classList.toggle("show", !!msg); };
      const next0 = () => {
        const pc = ($<HTMLInputElement>("#ipx-q-postcode")?.value || "").trim();
        if (pc.length < 3) { err(0, "Please enter a valid UK postcode."); return; }
        err(0); show(1);
      };
      const submit = () => {
        const name = ($<HTMLInputElement>("#ipx-q-name")?.value || "").trim();
        const phone = ($<HTMLInputElement>("#ipx-q-phone")?.value || "").replace(/[^0-9]/g, "");
        const email = ($<HTMLInputElement>("#ipx-q-email")?.value || "").trim();
        if (name.length < 2) { err(1, "Please tell us your name."); return; }
        if (phone.length < 10) { err(1, "Please enter a valid mobile number."); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err(1, "Please enter a valid email address."); return; }
        err(1);
        const okName = $("#ipx-ok-name"); if (okName) okName.textContent = name ? ", " + name.split(" ")[0] : "";
        const okPc = $("#ipx-ok-pc"); if (okPc) okPc.textContent = (($<HTMLInputElement>("#ipx-q-postcode")?.value || "").trim().toUpperCase()) || "your address";
        // TODO: POST the lead {postcode, property, name, phone, email} to your leads endpoint / CRM here.
        show(2);
      };
      const n0 = $("#ipx-next-0"); if (n0) on(n0, "click", next0);
      const b1 = $("#ipx-back-1"); if (b1) on(b1, "click", () => show(0));
      const sq = $("#ipx-submit-q"); if (sq) on(sq, "click", submit);
      const pc = $("#ipx-q-postcode"); if (pc) on(pc, "keydown", (e) => { if ((e as KeyboardEvent).key === "Enter") next0(); });
      const ph = $("#ipx-q-phone"); if (ph) on(ph, "keydown", (e) => { if ((e as KeyboardEvent).key === "Enter") submit(); });
      const em = $("#ipx-q-email"); if (em) on(em, "keydown", (e) => { if ((e as KeyboardEvent).key === "Enter") submit(); });
    }

    return () => { cleanups.forEach((fn) => { try { fn(); } catch { /* noop */ } }); };
  }, [variant]);

  return (
    <div ref={rootRef} className={`ipx${variant === "light" ? " ipx-light" : ""}`}>
      {/* NAV */}
      <header id="ipx-nav" className="nav">
        <div className="wrap nav-inner">
          <a href="#ipx-top" className="logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt="InstallPros" style={{ height: 28, width: "auto", display: "block" }} />
          </a>
          <nav className="nav-links">
            <a href="#ipx-why">Why us</a>
            <a href="#ipx-coverage">Coverage</a>
            <a href="#ipx-equipment">Equipment</a>
            <a href="#ipx-faq">FAQ</a>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a className="wa-round" href={WA_TEXT} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
              <WaIcon size={18} />
            </a>
            <button className="btn-primary js-quote" style={{ padding: "11px 22px", fontSize: 14 }}>Get My Quote</button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="ipx-top">
        <div className="hero">
          <div id="ipx-hero-cvwrap" className="hero-cvwrap"><canvas id="ipx-hero-cv" className="hero-cv" /></div>
          <div className="hero-content">
            <div className="hero-badge" data-hero><span className="dot" />Certified Starlink installers · UK-wide</div>
            <h1 className="hero-h1" data-hero>Professional Starlink<br /><span className="grad-text">installation.</span></h1>
            <p className="hero-sub" data-hero>Certified engineers. Millimetre-perfect placement. Same-week installs — anywhere in the UK.</p>
            <div className="hero-cta-row" data-hero>
              <button className="btn-primary js-quote" data-magnetic style={{ padding: "18px 36px", fontSize: 16 }}>Get My Quote <ArrowIcon /></button>
              <a className="btn-ghost" href={WA_TEXT} target="_blank" rel="noopener noreferrer" style={{ padding: "17px 32px", fontSize: 16 }}>
                <WaIcon size={18} /> Talk on WhatsApp
              </a>
            </div>
            <p className="hero-microproof" data-hero>Free fixed quotes&nbsp;&nbsp;·&nbsp;&nbsp;Same-week availability&nbsp;&nbsp;·&nbsp;&nbsp;All roof types</p>
          </div>
          <div className="trustbar" data-hero>
            <div className="wrap trustbar-inner">
              <div className="trust-cell">
                <GoogleG size={20} />
                <span style={{ fontSize: 14, fontWeight: 600 }}>5.0</span>
                <span style={{ fontSize: 13, color: "var(--gold)", letterSpacing: "2px" }}>★★★★★</span>
              </div>
              <a className="trust-cell" href="https://uk.trustpilot.com/review/installpros.co.uk" target="_blank" rel="noopener noreferrer" aria-label="Read our reviews on Trustpilot">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#00B67A" aria-hidden="true"><path d="M12 1.5l3.09 6.83 7.41.66-5.62 4.93 1.68 7.26L12 17.35l-6.56 3.83 1.68-7.26L1.5 8.99l7.41-.66L12 1.5z" /></svg>
                <span style={{ fontSize: 13, color: "var(--secondary)" }}><b style={{ color: "var(--primary)" }}>Excellent</b> on Trustpilot</span>
              </a>
              <div className="trust-cell"><span style={{ fontSize: 14, fontWeight: 600 }}>9,163+</span><span style={{ fontSize: 13, color: "var(--secondary)" }}>UK installations</span></div>
              <div className="trust-cell" style={{ flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
                <span style={{ fontSize: 8.5, letterSpacing: "0.24em", color: "var(--secondary)", fontWeight: 500 }}>AS FEATURED IN</span>
                <span style={{ fontFamily: "Georgia, serif", fontWeight: 600, letterSpacing: "0.03em", fontSize: 15, color: "var(--primary)" }}>THE TIMES</span>
              </div>
              <div className="trust-cell">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/funnel/Authorised-Starlink-Installer-Getmedigital.png" alt="Authorised Starlink Installer" style={{ height: 46, width: 46, borderRadius: 9, display: "block" }} />
                <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                  <span style={{ fontSize: 13, color: "var(--secondary)", fontWeight: 400 }}>Authorised</span>
                  <span style={{ fontSize: 14, color: "var(--primary)", fontWeight: 600 }}>Starlink Installer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section id="ipx-why" className="sec" style={{ padding: "160px 0 150px" }}>
        <div className="wrap">
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 28 }}>
            <div>
              <p className="eyebrow" data-reveal>Why InstallPros</p>
              <h2 className="h2" data-reveal="blur" data-reveal-delay="80" style={{ maxWidth: 640 }}>Engineered installs,<br />not odd jobs.</h2>
            </div>
            <p className="lead" data-reveal data-reveal-delay="160" style={{ maxWidth: 420 }}>One certified team handles everything — from the first signal scan to the final speed test.</p>
          </div>
          <div style={{ marginTop: 70, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(258px,1fr))", gap: 14 }}>
            {FEATURES.map((f, idx) => (
              <div className="card" data-reveal data-reveal-delay={String((idx % 4) * 60)} key={f.t}>
                <div className="card-icon">{f.i}</div>
                <h3>{f.t}</h3>
                <p>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section id="ipx-journey" className="sec" style={{ padding: "0 0 150px" }}>
        <div className="wrap">
          <div className="journey-panel">
            <div className="journey-glow" />
            <div style={{ position: "relative" }}>
              <p className="eyebrow" data-reveal>The Journey</p>
              <h2 className="h2" data-reveal="blur" data-reveal-delay="80" style={{ fontSize: "clamp(36px,4.4vw,58px)", maxWidth: 620 }}>From quote to connected,<br />in five steps.</h2>
              <div style={{ marginTop: 70, position: "relative", maxWidth: 760 }}>
                <div className="jline" />
                <div className="jline-track"><div id="ipx-jline-fill" className="jline-fill" /></div>
                {JOURNEY.map((s, i) => (
                  <div className="jstep" data-reveal data-reveal-delay={String(i * 60)} key={s.h}>
                    <div className="jnum" style={i === 0 ? { borderColor: "rgba(255,90,90,.35)", color: "#FF8585" } : undefined}>{i + 1}</div>
                    <div style={{ paddingTop: 8 }}><h3>{s.h}</h3><p>{s.p}</p></div>
                  </div>
                ))}
                <div className="jstep" data-reveal data-reveal-delay="240">
                  <div className="jnum" style={{ background: "var(--red)", borderColor: "rgba(255,120,120,.5)", boxShadow: "0 8px 30px rgba(199,5,5,.4)" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div style={{ paddingTop: 8 }}><h3>You&apos;re connected</h3><p>Full support and a written warranty, from day one.</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COVERAGE */}
      <section id="ipx-coverage" className="sec" style={{ padding: "0 0 160px" }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 70, alignItems: "center" }}>
          <div>
            <p className="eyebrow" data-reveal>Coverage</p>
            <h2 className="h2" data-reveal="blur" data-reveal-delay="80">One team.<br />The whole map.</h2>
            <p className="lead" data-reveal data-reveal-delay="140" style={{ marginTop: 26, maxWidth: 440 }}>From the Highlands to Cornwall, our engineers cover all four nations — no postcode too remote.</p>
            <div data-reveal data-reveal-delay="200" style={{ marginTop: 46, display: "grid", gridTemplateColumns: "1fr 1fr", maxWidth: 420 }}>
              <div className="hair-t" style={{ padding: "20px 24px 20px 0" }}><div className="statnum">4</div><div className="statlabel">Nations covered</div></div>
              <div className="hair-t hair-l" style={{ padding: "20px 0 20px 24px" }}><div className="statnum"><span data-counter="175" data-suffix="+">175+</span></div><div className="statlabel">Towns &amp; cities served</div></div>
              <div className="hair-t" style={{ padding: "20px 24px 20px 0" }}><div className="statnum">7 days</div><div className="statlabel">Typical lead time</div></div>
              <div className="hair-t hair-l" style={{ padding: "20px 0 20px 24px" }}><div className="statnum">100%</div><div className="statlabel">Fixed-price quotes</div></div>
            </div>
          </div>
          <div data-reveal="zoom" data-reveal-delay="120">
            <div style={{ position: "relative", width: "100%", maxWidth: 560, margin: "0 auto" }}>
              <UkCoverageMap />
            </div>
            <p style={{ marginTop: 14, textAlign: "center", fontSize: 12, color: "var(--secondary)", fontWeight: 400, letterSpacing: "0.04em" }}>Live installs pulse red · hover a city</p>
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section id="ipx-speed" className="sec" style={{ padding: "0 0 150px" }}>
        <div className="wrap">
          <div style={{ textAlign: "center" }}>
            <p className="eyebrow" data-reveal>The Difference</p>
            <h2 className="h2" data-reveal="blur" data-reveal-delay="80">Life before. Life after.</h2>
            <p className="lead" data-reveal data-reveal-delay="140" style={{ margin: "22px auto 0", maxWidth: 460 }}>Drag the handle. This is what a professional install changes.</p>
          </div>
          <div data-reveal="zoom" data-reveal-delay="120" style={{ marginTop: 60 }}>
            <div id="ipx-cmp" className="cmp">
              <div className="cmp-before">
                <div className="cmp-tag" style={{ left: 30 }}>BEFORE</div>
                <div style={{ position: "absolute", top: "50%", left: "clamp(24px,6vw,80px)", transform: "translateY(-50%)", maxWidth: "44%" }}>
                  <div style={{ fontSize: 13, letterSpacing: "0.06em", color: "var(--secondary)" }}>Typical rural broadband</div>
                  <div style={{ marginTop: 10, display: "flex", alignItems: "baseline", gap: 8 }}><span id="ipx-b-val" style={{ fontSize: "clamp(44px,5.5vw,72px)", fontWeight: 200, letterSpacing: "-0.04em", color: "var(--secondary)" }}>4.2</span><span style={{ fontSize: 16, color: "var(--secondary)", fontWeight: 400 }}>Mbps</span></div>
                  <div style={{ marginTop: 22, height: 3, background: "var(--hair-2)", borderRadius: 99, overflow: "hidden", maxWidth: 260 }}><div id="ipx-b-bar" style={{ height: "100%", width: "12%", background: "var(--secondary)", borderRadius: 99 }} /></div>
                  <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--secondary)", fontWeight: 400 }}><span id="ipx-b-buf" style={{ width: 7, height: 7, borderRadius: 99, background: "#B45309" }} /><span id="ipx-b-status">Buffering…</span></div>
                  <div style={{ marginTop: 20, fontSize: 13, color: "var(--secondary)", fontWeight: 400, lineHeight: 1.7 }}>Latency ~620 ms<br />4K streaming: not possible</div>
                </div>
              </div>
              <div id="ipx-cmp-after" style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 130% at 85% 110%,rgba(199,5,5,.28) 0%,rgba(20,10,10,.9) 45%,#0B0B0C 100%)", clipPath: "inset(0 0 0 55%)" }}>
                <div className="cmp-tag" style={{ right: 30, left: "auto", border: "1px solid rgba(255,120,120,.4)", color: "#FFB5B5", background: "rgba(60,5,5,.35)" }}>AFTER · STARLINK</div>
                <div style={{ position: "absolute", top: "50%", right: "clamp(24px,6vw,80px)", transform: "translateY(-50%)", maxWidth: "44%", textAlign: "right" }}>
                  <div style={{ fontSize: 13, letterSpacing: "0.06em", color: "#D9A0A0" }}>Starlink, professionally installed</div>
                  <div style={{ marginTop: 10, display: "flex", alignItems: "baseline", gap: 10, justifyContent: "flex-end" }}><span id="ipx-a-val" style={{ fontSize: "clamp(52px,6.5vw,88px)", fontWeight: 400, letterSpacing: "-0.04em", color: "#fff", textShadow: "0 0 40px rgba(255,80,80,.5)" }}>245</span><span style={{ fontSize: 17, color: "#E8B9B9", fontWeight: 400 }}>Mbps</span></div>
                  <div style={{ marginTop: 22, height: 3, background: "rgba(255,255,255,.12)", borderRadius: 99, overflow: "hidden", maxWidth: 280, marginLeft: "auto" }}><div id="ipx-a-bar" style={{ height: "100%", width: "70%", background: "linear-gradient(90deg,#FF6B6B,#C70505)", borderRadius: 99, boxShadow: "0 0 12px rgba(255,80,80,.8)" }} /></div>
                  <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#E8B9B9", fontWeight: 400, justifyContent: "flex-end" }}><span style={{ width: 7, height: 7, borderRadius: 99, background: "#34D399", boxShadow: "0 0 10px rgba(52,211,153,.9)" }} />Connected · rock solid</div>
                  <div style={{ marginTop: 20, fontSize: 13, color: "#C89B9B", fontWeight: 400, lineHeight: 1.7 }}>Latency ~28 ms<br />4K on every screen, all at once</div>
                </div>
              </div>
              <div id="ipx-cmp-handle" style={{ position: "absolute", top: 0, bottom: 0, left: "55%", width: 1, background: "rgba(255,255,255,.5)", boxShadow: "0 0 20px rgba(255,255,255,.4)" }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 52, height: 52, borderRadius: 999, background: "rgba(20,20,20,.85)", border: "1px solid rgba(255,255,255,.35)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", gap: 3, boxShadow: "0 10px 34px rgba(0,0,0,.6)" }}>
                  <svg width="9" height="12" viewBox="0 0 8 12" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"><path d="M6 1L2 6l4 5" /></svg>
                  <svg width="9" height="12" viewBox="0 0 8 12" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"><path d="M2 1l4 5-4 5" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STORIES */}
      <section id="ipx-stories" className="sec" style={{ padding: "0 0 150px" }}>
        <div className="wrap">
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 28 }}>
            <div>
              <p className="eyebrow" data-reveal>Customer Stories</p>
              <h2 className="h2" data-reveal="blur" data-reveal-delay="80">Five stars,<br />everywhere we go.</h2>
            </div>
            <div data-reveal data-reveal-delay="160" style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <GoogleG size={22} />
              <div><div style={{ fontSize: 15, fontWeight: 600 }}>5.0 on Google</div><div style={{ fontSize: 12.5, color: "var(--secondary)", fontWeight: 400 }}>Every review, five stars</div></div>
            </div>
          </div>
          {reviews && reviews.length ? (
            <StoryCarousel reviews={reviews} />
          ) : (
            <div style={{ marginTop: 64, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 14, alignItems: "start" }}>
              {REVIEWS.map((r, i) => (
                <div className="card" data-reveal data-reveal-delay={String(i * 80)} key={r.n} style={{ display: "flex", flexDirection: "column", borderRadius: 24, padding: "36px 32px" }}>
                  <div style={{ fontSize: 14, color: "var(--gold)", letterSpacing: "3px" }}>★★★★★</div>
                  <p style={{ marginTop: 20, fontSize: 17.5, fontWeight: 400, lineHeight: 1.65, color: "var(--primary)", flex: 1, textWrap: "pretty" }}>&ldquo;{r.q}&rdquo;</p>
                  <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 14, borderTop: "1px solid var(--hair)", paddingTop: 22 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 999, background: r.red ? "linear-gradient(160deg,#4A1214,#2A0A0B)" : "var(--avatar-grad)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 500, color: r.red ? "#FFB5B5" : "var(--primary)" }}>{r.a}</div>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 14.5, fontWeight: 600 }}>{r.n}</div><div style={{ marginTop: 2, fontSize: 12.5, color: "var(--secondary)", fontWeight: 400 }}>Google review · verified</div></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* EQUIPMENT */}
      <section id="ipx-equipment" className="sec" style={{ padding: "0 0 150px" }}>
        <div className="wrap">
          <div style={{ textAlign: "center" }}>
            <p className="eyebrow" data-reveal>Equipment</p>
            <h2 className="h2" data-reveal="blur" data-reveal-delay="80">The hardware, handled.</h2>
            <p className="lead" data-reveal data-reveal-delay="140" style={{ margin: "22px auto 0", maxWidth: 480 }}>We supply, mount and configure the full Starlink ecosystem — nothing for you to source.</p>
          </div>
          <div style={{ marginTop: 64, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 14 }}>
            {EQUIPMENT.map((e, i) => (
              <div className="card" data-reveal="zoom" data-reveal-delay={String(i * 70)} data-tilt key={e.t} style={{ background: "var(--eq-grad)", borderRadius: 26, padding: "18px 18px 26px" }}>
                <div style={{ aspectRatio: "1", borderRadius: 18, background: "var(--eq-img-grad)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "1px solid var(--hair-3)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={e.img}
                    alt={e.t}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "contain", padding: "12%" }}
                  />
                </div>
                <div style={{ padding: "22px 10px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}><h3 style={{ margin: 0 }}>{e.t}</h3><span style={{ fontSize: 10.5, letterSpacing: "0.14em", fontWeight: 600, color: "#FF8585", border: "1px solid rgba(255,90,90,.3)", borderRadius: 999, padding: "4px 10px", whiteSpace: "nowrap" }}>{e.badge}</span></div>
                  <p>{e.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIY VS PRO */}
      <section id="ipx-compare" className="sec" style={{ padding: "0 0 150px" }}>
        <div className="wrap">
          <div style={{ textAlign: "center" }}>
            <p className="eyebrow" data-reveal>Why Professional</p>
            <h2 className="h2" data-reveal="blur" data-reveal-delay="80">You could do it yourself.<br />Here&apos;s why most don&apos;t.</h2>
          </div>
          <div style={{ marginTop: 64, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 14, maxWidth: 1000, marginLeft: "auto", marginRight: "auto" }}>
            <div data-reveal style={{ background: "var(--surface)", border: "1px solid var(--hair)", borderRadius: 28, padding: "42px 38px" }}>
              <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.015em", color: "var(--secondary)" }}>Doing it yourself</h3>
              <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 20 }}>
                {DIY.map((d) => (
                  <div style={{ display: "flex", gap: 14 }} key={d}>
                    <svg style={{ flexShrink: 0, marginTop: 2 }} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9.5" /><path d="M9 9l6 6" /><path d="M15 9l-6 6" /></svg>
                    <span style={{ fontSize: 15, fontWeight: 400, color: "var(--secondary)", lineHeight: 1.55 }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
            <div data-reveal data-reveal-delay="100" style={{ background: "linear-gradient(175deg,rgba(199,5,5,.09),rgba(199,5,5,.03) 60%)", border: "1px solid rgba(199,5,5,.35)", borderRadius: 28, padding: "42px 38px", boxShadow: "0 30px 90px rgba(199,5,5,.10)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.015em", color: "var(--primary)" }}>The InstallPros way</h3>
                <span style={{ fontSize: 10.5, letterSpacing: "0.16em", fontWeight: 600, color: "var(--accent)", border: "1px solid var(--accent)", borderRadius: 999, padding: "5px 12px" }}>RECOMMENDED</span>
              </div>
              <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 20 }}>
                {PRO.map((d) => (
                  <div style={{ display: "flex", gap: 14 }} key={d}>
                    <svg style={{ flexShrink: 0, marginTop: 2 }} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9.5" /><path d="M8 12.3l2.7 2.7L16.5 9" /></svg>
                    <span style={{ fontSize: 15, fontWeight: 400, color: "var(--secondary)", lineHeight: 1.55 }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p data-reveal style={{ margin: "40px auto 0", textAlign: "center", fontSize: 14, fontWeight: 400, color: "var(--secondary)", maxWidth: 440, lineHeight: 1.6 }}>Starlink is brilliant technology. It deserves a proper installation.</p>
        </div>
      </section>

      {/* NUMBERS */}
      <section id="ipx-numbers" className="sec" style={{ padding: "0 0 160px" }}>
        <div className="wrap">
          <p className="eyebrow" data-reveal>Track Record</p>
          <h2 className="h2" data-reveal="blur" data-reveal-delay="80">The numbers<br />do the talking.</h2>
          <div style={{ marginTop: 70, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 40 }}>
            {NUMBERS.map((n, i) => (
              <div data-reveal data-reveal-delay={String(i * 70)} key={n.label} className="hair-t" style={{ paddingTop: 28 }}>
                <div style={{ fontSize: "clamp(44px,4.2vw,60px)", fontWeight: 200, letterSpacing: "-0.04em", lineHeight: 1 }}>
                  {n.hrs ? (
                    <>1–3<span style={{ fontSize: "0.45em", fontWeight: 400, color: "var(--secondary)" }}>&nbsp;hrs</span></>
                  ) : (
                    <>
                      <span data-counter={n.c} data-suffix={n.suffix || ""} data-decimals={n.decimals ? String(n.decimals) : "0"}>{n.decimals ? "5.0" : (n.c === "9163" ? "9,163+" : n.c + (n.suffix || ""))}</span>
                      {n.star && <span style={{ color: "var(--gold)", fontSize: "0.55em", verticalAlign: "0.28em" }}>★</span>}
                    </>
                  )}
                </div>
                <div style={{ marginTop: 14, fontSize: 15, color: "var(--secondary)", fontWeight: 400, lineHeight: 1.55 }}>{n.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="ipx-faq" className="sec" style={{ padding: "0 0 160px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 28px" }}>
          <div style={{ textAlign: "center" }}>
            <p className="eyebrow" data-reveal>FAQ</p>
            <h2 className="h2" data-reveal="blur" data-reveal-delay="80" style={{ fontSize: "clamp(36px,4.4vw,56px)" }}>Questions, answered.</h2>
          </div>
          <div data-reveal data-reveal-delay="140" style={{ marginTop: 60, borderTop: "1px solid var(--hair-2)" }}>
            {FAQS.map((f, i) => (
              <div className={`faq-item${i === 0 ? " open" : ""}`} key={f.q}>
                <button className="faq-q" type="button">{f.q}<span className="ic">+</span></button>
                <div className="faq-body"><div><p>{f.a}</p></div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="ipx-cta" style={{ position: "relative", padding: "190px 0 170px", overflow: "hidden", background: "var(--bg-deep)" }}>
        <div style={{ position: "absolute", left: "50%", bottom: -340, transform: "translateX(-50%)", width: 1300, height: 680, borderRadius: "50%", background: "radial-gradient(closest-side,rgba(199,5,5,.4),rgba(199,5,5,.1) 45%,transparent 75%)", filter: "blur(30px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: "50%", bottom: -620, transform: "translateX(-50%)", width: 1700, height: 1240, borderRadius: "50%", border: "1px solid rgba(255,90,90,.35)", boxShadow: "0 -8px 60px rgba(255,50,50,.25),inset 0 30px 80px rgba(199,5,5,.15)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", padding: "0 28px", textAlign: "center" }}>
          <h2 data-reveal="blur" style={{ fontSize: "clamp(46px,6vw,72px)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.03 }}>Ready to experience Starlink<br /><span className="grad-text">the right way?</span></h2>
          <p data-reveal data-reveal-delay="120" style={{ margin: "28px auto 0", fontSize: 17.5, fontWeight: 400, color: "var(--secondary)", lineHeight: 1.65, maxWidth: 460 }}>A fixed quote in minutes. A certified engineer at your door this week.</p>
          <div data-reveal data-reveal-delay="220" style={{ marginTop: 46, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <button className="btn-primary js-quote" data-magnetic style={{ padding: "19px 40px", fontSize: 16.5 }}>Get My Quote <ArrowIcon /></button>
            <a className="btn-ghost" href={WA_TEXT} target="_blank" rel="noopener noreferrer" style={{ padding: "18px 34px", fontSize: 16 }}>
              <WaIcon size={18} /> Talk on WhatsApp
            </a>
          </div>
          <p data-reveal data-reveal-delay="300" style={{ marginTop: 30, fontSize: 13.5, fontWeight: 400, color: "var(--secondary)" }}>Or call us — <a href="tel:+442033977003" style={{ color: "var(--secondary)", fontWeight: 500 }}>{PHONE}</a></p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--hair)", background: "var(--bg-footer)", padding: "70px 0 44px" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 44 }}>
            <div>
              <div className="logo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo} alt="InstallPros" style={{ height: 24, width: "auto", display: "block" }} />
              </div>
              <p style={{ marginTop: 18, fontSize: 13.5, fontWeight: 400, color: "var(--secondary)", lineHeight: 1.7, maxWidth: 250 }}>Professional Starlink installation across the United Kingdom.</p>
            </div>
            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.2em", fontWeight: 600, color: "var(--secondary)" }}>SOLUTIONS</div>
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 13, fontSize: 14, fontWeight: 400 }}><a href="#ipx-why" style={{ color: "var(--secondary)" }}>Satellite broadband</a><a href="#ipx-equipment" style={{ color: "var(--secondary)" }}>Equipment supply</a><a href="#ipx-why" style={{ color: "var(--secondary)" }}>Business installations</a><a href="#ipx-why" style={{ color: "var(--secondary)" }}>Mesh WiFi</a></div>
            </div>
            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.2em", fontWeight: 600, color: "var(--secondary)" }}>COMPANY</div>
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 13, fontSize: 14, fontWeight: 400 }}><a href="#ipx-stories" style={{ color: "var(--secondary)" }}>Reviews</a><a href="#ipx-coverage" style={{ color: "var(--secondary)" }}>Coverage</a><a href="#ipx-faq" style={{ color: "var(--secondary)" }}>FAQs</a><a href="#ipx-cta" style={{ color: "var(--secondary)" }}>Contact us</a></div>
            </div>
            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.2em", fontWeight: 600, color: "var(--secondary)" }}>CONTACT</div>
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 13, fontSize: 14, fontWeight: 400, color: "var(--secondary)" }}>
                <span style={{ lineHeight: 1.6 }}>Rotunda Buildings, Montpellier Exchange,<br />Cheltenham, GL50 1SX</span>
                <a href="tel:+442033977003" style={{ color: "var(--secondary)" }}>{PHONE}</a>
                <a href="mailto:admin@installpros.co.uk" style={{ color: "var(--secondary)" }}>admin@installpros.co.uk</a>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 60, paddingTop: 28, borderTop: "1px solid var(--hair)", display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: 12, fontWeight: 400, color: "var(--secondary)", lineHeight: 1.7, maxWidth: 760 }}>© 2026 Install Pros® is a registered trade mark of InstallPros Group Ltd (UK). Company No. 14896859 · VAT No. GB456635174. Starlink is a trademark of SpaceX; InstallPros is an independent installation company.</p>
            <div style={{ display: "flex", gap: 18, fontSize: 12.5, fontWeight: 400 }}><a href="#ipx-top" style={{ color: "var(--secondary)" }}>Terms</a><a href="#ipx-top" style={{ color: "var(--secondary)" }}>Privacy</a></div>
          </div>
        </div>
      </footer>

      {/* QUOTE MODAL */}
      <div id="ipx-modal-ov" className={`ipx-modal-ov${variant === "light" ? " light" : ""}`}>
        <div className="ipx-modal">
          <button className="close" aria-label="Close" type="button">✕</button>
          <div id="ipx-mstep-0">
            <p style={{ fontSize: 11, letterSpacing: "0.2em", fontWeight: 600, color: "var(--red-soft)" }}>STEP 1 OF 2</p>
            <h3 style={{ marginTop: 12, fontSize: 26, fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1.15 }}>Where are we installing?</h3>
            <p style={{ marginTop: 10, fontSize: 14.5, fontWeight: 400, color: "var(--secondary)", lineHeight: 1.6 }}>Takes under a minute. Fixed quote, no obligation.</p>
            <label>POSTCODE</label>
            <input id="ipx-q-postcode" placeholder="e.g. GL50 1SX" style={{ letterSpacing: "0.08em", textTransform: "uppercase" }} />
            <label>PROPERTY TYPE</label>
            <div id="ipx-q-property" style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="chip sel" type="button">Home</button><button className="chip" type="button">Business</button><button className="chip" type="button">Marine</button><button className="chip" type="button">Vehicle</button>
            </div>
            <p className="err" id="ipx-err-0" />
            <button id="ipx-next-0" className="btn-primary" type="button" style={{ marginTop: 28, width: "100%", justifyContent: "center", padding: 16, fontSize: 15.5 }}>Continue</button>
          </div>
          <div id="ipx-mstep-1" style={{ display: "none" }}>
            <p style={{ fontSize: 11, letterSpacing: "0.2em", fontWeight: 600, color: "var(--red-soft)" }}>STEP 2 OF 2</p>
            <h3 style={{ marginTop: 12, fontSize: 26, fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1.15 }}>Where do we send your quote?</h3>
            <label>YOUR NAME</label>
            <input id="ipx-q-name" placeholder="e.g. Sarah Whitfield" />
            <label>MOBILE NUMBER</label>
            <input id="ipx-q-phone" placeholder="e.g. 07700 900123" style={{ letterSpacing: "0.04em" }} />
            <label>EMAIL ADDRESS</label>
            <input id="ipx-q-email" type="email" inputMode="email" autoComplete="email" placeholder="e.g. sarah@example.com" />
            <p className="err" id="ipx-err-1" />
            <div style={{ marginTop: 28, display: "flex", gap: 10 }}>
              <button id="ipx-back-1" type="button" style={{ flexShrink: 0, background: "var(--surface-3)", color: "var(--secondary)", border: "1px solid var(--hair-3)", borderRadius: 999, padding: "16px 22px", fontSize: 15, fontWeight: 500, cursor: "pointer" }}>Back</button>
              <button id="ipx-submit-q" className="btn-primary" type="button" style={{ flex: 1, justifyContent: "center", padding: 16, fontSize: 15.5 }}>Get My Quote</button>
            </div>
            <p style={{ marginTop: 16, fontSize: 12, color: "var(--secondary)", fontWeight: 400, textAlign: "center" }}>No spam, ever. We only use this to send your quote.</p>
          </div>
          <div id="ipx-mstep-2" style={{ display: "none", textAlign: "center", padding: "14px 0 6px" }}>
            <div style={{ width: 74, height: 74, margin: "0 auto", borderRadius: 999, background: "linear-gradient(160deg,#E31111,#8A0303)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 50px rgba(199,5,5,.45)" }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 style={{ marginTop: 26, fontSize: 26, fontWeight: 600, letterSpacing: "-0.025em" }}>Request received<span id="ipx-ok-name" /></h3>
            <p style={{ marginTop: 12, fontSize: 15, fontWeight: 400, color: "var(--secondary)", lineHeight: 1.65, maxWidth: 340, marginLeft: "auto", marginRight: "auto" }}>Our team is preparing your fixed quote for <span id="ipx-ok-pc" style={{ color: "var(--primary)", fontWeight: 500 }}>your address</span>. We&apos;ll text you shortly.</p>
            <a href={WA_PLAIN} target="_blank" rel="noopener noreferrer" style={{ marginTop: 30, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%", background: "#25D366", color: "#052E13", borderRadius: 999, padding: 16, fontSize: 15.5, fontWeight: 600 }}>Skip the queue — WhatsApp us now</a>
            <p style={{ marginTop: 18, fontSize: 13, color: "var(--secondary)", fontWeight: 400 }}>Prefer to talk? <a href="tel:+442033977003" style={{ color: "var(--secondary)", fontWeight: 500 }}>{PHONE}</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
