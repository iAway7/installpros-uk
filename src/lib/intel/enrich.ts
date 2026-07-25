import { createServiceClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { fetchBroadband, fetchCrime, fetchEpc, fetchPostcodeInfo, fetchPricePaid } from "./fetchers";
import { fetchPropaltBroadband, propaltConfigured } from "@/lib/broadband/propalt";
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
    return { avg: d?.avgDownloadMbps ?? null, max: d?.maxDownloadMbps ?? null };
  }

  const pa = await fetchPropaltBroadband(pcCompact);
  if (!pa) return none;
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

  // Rural heuristic: England/Wales postcodes in a named civil parish sit
  // overwhelmingly outside the big urban cores (cities are unparished).
  // Approximate — swap for the ONS rural/urban lookup when we ingest NSPL.
  const hasParish = Boolean(pc?.parish && !/unparished/i.test(pc.parish));
  const rural: boolean | null = pc ? hasParish : null;

  const signals: IntelSignals = {
    postcode,
    maxDownloadMbps: bb?.maxDownloadMbps ?? null,
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
    raw: { postcodes_io: pc?.raw ?? null, ofcom: bb?.raw ?? null, epc: epc?.raw ?? null, land_registry: price?.raw ?? null },
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
