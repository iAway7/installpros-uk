import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  LEAD_SEARCH_COLUMNS,
  LEAD_SEARCH_LIMIT,
  leadSearchFilter,
  type LeadSearchResult,
} from "@/lib/dashboard/lead-search";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Lead search for the dashboard's top bar: `{ q }` against name, email, phone
 * and postcode, newest first, a handful of rows.
 *
 * A POST although it only reads: what gets typed here is a person's name or
 * phone number, and a query string would leave it in the request logs.
 *
 * Signed-in team only, and read with the caller's own session, so it returns
 * what the Leads page already shows them and nothing RLS would hide.
 */
export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let q: unknown;
  try {
    q = ((await request.json()) as { q?: unknown }).q;
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }
  const filter = typeof q === "string" ? leadSearchFilter(q) : null;
  if (!filter) return NextResponse.json({ leads: [] });

  const { data, error } = await supabase
    .from("leads")
    .select(LEAD_SEARCH_COLUMNS)
    .or(filter)
    .order("created_at", { ascending: false })
    .limit(LEAD_SEARCH_LIMIT);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ leads: (data as unknown as LeadSearchResult[] | null) ?? [] });
}
