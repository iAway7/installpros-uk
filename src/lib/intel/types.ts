/** Property-intelligence result stored in `lead_intel` (one row per lead). */
export interface LeadIntel {
  lead_id: string;
  postcode: string;
  max_download_mbps: number | null;
  max_upload_mbps: number | null;
  property_type: string | null;
  built_form: string | null;
  construction_age: string | null;
  floor_area_sqm: number | null;
  energy_rating: string | null;
  median_price_paid: number | null;
  value_band: string | null;
  region: string | null;
  rural: boolean | null;
  score: number | null;
  score_reasons: ScoreReason[] | null;
  actual_avg_download_mbps: number | null;
  actual_max_download_mbps: number | null;
  crime_month: string | null;
  crime_total: number | null;
  crime_burglary: number | null;
  crime_vehicle: number | null;
  energy_cost_annual: number | null;
  resolved_address: string | null;
  uprn: string | null;
  propalt_property_id: number | null;
  avm_value: number | null;
  bedrooms: number | null;
  tax_band: string | null;
  created_at: string;
}

export interface ScoreReason {
  signal: string;
  points: number;
  detail: string;
}

/** Raw signals collected by the fetchers before scoring. */
export interface IntelSignals {
  postcode: string;
  maxDownloadMbps: number | null;
  maxUploadMbps: number | null;
  /** Actual average line speed in use (Propalt take-up data), if enabled */
  actualDownloadMbps: number | null;
  /** District-level % of premises unable to get 30 Mbit/s (bundled Ofcom data) */
  outcodeUnable30Pct: number | null;
  propertyType: string | null;
  builtForm: string | null;
  constructionAge: string | null;
  floorAreaSqm: number | null;
  energyRating: string | null;
  medianPricePaid: number | null;
  region: string | null;
  parish: string | null;
  rural: boolean | null;
  // From the lead row itself
  deviceType: string | null;
  trafficSource: string | null;
  gclid: string | null;
  submittedAt: string;
  raw: Record<string, unknown>;
}
