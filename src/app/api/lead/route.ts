import { NextResponse } from "next/server";
import { rateLimit, LIMITS } from "@/lib/rate-limit";
import { isValidUkPostcode, normalisePostcode } from "@/lib/utils";
import { createServiceClient } from "@/lib/supabase/server";
import { internalSignature } from "@/lib/webhooks/internal";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";

interface LeadBody {
  name: string;
  email: string;
  phone: string;
  postcode: string;
  install_type: string;
  address?: string;
  town?: string;
  service?: string;
  notes?: string | null;
  marketing_consent?: boolean | null;
  postcode_precision?: "exact" | "approximate" | "none" | null;
  sector?: string;
  form_name?: string;
  /** Ajax forms only (migration 0022): alarm | cameras | both. */
  need?: string;
  /** Ajax forms only, optional (migration 0022): new | add | repair. */
  intent?: string;
  /** Hikvision forms only (migration 0024): the planner's plan, one line. */
  camera_plan?: string;
  meta?: {
    traffic_source?: string | null;
    campaign?: string | null;
    page_url?: string | null;
    device_type?: string | null;
    landing_page?: string | null;
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
    utm_term?: string | null;
    utm_content?: string | null;
    gclid?: string | null;
    fbclid?: string | null;
    session_id?: string | null;
    variant_id?: string | null;
    experiment_id?: string | null;
  };
}

/**
 * Kick off the outbound webhooks without making the visitor wait. The fan-out
 * runs in its own request so a slow receiver can never delay the form's
 * response — same pattern as enrichment. The browser fires
 * /api/leads/{id}/notify as a backstop; dispatch is idempotent, so at most one
 * delivery reaches each destination.
 *
 * The target origin comes from NEXT_PUBLIC_SITE_URL, never from the request.
 * This used to derive it from x-forwarded-host / host, which a visitor sets
 * freely: `Host: evil.com` made us POST the lead fan-out to the attacker —
 * carrying a valid x-internal-signature — turning lead submission into an
 * SSRF primitive. siteConfig.url is the same origin metadataBase and the auth
 * callback already trust.
 */
function fireLeadCreated(leadId: string): void {
  void fetch(`${siteConfig.url}/api/webhooks/dispatch`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-signature": internalSignature("lead.created", leadId),
    },
    body: JSON.stringify({ event: "lead.created", leadId }),
    keepalive: true,
  }).catch(() => {});
}

/** Trim + cap attribution strings so hostile query params can't bloat rows. */
function clean(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t ? t.slice(0, 255) : null;
}

/**
 * Length ceilings for the visitor-supplied fields.
 *
 * Every one of these columns is an unbounded `text` in Postgres and the route
 * runs under the service role, so whatever the form posts is what gets stored.
 * `clean()` already caps the attribution metadata; these are the fields it
 * never touched — `notes` in particular accepted a payload of any size.
 * Generous enough that no real submission is affected.
 */
const CAPS = {
  name: 120, email: 254, phone: 32, postcode: 12, notes: 2000,
  address: 300, town: 100, sector: 80, form_name: 80, camera_plan: 300,
} as const;

/**
 * Mirrors the install_type check in 0019, widened by 0021 for `security`
 * (the Ajax landing). The first five are what the landings actually submit;
 * the rest are the old enum's vocabulary, kept accepted so nothing that
 * predates the change is refused.
 */
const INSTALL_TYPES = ["residential", "commercial", "mobile_rv", "marine", "security", "business", "rural", "events"];

const PRECISIONS = ["exact", "approximate", "none"];

function cap(v: string, max: number): string {
  return v.trim().slice(0, max);
}

function valid(b: Partial<LeadBody>): b is LeadBody {
  return Boolean(
    b.name &&
      b.email &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) &&
      b.email.length <= CAPS.email &&
      b.phone &&
      b.postcode &&
      // Not just "present". The postcode is the key every downstream lookup
      // runs on (Propalt, the Ofcom outcode join, EPC, value band, crime), and
      // the address autocomplete used to send the whole formatted address here
      // when Google gave no postal_code, which `cap()` then silently truncated
      // to "DE LA BERE A". A 422 is louder and cheaper than a row of junk that
      // looks like data. Both funnels now block before this, so the only way to
      // trip it is a broken client or a bot.
      isValidUkPostcode(normalisePostcode(b.postcode)) &&
      // The check constraint would reject anything else anyway, but as a 500
      // from the failed insert rather than an honest 422.
      b.install_type &&
      INSTALL_TYPES.includes(b.install_type) &&
      (b.postcode_precision == null || PRECISIONS.includes(b.postcode_precision)),
  );
}

/**
 * Creates a lead. Writes to Supabase when configured; otherwise returns a
 * generated id so the funnel still works in local/dev without a backend.
 * Server-side is also where you'd forward the lead to email / CRM / WhatsApp.
 */
const NEEDS = new Set(["alarm", "cameras", "both"]);
const INTENTS = new Set(["new", "add", "repair"]);

/** Postgres "undefined column", or PostgREST not finding it in its cache. */
function isMissingColumn(error: { code?: string; message?: string }): boolean {
  return error.code === "42703" || error.code === "PGRST204" || /column/i.test(error.message ?? "");
}

export async function POST(req: Request) {
  const limited = rateLimit(req, LIMITS.lead);
  if (limited) return limited;

  let body: Partial<LeadBody>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!valid(body)) {
    return NextResponse.json({ error: "validation_failed" }, { status: 422 });
  }

  const hasSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!hasSupabase) {
    return NextResponse.json({ lead_id: `local_${crypto.randomUUID()}`, persisted: false });
  }

  try {
    const supabase = createServiceClient();
    const row = {
      name: cap(body.name, CAPS.name),
      email: cap(body.email, CAPS.email),
      phone: cap(body.phone, CAPS.phone),
      postcode: cap(normalisePostcode(body.postcode), CAPS.postcode),
      install_type: body.install_type,
      address: body.address ? cap(body.address, CAPS.address) : null,
      town: body.town ? cap(body.town, CAPS.town) : null,
      service: clean(body.service),
      notes: body.notes ? cap(body.notes, CAPS.notes) : null,
      // Null means nobody was asked; false means asked and declined. Keep the
      // two apart: collapsing them loses the only evidence of which it was.
      marketing_consent: typeof body.marketing_consent === "boolean" ? body.marketing_consent : null,
      consent_at: typeof body.marketing_consent === "boolean" ? new Date().toISOString() : null,
      postcode_precision: body.postcode_precision ?? null,
      sector: body.sector ? cap(body.sector, CAPS.sector) : null,
      form_name: body.form_name ? cap(body.form_name, CAPS.form_name) : null,
      device_type: clean(body.meta?.device_type),
      landing_page: clean(body.meta?.landing_page),
      traffic_source: clean(body.meta?.traffic_source),
      campaign: clean(body.meta?.campaign),
      source_url: clean(body.meta?.page_url),
      utm_source: clean(body.meta?.utm_source),
      utm_medium: clean(body.meta?.utm_medium),
      utm_campaign: clean(body.meta?.utm_campaign),
      utm_term: clean(body.meta?.utm_term),
      utm_content: clean(body.meta?.utm_content),
      gclid: clean(body.meta?.gclid),
      fbclid: clean(body.meta?.fbclid),
      session_id: clean(body.meta?.session_id),
      variant_id: clean(body.meta?.variant_id),
      experiment_id: clean(body.meta?.experiment_id),
      status: "new",
    };
    // The two Ajax answers (migration 0022) and the Hikvision camera plan
    // (0024), added only when they hold a value, so every other lead inserts
    // exactly as before.
    const extra: { need?: string; intent?: string; camera_plan?: string } = {};
    if (body.need && NEEDS.has(body.need)) extra.need = body.need;
    if (body.intent && INTENTS.has(body.intent)) extra.intent = body.intent;
    if (body.camera_plan) extra.camera_plan = cap(body.camera_plan, CAPS.camera_plan);

    let { data, error } = await supabase.from("leads").insert({ ...row, ...extra }).select("id").single();
    // If 0022 or 0024 has not been applied the columns do not exist yet.
    // Losing the lead over optional answers would be the wrong trade, so it
    // is saved without them.
    if (error && Object.keys(extra).length > 0 && isMissingColumn(error)) {
      ({ data, error } = await supabase.from("leads").insert(row).select("id").single());
    }

    if (error || !data) throw error ?? new Error("no_row");

    fireLeadCreated(data.id);

    return NextResponse.json({ lead_id: data.id, persisted: true });
  } catch {
    return NextResponse.json({ error: "persist_failed" }, { status: 500 });
  }
}
