/**
 * Propalt API client — held in reserve behind the Settings toggle
 * (app_settings.propalt_enabled). Free tier: 1,000 credits.
 *
 * Per docs: GET https://api.propalt.io/place-area/get-brandboard?postcode=…
 * Auth: "Authorization: Bearer KEY". Costs 1 credit per call.
 * Response (documented): sfbb_availability, ufbb_availability,
 * permises_unable_{2,5,10}mbps [sic], median/average/min/max_download_speed
 * (speeds arrive as strings). Generic fallback parsing kept for resilience.
 */

const BASE = process.env.PROPALT_API_BASE || "https://api.propalt.io";
const TIMEOUT_MS = 5000;

export interface PropaltBroadband {
  maxDownloadMbps: number | null;
  avgDownloadMbps: number | null;
  raw: unknown;
}

function headers(): Record<string, string> {
  return { Authorization: `Bearer ${process.env.PROPALT_API_KEY}`, Accept: "application/json" };
}

/** Depth-first numeric field search across unknown JSON shapes. */
function findNum(obj: unknown, patterns: RegExp[], depth = 0): number | null {
  if (depth > 5 || obj === null || typeof obj !== "object") return null;
  const rec = obj as Record<string, unknown>;
  for (const [k, v] of Object.entries(rec)) {
    if (patterns.some((p) => p.test(k))) {
      const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : NaN;
      if (Number.isFinite(n)) return n;
    }
  }
  for (const v of Object.values(rec)) {
    const found = findNum(v, patterns, depth + 1);
    if (found !== null) return found;
  }
  return null;
}

export function propaltConfigured(): boolean {
  return Boolean(process.env.PROPALT_API_KEY);
}

/** Health check — their documented /ping endpoint. Doesn't burn data credits. */
export async function pingPropalt(): Promise<{ ok: boolean; status: number }> {
  if (!propaltConfigured()) return { ok: false, status: 0 };
  try {
    const res = await fetch(`${BASE}/ping`, { headers: headers(), signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store" });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  }
}

// ── Address lookup + property detail (exact-property resolution) ──────────

export interface PropaltAddress {
  text: string;
  property_id: number;
}

/** Address search by postcode/free text. Docs path variants tried in order. */
export async function lookupAddresses(
  keyword: string,
): Promise<{ addresses: PropaltAddress[] } | { fail: string }> {
  if (!propaltConfigured()) return { fail: "no_key" };
  const attempts: string[] = [];
  for (const path of ["/location-search/address-lookup"]) {
    try {
      const res = await fetch(`${BASE}${path}?keyword=${encodeURIComponent(keyword)}&limit=10`, {
        headers: headers(),
        signal: AbortSignal.timeout(TIMEOUT_MS),
        cache: "no-store",
      });
      if (res.status === 404) {
        attempts.push(`${path}→404`);
        continue; // wrong path variant — try next
      }
      if (!res.ok) return { fail: `${path}→HTTP ${res.status}` };
      const json = (await res.json()) as { status?: string; data?: Array<{ type?: string; text?: string; property_id?: number }> };
      return {
        addresses: (json.data ?? [])
          .filter((d) => d.type === "address" && d.text && typeof d.property_id === "number")
          .map((d) => ({ text: d.text as string, property_id: d.property_id as number })),
      };
    } catch (e) {
      return { fail: `${path}→${e instanceof Error ? e.name : "network"}` };
    }
  }
  return { fail: attempts.join(", ") };
}

export interface PropaltProperty {
  address: string | null;
  uprn: string | null;
  propertyType: string | null;
  bedrooms: number | null;
  floorAreaSqm: number | null;
  energyRating: string | null;
  constructionAge: string | null;
  taxBand: string | null;
  avm: number | null;
  raw: unknown;
}

/** Full property record by Propalt property_id. */
export async function fetchPropertyDetail(propertyId: number): Promise<PropaltProperty | null> {
  if (!propaltConfigured()) return null;
  try {
    const res = await fetch(`${BASE}/property/get-property?property_id=${propertyId}`, {
      headers: headers(),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: Array<Record<string, unknown>> };
    const d = json.data?.[0];
    if (!d) return null;
    const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);
    const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
    return {
      address: str(d["address_text"]),
      uprn: d["uprn"] != null ? String(d["uprn"]) : null,
      propertyType: str(d["class_description"]) ?? str(d["property_type"]),
      bedrooms: num(d["number_of_bedrooms"]),
      floorAreaSqm: num(d["approx_size"]),
      energyRating: str(d["current_energy_rating"]),
      constructionAge: str(d["construction_age_band_std"]),
      taxBand: str(d["tax_band"]),
      avm: num(d["avm"]),
      raw: d,
    };
  } catch {
    return null;
  }
}

export async function fetchPropaltBroadband(postcode: string): Promise<PropaltBroadband | null> {
  if (!propaltConfigured()) return null;
  try {
    const res = await fetch(`${BASE}/place-area/get-brandboard?postcode=${encodeURIComponent(postcode)}`, {
      headers: headers(),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as Record<string, unknown> & { data?: unknown };
    const doc = (Array.isArray(json.data) ? json.data[0] ?? {} : json.data ?? json) as Record<string, unknown>;
    const num = (v: unknown) => {
      const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : NaN;
      return Number.isFinite(n) ? n : null;
    };
    return {
      maxDownloadMbps: num(doc["max_download_speed"]) ?? findNum(json, [/max.*down/i]),
      avgDownloadMbps:
        num(doc["average_download_speed"]) ?? num(doc["median_download_speed"]) ?? findNum(json, [/av(era)?g.*down/i, /median.*down/i]),
      raw: json,
    };
  } catch {
    return null;
  }
}
