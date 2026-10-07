/**
 * The questions asked after a commercial lead is already in the CRM.
 *
 * One module so the form, the API route that stores the answers and anything
 * that later reads them share a vocabulary. The alternative is the same list
 * typed out in three places, which survives exactly until somebody renames an
 * option in the form and the stored value stops matching what the dashboard
 * groups by.
 *
 * The values are stable ids, never the labels. Will rewords these: "Tills"
 * became "Payments and EPOS" on 7 October. A label is copy and can change
 * freely; a value is data and changing one splits its history in two, the same
 * trap the sector cards hit.
 */

export interface QualificationOption {
  value: string;
  label: string;
  /** Shown under the label where the choice is not self-evident. */
  description?: string;
}

/** Mirrors the sector cards on the commercial landing, plus an escape hatch.
 *  Prefilled from the card they clicked when there was one. */
export const BUSINESS_TYPES: QualificationOption[] = [
  { value: "offices", label: "Offices" },
  { value: "warehouses_depots", label: "Warehouses and depots" },
  { value: "construction_sites", label: "Construction and temporary sites" },
  { value: "retail_hospitality", label: "Retail and hospitality" },
  { value: "holiday_parks", label: "Holiday parks and campsites" },
  { value: "farms_rural", label: "Farms and rural business" },
  { value: "other", label: "Something else" },
];

/** Maps a sector card's analytics key onto a business type, so somebody who
 *  came through a card does not get asked what we already watched them say.
 *  Keys are the `k`/derived ids from sectors-section.tsx. */
export const SECTOR_TO_BUSINESS_TYPE: Record<string, string> = {
  offices: "offices",
  warehouses_and_depots: "warehouses_depots",
  construction_sites: "construction_sites",
  retail_and_hospitality: "retail_hospitality",
  holiday_parks_and_campsites: "holiday_parks",
  farms_and_rural_business: "farms_rural",
};

/** Closed set, mirrored by leads_timeframe_check in migration 0021. Adding one
 *  here without the migration will be rejected by the database. */
export const TIMEFRAMES: QualificationOption[] = [
  { value: "asap", label: "As soon as possible" },
  { value: "within_month", label: "Within a month" },
  { value: "one_to_three_months", label: "One to three months" },
  { value: "planning", label: "Planning and budgeting" },
];

/** The six rows from what-it-runs-section.tsx, word for word. The page spends
 *  a section telling a visitor these are the things that matter; asking the
 *  same question in different words a screen later reads as a different
 *  question. */
export const SYSTEMS: QualificationOption[] = [
  { value: "payments_epos", label: "Payments and EPOS" },
  { value: "wifi", label: "Guest and staff Wi-Fi" },
  { value: "cctv_access", label: "CCTV and access systems" },
  { value: "phones_cloud", label: "Phones and cloud applications" },
  { value: "vpn_remote", label: "VPNs and remote access" },
  { value: "multiple_buildings", label: "Multiple buildings" },
];

export interface QualificationAnswers {
  companyName?: string | null;
  businessType?: string | null;
  timeframe?: string | null;
  hasStarlink?: boolean | null;
  systems?: string[] | null;
  notes?: string | null;
}

/** Longest value we will store per text field. Generous for a company name and
 *  a note, mean enough that the column is not a place to paste a novel. */
export const MAX_TEXT = 500;
export const MAX_NOTES = 2000;

const BUSINESS_VALUES = new Set(BUSINESS_TYPES.map((o) => o.value));
const TIMEFRAME_VALUES = new Set(TIMEFRAMES.map((o) => o.value));
const SYSTEM_VALUES = new Set(SYSTEMS.map((o) => o.value));

export interface ParseResult {
  ok: boolean;
  /** Present when ok. Only the keys the caller actually sent. */
  value?: QualificationAnswers;
  /** Present when not ok. A stable code, not a sentence: it goes into analytics. */
  error?: string;
}

/**
 * Validate an untrusted body into something safe to write.
 *
 * Unknown keys are dropped rather than rejected, because this runs behind a
 * public endpoint and the point is that it can only ever write these six
 * fields. A body that tries to set `status` or `email` does not fail, it just
 * has no effect, which is the behaviour that stays correct if somebody adds a
 * column to the table later and forgets this file exists.
 *
 * Bad values in known fields do fail, loudly. Silently discarding an answer a
 * customer typed is worse than telling them to try again.
 */
export function parseQualification(body: unknown): ParseResult {
  if (typeof body !== "object" || body === null) return { ok: false, error: "bad_body" };
  const b = body as Record<string, unknown>;
  const out: QualificationAnswers = {};

  const text = (key: string, max: number): string | null | undefined => {
    const v = b[key];
    if (v === undefined) return undefined;
    if (v === null) return null;
    if (typeof v !== "string") return undefined;
    const trimmed = v.trim();
    // An empty string is "they left it blank", which is null, not "".
    if (trimmed === "") return null;
    return trimmed.slice(0, max);
  };

  const company = text("companyName", MAX_TEXT);
  if (company !== undefined) out.companyName = company;

  const notes = text("notes", MAX_NOTES);
  if (notes !== undefined) out.notes = notes;

  if (b.businessType !== undefined) {
    if (b.businessType === null) out.businessType = null;
    else if (typeof b.businessType === "string" && BUSINESS_VALUES.has(b.businessType)) out.businessType = b.businessType;
    else return { ok: false, error: "invalid_business_type" };
  }

  if (b.timeframe !== undefined) {
    if (b.timeframe === null) out.timeframe = null;
    else if (typeof b.timeframe === "string" && TIMEFRAME_VALUES.has(b.timeframe)) out.timeframe = b.timeframe;
    else return { ok: false, error: "invalid_timeframe" };
  }

  if (b.hasStarlink !== undefined) {
    if (b.hasStarlink === null) out.hasStarlink = null;
    else if (typeof b.hasStarlink === "boolean") out.hasStarlink = b.hasStarlink;
    else return { ok: false, error: "invalid_has_starlink" };
  }

  if (b.systems !== undefined) {
    if (b.systems === null) out.systems = null;
    else if (Array.isArray(b.systems)) {
      // Deduplicated and filtered rather than rejected on an unknown id: a
      // stale tab submitting a value we have since renamed should still save
      // the five answers it got right.
      const kept = Array.from(new Set(b.systems.filter((s): s is string => typeof s === "string" && SYSTEM_VALUES.has(s))));
      out.systems = kept.length > 0 ? kept : null;
    } else return { ok: false, error: "invalid_systems" };
  }

  if (Object.keys(out).length === 0) return { ok: false, error: "nothing_to_save" };
  return { ok: true, value: out };
}

/** Column names, kept beside the parser so the two cannot drift. */
export function toColumns(a: QualificationAnswers): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (a.companyName !== undefined) row.company_name = a.companyName;
  if (a.businessType !== undefined) row.business_type = a.businessType;
  if (a.timeframe !== undefined) row.timeframe = a.timeframe;
  if (a.hasStarlink !== undefined) row.has_starlink = a.hasStarlink;
  if (a.systems !== undefined) row.systems = a.systems;
  if (a.notes !== undefined) row.notes = a.notes;
  return row;
}
