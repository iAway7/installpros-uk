import { createServiceClient } from "@/lib/supabase/server";
import { fetchBroadband } from "@/lib/intel/fetchers";
import { getOutcodeBroadband } from "./outcodes";
import { fetchPropaltBroadband, propaltConfigured } from "./propalt";
import { getSetting } from "@/lib/settings/app-settings";
import { siteConfig } from "@/lib/site-config";

/**
 * Smart coverage message for /starlink-installation (Phase 2 of the A/B page).
 *
 * Chain: Supabase cache → homedata.co.uk /broadband → Ofcom Connected Nations
 * → generic (state "unknown" tells the client to keep its default copy).
 *
 * homedata's Broadband endpoint is marked "Limited Coverage" in their docs:
 * it 404s for a significant share of UK postcodes while their dataset grows,
 * hence the Ofcom fallback. Both ultimately source Ofcom Connected Nations.
 *
 * Quota protection: every result (including misses) is cached — hits for 90
 * days, misses for 30 — so homedata is called at most once per postcode/month.
 */

const HIT_TTL_MS = 90 * 864e5;
const MISS_TTL_MS = 30 * 864e5;
const TIMEOUT_MS = 4000;

export type CoverageState = "poor" | "fibre_coming" | "well_covered" | "invalid" | "unknown";

export interface CoverageResult {
  state: CoverageState;
  message: string | null;
  area: string | null;
  avgMbps: number | null;
}

interface HomedataBroadband {
  postcode: string;
  avg_download_speed: number;
  max_download_speed: number;
  superfast_available_pct: number;
  ultrafast_available_pct: number;
  gigabit_available_pct: number;
  full_fibre_available_pct: number;
  below_uso_pct: number;
  data_year: number;
}

const UNKNOWN: CoverageResult = { state: "unknown", message: null, area: null, avgMbps: null };

/** postcodes.io: validate + area name. */
async function lookupArea(postcode: string): Promise<{ valid: boolean; area: string | null }> {
  try {
    const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (res.status === 404) return { valid: false, area: null };
    if (!res.ok) return { valid: true, area: null }; // don't block on hiccups
    const json = (await res.json()) as { result?: { admin_district?: string; region?: string; parish?: string } };
    return { valid: true, area: json.result?.admin_district || json.result?.region || null };
  } catch {
    return { valid: true, area: null };
  }
}

async function fetchHomedata(pcCompact: string): Promise<HomedataBroadband | null | "miss"> {
  const key = process.env.HOMEDATA_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(`https://api.homedata.co.uk/broadband?postcode=${encodeURIComponent(pcCompact)}`, {
      headers: { Authorization: `Api-Key ${key}`, Accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (res.status === 404) return "miss"; // documented: many postcodes not covered yet
    if (!res.ok) return null;
    return (await res.json()) as HomedataBroadband;
  } catch {
    return null;
  }
}

function messageFor(state: CoverageState, area: string | null, avg: number | null): string | null {
  const place = area ?? "your area";
  switch (state) {
    case "poor":
      return `Your postcode: ${place}. Current typical speed: ~${avg} Mbps. No fibre upgrade currently scheduled for this area. Starlink typically delivers 100–250 Mbps here, installed within days.`;
    case "fibre_coming":
      return `Your postcode: ${place}. Current typical speed: ~${avg} Mbps. Fibre is rolling out in this area, but dates often slip and full coverage isn't confirmed. Get connected now — switch later if you want to.`;
    case "well_covered":
      return `Your postcode: ${place}. This area already has strong fixed broadband. Starlink can still make sense as backup, or for a boat, van, or second property nearby.`;
    case "invalid":
      return `We couldn't find that postcode. Double-check it, or call us on ${siteConfig.phone || "020 3397 7003"} and we'll check manually.`;
    default:
      return null;
  }
}

function classifyHomedata(d: HomedataBroadband, area: string | null): CoverageResult {
  const avg = Math.round(d.avg_download_speed);
  let state: CoverageState;
  if (d.gigabit_available_pct >= 50 || d.avg_download_speed >= 100) state = "well_covered";
  else if (d.full_fibre_available_pct >= 10) state = "fibre_coming"; // proxy: partial fibre = rollout in progress
  else state = "poor";
  return { state, message: messageFor(state, area, avg), area, avgMbps: avg };
}

function classifyOfcom(maxDown: number | null, area: string | null): CoverageResult {
  if (maxDown === null) return UNKNOWN;
  const avg = Math.round(maxDown);
  let state: CoverageState;
  if (maxDown >= 300) state = "well_covered";
  else if (maxDown < 30) state = "poor";
  else return UNKNOWN; // mid speeds without fibre-availability data: keep generic copy
  return { state, message: messageFor(state, area, avg), area, avgMbps: avg };
}

export async function getCoverage(rawPostcode: string): Promise<CoverageResult> {
  const pc = rawPostcode.trim().toUpperCase();
  const pcCompact = pc.replace(/\s+/g, "");
  if (!pcCompact) return { state: "invalid", message: messageFor("invalid", null, null), area: null, avgMbps: null };

  const { valid, area } = await lookupArea(pc);
  if (!valid) return { state: "invalid", message: messageFor("invalid", null, null), area: null, avgMbps: null };

  const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = hasSupabase ? createServiceClient() : null;

  // 1. Cache
  if (supabase) {
    const { data: cached } = await supabase
      .from("postcode_broadband_cache")
      .select("data, source, found, fetched_at")
      .eq("postcode", pcCompact)
      .maybeSingle();
    if (cached) {
      const age = Date.now() - +new Date(cached.fetched_at);
      const fresh = cached.found ? age < HIT_TTL_MS : age < MISS_TTL_MS;
      if (fresh) {
        if (!cached.found) return UNKNOWN;
        return cached.source === "homedata"
          ? classifyHomedata(cached.data as HomedataBroadband, area)
          : classifyOfcom((cached.data as { maxDownloadMbps?: number | null })?.maxDownloadMbps ?? null, area);
      }
    }
  }

  // 2. Propalt first (when toggled on): better data (actual line speeds),
  //    1,000 credits vs homedata's 100/month, and homedata 404s on many
  //    postcodes anyway — trying it first often wasted a call.
  if (propaltConfigured() && (await getSetting("propalt_enabled", false))) {
    const pa = await fetchPropaltBroadband(pcCompact);
    if (pa && (pa.avgDownloadMbps !== null || pa.maxDownloadMbps !== null)) {
      await supabase?.from("postcode_broadband_cache").upsert({
        postcode: pcCompact,
        data: { maxDownloadMbps: pa.maxDownloadMbps ?? pa.avgDownloadMbps, raw: pa.raw },
        source: "propalt", found: true, fetched_at: new Date().toISOString(),
      });
      return classifyOfcom(pa.maxDownloadMbps ?? pa.avgDownloadMbps, area);
    }
  }

  // 2b. homedata
  const hd = await fetchHomedata(pcCompact);
  if (hd && hd !== "miss") {
    await supabase?.from("postcode_broadband_cache").upsert({
      postcode: pcCompact, data: hd, source: "homedata", found: true, fetched_at: new Date().toISOString(),
    });
    return classifyHomedata(hd, area);
  }

  // 3. Ofcom direct (same underlying dataset; needs OFCOM_API_KEY)
  const ofcom = await fetchBroadband(pcCompact);
  if (ofcom?.maxDownloadMbps != null) {
    await supabase?.from("postcode_broadband_cache").upsert({
      postcode: pcCompact,
      data: { maxDownloadMbps: ofcom.maxDownloadMbps, maxUploadMbps: ofcom.maxUploadMbps },
      source: "ofcom", found: true, fetched_at: new Date().toISOString(),
    });
    return classifyOfcom(ofcom.maxDownloadMbps, area);
  }

  // 4. Bundled Ofcom outcode aggregates (Jan 2025 release) — always available,
  //    district-level rather than postcode-level, so wording avoids exact Mbps.
  const oc = getOutcodeBroadband(pc.split(/\s+/)[0] || pcCompact.slice(0, pcCompact.length - 3));
  if (oc) {
    const place = area ?? `the ${oc.outcode} area`;
    if (oc.gigabitPct >= 50) {
      return {
        state: "well_covered",
        message: `Your postcode: ${place}. This area already has strong fixed broadband. Starlink can still make sense as backup, or for a boat, van, or second property nearby.`,
        area, avgMbps: null,
      };
    }
    if (oc.unable30Pct >= 20 || oc.belowUsoPct >= 2) {
      return {
        state: "poor",
        message: `Your postcode: ${place}. Around ${Math.round(oc.unable30Pct)}% of homes here can't get superfast broadband, and no reliable fibre upgrade is confirmed. Starlink typically delivers 100–250 Mbps, installed within days.`,
        area, avgMbps: null,
      };
    }
  }

  // 5. Nothing usable: cache the miss (only if a source actually said "not found")
  if (hd === "miss") {
    await supabase?.from("postcode_broadband_cache").upsert({
      postcode: pcCompact, data: null, source: "homedata", found: false, fetched_at: new Date().toISOString(),
    });
  }
  return UNKNOWN;
}
