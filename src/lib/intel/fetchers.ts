/**
 * Server-only clients for the free UK property-intelligence APIs.
 * Every fetcher: short timeout, returns nulls on any failure — enrichment must
 * never break lead flow, and partial data still produces a usable score.
 *
 * Keys (all optional — fetchers no-op without them):
 *   OFCOM_API_KEY    — https://api.ofcom.org.uk (Connected Nations broadband)
 *   EPC_BEARER_TOKEN — new EPB service: https://get-energy-performance-data.communities.gov.uk
 *   EPC_API_EMAIL + EPC_API_KEY — legacy service (epc.opendatacommunities.org), fallback
 * postcodes.io and Land Registry need no key.
 */

const TIMEOUT_MS = 4000;

async function getJson(url: string, headers: Record<string, string> = {}): Promise<unknown | null> {
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json", ...headers },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

const num = (v: unknown): number | null => {
  const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) ? n : null;
};

// ── postcodes.io — region + parish (rural heuristic input) ────────────────

export interface PostcodeInfo {
  region: string | null;
  parish: string | null;
  latitude: number | null;
  longitude: number | null;
  raw: Record<string, unknown>;
}

export async function fetchPostcodeInfo(postcode: string): Promise<PostcodeInfo | null> {
  const json = (await getJson(
    `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`,
  )) as { result?: { region?: string; parish?: string; admin_district?: string; country?: string; latitude?: number; longitude?: number } } | null;
  if (!json?.result) return null;
  const r = json.result;
  return {
    region: r.region || r.country || null,
    parish: r.parish || null,
    latitude: typeof r.latitude === "number" ? r.latitude : null,
    longitude: typeof r.longitude === "number" ? r.longitude : null,
    raw: { region: r.region, parish: r.parish, admin_district: r.admin_district },
  };
}

// ── police.uk — street-level crime near the postcode (free, no key) ───────
// Coverage: England, Wales, NI. Returns the latest full month when no date
// is passed. Counts are within ~1 mile of the point.

export interface CrimeInfo {
  month: string | null;
  total: number;
  burglary: number;
  vehicle: number;
  raw: Record<string, unknown>;
}

export async function fetchCrime(lat: number, lng: number): Promise<CrimeInfo | null> {
  const json = (await getJson(
    `https://data.police.uk/api/crimes-street/all-crime?lat=${lat}&lng=${lng}`,
  )) as Array<{ category?: string; month?: string }> | null;
  if (!Array.isArray(json)) return null;
  let burglary = 0;
  let vehicle = 0;
  for (const c of json) {
    if (c.category === "burglary") burglary++;
    else if (c.category === "vehicle-crime") vehicle++;
  }
  return {
    month: json[0]?.month ?? null,
    total: json.length,
    burglary,
    vehicle,
    raw: { count: json.length },
  };
}

// ── Ofcom Connected Nations — broadband availability at the postcode ──────

export interface BroadbandInfo {
  maxDownloadMbps: number | null;
  maxUploadMbps: number | null;
  raw: Record<string, unknown>;
}

export async function fetchBroadband(postcode: string): Promise<BroadbandInfo | null> {
  const key = process.env.OFCOM_API_KEY;
  if (!key) return null;
  const pc = postcode.replace(/\s+/g, "").toUpperCase();
  const json = (await getJson(
    `https://api-proxy.ofcom.org.uk/broadband/coverage/${encodeURIComponent(pc)}`,
    { "Ofcom-API-Key": key },
  )) as { Availability?: Array<Record<string, unknown>> } | null;
  const premises = json?.Availability;
  if (!premises?.length) return null;

  // Field names vary across dataset vintages — probe the known candidates.
  const downKeys = ["MaxPredictedDown", "MaxBbPredictedDown", "MaxSfbbPredictedDown", "MaxUfbbPredictedDown"];
  const upKeys = ["MaxPredictedUp", "MaxBbPredictedUp", "MaxSfbbPredictedUp", "MaxUfbbPredictedUp"];
  const best = (rows: Array<Record<string, unknown>>, keys: string[]) => {
    let max: number | null = null;
    for (const row of rows)
      for (const k of keys) {
        const v = num(row[k]);
        if (v !== null && (max === null || v > max)) max = v;
      }
    return max;
  };

  return {
    maxDownloadMbps: best(premises, downKeys),
    maxUploadMbps: best(premises, upKeys),
    raw: { premises_count: premises.length, sample: premises[0] },
  };
}

// ── EPC register — property type, age, floor area, energy rating ──────────

export interface EpcInfo {
  propertyType: string | null;
  builtForm: string | null;
  constructionAge: string | null;
  floorAreaSqm: number | null;
  energyRating: string | null;
  /** heating + lighting + hot water, £/year, from the EPC certificate */
  energyCostAnnual: number | null;
  raw: Record<string, unknown>;
}

export async function fetchEpc(postcode: string): Promise<EpcInfo | null> {
  if (process.env.EPC_BEARER_TOKEN) return fetchEpcNew(postcode);
  return fetchEpcLegacy(postcode);
}

// ── New EPB Data API (Bearer token) ───────────────────────────────────────
// Search returns only summary rows; property details need /api/certificate.

const EPB_BASE = "https://api.get-energy-performance-data.communities.gov.uk";

/** RdSAP code → label maps (the new API returns coded values in places). */
const BUILT_FORM_CODES: Record<string, string> = {
  "1": "Detached", "2": "Semi-Detached", "3": "End-Terrace", "4": "Mid-Terrace",
  "5": "Enclosed End-Terrace", "6": "Enclosed Mid-Terrace",
};
const PROPERTY_TYPE_CODES: Record<string, string> = {
  "0": "House", "1": "Bungalow", "2": "Flat", "3": "Maisonette", "4": "Park home",
};
const AGE_BAND_CODES: Record<string, string> = {
  A: "before 1900", B: "1900-1929", C: "1930-1949", D: "1950-1966", E: "1967-1975",
  F: "1976-1982", G: "1983-1990", H: "1991-1995", I: "1996-2002", J: "2003-2006",
  K: "2007-2011", L: "2012 onwards",
};

/** Depth-first search of a nested EPC document for the first matching key. */
function deepFind(obj: unknown, keys: string[], depth = 0): unknown {
  if (depth > 6 || obj === null || typeof obj !== "object") return undefined;
  const rec = obj as Record<string, unknown>;
  for (const k of Object.keys(rec)) {
    const norm = k.toLowerCase().replace(/[-_]/g, "");
    if (keys.includes(norm)) return rec[k];
  }
  for (const k of Object.keys(rec)) {
    const found = deepFind(rec[k], keys, depth + 1);
    if (found !== undefined) return found;
  }
  return undefined;
}

const str = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : typeof v === "number" ? String(v) : null);

async function fetchEpcNew(postcode: string): Promise<EpcInfo | null> {
  const token = process.env.EPC_BEARER_TOKEN;
  if (!token) return null;
  const headers = { Authorization: `Bearer ${token}` };

  const search = (await getJson(
    `${EPB_BASE}/api/domestic/search?postcode=${encodeURIComponent(postcode)}&page_size=25`,
    headers,
  )) as { data?: Array<{ certificateNumber?: string; currentEnergyEfficiencyBand?: string }> } | null;
  const rows = search?.data;
  if (!rows?.length) return null;

  // Energy rating: most frequent band across certificates at this postcode.
  const bandCounts = new Map<string, number>();
  for (const r of rows) {
    const b = (r.currentEnergyEfficiencyBand || "").trim().toUpperCase();
    if (b) bandCounts.set(b, (bandCounts.get(b) || 0) + 1);
  }
  let energyRating: string | null = null;
  let bestBand = 0;
  bandCounts.forEach((c, b) => {
    if (c > bestBand) { energyRating = b; bestBand = c; }
  });

  // Property details: pull up to 2 full certificates and extract fields.
  const certNumbers = rows.map((r) => r.certificateNumber).filter((c): c is string => Boolean(c)).slice(0, 2);
  const certs = await Promise.all(
    certNumbers.map((cn) =>
      getJson(`${EPB_BASE}/api/certificate?certificate_number=${encodeURIComponent(cn)}`, headers),
    ),
  );

  let propertyType: string | null = null;
  let builtForm: string | null = null;
  let constructionAge: string | null = null;
  let floorArea: number | null = null;
  let energyCost: number | null = null;

  for (const cert of certs) {
    const doc = (cert as { data?: unknown } | null)?.data ?? cert;
    if (!doc) continue;
    if (!propertyType) {
      const v = str(deepFind(doc, ["propertytype"]));
      propertyType = v ? PROPERTY_TYPE_CODES[v] ?? v : null;
    }
    if (!builtForm) {
      const v = str(deepFind(doc, ["builtform"]));
      builtForm = v ? BUILT_FORM_CODES[v] ?? v : null;
    }
    if (!constructionAge) {
      const v = str(deepFind(doc, ["constructionageband", "constructionage"]));
      constructionAge = v ? AGE_BAND_CODES[v.toUpperCase()] ?? v : null;
    }
    if (floorArea === null) {
      const v = deepFind(doc, ["totalfloorarea"]);
      floorArea = num(typeof v === "object" && v !== null ? deepFind(v, ["value"]) : v);
    }
    if (energyCost === null) {
      const parts = [
        deepFind(doc, ["heatingcostcurrent"]),
        deepFind(doc, ["lightingcostcurrent"]),
        deepFind(doc, ["hotwatercostcurrent"]),
      ].map((v) => num(typeof v === "object" && v !== null ? deepFind(v, ["value"]) : v));
      const known = parts.filter((p): p is number => p !== null);
      if (known.length) energyCost = Math.round(known.reduce((a, b) => a + b, 0));
    }
    if (propertyType && builtForm && constructionAge && floorArea !== null && energyCost !== null) break;
  }

  return {
    propertyType,
    builtForm,
    constructionAge,
    floorAreaSqm: floorArea !== null ? Math.round(floorArea) : null,
    energyRating,
    energyCostAnnual: energyCost,
    raw: { certificates: rows.length, source: "epb-new", fetched_certs: certNumbers.length },
  };
}

// ── Legacy EPC API (Basic auth) — retired May 2026, kept as fallback ──────

async function fetchEpcLegacy(postcode: string): Promise<EpcInfo | null> {
  const email = process.env.EPC_API_EMAIL;
  const key = process.env.EPC_API_KEY;
  if (!email || !key) return null;
  const auth = Buffer.from(`${email}:${key}`).toString("base64");
  const json = (await getJson(
    `https://epc.opendatacommunities.org/api/v1/domestic/search?postcode=${encodeURIComponent(postcode)}&size=25`,
    { Authorization: `Basic ${auth}` },
  )) as { rows?: Array<Record<string, string>> } | null;
  const rows = json?.rows;
  if (!rows?.length) return null;

  /** Most frequent non-empty value of a column across certificates. */
  const mode = (col: string): string | null => {
    const counts = new Map<string, number>();
    for (const r of rows) {
      const v = (r[col] || "").trim();
      if (v && v.toUpperCase() !== "NO DATA!") counts.set(v, (counts.get(v) || 0) + 1);
    }
    let bestV: string | null = null;
    let bestC = 0;
    counts.forEach((c, v) => {
      if (c > bestC) { bestV = v; bestC = c; }
    });
    return bestV;
  };

  const areas = rows.map((r) => num(r["total-floor-area"])).filter((n): n is number => n !== null);

  const costs = rows
    .map((r) => {
      const parts = [num(r["heating-cost-current"]), num(r["lighting-cost-current"]), num(r["hot-water-cost-current"])];
      const known = parts.filter((p): p is number => p !== null);
      return known.length ? known.reduce((a, b) => a + b, 0) : null;
    })
    .filter((c): c is number => c !== null);

  return {
    propertyType: mode("property-type"),
    builtForm: mode("built-form"),
    constructionAge: mode("construction-age-band"),
    floorAreaSqm: areas.length ? Math.round(areas.reduce((a, b) => a + b, 0) / areas.length) : null,
    energyRating: mode("current-energy-rating"),
    energyCostAnnual: costs.length ? Math.round(costs.reduce((a, b) => a + b, 0) / costs.length) : null,
    raw: { certificates: rows.length },
  };
}

// ── Land Registry Price Paid — value band for the postcode ────────────────

export interface PriceInfo {
  medianPricePaid: number | null;
  valueBand: string | null;
  raw: Record<string, unknown>;
}

export function toValueBand(price: number | null): string | null {
  if (price === null) return null;
  if (price < 150_000) return "<£150k";
  if (price < 300_000) return "£150k-£300k";
  if (price < 500_000) return "£300k-£500k";
  if (price < 1_000_000) return "£500k-£1m";
  return ">£1m";
}

export async function fetchPricePaid(postcode: string): Promise<PriceInfo | null> {
  const json = (await getJson(
    `https://landregistry.data.gov.uk/data/ppi/transaction-record.json?propertyAddress.postcode=${encodeURIComponent(postcode.toUpperCase())}&_pageSize=50`,
  )) as { result?: { items?: Array<{ pricePaid?: number; transactionDate?: string }> } } | null;
  const items = json?.result?.items;
  if (!items?.length) return null;

  // Prefer recent sales (last 10 years) so the band reflects today's market.
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 10);
  let prices = items
    .filter((i) => i.transactionDate && new Date(i.transactionDate) >= cutoff)
    .map((i) => i.pricePaid)
    .filter((p): p is number => typeof p === "number" && p > 0);
  if (!prices.length) prices = items.map((i) => i.pricePaid).filter((p): p is number => typeof p === "number" && p > 0);
  if (!prices.length) return null;

  prices.sort((a, b) => a - b);
  const median = prices[Math.floor(prices.length / 2)];
  return { medianPricePaid: median, valueBand: toValueBand(median), raw: { sales: prices.length } };
}
