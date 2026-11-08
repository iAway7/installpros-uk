"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/system/input";
import { Button } from "@/components/system/button";
import { ConsentCheckbox, MarketingConsentLabel } from "./consent-checkbox";
import { FormLegalNotice } from "./form-legal-notice";
import { isValidUkPostcode, normalisePostcode } from "@/lib/utils";
import { checkUkPostcode } from "@/lib/funnel/check-postcode";
import { validateName, validatePhone, validateEmail, formatPhone, isValidUkPhone } from "@/lib/funnel/validation";
import { submitLead } from "@/lib/funnel/submit-lead";
import { track, EVENTS } from "@/lib/analytics";
import { ConnectivityNeedStep, type ConnectivityNeed } from "./connectivity-need-step";

type CheckStatus = "idle" | "checking" | "available" | "invalid";

const cleanPostcode = (v: string) => v.toUpperCase().replace(/[^A-Z0-9 ]/g, "").slice(0, 8);

/**
 * The form for the 4G/5G and fibre page, in the hero and in the closing band.
 * A copy of voip-lead-form.tsx (itself a cut-down copy of the live Hikvision
 * hero funnel), with its own first tap. Both forms sit on dark, so one
 * component serves both, told apart by `position` (analytics) and
 * `formName` (the lead).
 *
 * Steps: "What's your internet now?" (connectivity-need-step.tsx,
 * unnumbered), postcode, name, phone, email. Validation and tracking are the
 * Hikvision copy's, so the funnel numbers stay comparable with the other
 * pages.
 *
 * The postcode comes after the first tap, so people have already started
 * (the postcode is where 76 to 89% of abandons happen on the other funnels).
 * Here it is also the thing the check runs on: fibre plans and mobile
 * networks are looked up by address.
 *
 * install_type `connectivity` (migration 0027, NOT applied when written:
 * until it runs the insert fails). After the form, /thank-you-connectivity.
 */
export function ConnectivityLeadForm({
  formName,
  position,
}: {
  /** Names this form on the lead, e.g. "connectivity_4g5g". */
  formName: string;
  /** "hero" or "final_cta", for analytics and the radio group names. */
  position: "hero" | "final_cta";
}) {
  const router = useRouter();
  const lastStep = 3;
  // The postcode is step 1 of the numbered steps: the tap comes before it,
  // unnumbered, as on the Hikvision page.
  const totalSteps = lastStep + 1;

  const [step, setStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [postcode, setPostcode] = useState("");
  const [status, setStatus] = useState<CheckStatus>("idle");
  const [region, setRegion] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({ postcode: "", fullName: "", phone: "", email: "" });
  const [errors, setErrors] = useState({ fullName: "", phone: "", email: "" });
  const [showPhoneCheck, setShowPhoneCheck] = useState(false);
  const [showEmailCheck, setShowEmailCheck] = useState(false);
  const [consent, setConsent] = useState(false); // optional marketing opt-in

  const [need, setNeed] = useState<ConnectivityNeed | null>(null);
  // Analytics names the closing form "footer", as on every other page.
  const formPosition = position === "hero" ? "hero" : "footer";
  const started = need !== null;

  const postcodeRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  function chooseNeed(value: ConnectivityNeed) {
    setNeed(value);
    track(EVENTS.CTA_CLICKED, { cta_id: `need_${value}`, cta_label: value, cta_location: position });
  }

  // Straight to the postcode once they have picked, so the keyboard is up.
  useEffect(() => {
    if (started && step === 0) postcodeRef.current?.focus();
  }, [started, step]);

  // Last postcode actually sent to the API, in canonical form.
  const lastChecked = useRef("");
  // quote_started fires on the first keystroke in the first field, once per
  // mount, as on every other funnel (see hikvision-hero-funnel.tsx).
  const startedFired = useRef(false);

  function markStarted() {
    if (startedFired.current) return;
    startedFired.current = true;
    track(EVENTS.QUOTE_STARTED, { first_field: "postcode" });
  }

  useEffect(() => {
    if (step !== 0) return;
    const pc = normalisePostcode(postcode);
    if (isValidUkPostcode(pc)) {
      // Guard on the canonical value: re-checking on a reformat unmounts the
      // Next button under the cursor (see hikvision-hero-funnel.tsx).
      if (pc === lastChecked.current) return;
      lastChecked.current = pc;
      check(pc);
    } else {
      lastChecked.current = "";
      setStatus("idle");
      setError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postcode, step]);

  useEffect(() => {
    if (step === 1) nameRef.current?.focus();
    else if (step === 2) phoneRef.current?.focus();
    else if (step === 3) emailRef.current?.focus();
  }, [step]);

  // Per-step funnel tracking. Step 0 is "postcode", as on every other page;
  // the tap before it reports as "need", numbered -1.
  useEffect(() => {
    if (step === 0 && !started) {
      track(EVENTS.FORM_STEP_VIEWED, { step_number: -1, step_name: "need", form_name: formName });
      return;
    }
    const names = ["postcode", "name", "phone", "email"];
    track(EVENTS.FORM_STEP_VIEWED, { step_number: step, step_name: names[step], form_name: formName });
  }, [step, started, formName]);

  async function check(pc: string) {
    setError("");
    setStatus("checking");
    const res = await checkUkPostcode(pc);
    if (res.status === "available") {
      setRegion(res.region);
      setStatus("available");
      setFormData((f) => ({ ...f, postcode: pc }));
      track(EVENTS.COVERAGE_CHECKED, {
        postcode: pc, coverage_result: "available", location_name: res.region,
        form_name: formName, form_position: formPosition,
      });
    } else if (res.status === "invalid") {
      setStatus("invalid");
      setError("That doesn't look like a valid UK postcode. Please check and try again.");
      track(EVENTS.COVERAGE_CHECKED, {
        postcode: pc, coverage_result: "invalid", form_name: formName, form_position: formPosition,
      });
    } else {
      setStatus("idle");
      setError("We couldn't check your postcode just now. Please try again.");
      lastChecked.current = "";
    }
  }

  function next() {
    setIsTransitioning(true);
    setDirection("forward");
    setTimeout(() => { setStep((s) => s + 1); setIsTransitioning(false); }, 300);
  }
  function back() {
    if (step === 0) return setNeed(null);
    setIsTransitioning(true);
    setDirection("backward");
    setTimeout(() => { setStep((s) => s - 1); setIsTransitioning(false); }, 300);
  }

  const checkName = () => { const e = validateName(formData.fullName); setErrors((p) => ({ ...p, fullName: e ?? "" })); return !e; };
  const checkPhone = () => { const e = validatePhone(formData.phone); setErrors((p) => ({ ...p, phone: e ?? "" })); return !e; };
  const checkEmail = () => { const e = validateEmail(formData.email); setErrors((p) => ({ ...p, email: e ?? "" })); return !e; };

  function onPhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = formatPhone(e.target.value);
    setFormData((d) => ({ ...d, phone: f }));
    setShowPhoneCheck(isValidUkPhone(f));
  }
  function onEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setFormData((d) => ({ ...d, email: v }));
    const ok = !validateEmail(v);
    setShowEmailCheck(ok);
    if (ok) setErrors((p) => ({ ...p, email: "" }));
  }

  // Gates are "they typed something"; the click explains the rest (see the
  // notes in hikvision-hero-funnel.tsx on why full validation never gates).
  function canProceed() {
    switch (step) {
      case 1: return formData.fullName.trim().length > 0;
      case 2: return formData.phone.trim().length > 0;
      case 3: return formData.email.includes("@");
      default: return true;
    }
  }

  async function submit() {
    if (!checkName() || !checkPhone() || !checkEmail()) { toast.error("Please check all fields for errors"); return; }
    setIsSubmitting(true);
    try {
      const leadId = await submitLead({
        zipCode: formData.postcode, state: region, fullName: formData.fullName,
        phone: formData.phone, email: formData.email,
        installationType: "connectivity", source: position === "hero" ? "hero_funnel" : "cta_form",
        marketingConsent: consent, formName, postcodePrecision: "exact",
        need: need ?? undefined,
      });
      toast.success("Quote request submitted!");
      // The need rides along so the thank-you page can word its ask.
      router.push(`/thank-you-connectivity?leadId=${encodeURIComponent(leadId)}${need ? `&need=${need}` : ""}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  function stepNext() {
    if (step === 1 && checkName()) return next();
    if (step === 2 && checkPhone()) return next();
    if (step === 3 && checkEmail()) return submit();
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || isTransitioning || isSubmitting || !started) return;
      if (step === 0 && status === "available") next();
      else if (step > 0 && canProceed()) stepNext();
    };
    window.addEventListener("keypress", onKey);
    return () => window.removeEventListener("keypress", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, status, isTransitioning, isSubmitting, formData, started]);

  const anim = isTransitioning
    ? direction === "forward" ? "animate-[slideOutLeft_0.3s_ease-out]" : "animate-[slideOutRight_0.3s_ease-out]"
    : direction === "forward" ? "animate-[slideInRight_0.3s_ease-out]" : "animate-[slideInLeft_0.3s_ease-out]";

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="space-y-6">
        <div>
          {step === 0 && !started && <ConnectivityNeedStep name={`${position}-need`} onChoose={chooseNeed} className={anim} />}

          {step === 0 && started && (
            <StepField anim={anim} stepLabel={`Step 1 of ${totalSteps}`} title="What's your postcode?" error={error} errorId={`${position}-err-postcode`}>
              <div className="relative">
                <Input
                  ref={postcodeRef}
                  type="text" value={postcode}
                  onChange={(e) => { markStarted(); setPostcode(cleanPostcode(e.target.value)); }}
                  placeholder="e.g. SW1A 1AA" inputSize="lg" maxLength={8} aria-label="Postcode"
                  autoComplete="postal-code"
                  state={status === "invalid" ? "error" : "default"}
                  aria-describedby={error ? `${position}-err-postcode` : undefined}
                  className="text-center text-body uppercase md:text-[22px]"
                />
                {status === "checking" && (
                  <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-primary" />
                )}
                {status === "available" && (
                  <Check className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-success-bright" />
                )}
              </div>
            </StepField>
          )}

          {step === 1 && (
            <StepField anim={anim} stepLabel={`Step 2 of ${totalSteps}`} title="What's your name?" error={errors.fullName} errorId={`${position}-err-name`}>
              <Input
                ref={nameRef} type="text" value={formData.fullName}
                onChange={(e) => setFormData((d) => ({ ...d, fullName: e.target.value }))}
                placeholder="Full Name" inputSize="lg" aria-label="Full name" autoComplete="name"
                state={errors.fullName ? "error" : "default"}
                aria-describedby={errors.fullName ? `${position}-err-name` : undefined}
                className="text-center text-body md:text-[22px]"
              />
            </StepField>
          )}

          {step === 2 && (
            <StepField anim={anim} stepLabel={`Step 3 of ${totalSteps}`} title="What's your phone number?" error={errors.phone} errorId={`${position}-err-phone`}>
              <div className="relative">
                <Input
                  ref={phoneRef} type="tel" value={formData.phone} onChange={onPhoneChange}
                  onBlur={() => { if (formData.phone.trim()) checkPhone(); }}
                  placeholder="Enter phone number" inputSize="lg" aria-label="Phone number" autoComplete="tel"
                  state={errors.phone ? "error" : "default"}
                  aria-describedby={errors.phone ? `${position}-err-phone` : undefined}
                  className="text-center text-body md:text-[22px]"
                />
                {showPhoneCheck && <Check className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-success-bright" />}
              </div>
            </StepField>
          )}

          {step === 3 && (
            <>
              <StepField anim={anim} stepLabel={`Step 4 of ${totalSteps}`} title="What's your email?" error={errors.email} errorId={`${position}-err-email`}>
                <div className="relative">
                  <Input
                    ref={emailRef} type="email" value={formData.email} onChange={onEmailChange}
                    placeholder="you@example.com" inputSize="lg" aria-label="Email" autoComplete="email"
                    state={errors.email ? "error" : "default"}
                    aria-describedby={errors.email ? `${position}-err-email` : undefined}
                    className="text-center text-body md:text-[22px]"
                  />
                  {showEmailCheck && <Check className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-success-bright" />}
                </div>
              </StepField>
              <div className={`mt-6 ${anim}`}>
                <ConsentCheckbox
                  checked={consent}
                  onChange={setConsent}
                  tone="dark"
                  id={`${position}-marketing`}
                  label={<MarketingConsentLabel tone="dark" />}
                />
              </div>
            </>
          )}
        </div>

        {started && (
          <div className="flex gap-3">
            <Button onClick={back} variant="secondary" disabled={isTransitioning}>
              <ArrowLeft className="h-4 w-4 min-[350px]:mr-2" />
              <span className="sr-only min-[350px]:not-sr-only">Back</span>
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

        {step === lastStep && <FormLegalNotice tone="dark" />}
      </div>
    </div>
  );
}

function StepField({
  anim, stepLabel, title, error, errorId, children,
}: {
  anim: string; stepLabel: string; title: string; error?: string; errorId?: string; children: React.ReactNode;
}) {
  return (
    <div className={`space-y-6 ${anim}`}>
      <div className="space-y-2 text-center">
        <p className="text-body font-semibold text-white/80">{stepLabel}</p>
        <h2 className="h2-form text-white">{title}</h2>
      </div>
      {children}
      {error && (
        <p id={errorId} role="alert" className="text-center text-body text-error">{error}</p>
      )}
    </div>
  );
}
