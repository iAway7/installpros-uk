"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { WhatsAppIcon } from "./ui/whatsapp-icon";
import { Button } from "@/components/system/button";
import { Input } from "@/components/system/input";
import { Label } from "@/components/system/label";
import { Textarea } from "@/components/system/textarea";
import { Choicebox, ChoiceboxGroup } from "@/components/system/choicebox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/system/select";
import { track, EVENTS } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/funnel/contact";
import { readSectorInterest } from "@/lib/funnel/sector-interest";
import {
  BUSINESS_TYPES,
  SECTOR_TO_BUSINESS_TYPE,
  SYSTEMS,
  TIMEFRAMES,
  MAX_NOTES,
} from "@/lib/funnel/qualification";

/** The three questions answered by a group of boxes rather than one control.
 *  Hoisted because each is needed twice, visibly and as the fieldset's
 *  accessible name, and two copies of a sentence drift. */
const QUESTIONS = {
  timeframe: "How soon do you need it working?",
  hasStarlink: "Is there a Starlink on site already?",
  systems: "What needs to stay connected?",
} as const;

/** The question above a Choicebox group. Not the Label component: that renders
 *  a <label htmlFor>, and a group of radios has no single control to point at.
 *  ChoiceboxGroup names the fieldset itself, so this is the visible half and
 *  carries Label's typography by hand. */
function GroupLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <p className="mb-2 flex flex-wrap items-baseline gap-x-2 text-body font-semibold text-foreground">
      <span>{children}</span>
      {hint && <span className="text-caption font-normal text-muted-foreground">{hint}</span>}
    </p>
  );
}

/**
 * Post-submit qualification for the commercial funnel.
 *
 * The hero form asks for contact details and nothing else, because every field
 * in front of a visitor is a field they can abandon on. This screen asks the
 * rest, after the lead is already in the CRM, where a long form costs nothing:
 * there is no conversion left to lose. That split is the whole design, and it
 * is why every question here is optional and why the copy says so twice.
 *
 * The answers attach to the lead that was just created, keyed by the `leadId`
 * on the redirect. No second record, nothing to reconcile. Without an id there
 * is nothing to attach to, so the form is replaced by the WhatsApp route
 * rather than rendered as a thing that silently cannot save.
 *
 * Residential gets a different screen. It wants photos, and asking a
 * homeowner which VPN they run would be absurd; see thank-you-path.ts.
 */
export function SurveyPrepCard() {
  const [leadId, setLeadId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [hasStarlink, setHasStarlink] = useState<boolean | null>(null);
  const [systems, setSystems] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // The query string wins over the stored copy: it describes this navigation
    // rather than whatever the tab did last. Same order as the photo card.
    let id: string | null = null;
    try {
      id = new URLSearchParams(window.location.search).get("leadId");
    } catch {
      /* noop */
    }
    if (!id) {
      try {
        const raw = sessionStorage.getItem("quoteFormData");
        if (raw) id = (JSON.parse(raw) as { leadId?: string }).leadId ?? null;
      } catch {
        /* storage blocked */
      }
    }
    // A lead that was never persisted carries a throwaway local_ id, which no
    // row matches. Treat it as no id at all instead of posting into the void.
    if (id && id.startsWith("local_")) id = null;
    setLeadId(id);

    // Do not ask what we already watched them say. Somebody who came through
    // the Warehouses card has answered "business type" by clicking it.
    try {
      const sector = readSectorInterest();
      if (sector && SECTOR_TO_BUSINESS_TYPE[sector]) setBusinessType(SECTOR_TO_BUSINESS_TYPE[sector]);
    } catch {
      /* noop */
    }

    setReady(true);
    track(EVENTS.PAGE_VIEW, { cta_location: "thank_you_survey", lead_id: id ?? undefined });
  }, []);

  const answeredCount = useMemo(() => {
    let n = 0;
    if (companyName.trim()) n++;
    if (businessType) n++;
    if (timeframe) n++;
    if (hasStarlink !== null) n++;
    if (systems.length > 0) n++;
    if (notes.trim()) n++;
    return n;
  }, [companyName, businessType, timeframe, hasStarlink, systems, notes]);

  const toggleSystem = (value: string) =>
    setSystems((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

  const waHref = whatsappUrl(
    companyName.trim()
      ? `Hi, I have just requested a commercial Starlink quote for ${companyName.trim()}.`
      : "Hi, I have just requested a commercial Starlink quote.",
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!leadId || saving || answeredCount === 0) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/leads/${leadId}/qualify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: companyName.trim() || null,
          businessType: businessType || null,
          timeframe: timeframe || null,
          hasStarlink,
          systems: systems.length > 0 ? systems : null,
          notes: notes.trim() || null,
        }),
      });
      if (!res.ok) throw new Error(`qualify_failed:${res.status}`);
      track(EVENTS.LEAD_QUALIFIED, { lead_id: leadId, answered_count: answeredCount });
      setDone(true);
    } catch {
      // The lead is safe either way, so this is not a failure worth alarming
      // anybody about. Say what is true: we have their details, this part did
      // not save, and they can tell us on WhatsApp instead.
      toast.error("That did not save. Your quote request is safe, so you can send us the details on WhatsApp instead.");
    } finally {
      setSaving(false);
    }
  }

  const shell =
    "w-full max-w-[480px] md:max-w-[620px] md:rounded-2xl md:border md:border-border md:bg-card md:px-12 md:py-11 md:shadow-raised";

  const receivedPill = (
    <p className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/10 py-1.5 pl-2.5 pr-3.5">
      <CheckCircle2 className="h-[15px] w-[15px] text-success" aria-hidden="true" />
      <span className="text-caption font-semibold text-success md:text-body-sm">Request received</span>
    </p>
  );

  if (done) {
    return (
      <div className={shell}>
        {receivedPill}
        <h1 className="mt-4 md:mt-5 text-[29px] md:text-[36px] font-bold leading-[1.15] md:leading-[1.12] tracking-[-0.02em] md:tracking-[-0.025em] text-foreground [text-wrap:pretty]">
          That is everything we need
        </h1>
        <p className="mt-3.5 text-body md:text-lead leading-[1.55] md:leading-[1.6] text-muted-foreground [text-wrap:pretty]">
          Your answers are on file with your request. One of the team will call to arrange the survey, and you will have
          a fixed quote after it.
        </p>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track(EVENTS.WHATSAPP_CLICKED, { channel: "whatsapp", cta_location: "thank_you_survey", lead_id: leadId ?? undefined })}
          className="focus-ring-solid mt-7 flex h-control-lg items-center justify-center gap-2.5 rounded-lg bg-primary text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-primary-foreground transition-colors duration-quick ease-ds hover:bg-brand-hover"
        >
          <WhatsAppIcon className="h-[19px] w-[19px]" />
          Message us on WhatsApp
        </a>
        <p className="mt-3.5 text-center text-caption md:text-body-sm leading-[1.5] text-muted-foreground">
          Monday to Friday, 8am to 6pm.
        </p>
      </div>
    );
  }

  return (
    <div className={shell}>
      {receivedPill}
      <h1 className="mt-4 md:mt-5 text-[29px] md:text-[36px] font-bold leading-[1.15] md:leading-[1.12] tracking-[-0.02em] md:tracking-[-0.025em] text-foreground [text-wrap:pretty]">
        Help us prepare for your survey
      </h1>
      {/* The promise has to match what is on screen. Without an id there are no
          questions below, so the version that counts them would be describing
          a form the visitor cannot see. */}
      <p className="mt-3.5 text-body md:text-lead leading-[1.55] md:leading-[1.6] text-muted-foreground [text-wrap:pretty]">
        {ready && !leadId
          ? "We have your details and we will be in touch today. Anything you can tell us about the site now means the survey is spent looking at your building instead of asking the basics."
          : "We have your details and we will be in touch today either way. Five questions here means the survey is spent looking at your building instead of asking the basics."}
      </p>

      {/* No id means nothing to attach answers to, which happens when the lead
          was not persisted or somebody opens the page directly. Offering the
          form anyway would be a form that cannot save. */}
      {ready && !leadId ? (
        <>
          <p className="mt-6 rounded-lg border border-border bg-secondary px-4 py-3.5 text-body-sm leading-[1.55] text-muted-foreground">
            Send us the details on WhatsApp and we will add them to your request.
          </p>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track(EVENTS.WHATSAPP_CLICKED, { channel: "whatsapp", cta_location: "thank_you_survey" })}
            className="focus-ring-solid mt-5 flex h-control-lg items-center justify-center gap-2.5 rounded-lg bg-primary text-button font-[var(--button-weight)] uppercase tracking-[var(--button-tracking)] text-primary-foreground transition-colors duration-quick ease-ds hover:bg-brand-hover"
          >
            <WhatsAppIcon className="h-[19px] w-[19px]" />
            Message us on WhatsApp
          </a>
        </>
      ) : (
        <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-7">
          <div>
            <Label htmlFor="company-name">Company name</Label>
            <Input
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="As it appears on your invoices"
              autoComplete="organization"
              maxLength={200}
            />
          </div>

          <div>
            <Label htmlFor="business-type">What kind of site is it?</Label>
            <Select value={businessType} onValueChange={setBusinessType}>
              <SelectTrigger id="business-type">
                <SelectValue placeholder="Choose the closest match" />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_TYPES.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <GroupLabel>{QUESTIONS.timeframe}</GroupLabel>
            <ChoiceboxGroup label={QUESTIONS.timeframe}>
              {/* Full width on a phone. Two across, "One to three months" wraps
                  to three lines at 375px and the row ends up twice the height
                  of the text in it. The Yes/No pair below stays two across
                  because two words cannot wrap. */}
              {TIMEFRAMES.map((o) => (
                <Choicebox
                  key={o.value}
                  name="timeframe"
                  title={o.label}
                  selected={timeframe === o.value}
                  onSelect={() => setTimeframe(o.value)}
                  className="basis-full sm:basis-[calc(50%-6px)]"
                />
              ))}
            </ChoiceboxGroup>
          </div>

          <div>
            <GroupLabel>{QUESTIONS.hasStarlink}</GroupLabel>
            <ChoiceboxGroup label={QUESTIONS.hasStarlink}>
              <Choicebox
                name="has-starlink"
                title="Yes"
                selected={hasStarlink === true}
                onSelect={() => setHasStarlink(true)}
                className="basis-[calc(50%-6px)]"
              />
              <Choicebox
                name="has-starlink"
                title="No"
                selected={hasStarlink === false}
                onSelect={() => setHasStarlink(false)}
                className="basis-[calc(50%-6px)]"
              />
            </ChoiceboxGroup>
          </div>

          <div>
            <GroupLabel hint="Pick as many as apply">{QUESTIONS.systems}</GroupLabel>
            <ChoiceboxGroup label={QUESTIONS.systems}>
              {SYSTEMS.map((o) => (
                <Choicebox
                  key={o.value}
                  multi
                  title={o.label}
                  selected={systems.includes(o.value)}
                  onSelect={() => toggleSystem(o.value)}
                  className="basis-full sm:basis-[calc(50%-6px)]"
                />
              ))}
            </ChoiceboxGroup>
          </div>

          <div>
            <Label htmlFor="survey-notes">Anything else we should know?</Label>
            <Textarea
              id="survey-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Access, opening hours, how many buildings, what goes wrong today"
              maxLength={MAX_NOTES}
              rows={3}
            />
          </div>

          <div>
            <Button type="submit" size="lg" disabled={saving || answeredCount === 0} className="w-full">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Saving
                </>
              ) : (
                "Send to the survey team"
              )}
            </Button>
            <p className="mt-3.5 text-center text-caption md:text-body-sm leading-[1.5] text-muted-foreground">
              All optional. Leave anything you would rather talk through.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
