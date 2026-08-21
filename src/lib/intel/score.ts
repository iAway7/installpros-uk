import type { IntelSignals, ScoreReason } from "./types";

/**
 * Lead score 1-10. Base 5, signals push up or down, clamped.
 * The canonical examples from the spec:
 *   1960s detached farmhouse, rural Cornwall, 2 Mbps  → 10
 *   New-build flat, central Manchester, 500 Mbps fibre → 2
 *
 * Broadband speed is deliberately the heaviest signal — it's the single best
 * proxy for "actually needs Starlink".
 */
export function scoreLead(s: IntelSignals): { score: number; reasons: ScoreReason[] } {
  const reasons: ScoreReason[] = [];
  const add = (signal: string, points: number, detail: string) => {
    if (points !== 0) reasons.push({ signal, points, detail });
  };

  // ── Broadband (dominant, -3 … +4) ──
  const down = s.maxDownloadMbps;
  if (down !== null) {
    if (down < 10) add("broadband", 4, `${down} Mbps, below USO, desperate for Starlink`);
    else if (down < 30) add("broadband", 3, `${down} Mbps, below superfast threshold`);
    else if (down < 80) add("broadband", 1.5, `${down} Mbps, mediocre`);
    else if (down < 300) add("broadband", 0, `${down} Mbps, decent`);
    else add("broadband", -3, `${down} Mbps, fast fibre already available`);
  }

  // ── Actual line performance (Propalt take-up data, -1.5 … +3) ──
  // Ofcom says what's available; this says what residents really get. A street
  // crawling at 15 Mbps despite fibre availability is a hot Starlink prospect.
  const actual = s.actualDownloadMbps;
  if (actual !== null) {
    if (actual < 10) add("actual_speed", 3, `Residents actually get ~${actual} Mbps`);
    else if (actual < 20) add("actual_speed", 2, `Residents actually get ~${actual} Mbps`);
    else if (actual < 35) add("actual_speed", 1, `Residents actually get ~${actual} Mbps`);
    else if (actual >= 100) add("actual_speed", -1.5, `Residents already on ~${actual} Mbps`);
  }

  // ── District availability fallback (bundled Ofcom data, only when the
  //    postcode-level sources above returned nothing) ──
  const unable30 = s.outcodeUnable30Pct;
  if (down === null && actual === null && unable30 !== null) {
    if (unable30 >= 30) add("district_broadband", 2.5, `${Math.round(unable30)}% of homes in the district can't get 30 Mbps`);
    else if (unable30 >= 15) add("district_broadband", 1.5, `${Math.round(unable30)}% of homes in the district can't get 30 Mbps`);
    else if (unable30 <= 2) add("district_broadband", -1, "District has near-universal superfast availability");
  }

  // ── Property type / built form (-2 … +2) ──
  const type = (s.propertyType || "").toLowerCase();
  const form = (s.builtForm || "").toLowerCase();
  if (form.includes("detached") && !form.includes("semi")) add("property", 2, "Detached property");
  else if (type.includes("bungalow") || form.includes("semi")) add("property", 1, s.builtForm || s.propertyType || "");
  else if (type.includes("flat") || type.includes("maisonette")) add("property", -2, "Flat/maisonette: install harder, fibre likelier");

  // ── Rural (+1.5) ──
  if (s.rural === true) add("rural", 1.5, "Rural classification");

  // ── Construction age: older builds = poorer connectivity infrastructure ──
  const age = s.constructionAge || "";
  const yearMatch = age.match(/(\d{4})/);
  if (yearMatch && parseInt(yearMatch[1], 10) < 1967) add("age", 0.5, `Older build (${age.trim()})`);

  // ── Behavioural signals (small nudges) ──
  const hour = new Date(s.submittedAt).getUTCHours();
  if (hour >= 18 || hour < 8) add("timing", 0.5, "Submitted outside work hours, home-owner behaviour");
  if (s.gclid || s.trafficSource === "google") add("source", 0.25, "Arrived via paid/Google, active intent");
  if (s.deviceType === "desktop") add("device", 0.25, "Desktop, often rural (mobile signal poor too)");

  const total = 5 + reasons.reduce((sum, r) => sum + r.points, 0);
  let score = Math.max(1, Math.min(10, Math.round(total)));

  // Without any broadband signal (postcode-level OR district-level) we're
  // missing the strongest evidence, so cap at 7: no "call first" 8-10 on
  // property shape alone.
  if (down === null && actual === null && unable30 === null && score > 7) {
    score = 7;
    reasons.push({ signal: "cap", points: 0, detail: "Capped at 7, no broadband data for this postcode" });
  }

  return { score, reasons };
}
