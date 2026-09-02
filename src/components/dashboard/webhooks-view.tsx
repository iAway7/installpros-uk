"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "@/components/system/toast";
import { Plus, Send, Trash2, CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/system/card";
import { Button } from "@/components/system/button";
import { Input } from "@/components/system/input";
import { Label } from "@/components/system/label";
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

  async function toggleActive(ep: WebhookEndpoint) {
    setBusy(ep.id);
    try {
      await fetch(`/api/webhooks/${ep.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !ep.active }),
      });
      await load();
    } finally {
      setBusy(null);
    }
  }

  async function remove(ep: WebhookEndpoint) {
    if (!window.confirm(`Delete "${ep.name}"? Its delivery log goes with it.`)) return;
    setBusy(ep.id);
    try {
      await fetch(`/api/webhooks/${ep.id}`, { method: "DELETE" });
      toast.success("Endpoint deleted");
      await load();
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
  const deliveries = state?.deliveries ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-2xl text-body-sm text-muted-foreground">
          Every lead is POSTed as JSON to each active endpoint. Paste a Zapier or Make catch-hook URL
          and leads reach your CRM, WhatsApp or a spreadsheet without anyone opening this dashboard.
          Delivery never blocks the form: a failing endpoint is retried and logged, never surfaced to the visitor.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => void load()}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button size="sm" onClick={() => setShowForm((v) => !v)}>
            <Plus className="h-4 w-4" /> New endpoint
          </Button>
        </div>
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

      {showForm && <NewEndpointForm onDone={() => { setShowForm(false); void load(); }} />}

      {endpoints.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-body-sm text-muted-foreground">
            No endpoints yet. Add one and press <span className="font-semibold">Send test</span> to
            confirm the receiving side works before a real lead depends on it.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {endpoints.map((ep) => (
            <Card key={ep.id}>
              <CardContent className="space-y-3 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{ep.name}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-label font-semibold ${
                          ep.active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {ep.active ? "Active" : "Paused"}
                      </span>
                      {ep.secret && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-label font-semibold text-primary">
                          Signed
                        </span>
                      )}
                      {ep.format && ep.format !== "generic" && (
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-label font-semibold capitalize">
                          {ep.format} format
                        </span>
                      )}
                    </div>
                    <p className="mt-1 break-all font-mono text-label text-muted-foreground">{ep.url}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button variant="outline" size="sm" disabled={busy === ep.id} onClick={() => void sendTest(ep.id)}>
                      {busy === ep.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      Send test
                    </Button>
                    <Button variant="ghost" size="sm" disabled={busy === ep.id} onClick={() => void toggleActive(ep)}>
                      {ep.active ? "Pause" : "Resume"}
                    </Button>
                    <Button variant="ghost" size="icon" disabled={busy === ep.id} onClick={() => void remove(ep)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ep.events.map((e) => (
                    <span key={e} className="rounded bg-secondary px-2 py-0.5 font-mono text-label">{e}</span>
                  ))}
                </div>
                {ep.last_delivery_at && (
                  <p className="text-label text-muted-foreground">
                    Last delivery {new Date(ep.last_delivery_at).toLocaleString("en-GB")} · {ep.last_status}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div>
        <h2 className="mb-2 text-body font-semibold">Delivery log</h2>
        {deliveries.length === 0 ? (
          <p className="text-body-sm text-muted-foreground">Nothing sent yet.</p>
        ) : (
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-body-sm">
                <thead className="border-b border-border/50 text-label uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">When</th>
                    <th className="px-4 py-2 text-left font-semibold">Event</th>
                    <th className="px-4 py-2 text-left font-semibold">Destination</th>
                    <th className="px-4 py-2 text-left font-semibold">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map((d) => (
                    <tr key={d.id} className="border-b border-border/30 last:border-0">
                      <td className="whitespace-nowrap px-4 py-2 text-muted-foreground">
                        {new Date(d.created_at).toLocaleString("en-GB")}
                      </td>
                      <td className="px-4 py-2 font-mono text-label">{d.event}</td>
                      <td className="max-w-[240px] truncate px-4 py-2 font-mono text-label text-muted-foreground">
                        {d.endpoint_url}
                      </td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex items-center gap-1.5 ${d.status === "success" ? "text-success" : "text-destructive"}`}>
                          {d.status === "success" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                          {d.status_code ?? "—"}
                          {d.attempts > 1 && <span className="text-muted-foreground">· {d.attempts} attempts</span>}
                          {d.error && <span className="text-muted-foreground">· {d.error}</span>}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function NewEndpointForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [events, setEvents] = useState<WebhookEvent[]>([...WEBHOOK_EVENTS]);
  const [format, setFormat] = useState<WebhookFormat>("generic");
  const [saving, setSaving] = useState(false);

  function pickFormat(next: WebhookFormat) {
    setFormat(next);
    // Superchat's shape has no score field, and their function likely messages
    // the customer on every hit, so default it to the one event that matters.
    if (next === "superchat") setEvents(["lead.created"]);
  }

  async function save() {
    if (!name.trim() || !url.trim()) return toast.error("Name and URL are required");
    setSaving(true);
    try {
      const res = await fetch("/api/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url, secret: secret || undefined, events, format }),
      });
      if (!res.ok) throw new Error();
      toast.success("Endpoint added", "Send a test to confirm it receives.");
      onDone();
    } catch {
      toast.error("Couldn't save", "Check the URL is valid.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
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
          <Input id="wh-secret" value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="Leave blank for Zapier / Make" />
          <p className="text-label text-muted-foreground">
            When set, each request carries an <code className="rounded bg-secondary px-1">X-InstallPros-Signature</code>{" "}
            HMAC so the receiver can verify it came from us.
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-body-sm font-medium">Payload format</p>
          {WEBHOOK_FORMATS.map((f) => (
            <label key={f} className="flex items-start gap-2 text-body-sm">
              <input
                type="radio"
                name="wh-format"
                className="mt-1"
                checked={format === f}
                onChange={() => pickFormat(f)}
              />
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
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Add endpoint
          </Button>
          <Button variant="ghost" size="sm" onClick={onDone}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}
