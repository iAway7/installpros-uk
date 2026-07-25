import type { DeviceType, EventContext } from "./events";

const UTM_STORAGE_KEY = "ip_attribution";
const SESSION_ID_KEY = "ip_session_id";

interface StoredAttribution {
  traffic_source: string;
  campaign: string | null;
  medium: string | null;
  landing_page: string;
  first_seen: string;
  // Full UTM + click-id set (first touch). Optional so older cached blobs
  // written before these fields existed still parse fine.
  utm_source?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  gclid?: string | null;
  fbclid?: string | null;
}

function detectDevice(): DeviceType {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  const ua = navigator.userAgent.toLowerCase();
  const isTabletUA = /ipad|tablet|playbook|silk/.test(ua) || (/android/.test(ua) && !/mobile/.test(ua));
  if (isTabletUA || (w >= 640 && w < 1024)) return "tablet";
  if (w < 640 || /mobi|iphone|android.*mobile/.test(ua)) return "mobile";
  return "desktop";
}

/**
 * First-touch attribution. UTM params win; otherwise referrer host; else "direct".
 * Persisted to sessionStorage so every event in the session shares one source
 * — this is what makes traffic_source reliable across the funnel.
 */
function resolveAttribution(): StoredAttribution {
  const fallback: StoredAttribution = {
    traffic_source: "direct",
    campaign: null,
    medium: null,
    landing_page: typeof window !== "undefined" ? window.location.pathname : "/",
    first_seen: new Date().toISOString(),
  };
  if (typeof window === "undefined") return fallback;

  try {
    const cached = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (cached) return JSON.parse(cached) as StoredAttribution;
  } catch {
    /* storage blocked */
  }

  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source");
  const referrerHost = document.referrer ? safeHost(document.referrer) : null;
  const gclid = params.get("gclid");

  const resolved: StoredAttribution = {
    traffic_source: utmSource || (gclid ? "google" : null) || referrerHost || "direct",
    campaign: params.get("utm_campaign"),
    medium: params.get("utm_medium") || (utmSource || gclid ? "cpc" : referrerHost ? "referral" : "(none)"),
    landing_page: window.location.pathname,
    first_seen: new Date().toISOString(),
    utm_source: utmSource,
    utm_term: params.get("utm_term"),
    utm_content: params.get("utm_content"),
    gclid,
    fbclid: params.get("fbclid"),
  };

  try {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(resolved));
  } catch {
    /* storage blocked */
  }
  return resolved;
}

/** Stable per-session id, shared between analytics events and lead records. */
export function getSessionId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    let id = sessionStorage.getItem(SESSION_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_ID_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

function safeHost(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** Active A/B assignment, written by the experiment provider (Phase 5). */
function resolveExperiment(): { variant_id: string | null; experiment_id: string | null } {
  if (typeof window === "undefined") return { variant_id: null, experiment_id: null };
  const w = window as unknown as { __ipExperiment?: { variant_id: string; experiment_id: string } };
  return {
    variant_id: w.__ipExperiment?.variant_id ?? null,
    experiment_id: w.__ipExperiment?.experiment_id ?? null,
  };
}

/** Attribution meta sent with every lead submission (`/api/lead`). */
export interface LeadMeta {
  traffic_source: string | null;
  campaign: string | null;
  page_url: string;
  device_type: DeviceType;
  landing_page: string | null;
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

/** Single source of truth for the meta blob both lead forms submit. */
export function getLeadAttribution(): LeadMeta {
  const attr = resolveAttribution();
  const experiment = resolveExperiment();
  return {
    traffic_source: attr.traffic_source ?? null,
    campaign: attr.campaign ?? null,
    page_url: typeof window !== "undefined" ? window.location.href : "",
    device_type: detectDevice(),
    landing_page: attr.landing_page ?? null,
    utm_source: attr.utm_source ?? null,
    utm_medium: attr.medium ?? null,
    utm_campaign: attr.campaign ?? null,
    utm_term: attr.utm_term ?? null,
    utm_content: attr.utm_content ?? null,
    gclid: attr.gclid ?? null,
    fbclid: attr.fbclid ?? null,
    session_id: getSessionId(),
    variant_id: experiment.variant_id,
    experiment_id: experiment.experiment_id,
  };
}

export function buildEventContext(): EventContext {
  const attribution = resolveAttribution();
  const experiment = resolveExperiment();
  return {
    page_url: typeof window !== "undefined" ? window.location.href : "",
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
    page_title: typeof document !== "undefined" ? document.title : "",
    device_type: detectDevice(),
    traffic_source: attribution.traffic_source,
    campaign: attribution.campaign,
    medium: attribution.medium,
    variant_id: experiment.variant_id,
    experiment_id: experiment.experiment_id,
  };
}
