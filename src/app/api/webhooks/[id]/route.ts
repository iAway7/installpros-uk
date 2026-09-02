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

interface PatchBody {
  name?: string;
  url?: string;
  secret?: string | null;
  events?: string[];
  format?: string;
  active?: boolean;
}

/** Update an endpoint — rename, re-point, toggle active, change events. */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: "forbidden" }, { status: gate.status });

  let body: PatchBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};
  if (typeof body.name === "string" && body.name.trim()) patch.name = body.name.trim().slice(0, 120);
  if (typeof body.url === "string") {
    try {
      new URL(body.url);
      patch.url = body.url;
    } catch {
      return NextResponse.json({ error: "invalid_url" }, { status: 422 });
    }
  }
  if (body.secret !== undefined) patch.secret = body.secret?.trim() || null;
  if (typeof body.active === "boolean") patch.active = body.active;
  if (typeof body.format === "string") {
    if (!WEBHOOK_FORMATS.includes(body.format as WebhookFormat)) {
      return NextResponse.json({ error: "invalid_format" }, { status: 422 });
    }
    patch.format = body.format;
  }
  if (Array.isArray(body.events)) {
    patch.events = body.events.filter((e): e is WebhookEvent => WEBHOOK_EVENTS.includes(e as WebhookEvent));
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "nothing_to_update" }, { status: 400 });
  }

  const { data, error } = await createServiceClient()
    .from("webhook_endpoints")
    .update(patch)
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ endpoint: data });
}

/** Delete an endpoint. Its delivery log goes with it (on delete cascade). */
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: "forbidden" }, { status: gate.status });

  const { error } = await createServiceClient().from("webhook_endpoints").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
