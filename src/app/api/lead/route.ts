import { NextResponse } from "next/server";
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
  service?: string;
  notes?: string;
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
const CAPS = { name: 120, email: 254, phone: 32, postcode: 12, notes: 2000 } as const;

/** Mirrors the install_type enum in 0001_init.sql. */
const INSTALL_TYPES = ["residential", "business", "rural", "marine", "events"];

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
      // Anything else is rejected by the enum anyway — but as a 500 from the
      // failed insert rather than an honest 422.
      b.install_type &&
      INSTALL_TYPES.includes(b.install_type),
  );
}

/**
 * Creates a lead. Writes to Supabase when configured; otherwise returns a
 * generated id so the funnel still works in local/dev without a backend.
 * Server-side is also where you'd forward the lead to email / CRM / WhatsApp.
 */
export async function POST(req: Request) {
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
    const { data, error } = await supabase
      .from("leads")
      .insert({
        name: cap(body.name, CAPS.name),
        email: cap(body.email, CAPS.email),
        phone: cap(body.phone, CAPS.phone),
        postcode: cap(body.postcode, CAPS.postcode).toUpperCase(),
        install_type: body.install_type,
        service: clean(body.service),
        notes: body.notes ? cap(body.notes, CAPS.notes) : null,
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
      })
      .select("id")
      .single();

    if (error) throw error;

    fireLeadCreated(data.id);

    return NextResponse.json({ lead_id: data.id, persisted: true });
  } catch {
    return NextResponse.json({ error: "persist_failed" }, { status: 500 });
  }
}
