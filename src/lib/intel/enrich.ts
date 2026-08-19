import { createServiceClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { fetchBroadband, fetchCrime, fetchEpc, fetchPostcodeInfo, fetchPricePaid } from "./fetchers";
import { fetchPropaltBroadband, propaltConfigured } from "@/lib/broadband/propalt";
import { fetchHomedata } from "@/lib/broadband/coverage";
import { getOutcodeBroadband } from "@/lib/broadband/outcodes";
import { getSetting } from "@/lib/settings/app-settings";
import { scoreLead } from "./score";
import type { IntelSignals } from "./types";

/**
 * Propalt actual-speed lookup, cache-first (postcode_broadband_cache) so a
 * postcode never costs more than 1 credit per 90 days across the whole app.
 * Only runs when the Settings toggle is on.
 */
async function propaltActualSpeed(
  supabase: SupabaseClient,
  pcCompact: string,
): Promise<{ avg: number | null; max: number | null }> {
  const none = { avg: null, max: null };
  if (!propaltConfigured() || !(await getSetting("propalt_enabled", false))) return none;

  const { data: cached } = await supabase
    .from("postcode_broadband_cache")
    .select("data, fetched_at")
    .eq("postcode", pcCompact)
    .eq("source", "propalt")
    .maybeSingle();
  if (cached && Date.now() - +new Date(cached.fetched_at) < 90 * 864e5) {
    const d = cached.data as { avgDownloadMbps?: number | null; maxDownloadMbps?: number | null } | null;
    const hit = { avg: d?.avgDownloadMbps ?? null, max: d?.maxDownloadMbps ?? null };
    // An all-null cached row is a failed lookup, not an answer — retry rather
    // than serving the blank for the next 90 days.
    if (hit.avg !== null || hit.max !== null) return hit;
  }

  const pa = await fetchPropaltBroadband(pcCompact);
  if (!pa) return none;
  // Propalt answers 200 with an empty payload for postcodes it doesn't hold.
  // Caching that would freeze the blank in place, so only store real numbers.
  if (pa.avgDownloadMbps === null && pa.maxDownloadMbps === null) return none;
  await supabase.from("postcode_broadband_cache").upsert({
    postcode: pcCompact,
    data: { avgDownloadMbps: pa.avgDownloadMbps, maxDownloadMbps: pa.maxDownloadMbps, raw: pa.raw },
    source: "propalt",
    found: true,
    fetched_at: new Date().toISOString(),
  });
  return { avg: pa.avgDownloadMbps, max: pa.maxDownloadMbps };
}

/**
 * homedata.co.uk fallback for "max download" while the Ofcom subscription is
 * still awaiting approval (without OFCOM_API_KEY, fetchBroadband is a no-op,
 * so the field can never fill). Cache-first on the same table the coverage
 * message uses — hits last 90 days, misses 30 — so homedata is called at most
 * once per postcode per month across the whole app.
 */
async function homedataMaxDown(supabase: SupabaseClient, pcCompact: string): Promise<number | null> {
  const { data: cached } = await supabase
    .from("postcode_broadband_cache")
    .select("data, found, fetched_at")
    .eq("postcode", pcCompact)
    .eq("source", "homedata")
    .maybeSingle();
  if (cached) {
    const age = Date.now() - +new Date(cached.fetched_at);
    if (cached.found ? age < 90 * 864e5 : age < 30 * 864e5) {
      const d = cached.data as { max_download_speed?: number } | null;
      return d?.max_download_speed != null ? Math.round(d.max_download_speed) : null;
    }
  }

  const hd = await fetchHomedata(pcCompact);
  if (hd === null) return null; // no key or network failure — nothing to cache
  if (hd === "miss") {
    await supabase.from("postcode_broadband_cache").upsert({
      postcode: pcCompact, data: null, source: "homedata", found: false, fetched_at: new Date().toISOString(),
    });
    return null;
  }
  await supabase.from("postcode_broadband_cache").upsert({
    postcode: pcCompact, data: hd, source: "homedata", found: true, fetched_at: new Date().toISOString(),
  });
  return hd.max_download_speed != null ? Math.round(hd.max_download_speed) : null;
}

/**
 * Enrich one lead: hit the four free APIs in parallel, score, persist.
 * Idempotent — skips if intel already exists (pass force to re-run).
 * Never throws; returns whether a row was written.
 */
export async function enrichLead(leadId: string, opts: { force?: boolean } = {}): Promise<{ ok: boolean; reason?: string }> {
  const supabase = createServiceClient();

  const { data: lead } = await supabase
    .from("leads")
    .select("id, postcode, created_at, device_type, traffic_source, gclid")
    .eq("id", leadId)
    .single();
  if (!lead) return { ok: false, reason: "lead_not_found" };

  if (!opts.force) {
    const { data: existing } = await supabase.from("lead_intel").select("lead_id").eq("lead_id", leadId).maybeSingle();
    if (existing) return { ok: false, reason: "already_enriched" };
  }

  const postcode = String(lead.postcode).trim().toUpperCase();

  const [pc, bb, epc, price] = await Promise.all([
    fetchPostcodeInfo(postcode),
    fetchBroadband(postcode),
    fetchEpc(postcode),
    fetchPricePaid(postcode),
  ]);

  // Crime needs coordinates from the postcode lookup (police.uk is lat/lng based).
  const crime = pc?.latitude != null && pc?.longitude != null ? await fetchCrime(pc.latitude, pc.longitude) : null;

  // Actual line speeds (Propalt, toggle-gated, cache-first).
  const pcCompact = postcode.replace(/\s+/g, "");
  const actual = await propaltActualSpeed(supabase, pcCompact);

  // Max available download: Ofcom when the key is live, homedata meanwhile.
  const maxDown = bb?.maxDownloadMbps ?? (await homedataMaxDown(supabase, pcCompact));

  // Rural heuristic: England/Wales postcodes in a named civil parish sit
  // overwhelmingly outside the big urban cores (cities are unparished).
  // Approximate — swap for the ONS rural/urban lookup when we ingest NSPL.
  const hasParish = Boolean(pc?.parish && !/unparished/i.test(pc.parish));
  const rural: boolean | null = pc ? hasParish : null;

  const signals: IntelSignals = {
    postcode,
    maxDownloadMbps: maxDown,
    maxUploadMbps: bb?.maxUploadMbps ?? null,
    actualDownloadMbps: actual.avg,
    outcodeUnable30Pct: getOutcodeBroadband(postcode.split(/\s+/)[0])?.unable30Pct ?? null,
    propertyType: epc?.propertyType ?? null,
    builtForm: epc?.builtForm ?? null,
    constructionAge: epc?.constructionAge ?? null,
    floorAreaSqm: epc?.floorAreaSqm ?? null,
    energyRating: epc?.energyRating ?? null,
    medianPricePaid: price?.medianPricePaid ?? null,
    region: pc?.region ?? null,
    parish: pc?.parish ?? null,
    rural,
    deviceType: lead.device_type ?? null,
    trafficSource: lead.traffic_source ?? null,
    gclid: lead.gclid ?? null,
    submittedAt: lead.created_at,
    raw: {
      postcodes_io: pc?.raw ?? null,
      ofcom: bb?.raw ?? null,
      epc: epc?.raw ?? null,
      land_registry: price?.raw ?? null,
      broadband_source: bb?.maxDownloadMbps != null ? "ofcom" : maxDown != null ? "homedata" : null,
    },
  };

  const { score, reasons } = scoreLead(signals);

  const { error } = await supabase.from("lead_intel").upsert({
    lead_id: leadId,
    postcode,
    max_download_mbps: signals.maxDownloadMbps,
    max_upload_mbps: signals.maxUploadMbps,
    property_type: signals.propertyType,
    built_form: signals.builtForm,
    construction_age: signals.constructionAge,
    floor_area_sqm: signals.floorAreaSqm,
    energy_rating: signals.energyRating,
    median_price_paid: signals.medianPricePaid,
    value_band: price?.valueBand ?? null,
    region: signals.region,
    rural,
    score,
    score_reasons: reasons,
    actual_avg_download_mbps: actual.avg,
    actual_max_download_mbps: actual.max,
    crime_month: crime?.month ?? null,
    crime_total: crime?.total ?? null,
    crime_burglary: crime?.burglary ?? null,
    crime_vehicle: crime?.vehicle ?? null,
    energy_cost_annual: epc?.energyCostAnnual ?? null,
    raw: signals.raw,
  });
  if (error) return { ok: false, reason: error.message };

  await supabase.from("leads").update({ lead_score: score }).eq("id", leadId);
  return { ok: true };
}
