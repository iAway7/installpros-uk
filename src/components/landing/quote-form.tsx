"use client";

import * as React from "react";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { installTypes, whatsappLink } from "@/lib/site-config";
import { track, identifyLead, getLeadAttribution, EVENTS, type InstallType } from "@/lib/analytics";

type FormState = "idle" | "submitting" | "success" | "error";

const FIELDS = ["name", "email", "phone", "postcode"] as const;

export function QuoteForm({ defaultInstallType = "residential" as InstallType, defaultPostcode = "" }) {
  const [state, setState] = React.useState<FormState>("idle");
  const [installType, setInstallType] = React.useState<InstallType>(defaultInstallType);
  const [errors, setErrors] = React.useState<Partial<Record<(typeof FIELDS)[number], string>>>({});
  const startedRef = React.useRef(false);

  React.useEffect(() => setInstallType(defaultInstallType), [defaultInstallType]);

  function onFirstInteraction() {
    if (startedRef.current) return;
    startedRef.current = true;
    track(EVENTS.QUOTE_STARTED, { install_type: installType });
  }

  function validate(form: HTMLFormElement) {
    const data = new FormData(form);
    const next: typeof errors = {};
    if (!String(data.get("name") || "").trim()) next.name = "Please enter your name.";
    const email = String(data.get("email") || "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";
    const phone = String(data.get("phone") || "").replace(/\s/g, "");
    if (phone.length < 7) next.phone = "Enter a contactable phone number.";
    if (!String(data.get("postcode") || "").trim()) next.postcode = "Enter your postcode.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!validate(form)) return;

    setState("submitting");
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name")),
      email: String(fd.get("email")),
      phone: String(fd.get("phone")),
      postcode: String(fd.get("postcode")),
      install_type: installType,
      service: installType,
      notes: String(fd.get("notes") || ""),
      // attribution captured client-side and sent with the lead
      meta: getLeadAttribution(),
    };

    track(EVENTS.QUOTE_SUBMITTED, { install_type: installType });

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("bad status");
      const json = (await res.json()) as { lead_id: string; persisted?: boolean };

      // Kick off property-intelligence enrichment — fire and forget.
      if (json.persisted) {
        fetch(`/api/leads/${json.lead_id}/enrich`, { method: "POST", keepalive: true }).catch(() => {});
      }

      identifyLead(json.lead_id, { email: payload.email, install_type: installType });
      track(EVENTS.LEAD_CREATED, { install_type: installType, lead_id: json.lead_id });
      setState("success");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-2xl border border-success/30 bg-success/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
        <h3 className="mt-4 text-xl font-bold">Thanks — your quote request is in.</h3>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          One of our install team will be in touch within one working day with your fixed, all-in price. Need a faster
          answer?
        </p>
        <Button asChild variant="whatsapp" size="lg" className="mt-4">
          <a
            href={whatsappLink()}
            onClick={() => track(EVENTS.WHATSAPP_CLICKED, { channel: "whatsapp", cta_location: "quote_success" })}
          >
            Chat on WhatsApp
          </a>
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      onChange={onFirstInteraction}
      noValidate
      aria-label="Free Starlink quote request"
      className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-lg sm:p-6"
    >
      <Field id="name" label="Full name" error={errors.name}>
        <Input id="name" name="name" autoComplete="name" placeholder="Jane Smith" required />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="email" label="Email" error={errors.email}>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="jane@email.com" required />
        </Field>
        <Field id="phone" label="Phone" error={errors.phone}>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="07700 900000" required />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="postcode" label="Postcode" error={errors.postcode}>
          <Input
            id="postcode"
            name="postcode"
            autoComplete="postal-code"
            placeholder="CA11 7JN"
            defaultValue={defaultPostcode}
            className="uppercase"
            required
          />
        </Field>
        <Field id="install_type" label="Property / use">
          <Select value={installType} onValueChange={(v) => setInstallType(v as InstallType)}>
            <SelectTrigger id="install_type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {installTypes.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field id="notes" label="Anything we should know? (optional)">
        <Textarea id="notes" name="notes" placeholder="Mounting location, existing setup, access notes…" />
      </Field>

      {state === "error" ? (
        <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Something went wrong sending your request. Please try again, or message us on WhatsApp.
        </p>
      ) : null}

      <Button type="submit" size="xl" className="w-full" disabled={state === "submitting"}>
        {state === "submitting" ? (
          <>
            <Loader2 className="animate-spin" /> Sending…
          </>
        ) : (
          <>
            Get my free quote <ArrowRight />
          </>
        )}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        No obligation. We&apos;ll only use your details to prepare your quote — see our{" "}
        <a href="/privacy" className="underline">
          privacy policy
        </a>
        .
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

