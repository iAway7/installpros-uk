import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { internalSignature } from "@/lib/webhooks/internal";

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

function selfOrigin(req: Request): string {
  // Behind Vercel's proxy the forwarded headers are the public origin;
  // req.url can be the internal one. Fall back to it when they're absent.
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  if (host) return `${proto}://${host}`;
  return new URL(req.url).origin;
}

/**
 * Kick off the outbound webhooks without making the visitor wait. The fan-out
 * runs in its own request so a slow receiver can never delay the form's
 * response — same pattern as enrichment. The browser fires
 * /api/leads/{id}/notify as a backstop; dispatch is idempotent, so at most one
 * delivery reaches each destination.
 */
function fireLeadCreated(origin: string, leadId: string): void {
  void fetch(`${origin}/api/webhooks/dispatch`, {
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

function valid(b: Partial<LeadBody>): b is LeadBody {
  return Boolean(
    b.name &&
      b.email &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) &&
      b.phone &&
      b.postcode &&
      b.install_type,
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
        name: body.name,
        email: body.email,
        phone: body.phone,
        postcode: body.postcode.toUpperCase(),
        install_type: body.install_type,
        service: clean(body.service),
        notes: body.notes ?? null,
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

    fireLeadCreated(selfOrigin(req), data.id);

    return NextResponse.json({ lead_id: data.id, persisted: true });
  } catch {
    return NextResponse.json({ error: "persist_failed" }, { status: 500 });
  }
}
