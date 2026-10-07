import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { rateLimit, LIMITS } from "@/lib/rate-limit";
import { parseQualification, toColumns } from "@/lib/funnel/qualification";

export const runtime = "nodejs";

/** A lead id is a gen_random_uuid(). Checking the shape before touching the
 *  database turns a scan into a cheap 400 rather than a query per guess. */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Save the post-submit qualification answers onto an existing lead.
 *
 * Public by necessity: it is called from /thank-you-commercial, where the
 * visitor has just converted and has no account and never will. Authorisation
 * is the lead id itself, which is a random v4 UUID handed to this one browser
 * on the redirect. That is the capability-URL pattern, the same thing an
 * unsubscribe link relies on, and it is sound here for three reasons:
 *
 *  - 122 bits of entropy. Guessing one is not a thing that happens.
 *  - The route can only ever write the six columns in `toColumns`. A body that
 *    tries to set status, email or estimated_value is parsed into nothing.
 *    This is why the parser allowlists instead of rejecting unknown keys: the
 *    guarantee then survives somebody adding a column and not reading this.
 *  - It never reads anything back. There is no GET, and a successful response
 *    says "ok", not what the lead contains. So a leaked id cannot be turned
 *    into a way to look up a customer's phone number.
 *
 * Single write, enforced by qualified_at. A customer who refreshes and submits
 * again, a double-tapped button, or a link forwarded to a colleague cannot
 * overwrite answers that are already saved. The second call is told `already`
 * so the page can show the answered state rather than an error, because from
 * the visitor's side nothing went wrong.
 *
 * The authenticated PATCH on /api/leads/[id] is deliberately not reused. It
 * takes a dashboard session and can set status and estimated_value, neither of
 * which should be reachable from a public page.
 */
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const limited = rateLimit(req, LIMITS.qualify);
  if (limited) return limited;

  if (!UUID.test(params.id)) {
    return NextResponse.json({ error: "bad_id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = parseQualification(body);
  if (!parsed.ok || !parsed.value) {
    return NextResponse.json({ error: parsed.error ?? "validation_failed" }, { status: 422 });
  }

  const hasSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Local and preview have no backend, and the funnel has to stay walkable
  // there. Same contract as /api/lead, which reports persisted: false.
  if (!hasSupabase) {
    return NextResponse.json({ ok: true, persisted: false });
  }

  try {
    const supabase = createServiceClient();

    // The null guard is in the WHERE clause, not in a read-then-write. Two
    // submits landing together would both pass a prior SELECT and the second
    // would clobber the first; as one conditional UPDATE, the database decides
    // and the loser writes nothing. `select("id")` is what makes the outcome
    // legible: zero rows back means either no such lead or already answered.
    const { data, error } = await supabase
      .from("leads")
      .update({ ...toColumns(parsed.value), qualified_at: new Date().toISOString() })
      .eq("id", params.id)
      .is("qualified_at", null)
      .select("id");

    if (error) {
      // Logged, not returned. The visitor gets "save_failed" and a WhatsApp
      // route; the reason belongs in the server log, where a missing column or
      // a failed check constraint is the difference between a bug and a lead
      // typing something we did not expect. Without this the only trace of a
      // broken endpoint is a 500 with no cause, which is what this route
      // originally shipped as.
      console.error(`[leads/qualify] update failed for ${params.id}:`, error.message);
      return NextResponse.json({ error: "save_failed" }, { status: 500 });
    }

    if (!data || data.length === 0) {
      // Deliberately the same response either way. Telling an unknown id apart
      // from an already-answered one would turn this into an oracle for
      // whether a given uuid is a real lead.
      return NextResponse.json({ ok: true, already: true });
    }

    return NextResponse.json({ ok: true, persisted: true });
  } catch (e) {
    console.error(`[leads/qualify] threw for ${params.id}:`, e);
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }
}
