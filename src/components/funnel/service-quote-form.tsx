"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, ArrowRight, ArrowLeft, Home, Ship, Building2, Caravan } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/system/input";
import { AddressAutocomplete, type AddressSelection } from "./ui/address-autocomplete";
import { Button } from "@/components/system/button";
import { FormOption } from "@/components/system/form-option";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/system/select";
import { ConsentCheckbox } from "./consent-checkbox";
import { FormLegalNotice } from "./form-legal-notice";
import { SERVICE_OPTIONS } from "@/lib/funnel/states";
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

const INSTALL_OPTIONS = [
  { value: "residential", label: "Residential", icon: <Home className="h-6 w-6" /> },
  { value: "marine", label: "Marine", icon: <Ship className="h-6 w-6" /> },
  { value: "commercial", label: "Commercial", icon: <Building2 className="h-6 w-6" /> },
  { value: "mobile_rv", label: "Mobile/RV", icon: <Caravan className="h-6 w-6" /> },
];

/**
 * CTA form: postcode → name → phone → email → final step.
 *
 * Final step depends on context (`serviceMode`):
 *  - "starlink" (default): visitor is on a Starlink page, so we already know the
 *    service — ask "What are we installing?" with install-type cards instead.
 *  - "any": generic placements (blog posts etc.) — service <Select> dropdown.
 */
export function ServiceQuoteForm({
  defaultService = "",
  serviceMode = "starlink",
  addressMode = false,
}: {
  defaultService?: string;
  serviceMode?: "starlink" | "any";
  addressMode?: boolean;
}) {
  const router = useRouter();
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
  });
  const [errors, setErrors] = useState({ fullName: "", phone: "", email: "" });
  const [showPhoneCheck, setShowPhoneCheck] = useState(false);
  const [showEmailCheck, setShowEmailCheck] = useState(false);
  const [consent, setConsent] = useState(false); // optional marketing opt-in

  const nameRef = useRef<HTMLInputElement>(null);
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
  function onAddressSelect(sel: AddressSelection) {
    const area = sel.town || sel.postcode || "your area";
    setRegion(area);
    setStatus("available");
    setError("");
    setFormData((f) => ({ ...f, postcode: sel.postcode || sel.address, address: sel.address }));
  }

  useEffect(() => {
    if (step === 1) nameRef.current?.focus();
    else if (step === 2) phoneRef.current?.focus();
    else if (step === 3) emailRef.current?.focus();
  }, [step]);

  // Per-step funnel tracking for precise drop-off analysis in PostHog.
  useEffect(() => {
    const names = ["postcode", "name", "phone", "email", "service"];
    track(EVENTS.FORM_STEP_VIEWED, { step_number: step, step_name: names[step], form_name: "cta_form" });
  }, [step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || isTransitioning || isSubmitting) return;
      if (step === 0 && status === "available") next();
      else if (step > 0 && step < 4 && canProceed()) stepNext();
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
      setFormData((f) => ({ ...f, postcode: pc }));
    } else if (res.status === "invalid") {
      setStatus("invalid");
      setError("That doesn't look like a valid UK postcode. Please check and try again.");
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
      // See zip-availability-checker: gating on consent here disables the
      // button, which makes submit()'s consent error unreachable — the user is
      // blocked with no explanation. Let the click through and explain.
      case 4: return formData.installationType !== "";
      default: return true;
    }
  }

  async function submit() {
    if (!checkName() || !checkPhone() || !checkEmail()) { toast.error("Please check all fields for errors"); return; }
    if (!formData.installationType) { toast.error("Please select a service"); return; }
    // Consent optional (conservative path) — recorded, never blocks submission.
    setIsSubmitting(true);
    try {
      const leadId = await submitLead({
        zipCode: formData.postcode, state: region, fullName: formData.fullName,
        phone: formData.phone, email: formData.email, address: formData.address || undefined,
        installationType: formData.installationType, source: "cta_section",
        marketingConsent: consent,
      });
      toast.success("Quote request submitted!");
      router.push(`/thank-you?leadId=${leadId}`);
    } catch {
      toast.error("Something went wrong. Please try again."); setIsSubmitting(false);
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
            <div className={`space-y-4 ${anim}`}>
              <div className="text-center">
                <h2 className="h2-form text-foreground">Check Availability</h2>
              </div>
              <div className="relative">
                {addressMode ? (
                  <AddressAutocomplete
                    value={address}
                    onChange={(v) => { setAddress(v); if (status !== "idle") { setStatus("idle"); setError(""); } }}
                    onSelect={onAddressSelect}
                    placeholder="Start typing your address…"
                    className="text-body md:text-lg"
                  />
                ) : (
                  <>
                    <Input
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
              <div className="min-h-[100px]">
                {status === "checking" && <p className="text-center text-muted-foreground">Checking availability...</p>}
                {status === "available" && (
                  <div className="space-y-4">
                    <p className="flex flex-wrap items-center justify-center gap-x-1.5 text-center text-body text-foreground">
                      <Check className="h-5 w-5 rounded bg-success/20 p-0.5 text-success" />
                      <span className="font-semibold text-success">Great!</span>
                      <span>
                        We&apos;re available in{" "}
                        <span className="font-semibold text-success underline">{region}</span>.
                      </span>
                    </p>
                    <Button onClick={next} className="w-full">Get a Quote <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 1 && (
            <StepField anim={anim} label={`Step 1 of ${TOTAL_STEPS}`} title="What's your name?" error={errors.fullName} errorId="cta-err-name">
              <Input ref={nameRef} type="text" value={formData.fullName} onChange={(e) => setFormData((d) => ({ ...d, fullName: e.target.value }))} placeholder="Full Name" inputSize="lg" aria-label="Full name" state={errors.fullName ? "error" : "default"} aria-describedby={errors.fullName ? "cta-err-name" : undefined} className="text-center text-body md:text-[22px]" />
            </StepField>
          )}
          {step === 2 && (
            <StepField anim={anim} label={`Step 2 of ${TOTAL_STEPS}`} title="What's your phone number?" error={errors.phone} errorId="cta-err-phone">
              <div className="relative">
                <Input ref={phoneRef} type="tel" value={formData.phone} onChange={onPhoneChange} placeholder="07123 456789" inputSize="lg" aria-label="Phone number" state={errors.phone ? "error" : "default"} aria-describedby={errors.phone ? "cta-err-phone" : undefined} className="text-center text-body md:text-[22px]" />
                {showPhoneCheck && <Check className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-success" />}
              </div>
            </StepField>
          )}
          {step === 3 && (
            <StepField anim={anim} label={`Step 3 of ${TOTAL_STEPS}`} title="What's your email?" error={errors.email} errorId="cta-err-email">
              <div className="relative">
                <Input ref={emailRef} type="email" value={formData.email} onChange={onEmailChange} placeholder="you@example.com" inputSize="lg" aria-label="Email" state={errors.email ? "error" : "default"} aria-describedby={errors.email ? "cta-err-email" : undefined} className="text-center text-body md:text-[22px]" />
                {showEmailCheck && <Check className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-success" />}
              </div>
            </StepField>
          )}
          {step === 4 && (
            <div className={`space-y-4 ${anim}`}>
              <div className="space-y-2 text-center">
                <p className="text-body font-semibold text-primary">Step 4 of {TOTAL_STEPS}</p>
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
                      key={o.value}
                      label={o.label}
                      selected={formData.installationType === o.value}
                      onClick={() => setFormData((d) => ({ ...d, installationType: o.value }))}
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
                label={<>Keep me updated on offers and news from Install Pros <span className="text-muted-foreground/60">(optional)</span>.</>}
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

        {step === 4 && <FormLegalNotice tone="light" />}
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
