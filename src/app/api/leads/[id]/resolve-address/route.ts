import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { lookupAddresses, fetchPropertyDetail, propaltConfigured } from "@/lib/broadband/propalt";
import { getSetting } from "@/lib/settings/app-settings";

export const runtime = "nodejs";
export const maxDuration = 20;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Resolve a lead's postcode to an exact property via Propalt (on-demand,
 * team-triggered from the lead panel — costs credits, hence never automatic).
 *
 * POST without body        → address candidates for the lead's postcode.
 *                            If exactly one, resolves immediately.
 * POST { property_id }     → resolves that specific choice.
 */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!UUID_RE.test(params.id)) return NextResponse.json({ error: "invalid_id" }, { status: 400 });

  if (!propaltConfigured() || !(await getSetting("propalt_enabled", false))) {
    return NextResponse.json({ error: "propalt_disabled" }, { status: 409 });
  }

  let body: { property_id?: number } = {};
  try {
    body = await request.json();
  } catch {
    /* empty body is fine */
  }

  const admin = createServiceClient();
  const { data: lead } = await admin.from("leads").select("id, postcode").eq("id", params.id).single();
  if (!lead) return NextResponse.json({ error: "lead_not_found" }, { status: 404 });

  let propertyId = typeof body.property_id === "number" ? body.property_id : null;

  if (propertyId === null) {
    const result = await lookupAddresses(String(lead.postcode).trim().toUpperCase());
    if ("fail" in result) {
      return NextResponse.json({ error: "lookup_failed", detail: result.fail }, { status: 502 });
    }
    const candidates = result.addresses;
    if (candidates.length === 0) return NextResponse.json({ candidates: [] });
    if (candidates.length > 1) return NextResponse.json({ candidates });
    propertyId = candidates[0].property_id;
  }

  const prop = await fetchPropertyDetail(propertyId);
  if (!prop) return NextResponse.json({ error: "property_fetch_failed" }, { status: 502 });

  // Merge property-level facts into lead_intel (upsert in case not enriched yet).
  const { error } = await admin.from("lead_intel").upsert(
    {
      lead_id: lead.id,
      postcode: String(lead.postcode).trim().toUpperCase(),
      resolved_address: prop.address,
      uprn: prop.uprn,
      propalt_property_id: propertyId,
      avm_value: prop.avm,
      bedrooms: prop.bedrooms,
      tax_band: prop.taxBand,
      // Property-level values beat street-level aggregates where present:
      ...(prop.propertyType ? { property_type: prop.propertyType } : {}),
      ...(prop.floorAreaSqm != null ? { floor_area_sqm: prop.floorAreaSqm } : {}),
      ...(prop.energyRating ? { energy_rating: prop.energyRating } : {}),
      ...(prop.constructionAge ? { construction_age: prop.constructionAge } : {}),
    },
    { onConflict: "lead_id" },
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ resolved: true, address: prop.address, avm: prop.avm });
}
