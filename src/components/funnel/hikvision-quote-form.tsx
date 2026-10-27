"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Check, Loader2, ArrowRight, ArrowLeft, Home, Ship, Building2, Caravan } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/system/input";
import type { AddressSelection } from "./ui/address-autocomplete";
import { Button } from "@/components/system/button";
import { FormOption } from "@/components/system/form-option";
import { ConsentCheckbox, MarketingConsentLabel } from "./consent-checkbox";
import { FormLegalNotice } from "./form-legal-notice";
import { SERVICE_OPTIONS } from "@/lib/funnel/states";
import { isValidUkPostcode, normalisePostcode } from "@/lib/utils";
import { checkUkPostcode } from "@/lib/funnel/check-postcode";
import { validateName, validatePhone, validateEmail, formatPhone, isValidUkPhone } from "@/lib/funnel/validation";
import { submitLead } from "@/lib/funnel/submit-lead";
import { track, EVENTS } from "@/lib/analytics";
import { HikvisionNeedStep, HIKVISION_INTENT_EVENT, type HikvisionIntent } from "./hikvision-need-step";

// Never on screen on the Ajax page (no address mode, no service dropdown), so
// their code loads only if a form ever renders them instead of on every visit
// (Lighthouse, 19 October 2026: about 40 KB gzipped of the first load).
const AddressAutocomplete = dynamic(() => import("./ui/address-autocomplete").then((m) => m.AddressAutocomplete));
const Select = dynamic(() => import("@/components/system/select").then((m) => m.Select));
const SelectContent = dynamic(() => import("@/components/system/select").then((m) => m.SelectContent));
const SelectItem = dynamic(() => import("@/components/system/select").then((m) => m.SelectItem));
const SelectTrigger = dynamic(() => import("@/components/system/select").then((m) => m.SelectTrigger));
const SelectValue = dynamic(() => import("@/components/system/select").then((m) => m.SelectValue));

type CheckStatus = "idle" | "checking" | "available" | "invalid";

interface FormData {
  postcode: string;
  address: string;
  fullName: string;
  phone: string;
  email: string;
  installationType: string;
  /** How postcode was obtained: "approximate" when it came from the street's
   *  coordinates rather than the visitor's own premise. Travels to the lead so
   *  nobody reads street-level area data as the exact house. */
  postcodePrecision?: "exact" | "approximate" | "none";
}

const cleanPostcode = (v: string) => v.toUpperCase().replace(/[^A-Z0-9 ]/g, "").slice(0, 8);

const INSTALL_OPTIONS = [
  { value: "residential", label: "Residential", icon: <Home className="h-6 w-6" /> },
  { value: "marine", label: "Marine", icon: <Ship className="h-6 w-6" /> },
  { value: "commercial", label: "Commercial", icon: <Building2 className="h-6 w-6" /> },
  { value: "mobile_rv", label: "Mobile/RV", icon: <Caravan className="h-6 w-6" /> },
];

/**
 * The closing form for the Ajax landing. A copy of service-quote-form.tsx,
 * which /install-quote renders and which is not changed for another page.
 *
 * Changed from the original, 14 October 2026: the copy of the first step.
 * "Check Availability" is a Starlink question, where coverage is the real
 * doubt. Alarms and cameras are fitted UK-wide, and only 5 of 125 security
 * buyers in the chats asked whether we cover their area, so the step asks
 * where the property is instead. Since 17 October nothing is said once
 * the postcode checks out (Gus): no "We cover {area}", no checking line,
 * only the tick in the field and Next coming on.
 * Everything else, validation and tracking included, is the original's, so
 * the funnel numbers stay comparable with the other pages.
 *
 * Also changed: a one-tap first step before the postcode, "What do you need?
 * Alarm / Cameras / Both" (security-need-step.tsx, with the reasons).
 *
 * HIKVISION COPY, 27 October 2026, of security-quote-form.tsx, which the live
 * Ajax page renders. Changed: the first step asks New cameras / Add to mine /
 * Fix my system (hikvision-need-step.tsx) and sends it as the intent with no
 * need; the "Already have cameras?" section opens it on a chip through
 * HIKVISION_INTENT_EVENT; and the lead goes to /thank-you-hikvision.
 */

/**
 * CTA form: postcode → name → phone → email → final step.
 *
 * Final step depends on context (`serviceMode`):
 *  - "starlink" (default): visitor is on a Starlink page, so we already know the
 *    service: ask "What are we installing?" with install-type cards instead.
 *  - "any": generic placements (blog posts etc.): service <Select> dropdown.
 */
export function HikvisionQuoteForm({
  defaultService = "",
  serviceMode = "starlink",
  addressMode = false,
  skipServiceStep = false,
  formName = "cta_form",
}: {
  defaultService?: string;
  serviceMode?: "starlink" | "any";
  addressMode?: boolean;
  /** Removes the service step. Needs defaultService to be set. */
  skipServiceStep?: boolean;
  /** Names this form in analytics and on the lead, e.g. "starlink_commercial",
   *  so a lead is traceable to the landing page that produced it. */
  formName?: string;
}) {
  const router = useRouter();
  // A landing that already knows what it is selling can drop the service step.
  // Will's reasoning, and it is right: the page is the segment, so the
  // question's answer is already on the screen above the form.
  //
  // It only takes effect together with defaultService, because submit() still
  // needs a value and the page no longer has a control that could set one. The
  // consent box and the legal notice move to whatever the last step now is, so
  // nothing is quietly dropped along with the step.
  const skipService = skipServiceStep && defaultService !== "";
  const lastStep = skipService ? 3 : 4;
  // The postcode is step 1 of the numbered steps now: the "What do you need?"
  // tap comes before it, unnumbered, the way the postcode used to be. So the
  // count runs one past the original's and the Back/Next row starts at the
  // postcode, with Back returning to the tap.
  const totalSteps = lastStep + 1;

  const [step, setStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<CheckStatus>("idle");
  const [region, setRegion] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    postcode: "", address: "", fullName: "", phone: "", email: "", installationType: defaultService,
    postcodePrecision: "none",
  });
  const [errors, setErrors] = useState({ fullName: "", phone: "", email: "" });
  const [showPhoneCheck, setShowPhoneCheck] = useState(false);
  const [showEmailCheck, setShowEmailCheck] = useState(false);
  const [consent, setConsent] = useState(false); // optional marketing opt-in

  const nameRef = useRef<HTMLInputElement>(null);

  // The one-tap first step (hikvision-need-step.tsx), null until chosen.
  // Sent as leads.intent with no need (migration 0022 allows new, add and
  // repair); see that file for what this asks of Will's Zap.
  const [intent, setIntent] = useState<HikvisionIntent | null>(null);
  const postcodeRef = useRef<HTMLInputElement>(null);

  function chooseIntent(value: HikvisionIntent) {
    setIntent(value);
    track(EVENTS.CTA_CLICKED, { cta_id: `intent_${value}`, cta_label: value, cta_location: "final_cta" });
  }

  // Past the first step once a chip was picked.
  const started = intent !== null;

  // Back from the postcode undoes either.
  function backToStart() {
    setIntent(null);
  }

  // The "Already have cameras?" section's buttons (HIKVISION_INTENT_EVENT,
  // the intent in `detail`). Only from the first step, so it never undoes an
  // enquiry already under way.
  useEffect(() => {
    const onIntent = (e: Event) => {
      const value = (e as CustomEvent<HikvisionIntent>).detail;
      if (step === 0 && value) chooseIntent(value);
    };
    window.addEventListener(HIKVISION_INTENT_EVENT, onIntent);
    return () => window.removeEventListener(HIKVISION_INTENT_EVENT, onIntent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Straight to the postcode once they have picked, so the keyboard is up.
  useEffect(() => {
    if (started && step === 0) postcodeRef.current?.focus();
  }, [started, step]);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step !== 0 || addressMode) return;
    const pc = normalisePostcode(postcode);
    if (isValidUkPostcode(pc)) check(pc);
    else { setStatus("idle"); setError(""); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postcode, step]);

  // Address mode: a chosen suggestion is a real UK address → coverage available.
  //
  // Google returns a postal_code component only for premise-level results. Pick
  // a route (a whole street) and there is none, because a UK street can span
  // several postcodes. This used to fall back to `sel.postcode || sel.address`,
  // which put the formatted address into the postcode field; api/lead then cut
  // it to 12 characters ("DE LA BERE A") and every lookup keyed on the postcode
  // came back empty: Propalt, the Ofcom outcode join, EPC, value band, crime.
  //
  // Blocking on that was the first fix, and it cost us the visitor. What the
  // street pick does still carry is coordinates, so api/address/details now
  // turns those into the nearest real postcode: right area, right outcode , 
  // which is all the Ofcom join and broadband data need, but not necessarily
  // their own house, hence `precision: "approximate"` travelling with it all
  // the way to the lead. Nothing that is not a postcode is ever written to the
  // postcode field. We only stop the visitor when even the coordinates gave
  // nothing, which leaves status "idle" and keeps the Next button disabled.
  //
  // coverage_checked fires from here now. This form never reported it at all , 
  // only the hero checker did, so every coverage number we had described the
  // top of the page and nothing else, while this is the form that carries
  // commercial and both vehicle landings. A low needs_house_number count was
  // unreadable: it could mean nobody gets stuck, or that we were blind to half
  // the page. form_position says which form; form_name says which landing.
  function onAddressSelect(sel: AddressSelection) {
    const pc = normalisePostcode(sel.postcode);
    if (!isValidUkPostcode(pc)) {
      setRegion("");
      setStatus("idle");
      setError("We couldn't find a postcode for that. Try picking your house number from the list.");
      setFormData((f) => ({ ...f, postcode: "", address: sel.address, postcodePrecision: "none" }));
      track(EVENTS.COVERAGE_CHECKED, {
        postcode: "", coverage_result: "needs_house_number", location_name: sel.town || "",
        form_name: formName, form_position: "footer", postcode_precision: "none",
      });
      return;
    }
    const area = sel.town || pc;
    setRegion(area);
    setStatus("available");
    setError("");
    setFormData((f) => ({ ...f, postcode: pc, address: sel.address, postcodePrecision: sel.precision }));
    track(EVENTS.COVERAGE_CHECKED, {
      postcode: pc, coverage_result: "available", location_name: area,
      form_name: formName, form_position: "footer", postcode_precision: sel.precision,
    });
  }

  useEffect(() => {
    if (step === 1) nameRef.current?.focus();
    else if (step === 2) phoneRef.current?.focus();
    else if (step === 3) emailRef.current?.focus();
  }, [step]);

  // Per-step funnel tracking for precise drop-off analysis in PostHog.
  useEffect(() => {
    // Step 0 is still "postcode", as on every other page, so the funnels stay
    // comparable. The tap before it reports as "intent", numbered -1.
    if (step === 0 && !started) {
      track(EVENTS.FORM_STEP_VIEWED, { step_number: -1, step_name: "intent", form_name: formName });
      return;
    }
    const names = ["postcode", "name", "phone", "email", "service"];
    track(EVENTS.FORM_STEP_VIEWED, { step_number: step, step_name: names[step], form_name: formName });
  }, [step, started, formName]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || isTransitioning || isSubmitting) return;
      if (step === 0 && status === "available") next();
      else if (step > 0 && step < lastStep && canProceed()) stepNext();
    };
    window.addEventListener("keypress", onKey);
    return () => window.removeEventListener("keypress", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, status, isTransitioning, isSubmitting, formData]);

  async function check(pc: string) {
    setError(""); setStatus("checking");
    const res = await checkUkPostcode(pc);
    if (res.status === "available") {
      setRegion(res.region); setStatus("available");
      setFormData((f) => ({ ...f, postcode: pc, postcodePrecision: "exact" }));
      track(EVENTS.COVERAGE_CHECKED, {
        postcode: pc, coverage_result: "available", location_name: res.region,
        form_name: formName, form_position: "footer",
      });
    } else if (res.status === "invalid") {
      setStatus("invalid");
      setError("That doesn't look like a valid UK postcode. Please check and try again.");
      track(EVENTS.COVERAGE_CHECKED, {
        postcode: pc, coverage_result: "invalid", form_name: formName, form_position: "footer",
      });
    } else {
      setStatus("idle");
      setError("We couldn't check your postcode just now. Please try again.");
    }
  }

  const onPostcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => setPostcode(cleanPostcode(e.target.value));

  function next() {
    setIsTransitioning(true); setDirection("forward");
    setTimeout(() => { setStep((s) => s + 1); setIsTransitioning(false); }, 300);
  }
  function back() {
    if (step === 0) return;
    setIsTransitioning(true); setDirection("backward");
    setTimeout(() => { setStep((s) => s - 1); setIsTransitioning(false); }, 300);
  }

  const checkName = () => { const e = validateName(formData.fullName); setErrors((p) => ({ ...p, fullName: e ?? "" })); return !e; };
  const checkPhone = () => { const e = validatePhone(formData.phone); setErrors((p) => ({ ...p, phone: e ?? "" })); return !e; };
  const checkEmail = () => { const e = validateEmail(formData.email); setErrors((p) => ({ ...p, email: e ?? "" })); return !e; };

  function onPhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = formatPhone(e.target.value);
    setFormData((d) => ({ ...d, phone: f }));
    // The tick means "this is a valid UK number", not "you've typed enough
    // characters", a length check showed a green tick on numbers the form
    // then rejected on submit.
    setShowPhoneCheck(isValidUkPhone(f));
  }
  function onEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setFormData((d) => ({ ...d, email: v }));
    const ok = !validateEmail(v);
    setShowEmailCheck(ok);
    if (ok) setErrors((p) => ({ ...p, email: "" }));
  }

  function canProceed() {
    switch (step) {
      case 1: return formData.fullName.trim().length > 0;
      // Was `length === 14`, the width of the old US "(XXX) XXX-XXXX" mask.
      // No valid UK number is ever exactly 14 characters, so Next never enabled.
      // Was `isValidUkPhone(...)`, which made this the only step whose gate was
      // the full validation. A wrong number left the button grey and nothing on
      // screen said why, because validatePhone's message is only written by
      // checkPhone(), and checkPhone() only runs on a click the disabled button
      // could never receive. Same trap the consent note below describes. Now the
      // gate is "they typed something" and the click explains the rest.
      case 2: return formData.phone.trim().length > 0;
      case 3: return formData.email.includes("@");
      // See zip-availability-checker: gating on consent here disables the
      // button, which makes submit()'s consent error unreachable, the user is
      // blocked with no explanation. Let the click through and explain.
      case 4: return formData.installationType !== "";
      default: return true;
    }
  }

  async function submit() {
    if (!checkName() || !checkPhone() || !checkEmail()) { toast.error("Please check all fields for errors"); return; }
    if (!formData.installationType) { toast.error("Please select a service"); return; }
    // Consent optional (conservative path), recorded, never blocks submission.
    setIsSubmitting(true);
    try {
      const leadId = await submitLead({
        zipCode: formData.postcode, state: region, fullName: formData.fullName,
        phone: formData.phone, email: formData.email, address: formData.address || undefined,
        installationType: formData.installationType, source: "cta_section",
        marketingConsent: consent, formName, postcodePrecision: formData.postcodePrecision,
        intent: intent ?? undefined,
      });
      toast.success("Quote request submitted!");
      // Its own thank-you page: thankYouPath() maps install_type security to
      // the Ajax one, and this page shares that install type. The intent rides
      // along so the page can ask an owner for the recorder's label.
      router.push(`/thank-you-hikvision?leadId=${encodeURIComponent(leadId)}${intent ? `&intent=${intent}` : ""}`);
    } catch {
      toast.error("Something went wrong. Please try again."); setIsSubmitting(false);
    }
  }

  function stepNext() {
    if (step === 1 && checkName()) return next();
    if (step === 2 && checkPhone()) return next();
    if (step === 3 && checkEmail()) return skipService ? submit() : next();
    if (step === 4) return submit();
  }

  const anim = isTransitioning
    ? direction === "forward" ? "animate-[slideOutLeft_0.3s_ease-out]" : "animate-[slideOutRight_0.3s_ease-out]"
    : direction === "forward" ? "animate-[slideInRight_0.3s_ease-out]" : "animate-[slideInLeft_0.3s_ease-out]";

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="space-y-6">
        <div>
          {step === 0 && !started && (
            <HikvisionNeedStep tone="light" name="final-intent" onChoose={chooseIntent} className={anim} />
          )}
          {step === 0 && started && (
            <div className={`space-y-4 ${anim}`}>
              <div className="space-y-2 text-center">
                <p className="text-body font-semibold text-primary">Step 1 of {totalSteps}</p>
                <h2 className="h2-form text-foreground">Where&apos;s the property?</h2>
              </div>
              <div className="relative">
                {addressMode ? (
                  <AddressAutocomplete
                    value={address}
                    onChange={(v) => { setAddress(v); setError(""); if (status !== "idle") setStatus("idle"); }}
                    onSelect={onAddressSelect}
                    placeholder="Start typing your address…"
                    className="text-body md:text-lg"
                  />
                ) : (
                  <>
                    <Input
                      ref={postcodeRef}
                      type="text" value={postcode} onChange={onPostcodeChange} placeholder="e.g. SW1A 1AA"
                      inputSize="lg" maxLength={8} aria-label="Postcode" autoComplete="postal-code"
                      state={status === "invalid" ? "error" : "default"}
                      aria-describedby={error ? "cta-err-postcode" : undefined}
                      className="text-center text-body uppercase md:text-[22px]"
                    />
                    {status === "checking" && <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-primary" />}
                    {status === "available" && <Check className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-success" />}
                  </>
                )}
              </div>
              {error && <p id="cta-err-postcode" role="alert" className="text-center text-body text-error">{error}</p>}
            </div>
          )}

          {step === 1 && (
            <StepField anim={anim} label={`Step 2 of ${totalSteps}`} title="What's your name?" error={errors.fullName} errorId="cta-err-name">
              <Input ref={nameRef} type="text" value={formData.fullName} onChange={(e) => setFormData((d) => ({ ...d, fullName: e.target.value }))} placeholder="Full Name" inputSize="lg" aria-label="Full name" state={errors.fullName ? "error" : "default"} aria-describedby={errors.fullName ? "cta-err-name" : undefined} className="text-center text-body md:text-[22px]" />
            </StepField>
          )}
          {step === 2 && (
            <StepField anim={anim} label={`Step 3 of ${totalSteps}`} title="What's your phone number?" error={errors.phone} errorId="cta-err-phone">
              <div className="relative">
                <Input ref={phoneRef} type="tel" value={formData.phone} onChange={onPhoneChange}
                  /* Ver zip-availability-checker: el error solo se veia al pulsar. */
                  onBlur={() => { if (formData.phone.trim()) checkPhone(); }}
                  placeholder="Enter phone number" inputSize="lg" aria-label="Phone number" state={errors.phone ? "error" : "default"} aria-describedby={errors.phone ? "cta-err-phone" : undefined} className="text-center text-body md:text-[22px]" />
                {showPhoneCheck && <Check className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-success" />}
              </div>
            </StepField>
          )}
          {step === 3 && (
            <StepField anim={anim} label={`Step 4 of ${totalSteps}`} title="What's your email?" error={errors.email} errorId="cta-err-email">
              <div className="relative">
                <Input ref={emailRef} type="email" value={formData.email} onChange={onEmailChange} placeholder="you@example.com" inputSize="lg" aria-label="Email" state={errors.email ? "error" : "default"} aria-describedby={errors.email ? "cta-err-email" : undefined} className="text-center text-body md:text-[22px]" />
                {showEmailCheck && <Check className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-success" />}
              </div>
            </StepField>
          )}

          {/* The consent box and the legal notice belong to the last step,
              wherever that is. Without this they would vanish with step 4. */}
          {skipService && step === 3 && (
            <div className={`mt-6 ${anim}`}>
              <ConsentCheckbox
                checked={consent}
                onChange={setConsent}
                tone="light"
                id="cta-marketing"
                label={<MarketingConsentLabel tone="light" />}
              />
            </div>
          )}

          {step === 4 && (
            <div className={`space-y-4 ${anim}`}>
              <div className="space-y-2 text-center">
                <p className="text-body font-semibold text-primary">Step 5 of {totalSteps}</p>
                <h2 className="h2-form text-foreground">
                  {serviceMode === "starlink" ? "What are we installing?" : "Which service are you looking for?"}
                </h2>
                {serviceMode === "any" && (
                  <p className="text-body text-muted-foreground">Select the service you want a quote for.</p>
                )}
              </div>
              {serviceMode === "starlink" ? (
                <div className="grid grid-cols-2 gap-3">
                  {INSTALL_OPTIONS.map((o) => (
                    <FormOption
                      name="install-type"
                      key={o.value}
                      label={o.label}
                      selected={formData.installationType === o.value}
                      onSelect={() => setFormData((d) => ({ ...d, installationType: o.value }))}
                      icon={o.icon}
                    />
                  ))}
                </div>
              ) : (
                <Select value={formData.installationType} onValueChange={(v) => setFormData((d) => ({ ...d, installationType: v }))}>
                  <SelectTrigger className="h-14 border-field bg-white text-body text-black focus-visible:border-selection-border">
                    <SelectValue placeholder="Select a service..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {SERVICE_OPTIONS.map((s) => (
                      <SelectItem
                        key={s}
                        value={s}
                        className="focus:bg-secondary focus:text-foreground data-[highlighted]:bg-secondary data-[highlighted]:text-foreground data-[state=checked]:bg-secondary"
                      >
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <ConsentCheckbox
                checked={consent}
                onChange={setConsent}
                tone="light"
                id="cta-marketing"
                label={<MarketingConsentLabel tone="light" />}
              />
            </div>
          )}
        </div>

        {started && (
          <div className="flex gap-3">
            {/* "Back" plus "Get My Free Quote" need 309px, which this card only
                has from 405px. Narrower, Back keeps only its arrow (the word
                stays for screen readers) and the submit may wrap rather than
                run off the edge. */}
            <Button onClick={step === 0 ? backToStart : back} variant="secondary" disabled={isTransitioning}>
              <ArrowLeft className="h-4 w-4 sm:mr-2" />
              <span className="sr-only sm:not-sr-only">Back</span>
            </Button>
            <Button
              onClick={step === 0 ? next : stepNext}
              disabled={(step === 0 ? status !== "available" : !canProceed()) || isSubmitting || isTransitioning}
              className="min-w-0 flex-1 whitespace-normal text-center"
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...</>
              ) : (
                <>{step === lastStep ? "Get My Free Quote" : "Next"} <ArrowRight className="ml-2 h-5 w-5" /></>
              )}
            </Button>
          </div>
        )}

        {step === lastStep && <FormLegalNotice tone="light" />}
      </div>
    </div>
  );
}

function StepField({ anim, label, title, error, errorId, children }: { anim: string; label: string; title: string; error?: string; errorId?: string; children: React.ReactNode }) {
  return (
    <div className={`space-y-4 ${anim}`}>
      <div className="space-y-2 text-center">
        <p className="text-body font-semibold text-primary">{label}</p>
        <h2 className="h2-form text-foreground">{title}</h2>
      </div>
      {children}
      {error && (
        <p id={errorId} role="alert" className="text-center text-body text-error">{error}</p>
      )}
    </div>
  );
}
