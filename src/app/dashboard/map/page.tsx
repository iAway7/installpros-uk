import Link from "next/link";
import { MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/system/card";
import { lookupLocations } from "@/lib/dashboard/locations";
import { WON_STATUSES, type LeadStatus } from "@/lib/dashboard/leads";
import { ukMap, UK_MAP_VIEWBOX } from "@/lib/funnel/uk-map";
import { InfoTip } from "@/components/system/info-tip";
import { worstServedOutcodes, releaseLabel } from "@/lib/broadband/outcode-coverage";

export const dynamic = "force-dynamic";

type View = "leads" | "quoted" | "won";
const VIEWS: Array<{ key: View; label: string }> = [
  { key: "leads", label: "All leads" },
  { key: "quoted", label: "Quoted+" },
  { key: "won", label: "Won" },
];

const QUOTED_OR_LATER: LeadStatus[] = ["quoted", "booked", "installed"];

/**
 * A district average is only as good as the number of postcodes behind it.
 * Below this, one airport terminal or industrial estate (TW6 = Heathrow, 109
 * postcodes, 98% with no 30 Mbit/s) outranks every genuinely rural district in
 * the country, and none of those premises is a house anyone lives in.
 */
const MIN_POSTCODES = 150;

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

  // Broadband gap list: the worst-served postcode districts in the country
  // (our own copy of the Ofcom Connected Nations open data) set against where
  // our leads actually come from. Bad coverage with zero leads is demand that
  // has never heard of us, which is exactly what an ad campaign is for.
  const leadsByOutcode = new Map<string, number>();
  for (const l of leads) {
    const oc = outcodeOf(l.postcode);
    leadsByOutcode.set(oc, (leadsByOutcode.get(oc) || 0) + 1);
  }
  const worst = await worstServedOutcodes(supabase, { limit: 12, minPostcodes: MIN_POSTCODES });
  const gaps = worst.map((c) => ({ ...c, leads: leadsByOutcode.get(c.outcode) ?? 0 }));
  const gapsRelease = releaseLabel(gaps[0]?.release);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Map</h1>
        <p className="text-muted-foreground">Where your leads come from, and where you close.</p>
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
        <Card><CardContent className="text-body-sm text-destructive">Couldn&apos;t load leads ({error.message}).</CardContent></Card>
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
              <CardHeader><CardTitle>Broadband gaps: ad targets</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm">
                    <thead className="border-y border-border bg-secondary/40 text-left text-label uppercase text-muted-foreground">
                      <tr>
                        <th className="px-4 py-2 font-medium">
                          <span className="inline-flex items-center gap-1">
                            District
                            <InfoTip
                              text="Postcode district: the part before the space, like EX21. Ofcom publishes coverage per full postcode, so each row here is the average of every postcode in that district."
                              source="Ofcom Connected Nations"
                            />
                          </span>
                        </th>
                        <th className="px-3 py-2 text-right font-medium">
                          <span className="inline-flex items-center justify-end gap-1">
                            No 10Mb
                            <InfoTip
                              align="end"
                              text="Homes that cannot order a 10 Mbit/s line at any price. That is below the UK legal minimum, so these homes can claim a subsidised connection. Your strongest sales case."
                              source="Ofcom Connected Nations"
                            />
                          </span>
                        </th>
                        <th className="px-3 py-2 text-right font-medium">
                          <span className="inline-flex items-center justify-end gap-1">
                            No 30Mb
                            <InfoTip
                              align="end"
                              text="Homes that cannot get 30 Mbit/s, the UK definition of superfast. Enough for one video stream, not for a family or for working from home."
                              source="Ofcom Connected Nations"
                            />
                          </span>
                        </th>
                        <th className="px-3 py-2 text-right font-medium">
                          <span className="inline-flex items-center justify-end gap-1">
                            Postcodes
                            <InfoTip
                              align="end"
                              text="How many postcodes the district average is built from. More postcodes means a more reliable figure. Districts under 150 are excluded."
                              source="Ofcom Connected Nations"
                            />
                          </span>
                        </th>
                        <th className="px-3 py-2 text-right font-medium">
                          <span className="inline-flex items-center justify-end gap-1">
                            Leads
                            <InfoTip
                              align="end"
                              text="Your leads from this district so far. Terrible broadband plus zero leads is an audience that needs you and has never heard of you."
                            />
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {gaps.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                            Ofcom coverage data not loaded yet.
                          </td>
                        </tr>
                      ) : (
                        gaps.map((g) => (
                          <tr key={g.outcode}>
                            <td className="px-4 py-2 font-medium">
                              {g.outcode}
                              {g.leads === 0 && (
                                <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
                                  untapped
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-right tabular-nums text-destructive">
                              {g.pctUnable10 == null ? "\u2014" : `${g.pctUnable10}%`}
                            </td>
                            <td className="px-3 py-2 text-right tabular-nums">
                              {g.pctUnable30 == null ? "\u2014" : `${g.pctUnable30}%`}
                            </td>
                            <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{g.postcodes}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{g.leads}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <p className="px-4 pt-4 text-label text-muted-foreground">
                  Worst-served postcode districts in the UK, ranked by how many homes fall below the legal 10 Mbit/s
                  minimum. Source: Ofcom Connected Nations, {gapsRelease}.
                </p>
                <p className="px-4 pb-4 text-label text-muted-foreground">
                  These are <span className="font-medium text-foreground">availability</span> figures: what a home is
                  able to order, not the speed it actually gets. A district marked{" "}
                  <span className="font-medium text-foreground">untapped</span> has bad broadband and not one lead, so
                  point ads at it.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-label text-muted-foreground">
                <span className="font-semibold text-foreground">Gap</span> badge in the district table = 3+ leads, zero
                won. Investigate pricing or follow-up in that area.
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
