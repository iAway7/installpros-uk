"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, ExternalLink, Check, Pencil, RefreshCw, Wifi, Home, MapPinned, Loader2 } from "lucide-react";
import type { LeadIntel, PlanningConstraint } from "@/lib/intel/types";
import { pitchAngles } from "@/lib/intel/pitch-angles";
import { InfoTip } from "@/components/system/info-tip";
import { scoreStyle } from "@/lib/dashboard/leads";
import {
  type Lead,
  type LeadLocation,
  STATUS_LABEL,
  STATUS_STYLE,
  serviceOf,
  formatDateTime,
} from "@/lib/dashboard/leads";

interface Props {
  lead: Lead;
  location?: LeadLocation;
  onClose: () => void;
  statusPicker: React.ReactNode;
  onSaveValue?: (value: number | null) => void;
  intel?: LeadIntel;
  photos?: string[];
}

/** Slide-in panel with the full detail of one lead. */
export function LeadDetailPanel({ lead, location, onClose, statusPicker, onSaveValue, intel, photos }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const fullAddress = location ? `${location.city}, ${lead.postcode.toUpperCase()}` : lead.postcode.toUpperCase();
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={`Lead ${lead.name}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="absolute inset-y-0 left-0 flex w-full max-w-md animate-in slide-in-from-left flex-col overflow-y-auto bg-background shadow-overlay duration-200">
        <div className="sticky top-0 z-10 border-b border-border bg-background px-6 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">{lead.name}</h2>
                <span className={`rounded-full px-2.5 py-0.5 text-label font-semibold ${STATUS_STYLE[lead.status]}`}>
                  {STATUS_LABEL[lead.status]}
                </span>
              </div>
              <p className="mt-1 text-body-sm text-muted-foreground">Submitted {formatDateTime(lead.created_at)}</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-8 px-6 py-6">
          <Section title="Contact">
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              <Field label="Name">{lead.name}</Field>
              <Field label="Email">
                <a href={`mailto:${lead.email}`} className="break-all hover:text-primary">{lead.email}</a>
              </Field>
              <Field label="Phone">
                <a href={`tel:${lead.phone}`} className="hover:text-primary">{lead.phone}</a>
              </Field>
            </div>
          </Section>

          <Section title="Address">
            <div className="space-y-4">
              <Field label="Full address">
                {fullAddress}
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center gap-1.5 text-body-sm font-bold uppercase tracking-wide text-primary hover:underline"
                >
                  Open in Google Maps <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Field>
              <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                <Field
                  label="Postcode"
                  tip="Entered on the quote form. This is the key every data source below is looked up with."
                  source="Quote form"
                >
                  <span className="uppercase">{lead.postcode}</span>
                </Field>
                <Field label="Region" align="end" tip="Region resolved from the postcode." source="postcodes.io">
                  {location?.region ?? "—"}
                </Field>
              </div>
              <AddressResolver leadId={lead.id} intel={intel} />
              <SatelliteView
                leadId={lead.id}
                mapsQuery={intel?.resolved_address ?? fullAddress}
                exact={intel?.property_lat != null && intel?.property_lng != null}
              />
            </div>
          </Section>

          <Section title="Property">
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              <Field label="Installation type"><span className="capitalize">{lead.install_type}</span></Field>
              <Field label="Service">{serviceOf(lead)}</Field>
              <Field
                label="Est. value"
                tip="What you expect this job to be worth. Entered by the team — it is what turns the leads list into a pipeline figure."
                source="Entered manually"
              >
                <EstimatedValue value={lead.estimated_value} onSave={onSaveValue} />
              </Field>
              <Field
                label="Status"
                align="end"
                tip="Keeping this current is what makes campaign-to-installation reporting possible. Booked and Installed count as won."
                source="Set by the team"
              >
                {statusPicker}
              </Field>
            </div>
          </Section>

          <Section title={`Property photos${photos?.length ? ` (${photos.length})` : ""}`}>
            {!photos?.length ? (
              <p className="text-body-sm text-muted-foreground">No photos sent yet.</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {photos.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="group relative block overflow-hidden rounded-lg border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Property photo ${i + 1}`} className="aspect-square w-full object-cover transition-transform group-hover:scale-105" />
                  </a>
                ))}
              </div>
            )}
          </Section>

          <IntelSection leadId={lead.id} intel={intel} />

          {lead.notes && (
            <Section title="Notes">
              <p className="whitespace-pre-wrap text-body-sm">{lead.notes}</p>
            </Section>
          )}

          <Section title="Attribution">
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              <Field label="Source"><span className="capitalize">{lead.traffic_source || "direct"}</span></Field>
              <Field label="Device"><span className="capitalize">{lead.device_type ?? "—"}</span></Field>
              <Field label="Landing page">{lead.landing_page ?? "—"}</Field>
              <Field label="Variant">{lead.variant_id ?? "—"}</Field>
              <Field label="UTM source">{lead.utm_source ?? "—"}</Field>
              <Field label="UTM medium">{lead.utm_medium ?? "—"}</Field>
              <Field label="UTM campaign">{lead.utm_campaign ?? lead.campaign ?? "—"}</Field>
              <Field label="UTM term">{lead.utm_term ?? "—"}</Field>
              <Field label="UTM content">{lead.utm_content ?? "—"}</Field>
              <Field label="GCLID"><Mono value={lead.gclid} /></Field>
              <Field label="FBCLID"><Mono value={lead.fbclid} /></Field>
              <Field label="Source URL">
                {lead.source_url ? (
                  <a href={lead.source_url} target="_blank" rel="noopener noreferrer" className="break-all hover:text-primary">
                    {lead.source_url}
                  </a>
                ) : "—"}
              </Field>
            </div>
          </Section>

          <Section title="Meta">
            <div className="space-y-4">
              <Field label="First contacted">{lead.contacted_at ? formatDateTime(lead.contacted_at) : "—"}</Field>
              <Field label="Quote sent">{lead.quoted_at ? formatDateTime(lead.quoted_at) : "—"}</Field>
              <Field label="Lead ID"><Mono value={lead.id} /></Field>
              <Field label="Session ID"><Mono value={lead.session_id} /></Field>
              <Field label="Experiment ID"><Mono value={lead.experiment_id} /></Field>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

/**
 * Satellite view — free Esri imagery by default, Google when a key is set.
 * `exact` is true once the address has been resolved, which both changes the
 * caption and busts the browser cache: the endpoint then centres on the
 * building instead of the postcode, at the same URL.
 */
function SatelliteView({ leadId, mapsQuery, exact }: { leadId: string; mapsQuery: string; exact?: boolean }) {
  const [zoomOut, setZoomOut] = useState(false);
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Satellite view
          <InfoTip
            text="Aerial imagery centred on the postcode — check the roof, outbuildings and tree line before quoting, even when the customer sent no photos."
            source="Esri World Imagery, or Google Static Maps when a key is set"
          />
        </p>
        <button
          onClick={() => setZoomOut((z) => !z)}
          className="text-label font-medium text-muted-foreground hover:text-primary"
        >
          {zoomOut ? "Zoom to roof" : "Zoom out"}
        </button>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/api/leads/${leadId}/satellite?at=${exact ? "property" : "postcode"}${zoomOut ? "&zoom=out" : ""}`}
        alt="Satellite view of the property area"
        onError={() => setFailed(true)}
        className="w-full rounded-lg border border-border"
      />
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{exact ? "Centred on the property" : "Postcode-centre view"} · imagery © Esri/Maxar</span>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}&basemap=satellite`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium hover:text-primary hover:underline"
        >
          Open in Google Maps →
        </a>
      </div>
    </div>
  );
}

/**
 * Exact-property resolution via Propalt (on-demand — costs credits, so only
 * on click). One candidate resolves instantly; several show a picker.
 */
function AddressResolver({ leadId, intel }: { leadId: string; intel?: LeadIntel }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [candidates, setCandidates] = useState<Array<{ text: string; property_id: number }> | null>(null);
  const [error, setError] = useState("");

  async function resolve(propertyId?: number) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/leads/${leadId}/resolve-address`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(propertyId ? { property_id: propertyId } : {}),
      });
      const json = (await res.json()) as { resolved?: boolean; candidates?: Array<{ text: string; property_id: number }>; error?: string; detail?: string };
      if (json.error === "propalt_disabled") setError("Activate Propalt in Settings → APIs first.");
      else if (json.error) setError(`Lookup failed${json.detail ? ` (${json.detail})` : ""} — try again.`);
      else if (json.resolved) {
        setCandidates(null);
        router.refresh();
      } else if (json.candidates) {
        setCandidates(json.candidates);
        if (json.candidates.length === 0) setError("No addresses found for this postcode.");
      }
    } catch {
      setError("Lookup failed — try again.");
    } finally {
      setBusy(false);
    }
  }

  if (intel?.resolved_address) {
    const rooms = [
      intel.bedrooms != null ? `${intel.bedrooms} bed` : null,
      intel.bathrooms != null ? `${intel.bathrooms} bath` : null,
      intel.reception_rooms != null ? `${intel.reception_rooms} reception` : null,
    ].filter(Boolean).join(" · ");
    const build = [
      intel.property_built_form,
      intel.floor_area_sqm != null
        ? `${intel.floor_area_sqm} m² (${Math.round(intel.floor_area_sqm * 10.764).toLocaleString("en-GB")} sq ft)`
        : null,
      intel.plot_size != null ? `${Number(intel.plot_size).toLocaleString("en-GB")} sq ft plot` : null,
    ].filter(Boolean).join(" · ");
    const legal = [
      intel.tax_band ? `Tax band ${intel.tax_band}` : null,
      intel.tenure,
      intel.avm_value != null ? `Est. value £${Number(intel.avm_value).toLocaleString("en-GB")}` : null,
      intel.is_hmo ? "HMO" : null,
    ].filter(Boolean).join(" · ");

    return (
      <div className="space-y-2">
        <div className="rounded-lg bg-secondary/50 p-3 text-body-sm">
          <p className="mb-1 flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Exact property
            <InfoTip
              text="The specific building, not the postcode. Room counts are modelled estimates; floor area, tax band and plot come from records."
              source="Propalt"
            />
          </p>
          <p className="font-medium">{intel.resolved_address}</p>
          <div className="mt-1 space-y-0.5 text-label text-muted-foreground">
            {rooms && <p>{rooms}</p>}
            {build && <p>{build}</p>}
            {legal && <p>{legal}</p>}
            {intel.title_number && <p>Title {intel.title_number}</p>}
          </div>
        </div>
        <PlanningConstraints constraints={intel.planning_constraints} />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {candidates && candidates.length > 1 ? (
        <div className="space-y-1 rounded-lg border border-border p-2">
          <p className="px-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Pick the exact address</p>
          {candidates.map((c) => (
            <button
              key={c.property_id}
              onClick={() => resolve(c.property_id)}
              disabled={busy}
              className="block w-full rounded-md px-2 py-1.5 text-left text-body-sm hover:bg-secondary disabled:opacity-50"
            >
              {c.text}
            </button>
          ))}
        </div>
      ) : (
        <button
          onClick={() => resolve()}
          disabled={busy}
          className="inline-flex items-center gap-1.5 text-body-sm font-medium text-primary hover:underline disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MapPinned className="h-3.5 w-3.5" />}
          Resolve exact address (Propalt)
        </button>
      )}
      {error && <p className="text-label text-destructive">{error}</p>}
    </div>
  );
}

/** Property intelligence — enrichment from Ofcom / EPC / Land Registry / postcodes.io. */
function IntelSection({ leadId, intel }: { leadId: string; intel?: LeadIntel }) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  async function refresh() {
    setRefreshing(true);
    try {
      await fetch(`/api/leads/${leadId}/enrich?force=1`, { method: "POST" });
      router.refresh();
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <Section
      title="Property intelligence"
      action={
        <button
          onClick={refresh}
          disabled={refreshing}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-primary disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
          {intel ? "Refresh" : "Fetch"}
        </button>
      }
    >
      {!intel ? (
        <p className="text-body-sm text-muted-foreground">
          Not enriched yet. Fetch to pull broadband speed, property type and value band for this postcode.
        </p>
      ) : (
        <div className="space-y-4">
          {intel.score != null && (
            <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
              <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-body font-bold ${scoreStyle(intel.score)}`}>
                {intel.score}
              </span>
              <div className="min-w-0 text-label text-muted-foreground">
                {(intel.score_reasons ?? []).slice(0, 4).map((r) => (
                  <p key={r.signal} className="truncate">
                    {r.points > 0 ? "+" : ""}{r.points} {r.detail}
                  </p>
                ))}
              </div>
              <InfoTip
                align="end"
                className="ml-auto self-start"
                text="Priority score from 1 to 10. Every lead starts at 5; the lines here are the signals that moved it. Capped at 7 when no broadband data exists for the postcode."
                source="Derived from the fields below"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            <Field
              label="Broadband (max down)"
              tip="Fastest download speed available at this postcode. Under 30 Mbps is the strongest Starlink signal there is."
              source="Ofcom Connected Nations, homedata while Ofcom is pending"
            >
              <span className="inline-flex items-center gap-1.5">
                <Wifi className="h-3.5 w-3.5 text-muted-foreground" />
                {intel.max_download_mbps != null ? `${intel.max_download_mbps} Mbps` : "—"}
              </span>
            </Field>
            <Field
              label="Property"
              align="end"
              tip="Property type and built form from the energy certificates registered at this postcode. Detached is an easy mount; a flat usually is not."
              source="EPC register (MHCLG)"
            >
              <span className="inline-flex items-center gap-1.5">
                <Home className="h-3.5 w-3.5 text-muted-foreground" />
                {[intel.built_form, intel.property_type].filter(Boolean).join(" ") || "—"}
              </span>
            </Field>
            <Field
              label="Actual speed in use"
              tip="What residents on these lines actually get, as opposed to what is advertised as available. A gap between the two is a strong lead."
              source="Propalt"
            >
              {intel.actual_avg_download_mbps != null ? `~${intel.actual_avg_download_mbps} Mbps avg` : "—"}
            </Field>
            <Field
              label="Construction age"
              align="end"
              tip="Band the property was built in. Older builds sit in areas with older infrastructure."
              source="EPC register (MHCLG)"
            >
              {intel.construction_age?.replace(/England and Wales:\s*/i, "") ?? "—"}
            </Field>
            <Field
              label="Floor area"
              tip="Total floor area recorded on the energy certificate — a rough read on job size."
              source="EPC register (MHCLG)"
            >
              {intel.floor_area_sqm != null ? `${intel.floor_area_sqm} m²` : "—"}
            </Field>
            <Field
              label="EPC rating"
              align="end"
              tip="Most common energy rating among the certificates at this postcode, A to G."
              source="EPC register (MHCLG)"
            >
              {intel.energy_rating ?? "—"}
            </Field>
            <Field
              label="Value band"
              tip="Median sale price for this postcode over the last 10 years. A read on budget, not a valuation of this house."
              source="HM Land Registry Price Paid"
            >
              {intel.value_band ?? "—"}
            </Field>
            <Field
              label="Classification"
              align="end"
              tip="Rural or urban, inferred from whether the postcode sits in a named civil parish. Rural is where Starlink wins."
              source="postcodes.io"
            >
              {intel.rural == null ? "—" : intel.rural ? "Rural" : "Urban"}
            </Field>
            <Field label="Region" tip="UK region this postcode falls in." source="postcodes.io">
              {intel.region ?? "—"}
            </Field>
            <Field
              label="Crime (month, ~1mi)"
              align="end"
              tip="Crimes reported within about a mile in the latest full month. A high burglary count is a CCTV and security pitch, not a Starlink one."
              source="police.uk"
            >
              {intel.crime_total != null
                ? `${intel.crime_total} total · ${intel.crime_burglary ?? 0} burglary · ${intel.crime_vehicle ?? 0} vehicle`
                : "—"}
            </Field>
            <Field
              label="Energy cost (EPC)"
              tip="Estimated yearly heating, lighting and hot water cost from the certificate. An expensive house is a smart-home prospect."
              source="EPC register (MHCLG)"
            >
              {intel.energy_cost_annual != null ? `~£${Number(intel.energy_cost_annual).toLocaleString("en-GB")}/yr` : "—"}
            </Field>
          </div>
          <p className="text-[11px] leading-snug text-muted-foreground">
            Broadband, property, value and crime figures describe the postcode, not the exact house. Resolve the address
            above for property-level data.
          </p>
          <PitchAngles intel={intel} />
        </div>
      )}
    </Section>
  );
}

/**
 * Planning constraints on the resolved property. These decide whether a dish
 * can go on a visible elevation, so they belong next to the address rather
 * than buried in the intelligence grid.
 *
 * null = never checked (nothing to say). [] = checked and clear, which is
 * worth stating explicitly — "we looked" is different from "we didn't".
 */
function PlanningConstraints({ constraints }: { constraints?: PlanningConstraint[] | null }) {
  if (constraints == null) return null;

  const COPY: Record<string, string> = {
    article_4: "Article 4 direction — permitted development rights are restricted here. External fixtures may need planning permission; check before quoting.",
    conservation_area: "Conservation area — expect restrictions on anything visible from the street. Favour a rear or side elevation.",
    listed_building: "Listed building — external fixtures need listed building consent. Do not quote a front-elevation mount.",
    flood_zone: "Flood zone — relevant for ground-mounted equipment and cable entry points.",
    green_belt: "Green belt — restrictions apply to new structures rather than dishes, but worth knowing.",
  };
  const label = (t: string) => t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  if (!constraints.length) {
    return (
      <p className="text-label text-muted-foreground">
        No planning constraints found on this property (checked with Propalt).
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
      <p className="mb-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-amber-600">
        Install constraints
        <InfoTip
          align="end"
          text="Active planning designations on this exact property. They govern what can be attached to the building and where."
          source="Propalt planning constraints"
        />
      </p>
      {constraints.map((c) => (
        <p key={`${c.type}-${c.name ?? ""}`} className="text-body-sm">
          <strong>{label(c.type)}</strong>
          {c.start_date ? ` (since ${c.start_date.slice(0, 4)})` : ""} — {COPY[c.type] ?? "Check with the local planning authority before quoting."}
        </p>
      ))}
    </div>
  );
}

/** Cross-sell hints derived from the intel — which service to lead with. */
function PitchAngles({ intel }: { intel: LeadIntel }) {
  const angles = pitchAngles(intel);
  if (!angles.length) return null;
  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
      <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-primary">Pitch angles</p>
      {angles.map((a) => (
        <p key={a} className="text-body-sm">{a}</p>
      ))}
    </div>
  );
}

/** Inline-editable estimated value (£). Enter or ✓ saves; Escape cancels. */
function EstimatedValue({ value, onSave }: { value: number | null; onSave?: (v: number | null) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  if (!onSave) {
    return <>{value != null ? `£${Number(value).toLocaleString("en-GB")}` : "—"}</>;
  }

  function commit() {
    const t = draft.trim().replace(/[£,\s]/g, "");
    if (t === "") {
      onSave?.(null);
    } else {
      const n = Number(t);
      if (!Number.isFinite(n) || n < 0) return; // keep editing on bad input
      onSave?.(n);
    }
    setEditing(false);
  }

  if (!editing) {
    return (
      <button
        onClick={() => {
          setDraft(value != null ? String(value) : "");
          setEditing(true);
        }}
        className="group inline-flex items-center gap-1.5 hover:text-primary"
        aria-label="Edit estimated value"
      >
        {value != null ? `£${Number(value).toLocaleString("en-GB")}` : "—"}
        <Pencil className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-muted-foreground">£</span>
      <input
        autoFocus
        inputMode="numeric"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") setEditing(false);
        }}
        className="w-24 rounded-md border border-border bg-background px-2 py-1 text-body-sm"
        placeholder="0"
      />
      <button onClick={commit} aria-label="Save value" className="rounded-md p-1 text-success hover:bg-secondary">
        <Check className="h-4 w-4" />
      </button>
    </span>
  );
}

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
        <h3 className="text-label font-bold uppercase tracking-wider text-muted-foreground">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function Mono({ value }: { value: string | null }) {
  return value ? <span className="break-all font-mono text-label">{value}</span> : <>—</>;
}

/**
 * One labelled value. `tip` adds the info affordance next to the label —
 * pass `align="end"` in the right-hand column so the bubble opens inwards
 * instead of off the edge of the panel.
 */
function Field({
  label,
  children,
  tip,
  source,
  align = "start",
}: {
  label: string;
  children: React.ReactNode;
  tip?: string;
  source?: string;
  align?: "start" | "end";
}) {
  return (
    <div>
      <p className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
        {tip && <InfoTip text={tip} source={source} align={align} />}
      </p>
      <div className="mt-0.5 text-body-sm font-medium">{children}</div>
    </div>
  );
}
