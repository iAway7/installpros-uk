/**
 * Turns what someone types into the dashboard search into a PostgREST `or`
 * filter over the leads table: name, email, phone and postcode, or the lead's
 * id when a whole one is pasted.
 *
 * Pure, so the awkward part (what the stored values look like, and what is
 * safe to put inside a filter string) can be checked without a database.
 *
 * How the values are stored, measured on 17 November 2026 over 2,159 leads:
 *   phone     digits only, no spaces (all but 2), almost all starting 0
 *   postcode  upper case with the space, "AB12 3CD"
 * So a phone is matched on its digits, with +44 and 0044 folded to the leading
 * 0, and a postcode typed without its space still finds the spaced one.
 */

export interface LeadSearchResult {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string;
  postcode: string;
  install_type: string | null;
  is_test: boolean | null;
}

/** The columns the search returns, and nothing else. */
export const LEAD_SEARCH_COLUMNS = "id, created_at, name, phone, email, postcode, install_type, is_test";

export const LEAD_SEARCH_MIN_CHARS = 2;
export const LEAD_SEARCH_LIMIT = 8;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** A whole UK postcode with no space in it: outward code, then digit + 2 letters. */
const COMPACT_POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$/i;

/**
 * Characters with a meaning inside a filter: the LIKE wildcards (% _ and
 * PostgREST's *), the list syntax (, ( )) and the quoting (" \). They are
 * dropped, not escaped: nobody's name needs them, and a filter that can only
 * hold letters, digits and plain punctuation has nothing to get wrong.
 */
function tidy(raw: string): string {
  return raw
    .normalize("NFKC")
    .replace(/[%_*,()"\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

/** The filter for `.or()`, or null when there is not enough to search on. */
export function leadSearchFilter(raw: string): string | null {
  const q = tidy(raw);
  if (q.length < LEAD_SEARCH_MIN_CHARS) return null;

  if (UUID_RE.test(q)) return `id.eq.${q.toLowerCase()}`;

  // "jane smi" finds "Jane Smith" and "janesmith@...": the words, in order.
  const words = `%${q.replace(/ /g, "%")}%`;
  const parts = [`name.ilike."${words}"`, `email.ilike."${words}"`, `postcode.ilike."${words}"`];

  const compact = q.replace(/ /g, "");
  if (COMPACT_POSTCODE_RE.test(compact)) {
    // "AB123CD" as typed; the inward code is always the last three characters.
    parts.push(`postcode.ilike."${compact.slice(0, -3)}%${compact.slice(-3)}"`);
  }

  // A phone: digits with nothing but spacing and dialling punctuation around.
  if (/^[\d\s+.-]+$/.test(q)) {
    let digits = q.replace(/\D/g, "");
    if (digits.startsWith("0044")) digits = `0${digits.slice(4)}`;
    else if (digits.startsWith("44") && digits.length >= 11) digits = `0${digits.slice(2)}`;
    if (digits.length >= 3) parts.push(`phone.ilike."%${digits}%"`);
  }

  return parts.join(",");
}
