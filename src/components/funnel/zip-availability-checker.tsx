"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, ArrowRight, ArrowLeft, Home, Ship, Building2, Caravan } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/system/input";
import { AddressAutocomplete, type AddressSelection } from "./ui/address-autocomplete";
import { Button } from "@/components/system/button";
import { FormOption } from "@/components/system/form-option";
import { ConsentCheckbox } from "./consent-checkbox";
import { FormLegalNotice } from "./form-legal-notice";
import { isValidUkPostcode, normalisePostcode } from "@/lib/utils";
import { checkUkPostcode } from "@/lib/funnel/check-postcode";
import { validateName, validatePhone, validateEmail, formatPhone, isValidUkPhone } from "@/lib/funnel/validation";
import { submitLead } from "@/lib/funnel/submit-lead";
import { track, EVENTS } from "@/lib/analytics";

type CheckStatus = "idle" | "checking" | "available" | "invalid";
const TOTAL_STEPS = 4;

interface FormData {
  postcode: string;
  address: string;
  fullName: string;
  phone: string;
  email: string;
  installationType: string;
}

const cleanPostcode = (v: string) => v.toUpperCase().replace(/[^A-Z0-9 ]/g, "").slice(0, 8);

/**
 * Hero multi-step funnel: postcode availability → name → phone → email → install
 * type. The postcode is validated against postcodes.io and the area is echoed
 * back ("We're available in Westminster") before the lead form begins.
 */
export function ZipAvailabilityChecker(
  { smartCoverage = false, addressMode = false }: { smartCoverage?: boolean; addressMode?: boolean } = {},
) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [smartMessage, setSmartMessage] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<CheckStatus>("idle");
  const [region, setRegion] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    postcode: "", address: "", fullName: "", phone: "", email: "", installationType: "",
  });
  const [errors, setErrors] = useState({ fullName: "", phone: "", email: "" });
  const [showPhoneCheck, setShowPhoneCheck] = useState(false);
  const [showEmailCheck, setShowEmailCheck] = useState(false);
  const [consent, setConsent] = useState(false); // optional marketing opt-in

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // Last postcode actually sent to the API, in canonical form.
  const lastChecked = useRef("");
  /*
   * quote_started used to fire from next(), i.e. only once the visitor had
   * typed a postcode AND pressed Continue. The baseline it is compared against
   * counts anyone who *touches* the first field, so measuring it that way read
   * systematically low and would have made a working page look like a failure.
   * It now fires on the first keystroke in the first field, once per mount.
   */
  const startedFired = useRef(false);

  function markStarted(firstField: "postcode" | "address") {
    if (startedFired.current) return;
    startedFired.current = true;
    track(EVENTS.QUOTE_STARTED, { first_field: firstField });
  }

  // Live check once the input forms a valid UK postcode (step 0, postcode mode)
  useEffect(() => {
    if (step !== 0 || addressMode) return;
    const pc = normalisePostcode(postcode);
    if (isValidUkPostcode(pc)) {
      // "SW1A1AA" and "SW1A 1AA" are the same postcode. Re-checking on the
      // blur-triggered reformat sent status back to "checking", which unmounts
      // the Continue button — and since blur fires before click, the button
      // vanished from under the cursor and the first press did nothing.
      // Guarding on the canonical value also stops duplicate API calls.
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

  // Address mode (step 0): a chosen suggestion is itself a real UK address, so
  // we mark coverage available and echo back the post town.
  function onAddressSelect(sel: AddressSelection) {
    const area = sel.town || sel.postcode || "your area";
    setRegion(area);
    setStatus("available");
    setError("");
    setFormData((f) => ({ ...f, postcode: sel.postcode || sel.address, address: sel.address }));
    track(EVENTS.COVERAGE_CHECKED, {
      postcode: sel.postcode || "", coverage_result: "available", location_name: area,
    });
  }

  useEffect(() => {
    if (step === 1) nameRef.current?.focus();
    else if (step === 2) phoneRef.current?.focus();
    else if (step === 3) emailRef.current?.focus();
  }, [step]);

  // Per-step funnel tracking, so PostHog shows exactly where people drop off.
  useEffect(() => {
    const names = ["postcode", "name", "phone", "email", "install_type"];
    track(EVENTS.FORM_STEP_VIEWED, { step_number: step, step_name: names[step], form_name: "hero_funnel" });
  }, [step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || isTransitioning || isSubmitting) return;
      if (step === 0 && status === "available") next();
      else if (step > 0 && canProceed()) stepNext();
    };
    window.addEventListener("keypress", onKey);
    return () => window.removeEventListener("keypress", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, status, isTransitioning, isSubmitting, formData]);

  async function check(pc: string) {
    setError("");
    setStatus("checking");
    setSmartMessage(null);
    const res = await checkUkPostcode(pc);
    if (res.status === "available") {
      setRegion(res.region);
      setStatus("available");
      setFormData((f) => ({ ...f, postcode: pc }));
      track(EVENTS.COVERAGE_CHECKED, { postcode: pc, coverage_result: "available", location_name: res.region });
      // A/B variant: swap in a data-driven coverage message when available.
      // Fire-and-forget — the generic copy stays if this fails or is slow.
      if (smartCoverage) {
        fetch("/api/broadband-coverage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postcode: pc }),
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((json: { state?: string; message?: string | null } | null) => {
            if (json?.message && json.state !== "invalid") setSmartMessage(json.message);
          })
          .catch(() => {});
      }
    } else if (res.status === "invalid") {
      setStatus("invalid");
      setError("That doesn't look like a valid UK postcode. Please check and try again.");
      track(EVENTS.COVERAGE_CHECKED, { postcode: pc, coverage_result: "invalid" });
    } else {
      setStatus("idle");
      setError("We couldn't check your postcode just now. Please try again.");
      // Transient failure: forget it so retyping the same postcode retries
      // instead of being swallowed by the duplicate guard.
      lastChecked.current = "";
    }
  }

  const onPostcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    markStarted("postcode");
    setPostcode(cleanPostcode(e.target.value));
  };
  /*
   * NOTE — do not reformat this field on blur.
   *
   * Tidying "SW1A1AA" into "SW1A 1AA" when the field loses focus looks
   * harmless, but blur fires on mousedown, i.e. *inside* the click on the
   * Continue button. The resulting state update re-renders the button between
   * mousedown and mouseup and the first press is swallowed — the user has to
   * click twice on the single most important control in the funnel.
   *
   * The canonical form is still what gets sent to the API and stored on the
   * lead (see `normalisePostcode` in the effect below); only the input is left
   * exactly as the user typed it. A cosmetic space is not worth putting a
   * state change in the path of the primary CTA.
   */

  function next() {
    setIsTransitioning(true);
    setDirection("forward");
    setTimeout(() => {
      setStep((s) => s + 1);
      setIsTransitioning(false);
    }, 300);
  }
  function back() {
    if (step === 0) return;
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
    // The tick means "this is a valid UK number", not "you've typed enough
    // characters" — a length check showed a green tick on numbers the form
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
      // Was `length === 14` — the width of the old US "(XXX) XXX-XXXX" mask.
      // No valid UK number is ever exactly 14 characters, so Next never enabled.
      case 2: return isValidUkPhone(formData.phone);
      case 3: return formData.email.includes("@");
      // Consent deliberately NOT gated here. `submit()` already handles it —
      // it sets consentError, shows the inline message and toasts. But if the
      // button is disabled, none of that can ever fire: the user selects an
      // install type, the button stays grey, and nothing says why. A disabled
      // control that won't explain itself is a dead end (and screen readers
      // skip it entirely). Let them click; then tell them what's missing.
      case 4: return formData.installationType !== "";
      default: return true;
    }
  }

  async function submit() {
    if (!checkName() || !checkPhone() || !checkEmail()) { toast.error("Please check all fields for errors"); return; }
    if (!formData.installationType) { toast.error("Please select an installation type"); return; }
    // Consent is optional (conservative path): the box is kept and its value
    // recorded, but it never blocks submission — clicking "Get My Free Quote"
    // is itself the request. Legal sign-off pending before removing the box.
    setIsSubmitting(true);
    try {
      const leadId = await submitLead({
        zipCode: formData.postcode, state: region, fullName: formData.fullName,
        phone: formData.phone, email: formData.email, address: formData.address || undefined,
        installationType: formData.installationType, source: "hero_funnel",
        marketingConsent: consent,
      });
      toast.success("Quote request submitted!");
      router.push(`/thank-you?leadId=${leadId}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  function stepNext() {
    if (step === 1 && checkName()) return next();
    if (step === 2 && checkPhone()) return next();
    if (step === 3 && checkEmail()) return next();
    if (step === 4) return submit();
  }

  const anim = isTransitioning
    ? direction === "forward" ? "animate-[slideOutLeft_0.3s_ease-out]" : "animate-[slideOutRight_0.3s_ease-out]"
    : direction === "forward" ? "animate-[slideInRight_0.3s_ease-out]" : "animate-[slideInLeft_0.3s_ease-out]";

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="space-y-6">
        <div>
          {step === 0 && (
            <div className={`space-y-6 ${anim}`}>
              <div className="text-center">
                <h2 className="h2-form mb-2 text-white">Check Availability</h2>
              </div>
              <div className="relative !mt-4">
                {addressMode ? (
                  <AddressAutocomplete
                    value={address}
                    onChange={(v) => {
                      markStarted("address");
                      setAddress(v);
                      if (status !== "idle") { setStatus("idle"); setError(""); }
                    }}
                    onSelect={onAddressSelect}
                    placeholder="Start typing your address…"
                    className="text-body md:text-lg"
                  />
                ) : (
                  <>
                    <Input
                      type="text" value={postcode} onChange={onPostcodeChange}
                      placeholder="e.g. SW1A 1AA" inputSize="lg" maxLength={8} aria-label="Postcode"
                      autoComplete="postal-code"
                      state={status === "invalid" ? "error" : "default"}
                      aria-describedby={error ? "err-postcode" : undefined}
                      className="text-center text-body uppercase md:text-[22px]"
                    />
                    {status === "checking" && (
                      <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-primary" />
                    )}
                    {status === "available" && (
                      <Check className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-success-bright" />
                    )}
                  </>
                )}
              </div>
              {(status === "invalid" || error) && error && (
                <p id="err-postcode" role="alert" className="text-center text-body text-error">{error}</p>
              )}
              <div className="min-h-[100px]">
                {status === "checking" && <p className="text-center text-white/70">Checking availability...</p>}
                {status === "available" && (
                  <div className="space-y-4">
                    {smartMessage ? (
                      <p className="flex flex-wrap items-center justify-center gap-x-1.5 text-center text-body text-white">
                        <Check className="h-5 w-5 rounded bg-success-bright/20 p-0.5 text-success-bright" />
                        <span className="font-semibold text-success-bright">We cover {region}.</span>
                        <span>{smartMessage}</span>
                      </p>
                    ) : (
                      <p className="flex flex-wrap items-center justify-center gap-x-1.5 text-center text-body text-white">
                        <Check className="h-5 w-5 rounded bg-success-bright/20 p-0.5 text-success-bright" />
                        <span className="font-semibold text-success-bright">Great!</span>
                        <span>
                          We&apos;re available in{" "}
                          <span className="font-semibold text-success-bright underline">{region}</span>.
                        </span>
                      </p>
                    )}
                    <Button onClick={next} className="w-full">
                      Get a quote <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 1 && (
            <StepField anim={anim} stepLabel={`Step 1 of ${TOTAL_STEPS}`} title="What's your name?" error={errors.fullName} errorId="err-name">
              <Input
                ref={nameRef} type="text" value={formData.fullName}
                onChange={(e) => setFormData((d) => ({ ...d, fullName: e.target.value }))}
                placeholder="Full Name" inputSize="lg" aria-label="Full name"
                state={errors.fullName ? "error" : "default"}
                aria-describedby={errors.fullName ? "err-name" : undefined}
                className="text-center text-body md:text-[22px]"
              />
            </StepField>
          )}

          {step === 2 && (
            <StepField anim={anim} stepLabel={`Step 2 of ${TOTAL_STEPS}`} title="What's your phone number?" error={errors.phone} errorId="err-phone">
              <div className="relative">
                <Input
                  ref={phoneRef} type="tel" value={formData.phone} onChange={onPhoneChange}
                  placeholder="Enter phone number" inputSize="lg" aria-label="Phone number"
                  state={errors.phone ? "error" : "default"}
                  aria-describedby={errors.phone ? "err-phone" : undefined}
                  className="text-center text-body md:text-[22px]"
                />
                {showPhoneCheck && <Check className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-success-bright" />}
              </div>
            </StepField>
          )}

          {step === 3 && (
            <StepField anim={anim} stepLabel={`Step 3 of ${TOTAL_STEPS}`} title="What's your email?" error={errors.email} errorId="err-email">
              <div className="relative">
                <Input
                  ref={emailRef} type="email" value={formData.email} onChange={onEmailChange}
                  placeholder="you@example.com" inputSize="lg" aria-label="Email"
                  state={errors.email ? "error" : "default"}
                  aria-describedby={errors.email ? "err-email" : undefined}
                  className="text-center text-body md:text-[22px]"
                />
                {showEmailCheck && <Check className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-success-bright" />}
              </div>
            </StepField>
          )}

          {step === 4 && (
            <div className={`space-y-6 ${anim}`}>
              <div className="space-y-2 text-center">
                <p className="text-body font-semibold text-white/80">Step 4 of {TOTAL_STEPS}</p>
                <h2 className="h2-form text-white">What are we installing?</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {INSTALL_OPTIONS.map((o) => (
                  <FormOption
                    name="install-type-zip"
                    key={o.value}
                    label={o.label}
                    selected={formData.installationType === o.value}
                    onSelect={() => setFormData((d) => ({ ...d, installationType: o.value }))}
                    icon={o.icon}
                  />
                ))}
              </div>
              <ConsentCheckbox
                checked={consent}
                onChange={setConsent}
                tone="dark"
                id="hero-marketing"
                label={<>Keep me updated on offers and news from Install Pros <span className="text-white/50">(optional)</span>.</>}
              />
            </div>
          )}
        </div>

        {step > 0 && (
          <div className="flex gap-3">
            <Button onClick={back} variant="secondary" disabled={isTransitioning}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button onClick={stepNext} disabled={!canProceed() || isSubmitting || isTransitioning} className="flex-1">
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...</>
              ) : (
                <>{step === 4 ? "Get My Free Quote" : "Next"} <ArrowRight className="ml-2 h-5 w-5" /></>
              )}
            </Button>
          </div>
        )}

        {step === 4 && <FormLegalNotice tone="dark" />}
      </div>
    </div>
  );
}

const INSTALL_OPTIONS = [
  { value: "residential", label: "Residential", icon: <Home className="hidden h-6 w-6 sm:block" /> },
  { value: "marine", label: "Marine", icon: <Ship className="hidden h-6 w-6 sm:block" /> },
  { value: "commercial", label: "Commercial", icon: <Building2 className="hidden h-6 w-6 sm:block" /> },
  { value: "mobile_rv", label: "Mobile/RV", icon: <Caravan className="hidden h-6 w-6 sm:block" /> },
];

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
