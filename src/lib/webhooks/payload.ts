import { createServiceClient } from "@/lib/supabase/server";
import { pitchAngles } from "@/lib/intel/pitch-angles";
import { siteConfig } from "@/lib/site-config";
import type { WebhookEvent, WebhookPayload } from "./types";

/** Intel columns worth sending. Deliberately excludes `raw` — it's megabytes. */
const INTEL_FIELDS = [
  "score",
  "score_reasons",
  "max_download_mbps",
  "max_upload_mbps",
  "actual_avg_download_mbps",
  "actual_max_download_mbps",
  "property_type",
  "built_form",
  "construction_age",
  "floor_area_sqm",
  "energy_rating",
  "energy_cost_annual",
  "median_price_paid",
  "value_band",
  "region",
  "rural",
  "crime_month",
  "crime_total",
  "crime_burglary",
  "crime_vehicle",
  "resolved_address",
  "bedrooms",
  "bathrooms",
  "tenure",
] as const;

/**
 * The lead columns we forward. Declared explicitly because the Supabase client
 * can't infer a row type from a concatenated select string.
 */
interface LeadRow {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  postcode: string;
  service: string | null;
  install_type: string | null;
  notes: string | null;
  status: string | null;
  lead_score: number | null;
  landing_page: string | null;
  traffic_source: string | null;
  campaign: string | null;
  device_type: string | null;
  source_url: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  gclid: string | null;
  fbclid: string | null;
  session_id: string | null;
  variant_id: string | null;
  experiment_id: string | null;
}

/**
 * Build the payload for one lead. On `lead.created` the intel row usually
 * doesn't exist yet, so `intel` comes back null — that's expected, not a fault.
 */
export async function buildPayload(event: WebhookEvent, leadId: string): Promise<WebhookPayload | null> {
  const supabase = createServiceClient();

  const { data } = await supabase
    .from("leads")
    .select(
      "id, created_at, name, email, phone, postcode, service, install_type, notes, status, lead_score, " +
        "landing_page, traffic_source, campaign, device_type, source_url, utm_source, utm_medium, " +
        "utm_campaign, utm_term, utm_content, gclid, fbclid, session_id, variant_id, experiment_id",
    )
    .eq("id", leadId)
    .maybeSingle();

  const lead = data as unknown as LeadRow | null;
  if (!lead) return null;

  // Only fetch intel for the enriched event — on lead.created it can't exist yet.
  let intel: Record<string, unknown> | null = null;
  if (event === "lead.enriched") {
    const { data: intelRow } = await supabase
      .from("lead_intel")
      .select(INTEL_FIELDS.join(", "))
      .eq("lead_id", leadId)
      .maybeSingle();
    intel = (intelRow as unknown as Record<string, unknown> | null) ?? null;
  }

  return {
    event,
    sent_at: new Date().toISOString(),
    lead: {
      id: lead.id,
      created_at: lead.created_at,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      postcode: lead.postcode,
      service: lead.service ?? null,
      install_type: lead.install_type ?? null,
      notes: lead.notes ?? null,
      status: lead.status ?? null,
      score: (lead.lead_score as number | null) ?? null,
    },
    attribution: {
      landing_page: lead.landing_page ?? null,
      traffic_source: lead.traffic_source ?? null,
      campaign: lead.campaign ?? null,
      device_type: lead.device_type ?? null,
      source_url: lead.source_url ?? null,
      utm_source: lead.utm_source ?? null,
      utm_medium: lead.utm_medium ?? null,
      utm_campaign: lead.utm_campaign ?? null,
      utm_term: lead.utm_term ?? null,
      utm_content: lead.utm_content ?? null,
      gclid: lead.gclid ?? null,
      fbclid: lead.fbclid ?? null,
      session_id: lead.session_id ?? null,
      variant_id: lead.variant_id ?? null,
      experiment_id: lead.experiment_id ?? null,
    },
    intel,
    pitch_angles: pitchAngles(intel as unknown as Parameters<typeof pitchAngles>[0]),
    links: { dashboard: `${siteConfig.url}/dashboard/leads?lead=${lead.id}` },
  };
}

/** A realistic fake payload for the "Send test" button. */
export function testPayload(): WebhookPayload {
  const now = new Date().toISOString();
  return {
    event: "webhook.test",
    sent_at: now,
    lead: {
      id: "00000000-0000-0000-0000-000000000000",
      created_at: now,
      name: "Test Lead",
      email: "test@example.com",
      phone: "+447700900000",
      postcode: "LS18 5QB",
      service: "Starlink installation",
      install_type: "residential",
      notes: "This is a test delivery from the InstallPros dashboard.",
      status: "new",
      score: 9,
    },
    attribution: {
      landing_page: "/install-quote",
      traffic_source: "google",
      campaign: "starlink-uk",
      device_type: "mobile",
      source_url: "https://get.installpros.co.uk/install-quote?gclid=TEST",
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "starlink-uk",
      utm_term: null,
      utm_content: null,
      gclid: "TEST_GCLID",
      fbclid: null,
      session_id: "test-session",
      variant_id: null,
      experiment_id: null,
    },
    intel: {
      score: 9,
      max_download_mbps: 12,
      actual_avg_download_mbps: 8,
      property_type: "House",
      built_form: "Detached",
      energy_rating: "E",
      rural: true,
    },
    pitch_angles: ["Slow broadband — lead with Starlink"],
    links: { dashboard: `${siteConfig.url}/dashboard/leads` },
  };
}
