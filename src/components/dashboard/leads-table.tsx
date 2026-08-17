"use client";

import { useMemo, useState } from "react";
import { Search, Phone, Mail, MapPin, Loader2, Inbox, Download, Camera } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { LeadDetailPanel } from "@/components/dashboard/lead-detail-panel";
import {
  type Lead,
  type LeadStatus,
  type LocationMap,
  LEAD_STATUSES,
  STATUS_LABEL,
  STATUS_STYLE,
  serviceOf,
  scoreStyle,
  formatDateTime,
} from "@/lib/dashboard/leads";
import type { LeadIntel } from "@/lib/intel/types";

/** Escape one CSV cell per RFC 4180. */
function csvCell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

type DateRange = "all" | "today" | "7d" | "30d" | "month" | "custom";

const DATE_RANGES: Array<{ value: DateRange; label: string }> = [
  { value: "all", label: "All dates" },
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "month", label: "This month" },
  { value: "custom", label: "Custom range" },
];

function dateRangeStart(range: DateRange): Date | null {
  const now = new Date();
  switch (range) {
    case "today":
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case "7d":
      return new Date(now.getTime() - 7 * 86400_000);
    case "30d":
      return new Date(now.getTime() - 30 * 86400_000);
    case "month":
      return new Date(now.getFullYear(), now.getMonth(), 1);
    default:
      return null;
  }
}

export function LeadsTable({
  initialLeads,
  locations = {},
  intel = {},
  photos = {},
}: {
  initialLeads: Lead[];
  locations?: LocationMap;
  intel?: Record<string, LeadIntel>;
  photos?: Record<string, string[]>;
}) {
  const [leads, setLeads] = useState(initialLeads);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | LeadStatus>("all");
  const [sortBy, setSortBy] = useState<"newest" | "score">("newest");
  const [saving, setSaving] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [service, setService] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const cityOf = (l: Lead) => locations[l.postcode.trim().toUpperCase()]?.city;

  const services = useMemo(() => {
    const set = new Set<string>();
    for (const l of leads) {
      const s = serviceOf(l);
      if (s && s !== "—") set.add(s);
    }
    return Array.from(set).sort();
  }, [leads]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let since: Date | null = null;
    let until: Date | null = null;
    if (dateRange === "custom") {
      if (customFrom) since = new Date(`${customFrom}T00:00:00`);
      if (customTo) until = new Date(`${customTo}T23:59:59.999`);
    } else {
      since = dateRangeStart(dateRange);
    }
    const rows = leads.filter((l) => {
      if (filter !== "all" && l.status !== filter) return false;
      if (service !== "all" && serviceOf(l) !== service) return false;
      const created = new Date(l.created_at);
      if (since && created < since) return false;
      if (until && created > until) return false;
      if (!q) return true;
      return [l.name, l.email, l.phone, l.postcode, cityOf(l) ?? "", l.notes ?? ""].join(" ").toLowerCase().includes(q);
    });
    if (sortBy === "score") {
      rows.sort((a, b) => (b.lead_score ?? 0) - (a.lead_score ?? 0) || +new Date(b.created_at) - +new Date(a.created_at));
    }
    return rows;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leads, query, filter, service, dateRange, customFrom, customTo, sortBy]);

  const openLead = openId ? leads.find((l) => l.id === openId) ?? null : null;

  function exportCsv() {
    const headers = [
      "created_at", "name", "email", "phone", "postcode", "city", "service", "status", "lead_score",
      "estimated_value", "device_type", "landing_page", "traffic_source", "campaign",
      "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid",
      "contacted_at", "quoted_at",
    ];
    const rows = filtered.map((l) =>
      [
        l.created_at, l.name, l.email, l.phone, l.postcode.toUpperCase(), cityOf(l) ?? "", serviceOf(l),
        STATUS_LABEL[l.status], l.lead_score ?? "", l.estimated_value ?? "", l.device_type ?? "", l.landing_page ?? "",
        l.traffic_source ?? "", l.campaign ?? "", l.utm_source ?? "", l.utm_medium ?? "",
        l.utm_campaign ?? "", l.utm_term ?? "", l.utm_content ?? "", l.gclid ?? "", l.fbclid ?? "",
        l.contacted_at ?? "", l.quoted_at ?? "",
      ].map(csvCell).join(","),
    );
    const blob = new Blob([`﻿${headers.join(",")}\n${rows.join("\n")}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `installpros-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} lead${filtered.length === 1 ? "" : "s"}`);
  }

  async function updateValue(id: string, value: number | null) {
    const prev = leads;
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, estimated_value: value } : l)));
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estimated_value: value }),
      });
      if (!res.ok) throw new Error();
      toast.success("Estimated value saved");
    } catch {
      setLeads(prev);
      toast.error("Couldn't save value. Try again.");
    }
  }

  async function updateStatus(id: string, status: LeadStatus) {
    const prev = leads;
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
    setSaving(id);
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Marked as ${STATUS_LABEL[status]}`);
    } catch {
      setLeads(prev);
      toast.error("Couldn't update status. Try again.");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, city…" className="pl-9" />
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {LEAD_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={service} onValueChange={setService}>
          <SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All services</SelectItem>
            {services.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
          <SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            {DATE_RANGES.map((r) => (
              <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="score">Highest score</SelectItem>
          </SelectContent>
        </Select>
        <button
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-body-sm font-medium hover:bg-secondary disabled:opacity-50"
        >
          <Download className="h-4 w-4" /> CSV
        </button>
      </div>

      {dateRange === "custom" && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <label htmlFor="date-from" className="text-body-sm text-muted-foreground">From</label>
            <Input
              id="date-from"
              type="date"
              value={customFrom}
              max={customTo || undefined}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="w-auto"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="date-to" className="text-body-sm text-muted-foreground">To</label>
            <Input
              id="date-to"
              type="date"
              value={customTo}
              min={customFrom || undefined}
              onChange={(e) => setCustomTo(e.target.value)}
              className="w-auto"
            />
          </div>
          {(customFrom || customTo) && (
            <button
              onClick={() => { setCustomFrom(""); setCustomTo(""); }}
              className="text-body-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      )}

      <p className="text-body-sm text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "lead" : "leads"}
        {filter !== "all" ? ` · ${STATUS_LABEL[filter as LeadStatus]}` : ""}
      </p>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 p-12 text-center">
            <Inbox className="h-10 w-10 text-muted-foreground" />
            <p className="font-medium">No matching leads</p>
            <p className="text-body-sm text-muted-foreground">
              {leads.length === 0 ? "New quote requests will appear here." : "Try clearing your search or filter."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop table */}
          <Card className="hidden overflow-hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-body-sm">
                <thead className="border-b border-border bg-secondary/50 text-left text-label uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Score</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Contact</th>
                    <th className="px-4 py-3 font-medium">City</th>
                    <th className="px-4 py-3 font-medium">Service</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((l) => (
                    <tr
                      key={l.id}
                      onClick={() => setOpenId(l.id)}
                      className="cursor-pointer hover:bg-secondary/30"
                    >
                      <td className="px-4 py-3"><ScoreBadge score={l.lead_score} /></td>
                      <td className="px-4 py-3 font-medium">
                        <span className="flex items-center gap-1.5">
                          {l.name}
                          {(photos[l.id]?.length ?? 0) > 0 && (
                            <span className="inline-flex items-center gap-0.5 text-label text-muted-foreground" title={`${photos[l.id].length} photo(s) sent`}>
                              <Camera className="h-3.5 w-3.5" />{photos[l.id].length}
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5 text-label">
                          <a href={`mailto:${l.email}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                            <Mail className="h-3 w-3" /> {l.email}
                          </a>
                          <a href={`tel:${l.phone}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                            <Phone className="h-3 w-3" /> {l.phone}
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-3">{cityOf(l) ?? <span className="uppercase">{l.postcode}</span>}</td>
                      <td className="px-4 py-3">{serviceOf(l)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{formatDateTime(l.created_at)}</td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <StatusPicker lead={l} saving={saving === l.id} onChange={(s) => updateStatus(l.id, s)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {filtered.map((l) => (
              <Card key={l.id} onClick={() => setOpenId(l.id)} className="cursor-pointer">
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="flex items-center gap-2 font-semibold">{l.name} <ScoreBadge score={l.lead_score} /></p>
                      <p className="text-label text-muted-foreground">{formatDateTime(l.created_at)} · {l.traffic_source || "direct"}</p>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <StatusPicker lead={l} saving={saving === l.id} onChange={(s) => updateStatus(l.id, s)} />
                    </div>
                  </div>
                  <div className="grid gap-1 text-body-sm">
                    <a href={`mailto:${l.email}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" /> {l.email}</a>
                    <a href={`tel:${l.phone}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" /> {l.phone}</a>
                    <span className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {cityOf(l) ?? l.postcode} · {serviceOf(l)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {openLead && (
        <LeadDetailPanel
          lead={openLead}
          location={locations[openLead.postcode.trim().toUpperCase()]}
          onClose={() => setOpenId(null)}
          onSaveValue={(v) => updateValue(openLead.id, v)}
          intel={intel[openLead.id]}
          photos={photos[openLead.id]}
          statusPicker={
            <StatusPicker lead={openLead} saving={saving === openLead.id} onChange={(s) => updateStatus(openLead.id, s)} />
          }
        />
      )}
    </div>
  );
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score == null) return <span className="text-label text-muted-foreground">—</span>;
  return (
    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-label font-bold tabular-nums ${scoreStyle(score)}`}>
      {score}
    </span>
  );
}

function StatusPicker({ lead, saving, onChange }: { lead: Lead; saving: boolean; onChange: (s: LeadStatus) => void }) {
  return (
    <div className="flex items-center gap-2">
      {saving && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
      <Select value={lead.status} onValueChange={(v) => onChange(v as LeadStatus)}>
        <SelectTrigger className={`h-8 w-[130px] border-0 text-label font-semibold ${STATUS_STYLE[lead.status]}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LEAD_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
