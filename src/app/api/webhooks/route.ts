import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { WEBHOOK_EVENTS, WEBHOOK_FORMATS, type WebhookEvent, type WebhookFormat } from "@/lib/webhooks/types";

export const runtime = "nodejs";

async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, status: 401 };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return { ok: false as const, status: 403 };
  return { ok: true as const };
}

function validUrl(url: unknown): url is string {
  if (typeof url !== "string") return false;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

/** List endpoints + the most recent deliveries (admin only). */
export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: "forbidden" }, { status: gate.status });

  const supabase = createServiceClient();
  const [{ data: endpoints }, { data: deliveries }] = await Promise.all([
    supabase.from("webhook_endpoints").select("*").order("created_at", { ascending: false }),
    supabase.from("webhook_deliveries").select("*").order("created_at", { ascending: false }).limit(50),
  ]);

  return NextResponse.json({
    endpoints: endpoints ?? [],
    deliveries: deliveries ?? [],
    envConfigured: Boolean(process.env.LEAD_WEBHOOK_URL),
  });
}

interface CreateBody {
  name?: string;
  url?: string;
  secret?: string;
  events?: string[];
  format?: string;
  headers?: Record<string, string>;
}

/** Create an endpoint (admin only). */
export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: "forbidden" }, { status: gate.status });

  let body: CreateBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!body.name?.trim() || !validUrl(body.url)) {
    return NextResponse.json({ error: "validation_failed" }, { status: 422 });
  }

  const events = (body.events ?? WEBHOOK_EVENTS).filter((e): e is WebhookEvent =>
    WEBHOOK_EVENTS.includes(e as WebhookEvent),
  );

  const format: WebhookFormat = WEBHOOK_FORMATS.includes(body.format as WebhookFormat)
    ? (body.format as WebhookFormat)
    : "generic";

  const { data, error } = await createServiceClient()
    .from("webhook_endpoints")
    .insert({
      name: body.name.trim().slice(0, 120),
      url: body.url,
      secret: body.secret?.trim() || null,
      events: events.length ? events : WEBHOOK_EVENTS,
      format,
      headers: body.headers ?? {},
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ endpoint: data });
}
