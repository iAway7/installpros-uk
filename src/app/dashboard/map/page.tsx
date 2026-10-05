import { MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/system/card";
import { lookupLocations } from "@/lib/dashboard/locations";
import { WON_STATUSES, type LeadStatus } from "@/lib/dashboard/leads";
import { ukMap, UK_MAP_VIEWBOX } from "@/lib/funnel/uk-map";
import { worstServedOutcodes, releaseLabel } from "@/lib/broadband/outcode-coverage";
import { EmptyState } from "@/components/system/empty-state";
import { PageHeader } from "@/components/system/page-header";
import { MapTables, type MapTab } from "@/components/dashboard/map-tables";

export const dynamic = "force-dynamic";

const QUOTED_OR_LATER: LeadStatus[] = ["quoted", "booked", "installed"];

/**
 * A district average is only as good as the number of postcodes behind it.
 * Below this, one airport terminal or industrial estate (TW6 = Heathrow, 109
 * postcodes, 98% with no 30 Mbit/s) outranks every genuinely rural district in
 * the country, and none of those premises is a house anyone lives in.
 */
const MIN_POSTCODES = 150;

/** How many of the worst-served districts the ad-target tab pages through. */
const GAP_ROWS = 200;

/** Normalise a district name for fuzzy matching against the SVG region names. */
function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/\b(city of|royal borough of|county of|council|district|borough)\b/g, "")
    .replace(/[^a-z]/g, "");
}

/** "LS18 5QB", "ls185qb" → "LS18". Lead postcodes are stored in both shapes. */
function outcodeOf(postcode: string): string {
  const pc = postcode.replace(/\s+/g, "").toUpperCase();
  return pc.length > 3 ? pc.slice(0, -3) : pc;
}

interface DistrictStats {
  name: string;
  leads: number;
  quoted: number;
  won: number;
}

export default async function MapPage({ searchParams }: { searchParams: { tab?: string } }) {
  const initialTab: MapTab = searchParams.tab === "gaps" ? "gaps" : "districts";
  const supabase = createClient();
  const { data, error } = await supabase.from("leads").select("postcode, status").eq("is_test", false);
  const leads = ((data as { postcode: string; status: LeadStatus }[] | null) ?? []);

  const locations = error ? {} : await lookupLocations(leads.map((l) => l.postcode));

  // Aggregate per admin district.
  const districts = new Map<string, DistrictStats>();
  let unmatchedLeads = 0;
  for (const l of leads) {
    const loc = locations[l.postcode.trim().toUpperCase()];
    if (!loc?.city) {
      unmatchedLeads++;
      continue;
    }
    const d = districts.get(loc.city) ?? { name: loc.city, leads: 0, quoted: 0, won: 0 };
    d.leads++;
    if (QUOTED_OR_LATER.includes(l.status)) d.quoted++;
    if (WON_STATUSES.includes(l.status)) d.won++;
    districts.set(loc.city, d);
  }

  // Match district names to SVG regions.
  const regionIndex = new Map<string, string>(); // norm(name) -> svg key
  for (const [key, region] of Object.entries(ukMap)) regionIndex.set(norm(region.name), key);

  const regionCounts = new Map<string, { count: number; label: string }>();
  const unmatchedDistricts: string[] = [];
  districts.forEach((d) => {
    const key =
      regionIndex.get(norm(d.name)) ??
      // partial match: "Cornwall" in "Cornwall and Isles of Scilly" etc.
      Array.from(regionIndex.entries()).find(([n]) => n.includes(norm(d.name)) || norm(d.name).includes(n))?.[1];
    if (!key) {
      if (d.leads > 0) unmatchedDistricts.push(d.name);
      return;
    }
    const existing = regionCounts.get(key);
    regionCounts.set(key, {
      count: (existing?.count ?? 0) + d.leads,
      label: d.name,
    });
  });

  const max = Math.max(1, ...Array.from(regionCounts.values()).map((v) => v.count));

  const table = Array.from(districts.values()).sort((a, b) => b.leads - a.leads);

  // Broadband gap list: the worst-served postcode districts in the country
  // (our own copy of the Ofcom Connected Nations open data) set against where
  // our leads actually come from. Bad coverage with zero leads is demand that
  // has never heard of us, which is exactly what an ad campaign is for.
  const leadsByOutcode = new Map<string, number>();
  for (const l of leads) {
    const oc = outcodeOf(l.postcode);
    leadsByOutcode.set(oc, (leadsByOutcode.get(oc) || 0) + 1);
  }
  const worst = await worstServedOutcodes(supabase, { limit: GAP_ROWS, minPostcodes: MIN_POSTCODES });
  const gaps = worst.map((c) => ({ ...c, leads: leadsByOutcode.get(c.outcode) ?? 0 }));
  const gapsRelease = releaseLabel(gaps[0]?.release);

  const unmatchedNote =
    [
      unmatchedLeads > 0 ? `${unmatchedLeads} lead(s) had unresolvable postcodes.` : "",
      unmatchedDistricts.length > 0 ? `Not drawn on the map: ${unmatchedDistricts.join(", ")}.` : "",
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Map" description="Where your leads come from, and where you close." />

      {error ? (
        <Card><CardContent className="text-body-sm text-destructive">Couldn&apos;t load leads ({error.message}).</CardContent></Card>
      ) : leads.length === 0 ? (
        <EmptyState
          icon={<MapPin />}
          title="No leads to map yet"
          description="Each lead lands on its postcode area as it comes in."
        />
      ) : (
        <div className="space-y-6">
          <Card>
            <CardContent className="flex flex-col items-center p-4">
              <svg viewBox={UK_MAP_VIEWBOX} className="w-full max-w-xl" role="img" aria-label="UK lead density map">
                {Object.entries(ukMap).map(([key, region]) => {
                  const hit = regionCounts.get(key);
                  const intensity = hit ? 0.25 + 0.75 * (hit.count / max) : 0;
                  return (
                    <path
                      key={key}
                      d={region.dimensions}
                      className={hit ? "fill-primary stroke-background" : "fill-secondary stroke-background"}
                      fillOpacity={hit ? intensity : 1}
                      strokeWidth={0.5}
                    >
                      <title>{`${region.name}${hit ? `: ${hit.count}` : ""}`}</title>
                    </path>
                  );
                })}
              </svg>
              <div className="mt-3 flex items-center gap-2 text-label text-muted-foreground">
                <span>0</span>
                <div className="h-2 w-32 rounded-full bg-gradient-to-r from-secondary via-primary/40 to-primary" />
                <span>{max}</span>
                <span className="ml-2">Leads per area</span>
              </div>
            </CardContent>
          </Card>

          <MapTables
            districts={table}
            gaps={gaps.map(({ outcode, postcodes, pctUnable10, pctUnable30, leads }) => ({ outcode, postcodes, pctUnable10, pctUnable30, leads }))}
            gapsRelease={gapsRelease}
            unmatchedNote={unmatchedNote}
            initialTab={initialTab}
          />
        </div>
      )}
    </div>
  );
}
