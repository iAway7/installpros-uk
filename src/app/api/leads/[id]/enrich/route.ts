import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { enrichLead } from "@/lib/intel/enrich";

export const runtime = "nodejs";
export const maxDuration = 30;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Property-intelligence enrichment for one lead.
 *
 * Called fire-and-forget by the funnel right after submit (anonymous), and by
 * the dashboard's "Refresh intel" button (authenticated, may force re-run).
 * Anonymous calls are safe: the endpoint only reads the lead's postcode, only
 * writes derived public data, and is idempotent — a second call is a no-op.
 */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  if (!UUID_RE.test(params.id)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const hasSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!hasSupabase) return NextResponse.json({ ok: false, reason: "no_backend" });

  // force=1 (re-run) is reserved for logged-in team members.
  const force = new URL(request.url).searchParams.get("force") === "1";
  if (force) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await enrichLead(params.id, { force });
  return NextResponse.json(result);
}
