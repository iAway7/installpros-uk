"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/system/card";
import { Tabs } from "@/components/system/tabs";
import { Pagination } from "@/components/system/pagination";
import { InfoTip } from "@/components/system/info-tip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/system/select";

export interface DistrictRow {
  name: string;
  leads: number;
  quoted: number;
  won: number;
}

export interface GapRow {
  outcode: string;
  postcodes: number;
  pctUnable10: number | null;
  pctUnable30: number | null;
  leads: number;
}

export type MapTab = "districts" | "gaps";

const PAGE_SIZES = [10, 20, 50] as const;
const DEFAULT_PAGE_SIZE = 20;

/**
 * The two lists under the map, one at a time. The tab is mirrored into
 * `?tab=` with history.replaceState, so a view stays linkable without a
 * server round-trip on every switch.
 */
export function MapTables({
  districts,
  gaps,
  gapsRelease,
  unmatchedNote,
  initialTab,
}: {
  districts: DistrictRow[];
  gaps: GapRow[];
  gapsRelease: string;
  /** Leads or districts that could not be placed on the map, if any. */
  unmatchedNote?: string;
  initialTab: MapTab;
}) {
  const [tab, setTab] = useState<MapTab>(initialTab);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);

  const rows = tab === "districts" ? districts.length : gaps.length;
  const totalPages = Math.max(1, Math.ceil(rows / pageSize));
  const from = (page - 1) * pageSize;
  const to = Math.min(rows, from + pageSize);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState(null, "", url);
  }, [tab]);

  const untapped = gaps.filter((g) => g.leads === 0).length;

  return (
    <Card>
      <Tabs
        label="Map breakdown"
        className="px-2"
        selected={tab}
        onSelect={(v) => { setTab(v as MapTab); setPage(1); }}
        tabs={[
          { title: "By district", value: "districts", badge: districts.length || undefined },
          { title: "Broadband gaps: ad targets", value: "gaps", badge: untapped ? `${untapped} untapped` : undefined },
        ]}
      />

      <CardContent className="p-0" role="tabpanel">
        {tab === "districts" ? (
          <DistrictTable rows={districts.slice(from, to)} />
        ) : (
          <GapTable rows={gaps.slice(from, to)} />
        )}

        {rows > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
            <div className="flex items-center gap-3 text-label text-muted-foreground">
              <span className="tabular-nums">
                {from + 1}–{to} of {rows}
              </span>
              <span aria-hidden>·</span>
              <label className="flex items-center gap-2">
                Rows per page
                <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
                  <SelectTrigger className="h-8 w-[4.5rem] text-body-sm" aria-label="Rows per page">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZES.map((n) => (
                      <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}

        <div className="space-y-2 border-t border-border px-4 py-4 text-label text-muted-foreground">
          {tab === "districts" ? (
            <>
              <p>
                <span className="font-semibold text-foreground">Gap</span> badge = 3+ leads, zero won. Investigate
                pricing or follow-up in that area.
              </p>
              {unmatchedNote && <p>{unmatchedNote}</p>}
            </>
          ) : (
            <>
              <p>
                Worst-served postcode districts in the UK, ranked by how many homes fall below the legal 10 Mbit/s
                minimum. Source: Ofcom Connected Nations, {gapsRelease}.
              </p>
              <p>
                These are <span className="font-medium text-foreground">availability</span> figures: what a home is
                able to order, not the speed it actually gets. A district marked{" "}
                <span className="font-medium text-foreground">untapped</span> has bad broadband and not one lead, so
                point ads at it.
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const TH = "px-3 py-2 text-right font-medium";
const HEAD = "border-b border-border bg-secondary/40 text-left text-label uppercase text-muted-foreground";

function DistrictTable({ rows }: { rows: DistrictRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-body-sm">
        <thead className={HEAD}>
          <tr>
            <th className="px-4 py-2 font-medium">District</th>
            <th className={TH}>Leads</th>
            <th className={TH}>Quoted+</th>
            <th className={TH}>Won</th>
            <th className={TH}>Win rate</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((d) => {
            const gap = d.leads >= 3 && d.won === 0;
            return (
              <tr key={d.name}>
                <td className="px-4 py-2">
                  {d.name}
                  {gap && (
                    <span className="ml-2 rounded-full bg-warning/10 px-2 py-0.5 text-micro font-semibold uppercase text-warning">
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
  );
}

function HeadTip({ children, text, source, end }: { children: React.ReactNode; text: string; source?: string; end?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 ${end ? "justify-end" : ""}`}>
      {children}
      <InfoTip align={end ? "end" : undefined} text={text} source={source} />
    </span>
  );
}

function GapTable({ rows }: { rows: GapRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-body-sm">
        <thead className={HEAD}>
          <tr>
            <th className="px-4 py-2 font-medium">
              <HeadTip
                text="Postcode district: the part before the space, like EX21. Ofcom publishes coverage per full postcode, so each row here is the average of every postcode in that district."
                source="Ofcom Connected Nations"
              >
                District
              </HeadTip>
            </th>
            <th className={TH}>
              <HeadTip
                end
                text="Homes that cannot order a 10 Mbit/s line at any price. That is below the UK legal minimum, so these homes can claim a subsidised connection. Your strongest sales case."
                source="Ofcom Connected Nations"
              >
                No 10Mb
              </HeadTip>
            </th>
            <th className={TH}>
              <HeadTip
                end
                text="Homes that cannot get 30 Mbit/s, the UK definition of superfast. Enough for one video stream, not for a family or for working from home."
                source="Ofcom Connected Nations"
              >
                No 30Mb
              </HeadTip>
            </th>
            <th className={TH}>
              <HeadTip
                end
                text="How many postcodes the district average is built from. More postcodes means a more reliable figure. Districts under 150 are excluded."
                source="Ofcom Connected Nations"
              >
                Postcodes
              </HeadTip>
            </th>
            <th className={TH}>
              <HeadTip
                end
                text="Your leads from this district so far. Terrible broadband plus zero leads is an audience that needs you and has never heard of you."
              >
                Leads
              </HeadTip>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                Ofcom coverage data not loaded yet.
              </td>
            </tr>
          ) : (
            rows.map((g) => (
              <tr key={g.outcode}>
                <td className="px-4 py-2 font-medium">
                  {g.outcode}
                  {g.leads === 0 && (
                    <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-micro font-semibold uppercase text-primary">
                      untapped
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-destructive">
                  {g.pctUnable10 == null ? "—" : `${g.pctUnable10}%`}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {g.pctUnable30 == null ? "—" : `${g.pctUnable30}%`}
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{g.postcodes}</td>
                <td className="px-3 py-2 text-right tabular-nums">{g.leads}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
