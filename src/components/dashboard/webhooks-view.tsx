"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "@/components/system/toast";
import { Plus, Send, CheckCircle2, XCircle, Loader2, Pencil, Trash2, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/system/card";
import { Button } from "@/components/system/button";
import { Input } from "@/components/system/input";
import { Label } from "@/components/system/label";
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from "@/components/system/table";
import { MiddleTruncate } from "@/components/system/middle-truncate";
import {
  WEBHOOK_EVENTS,
  EVENT_LABEL,
  WEBHOOK_FORMATS,
  FORMAT_LABEL,
  type WebhookDelivery,
  type WebhookEndpoint,
  type WebhookEvent,
  type WebhookFormat,
} from "@/lib/webhooks/types";

interface ApiState {
  endpoints: WebhookEndpoint[];
  deliveries: WebhookDelivery[];
  envConfigured: boolean;
}

export function WebhooksView() {
  const [state, setState] = useState<ApiState | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [logFilter, setLogFilter] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/webhooks", { cache: "no-store" });
      if (!res.ok) throw new Error();
      setState((await res.json()) as ApiState);
    } catch {
      toast.error("Couldn't load webhooks", "Has migration 0014 been run?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function sendTest(id: string) {
    setBusy(id);
    try {
      const res = await fetch(`/api/webhooks/${id}/test`, { method: "POST" });
      const json = (await res.json()) as { outcome?: { ok: boolean; statusCode: number | null; error: string | null } };
      if (json.outcome?.ok) toast.success("Test delivered", `HTTP ${json.outcome.statusCode}`);
      else toast.error("Test failed", json.outcome?.error ?? "No response from the endpoint");
      await load();
    } catch {
      toast.error("Test failed");
    } finally {
      setBusy(null);
    }
  }

  async function setActive(ep: WebhookEndpoint, active: boolean) {
    setBusy(ep.id);
    try {
      const res = await fetch(`/api/webhooks/${ep.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      });
      if (!res.ok) throw new Error();
      toast.success(active ? "Endpoint active" : "Endpoint paused", active ? "Leads are flowing again." : "Nothing is sent until you resume it.");
      await load();
    } catch {
      toast.error("Couldn't update");
    } finally {
      setBusy(null);
    }
  }

  async function remove(ep: WebhookEndpoint) {
    setBusy(ep.id);
    try {
      const res = await fetch(`/api/webhooks/${ep.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Endpoint deleted", "Its delivery history is kept in the log.");
      if (logFilter === ep.id) setLogFilter(null);
      await load();
    } catch {
      toast.error("Couldn't delete");
    } finally {
      setBusy(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
      </div>
    );
  }

  const endpoints = state?.endpoints ?? [];
  const allDeliveries = state?.deliveries ?? [];
  const filteredEndpoint = logFilter ? endpoints.find((e) => e.id === logFilter) : null;
  const deliveries = filteredEndpoint
    ? allDeliveries.filter((d) => d.endpoint_id === filteredEndpoint.id || d.endpoint_url === filteredEndpoint.url)
    : allDeliveries;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-6">
        <p className="max-w-2xl text-body-sm text-muted-foreground">
          Every lead is POSTed as JSON to each active endpoint. Paste a Zapier or Make catch-hook URL
          and leads reach your CRM, WhatsApp or a spreadsheet without anyone opening this dashboard.
          Delivery never blocks the form: a failing endpoint is retried and logged, never surfaced to the visitor.
        </p>
        <Button size="sm" className="shrink-0" onClick={() => { setEditing(null); setShowForm((v) => !v); }}>
          <Plus className="h-4 w-4" /> New endpoint
        </Button>
      </div>

      {state?.envConfigured && (
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
            <p className="text-body-sm">
              <span className="font-semibold">LEAD_WEBHOOK_URL</span> is set in the environment, so that
              destination receives leads too, and isn&apos;t listed below. Its deliveries do appear in the log.
            </p>
          </CardContent>
        </Card>
      )}

      {showForm && (
        <Card>
          <CardContent className="p-5">
            <EndpointForm onDone={() => { setShowForm(false); void load(); }} onCancel={() => setShowForm(false)} />
          </CardContent>
        </Card>
      )}

      {endpoints.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-body-sm text-muted-foreground">
            No endpoints yet. Add one and press <span className="font-semibold">Send test</span> to
            confirm the receiving side works before a real lead depends on it.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>URL</TableHeaderCell>
                  <TableHeaderCell>Events</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell className="text-right">Actions</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {endpoints.map((ep) => (
                  <EndpointRow
                    key={ep.id}
                    endpoint={ep}
                    busy={busy === ep.id}
                    selected={logFilter === ep.id}
                    editing={editing === ep.id}
                    onSelect={() => setLogFilter((cur) => (cur === ep.id ? null : ep.id))}
                    onSendTest={() => void sendTest(ep.id)}
                    onSetActive={(active) => void setActive(ep, active)}
                    onEdit={() => { setShowForm(false); setEditing(ep.id); }}
                    onCancelEdit={() => setEditing(null)}
                    onSaved={() => { setEditing(null); void load(); }}
                    onDelete={() => void remove(ep)}
                  />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <div>
        <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="text-body font-semibold">Delivery log</h2>
          {filteredEndpoint && (
            <p className="text-label text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredEndpoint.name}</span> only ·{" "}
              <button type="button" className="underline underline-offset-2" onClick={() => setLogFilter(null)}>
                Show all
              </button>
            </p>
          )}
        </div>
        {deliveries.length === 0 ? (
          <p className="text-body-sm text-muted-foreground">
            {filteredEndpoint ? "Nothing sent to this endpoint yet." : "Nothing sent yet."}
          </p>
        ) : (
          <Card>
            <CardContent className="overflow-x-auto p-0">
              <Table density="compact">
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>When</TableHeaderCell>
                    <TableHeaderCell>Event</TableHeaderCell>
                    <TableHeaderCell>Destination</TableHeaderCell>
                    <TableHeaderCell>Result</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deliveries.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {new Date(d.created_at).toLocaleString("en-GB")}
                      </TableCell>
                      <TableCell className="font-mono text-label">{d.event}</TableCell>
                      <TableCell className="max-w-[260px] font-mono text-label text-muted-foreground">
                        <MiddleTruncate value={d.endpoint_url} />
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 ${d.status === "success" ? "text-success" : "text-destructive"}`}>
                          {d.status === "success" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                          {d.status_code ?? "—"}
                          {d.attempts > 1 && <span className="text-muted-foreground">· {d.attempts} attempts</span>}
                          {d.error && <span className="text-muted-foreground">· {d.error}</span>}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */

function EndpointRow({
  endpoint: ep,
  busy,
  selected,
  editing,
  onSelect,
  onSendTest,
  onSetActive,
  onEdit,
  onCancelEdit,
  onSaved,
  onDelete,
}: {
  endpoint: WebhookEndpoint;
  busy: boolean;
  selected: boolean;
  editing: boolean;
  onSelect: () => void;
  onSendTest: () => void;
  onSetActive: (active: boolean) => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSaved: () => void;
  onDelete: () => void;
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <>
      <TableRow className={`${ep.active ? "" : "opacity-60"} ${selected ? "bg-secondary/30" : ""}`}>
        <TableCell className="align-top">
          <button type="button" className="text-left" onClick={onSelect} title="Filter the delivery log to this endpoint">
            <span className="font-semibold">{ep.name}</span>
          </button>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {ep.format && ep.format !== "generic" && (
              <span className="rounded-full bg-secondary px-2 py-0.5 text-label font-semibold capitalize">{ep.format}</span>
            )}
            {ep.secret && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-label font-semibold text-primary">Signed</span>
            )}
          </div>
        </TableCell>
        <TableCell className="max-w-[320px] align-top">
          <a
            href={ep.url}
            target="_blank"
            rel="noreferrer"
            className="flex max-w-full items-center gap-1.5 font-mono text-label text-primary hover:underline"
            title={ep.url}
          >
            <MiddleTruncate value={ep.url} className="min-w-0" />
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          </a>
          {ep.last_delivery_at && (
            <p className="mt-1 text-label text-muted-foreground">
              Last {new Date(ep.last_delivery_at).toLocaleString("en-GB")} · {ep.last_status}
            </p>
          )}
        </TableCell>
        <TableCell className="align-top">
          <div className="flex flex-wrap gap-1.5">
            {ep.events.map((e) => (
              <span key={e} className="whitespace-nowrap rounded bg-secondary px-2 py-0.5 font-mono text-label">{e}</span>
            ))}
          </div>
        </TableCell>
        <TableCell className="align-top">
          <ActiveSwitch on={ep.active} disabled={busy} onChange={onSetActive} />
        </TableCell>
        <TableCell className="align-top text-right">
          {confirmingDelete ? (
            <div className="inline-flex flex-wrap items-center justify-end gap-2">
              <span className="text-body-sm">Delete <span className="font-semibold">{ep.name}</span>?</span>
              <Button
                variant="outline"
                size="sm"
                className="border-destructive/60 text-destructive hover:bg-destructive/10"
                disabled={busy}
                onClick={() => { setConfirmingDelete(false); onDelete(); }}
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Delete
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmingDelete(false)}>Cancel</Button>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                disabled={busy || !ep.active}
                onClick={onSendTest}
                title={ep.active ? "Send test" : "Resume the endpoint to send a test"}
                aria-label="Send test"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" disabled={busy} onClick={editing ? onCancelEdit : onEdit} title="Edit" aria-label="Edit">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" disabled={busy} onClick={() => setConfirmingDelete(true)} title="Delete" aria-label="Delete">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          )}
        </TableCell>
      </TableRow>
      {editing && (
        <TableRow className="bg-secondary/20">
          <TableCell colSpan={5} className="p-5">
            <EndpointForm endpoint={ep} onDone={onSaved} onCancel={onCancelEdit} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

function ActiveSwitch({ on, disabled, onChange }: { on: boolean; disabled?: boolean; onChange: (next: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-body-sm">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        disabled={disabled}
        onClick={() => onChange(!on)}
        title={on ? "Pause: stop sending leads here" : "Resume: start sending leads here"}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
          on ? "bg-success" : "bg-muted"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            on ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </button>
      <span className="sr-only">{on ? "Active" : "Paused"}</span>
    </label>
  );
}

/* ────────────────────────────────────────────────────────────────────── */

/**
 * One form for both creating and editing. In edit mode the secret is never
 * echoed back: the user sees that one is set and can replace or remove it.
 */
function EndpointForm({
  endpoint,
  onDone,
  onCancel,
}: {
  endpoint?: WebhookEndpoint;
  onDone: () => void;
  onCancel: () => void;
}) {
  const isEdit = Boolean(endpoint);
  const [name, setName] = useState(endpoint?.name ?? "");
  const [url, setUrl] = useState(endpoint?.url ?? "");
  const [secret, setSecret] = useState("");
  // Edit mode: "keep" leaves the stored secret alone, "replace" sends the new
  // value, "remove" clears it.
  const [secretMode, setSecretMode] = useState<"keep" | "replace" | "remove">(endpoint?.secret ? "keep" : "replace");
  const [events, setEvents] = useState<WebhookEvent[]>(endpoint?.events?.length ? [...endpoint.events] : [...WEBHOOK_EVENTS]);
  const [format, setFormat] = useState<WebhookFormat>(endpoint?.format ?? "generic");
  const [saving, setSaving] = useState(false);

  function pickFormat(next: WebhookFormat) {
    setFormat(next);
    // Superchat's shape has no score field, and their function likely messages
    // the customer on every hit, so default it to the one event that matters.
    if (next === "superchat") setEvents(["lead.created"]);
  }

  async function save() {
    if (!name.trim() || !url.trim()) return toast.error("Name and URL are required");
    if (events.length === 0) return toast.error("Pick at least one event");
    setSaving(true);
    try {
      const body: Record<string, unknown> = { name, url, events, format };
      if (isEdit) {
        if (secretMode === "replace" && secret.trim()) body.secret = secret;
        if (secretMode === "remove") body.secret = null;
      } else if (secret.trim()) {
        body.secret = secret;
      }

      const res = await fetch(isEdit ? `/api/webhooks/${endpoint!.id}` : "/api/webhooks", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();

      const destinationChanged = isEdit && (url !== endpoint!.url || format !== endpoint!.format);
      if (destinationChanged) toast.success("Saved", "Send a test to confirm the new destination works.");
      else if (isEdit) toast.success("Saved");
      else toast.success("Endpoint added", "Send a test to confirm it receives.");
      onDone();
    } catch {
      toast.error("Couldn't save", "Check the URL is valid.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {isEdit && <p className="text-body-sm font-semibold">Edit endpoint</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="wh-name">Name</Label>
          <Input id="wh-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Will's Zapier" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wh-url">URL</Label>
          <Input id="wh-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://hooks.zapier.com/hooks/catch/…" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="wh-secret">Signing secret (optional)</Label>
        {isEdit && secretMode === "keep" ? (
          <div className="flex flex-wrap items-center gap-3 text-body-sm">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-label font-semibold text-primary">Secret set</span>
            <button type="button" className="underline underline-offset-2" onClick={() => setSecretMode("replace")}>Replace</button>
            <button type="button" className="text-muted-foreground underline underline-offset-2" onClick={() => setSecretMode("remove")}>Remove</button>
          </div>
        ) : isEdit && secretMode === "remove" ? (
          <div className="flex flex-wrap items-center gap-3 text-body-sm">
            <span className="text-muted-foreground">Secret will be removed on save.</span>
            <button type="button" className="underline underline-offset-2" onClick={() => setSecretMode("keep")}>Keep it</button>
          </div>
        ) : (
          <Input id="wh-secret" value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="Leave blank for Zapier / Make" />
        )}
        <p className="text-label text-muted-foreground">
          When set, each request carries an <code className="rounded bg-secondary px-1">X-InstallPros-Signature</code>{" "}
          HMAC so the receiver can verify it came from us.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-body-sm font-medium">Payload format</p>
        {WEBHOOK_FORMATS.map((f) => (
          <label key={f} className="flex items-start gap-2 text-body-sm">
            <input type="radio" name="wh-format" className="mt-1" checked={format === f} onChange={() => pickFormat(f)} />
            <span>
              <span className="font-mono text-label">{f}</span>
              <span className="block text-muted-foreground">{FORMAT_LABEL[f]}</span>
            </span>
          </label>
        ))}
        {format === "superchat" && (
          <p className="text-label text-muted-foreground">
            Sends <code className="rounded bg-secondary px-1">event_type: &quot;lead_received&quot;</code> with
            first/last name split, phone as +44, and <code className="rounded bg-secondary px-1">install_type</code>{" "}
            mapped from the service. Only <code className="rounded bg-secondary px-1">lead.created</code> is
            recommended: the format carries no score, so the enriched event would only duplicate the lead.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-body-sm font-medium">Events</p>
        {WEBHOOK_EVENTS.map((e) => (
          <label key={e} className="flex items-start gap-2 text-body-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={events.includes(e)}
              onChange={(ev) => setEvents((prev) => (ev.target.checked ? [...prev, e] : prev.filter((x) => x !== e)))}
            />
            <span>
              <span className="font-mono text-label">{e}</span>
              <span className="block text-muted-foreground">{EVENT_LABEL[e]}</span>
            </span>
          </label>
        ))}
      </div>

      <div className="flex gap-2">
        <Button size="sm" disabled={saving} onClick={() => void save()}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" />} {isEdit ? "Save changes" : "Add endpoint"}
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}
