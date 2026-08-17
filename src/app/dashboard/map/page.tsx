import Link from "next/link";
import { MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { lookupLocations } from "@/lib/dashboard/locations";
import { WON_STATUSES, type LeadStatus } from "@/lib/dashboard/leads";
import { ukMap, UK_MAP_VIEWBOX } from "@/lib/funnel/uk-map";
import { worstServedOutcodes } from "@/lib/broadband/outcodes";

export const dynamic = "force-dynamic";

type View = "leads" | "quoted" | "won";
const VIEWS: Array<{ key: View; label: string }> = [
  { key: "leads", label: "All leads" },
  { key: "quoted", label: "Quoted+" },
  { key: "won", label: "Won" },
];

const QUOTED_OR_LATER: LeadStatus[] = ["quoted", "booked", "installed"];

/** Normalise a district name for fuzzy matching against the SVG region names. */
function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/\b(city of|royal borough of|county of|council|district|borough)\b/g, "")
    .replace(/[^a-z]/g, "");
}

interface DistrictStats {
  name: string;
  leads: number;
  quoted: number;
  won: number;
}

export default async function MapPage({ searchParams }: { searchParams: { view?: string } }) {
  const view: View = (VIEWS.some((v) => v.key === searchParams.view) ? searchParams.view : "leads") as View;

  const supabase = createClient();
  const { data, error } = await supabase.from("leads").select("postcode, status");
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

  const countFor = (d: DistrictStats) => (view === "won" ? d.won : view === "quoted" ? d.quoted : d.leads);

  const regionCounts = new Map<string, { count: number; label: string }>();
  const unmatchedDistricts: string[] = [];
  districts.forEach((d) => {
    const key =
      regionIndex.get(norm(d.name)) ??
      // partial match: "Cornwall" in "Cornwall and Isles of Scilly" etc.
      Array.from(regionIndex.entries()).find(([n]) => n.includes(norm(d.name)) || norm(d.name).includes(n))?.[1];
    if (!key) {
      if (countFor(d) > 0) unmatchedDistricts.push(d.name);
      return;
    }
    const existing = regionCounts.get(key);
    regionCounts.set(key, {
      count: (existing?.count ?? 0) + countFor(d),
      label: d.name,
    });
  });

  const max = Math.max(1, ...Array.from(regionCounts.values()).map((v) => v.count));

  const table = Array.from(districts.values()).sort((a, b) => b.leads - a.leads);

  // Broadband gap list: worst-served outcodes (Ofcom Jan-2025) vs your leads.
  // Zero leads + terrible broadband = cold audience worth targeting with ads.
  const leadsByOutcode = new Map<string, number>();
  for (const l of leads) {
    const ocKey = l.postcode.trim().toUpperCase().split(/\s+/)[0];
    leadsByOutcode.set(ocKey, (leadsByOutcode.get(ocKey) || 0) + 1);
  }
  const gaps = worstServedOutcodes(40, 30)
    .map((o) => ({ ...o, leads: leadsByOutcode.get(o.outcode) ?? 0 }))
    .filter((o) => o.leads === 0)
    .slice(0, 15);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Map</h1>
        <p className="text-muted-foreground">Where your leads come from — and where you close.</p>
      </div>

      <div className="flex gap-1 rounded-lg bg-secondary p-1 w-fit">
        {VIEWS.map((v) => (
          <Link
            key={v.key}
            href={`/dashboard/map?view=${v.key}`}
            className={`rounded-md px-4 py-1.5 text-body-sm font-medium ${
              view === v.key ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {v.label}
          </Link>
        ))}
      </div>

      {error ? (
        <Card><CardContent className="p-6 text-body-sm text-destructive">Couldn&apos;t load leads ({error.message}).</CardContent></Card>
      ) : leads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 p-12 text-center">
            <MapPin className="h-10 w-10 text-muted-foreground" />
            <p className="font-medium">No leads to map yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card>
            <CardContent className="p-4">
              <svg viewBox={UK_MAP_VIEWBOX} className="w-full" role="img" aria-label="UK lead density map">
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
                <span className="ml-2">{VIEWS.find((v) => v.key === view)?.label} per area</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>By district</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm">
                    <thead className="border-y border-border bg-secondary/40 text-left text-label uppercase text-muted-foreground">
                      <tr>
                        <th className="px-4 py-2 font-medium">District</th>
                        <th className="px-3 py-2 text-right font-medium">Leads</th>
                        <th className="px-3 py-2 text-right font-medium">Quoted+</th>
                        <th className="px-3 py-2 text-right font-medium">Won</th>
                        <th className="px-3 py-2 text-right font-medium">Win rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {table.map((d) => {
                        const gap = d.leads >= 3 && d.won === 0;
                        return (
                          <tr key={d.name}>
                            <td className="px-4 py-2">
                              {d.name}
                              {gap && (
                                <span className="ml-2 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-600">
                                  gap
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-right tabular-nums">{d.leads}</td>
                            <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{d.quoted}</td>
                            <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{d.won}</td>
                            <td className="px-3 py-2 text-right tabular-nums">
                              {d.leads ? `${Math.round((d.won / d.leads) * 100)}%` : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {(unmatchedDistricts.length > 0 || unmatchedLeads > 0) && (
              <p className="text-label text-muted-foreground">
                {unmatchedLeads > 0 && `${unmatchedLeads} lead(s) had unresolvable postcodes. `}
                {unmatchedDistricts.length > 0 && `Not drawn on the map: ${unmatchedDistricts.join(", ")}.`}
              </p>
            )}

            <Card>
              <CardHeader><CardTitle>Broadband gaps — ad targets</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm">
                    <thead className="border-y border-border bg-secondary/40 text-left text-label uppercase text-muted-foreground">
                      <tr>
                        <th className="px-4 py-2 font-medium">District</th>
                        <th className="px-3 py-2 text-right font-medium">Can&apos;t get 30Mbps</th>
                        <th className="px-3 py-2 text-right font-medium">Below USO</th>
                        <th className="px-3 py-2 text-right font-medium">Your leads</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {gaps.map((g) => (
                        <tr key={g.outcode}>
                          <td className="px-4 py-2 font-medium">{g.outcode}</td>
                          <td className="px-3 py-2 text-right tabular-nums text-destructive">{Math.round(g.unable30Pct)}%</td>
                          <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{g.belowUsoPct.toFixed(1)}%</td>
                          <td className="px-3 py-2 text-right tabular-nums">{g.leads}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="p-4 text-label text-muted-foreground">
                  Worst fixed-broadband districts in the UK (Ofcom Connected Nations, Jan 2025) where you have zero
                  leads — people who need Starlink but haven&apos;t heard of you. Target these postcodes with ads.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-label text-muted-foreground">
                <span className="font-semibold text-foreground">Gap</span> badge in the district table = 3+ leads, zero
                won — investigate pricing or follow-up in that area.
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
