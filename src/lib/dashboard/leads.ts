export type LeadStatus = "new" | "contacted" | "quoted" | "booked" | "installed" | "lost";

export interface Lead {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  postcode: string;
  /** The address the visitor picked, when they came through the autocomplete.
   *  Optional, not just nullable: migration 0017 adds the column, and the
   *  leads query only selects it once that has been applied. Until then these
   *  are absent and the detail panel falls back to the postcode lookup. */
  address?: string | null;
  /** True ticked, false asked and declined, null never asked. */
  marketing_consent?: boolean | null;
  postcode_precision?: string | null;
  sector?: string | null;
  form_name?: string | null;
  /** Post town for that address — the name a person uses, unlike the
   *  admin district a postcode lookup returns. Same caveat as `address`. */
  town?: string | null;
  install_type: string;
  notes: string | null;
  status: LeadStatus;
  traffic_source: string | null;
  campaign: string | null;
  source_url: string | null;
  estimated_value: number | null;
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
  device_type: string | null;
  landing_page: string | null;
  service: string | null;
  contacted_at: string | null;
  quoted_at: string | null;
  lead_score: number | null;
}

/** Tailwind classes for the 1-10 lead-score badge. */
export function scoreStyle(score: number): string {
  if (score >= 8) return "bg-success/15 text-success";
  if (score >= 5) return "bg-amber-500/10 text-amber-600";
  return "bg-muted text-muted-foreground";
}

/** City/region resolved from a postcode (postcodes.io) — not stored in the DB. */
export interface LeadLocation {
  city: string;
  region: string | null;
}

export type LocationMap = Record<string, LeadLocation>;

export const LEAD_STATUSES: LeadStatus[] = ["new", "contacted", "quoted", "booked", "installed", "lost"];

/** Statuses that count as a won/converted deal for conversion-rate maths. */
export const WON_STATUSES: LeadStatus[] = ["booked", "installed"];

export const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  booked: "Booked",
  installed: "Installed",
  lost: "Lost",
};

/** Tailwind classes for each status pill. */
export const STATUS_STYLE: Record<LeadStatus, string> = {
  new: "bg-primary/10 text-primary",
  contacted: "bg-accent/10 text-accent",
  quoted: "bg-amber-500/10 text-amber-600",
  booked: "bg-success/10 text-success",
  installed: "bg-success/15 text-success",
  lost: "bg-muted text-muted-foreground",
};

/** Pull the human-entered service out of the funnel's notes ("Service: X | …"). */
export function serviceFromNotes(notes: string | null): string {
  if (!notes) return "—";
  const m = notes.match(/Service:\s*([^|]+)/i);
  return m ? m[1].trim() : notes.slice(0, 40);
}

/** Service of a lead — dedicated column (0004+) with notes-parsing fallback. */
export function serviceOf(lead: Pick<Lead, "service" | "notes">): string {
  return lead.service?.trim() || serviceFromNotes(lead.notes);
}

/**
 * Readable name for an install_type slug.
 *
 * Needed now that the column holds the real selection: until migration 0019 it
 * was pinned to "residential" on every lead, so a bare capitalize was enough.
 * "mobile_rv" would render as "Mobile_rv".
 */
const INSTALL_TYPE_LABEL: Record<string, string> = {
  residential: "Residential",
  commercial: "Commercial",
  mobile_rv: "Mobile / RV",
  marine: "Marine",
  business: "Business",
  rural: "Rural",
  events: "Events",
};

export function installTypeLabel(slug: string | null | undefined): string {
  if (!slug) return "\u2014";
  return INSTALL_TYPE_LABEL[slug] ?? slug.replace(/_/g, " ");
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" })} at ${d.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit" })}`;
}
