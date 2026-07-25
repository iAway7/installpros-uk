"use client";

import * as React from "react";
import { Loader2, MapPin, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, isValidUkPostcode, normalisePostcode } from "@/lib/utils";
import { installTypes } from "@/lib/site-config";
import { track, EVENTS, type InstallType } from "@/lib/analytics";

type Status = "idle" | "checking" | "available" | "waitlist" | "invalid" | "error";

interface CoverageResponse {
  result: "available" | "waitlist" | "invalid";
  location_name?: string;
  region?: string;
  eta_days?: number;
}

/**
 * The US-funnel differentiator: a REAL postcode coverage check that echoes the
 * caller's actual location ("Great news — Starlink is live in Penrith, Cumbria")
 * instead of the UK site's generic, fake-feeling "Starlink is Available!".
 * Pairs with an install-type selector to qualify the lead before the form.
 */
export function CoverageChecker({ onProceed }: { onProceed?: (ctx: { postcode: string; installType: InstallType }) => void }) {
  const [postcode, setPostcode] = React.useState("");
  const [installType, setInstallType] = React.useState<InstallType>("residential");
  const [status, setStatus] = React.useState<Status>("idle");
  const [data, setData] = React.useState<CoverageResponse | null>(null);
  const liveRef = React.useRef<HTMLDivElement>(null);

  async function check(e: React.FormEvent) {
    e.preventDefault();
    const clean = normalisePostcode(postcode);
    if (!isValidUkPostcode(clean)) {
      setStatus("invalid");
      track(EVENTS.COVERAGE_CHECKED, { postcode: clean, coverage_result: "invalid", install_type: installType });
      return;
    }

    setStatus("checking");
    try {
      const res = await fetch("/api/coverage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postcode: clean, install_type: installType }),
      });
      const json = (await res.json()) as CoverageResponse;
      setData(json);
      setStatus(json.result);
      track(EVENTS.COVERAGE_CHECKED, {
        postcode: clean,
        coverage_result: json.result,
        location_name: json.location_name,
        install_type: installType,
      });
    } catch {
      setStatus("error");
    }
  }

  function proceed() {
    track(EVENTS.QUOTE_STARTED, { install_type: installType, postcode: normalisePostcode(postcode) });
    onProceed?.({ postcode: normalisePostcode(postcode), installType });
    const form = document.getElementById("quote");
    form?.scrollIntoView({ behavior: "smooth" });
  }

  const showResult = ["available", "waitlist", "invalid", "error"].includes(status);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-lg sm:p-6">
      <form onSubmit={check} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="postcode" className="text-foreground">
            Check Starlink coverage at your address
          </Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="postcode"
                inputMode="text"
                autoComplete="postal-code"
                placeholder="e.g. CA11 7JN"
                aria-describedby="coverage-status"
                value={postcode}
                onChange={(e) => {
                  setPostcode(e.target.value);
                  if (status !== "idle" && status !== "checking") setStatus("idle");
                }}
                className="pl-10 uppercase"
              />
            </div>
            <Button type="submit" size="lg" className="sm:w-auto" disabled={status === "checking"}>
              {status === "checking" ? (
                <>
                  <Loader2 className="animate-spin" /> Checking…
                </>
              ) : (
                <>
                  Check coverage <ArrowRight />
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="install-type">What are you connecting?</Label>
          <Select value={installType} onValueChange={(v) => setInstallType(v as InstallType)}>
            <SelectTrigger id="install-type" aria-label="Installation type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {installTypes.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label} — <span className="text-muted-foreground">{t.blurb}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </form>

      {/* Live region: result is announced to screen readers */}
      <div id="coverage-status" aria-live="polite" ref={liveRef} className={cn("mt-4", !showResult && "sr-only")}>
        {status === "available" && data ? (
          <div className="rounded-xl border border-success/30 bg-success/10 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
              <div className="space-y-2">
                <p className="font-semibold text-foreground">
                  Great news — Starlink is live in {data.location_name}
                  {data.region ? `, ${data.region}` : ""}.
                </p>
                <p className="text-sm text-muted-foreground">
                  We install in your area. Get a fixed, all-in quote for a {labelFor(installType)} install in under a minute.
                </p>
                <Button onClick={proceed} variant="success" size="lg">
                  Get my free quote <ArrowRight />
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {status === "waitlist" && data ? (
          <div className="rounded-xl border border-accent/30 bg-accent/10 p-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <div className="space-y-2">
                <p className="font-semibold text-foreground">
                  {data.location_name} is in a high-demand cell — short waitlist
                  {data.eta_days ? ` (typically ${data.eta_days} days)` : ""}.
                </p>
                <p className="text-sm text-muted-foreground">
                  Reserve your install now and we&apos;ll confirm your slot the moment capacity opens.
                </p>
                <Button onClick={proceed} variant="accent" size="lg">
                  Reserve my install <ArrowRight />
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {status === "invalid" ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <p className="text-sm text-foreground">
                That doesn&apos;t look like a valid UK postcode. Please check and try again — e.g. <strong>CA11 7JN</strong>.
              </p>
            </div>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
            <p className="text-sm text-foreground">
              We couldn&apos;t check coverage just now.{" "}
              <button onClick={check as never} className="font-semibold underline">
                Try again
              </button>{" "}
              or message us on WhatsApp.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function labelFor(value: InstallType) {
  return installTypes.find((t) => t.value === value)?.label.toLowerCase() ?? "Starlink";
}
