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
import { isValidUkPostcode, normalisePostcode } from "@/lib/utils";
import { checkUkPostcode } from "@/lib/funnel/check-postcode";
import { validateName, validatePhone, validateEmail, formatPhone, isValidUkPhone } from "@/lib/funnel/validation";
import { submitLead } from "@/lib/funnel/submit-lead";
import { storedPlanForLead } from "@/lib/funnel/hikvision-plan";
import { track, EVENTS } from "@/lib/analytics";
import { HikvisionNeedStep, type HikvisionIntent } from "./hikvision-need-step";

// Never on screen on the Ajax page (no address mode, no service dropdown), so
// their code loads only if a form ever renders them instead of on every visit
// (Lighthouse, 19 October 2026: about 40 KB gzipped of the first load).
const AddressAutocomplete = dynamic(() => import("./ui/address-autocomplete").then((m) => m.AddressAutocomplete));

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

/**
 * The hero funnel for the Ajax landing. A copy of zip-availability-checker.tsx,
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
 * HIKVISION COPY, 27 October 2026, of security-hero-funnel.tsx, which the
 * live Ajax page renders. Changed: the first step asks New cameras / Add to
 * mine / Fix my system (hikvision-need-step.tsx) and sends it as the intent
 * with no need; the hero alerts' callback is gone (this hero has none); and
 * the lead goes to /thank-you-hikvision. Validation and tracking are the
 * Ajax copy's, so the funnel numbers stay comparable.
 */
/**
 * Hero multi-step funnel: postcode availability → name → phone → email → install
 * type. The postcode is validated against postcodes.io before the lead form
 * begins.
 */
export function HikvisionHeroFunnel(
  { addressMode = false, defaultInstallType = "", skipServiceStep = false, formName = "hero_funnel" }: {
    addressMode?: boolean;
    /** Pre-selects the install type on a segment landing. Somebody who arrived
     *  on the commercial page and read a commercial headline should not be
     *  asked what they are installing. On its own it keeps the step visible so
     *  they can correct us; pair it with skipServiceStep to remove it. */
    defaultInstallType?: string;
    /** Removes the install-type step. Needs defaultInstallType to be set. */
    skipServiceStep?: boolean;
    /** Names this form in analytics and on the lead, e.g. "starlink_commercial",
     *  so a lead is traceable to the landing page that produced it. */
    formName?: string;
  } = {},
) {
  const router = useRouter();
  // A landing that already knows what it is selling can drop the install-type
  // step. Will's reasoning, and it is right: the page is the segment, so the
  // question's answer is already on the screen above the form.
  //
  // It only takes effect together with a default, because submit() still needs
  // a value and the page no longer has a control that could set one. When it
  // is on, the consent box and the legal notice move to whatever the last step
  // now is, so nothing is quietly dropped along with the step.
  const skipService = skipServiceStep && defaultInstallType !== "";
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
    postcode: "", address: "", fullName: "", phone: "", email: "", installationType: defaultInstallType,
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
    track(EVENTS.CTA_CLICKED, { cta_id: `intent_${value}`, cta_label: value, cta_location: "hero" });
  }

  // Past the first step once a chip was picked.
  const started = intent !== null;

  // Back from the postcode undoes either.
  function backToStart() {
    setIntent(null);
  }

  // Straight to the postcode once they have picked, so the keyboard is up.
  useEffect(() => {
    if (started && step === 0) postcodeRef.current?.focus();
  }, [started, step]);
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
      // the Continue button, and since blur fires before click, the button
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
  //
  // Unless it is a street rather than a house. Google returns a postal_code
  // component only for premise-level results, and a UK street can span several
  // postcodes, so picking "De La Bere Ave" yields none. This used to fall back
  // to `sel.postcode || sel.address`, writing the formatted address into the
  // postcode field; api/lead cut it to 12 characters and every postcode-keyed
  // lookup (Propalt, the Ofcom outcode join, EPC, value band, crime) came back
  // empty. Nothing that is not a postcode goes in that field now, and without
  // one we fall back to the street's coordinates, which api/address/details
  // resolves to the nearest real postcode. That is the right area but not
  // necessarily their house, so it is flagged "approximate" and carried as
  // such. Only when that fails too does the step stop: status stays "idle"
  // and the Next button stays disabled.
  //
  // The event reports precision either way, so PostHog separates "we knew the
  // house" from "we guessed the street" from "we got nothing".
  function onAddressSelect(sel: AddressSelection) {
    const pc = normalisePostcode(sel.postcode);
    if (!isValidUkPostcode(pc)) {
      setRegion("");
      setStatus("idle");
      setError("We couldn't find a postcode for that. Try picking your house number from the list.");
      setFormData((f) => ({ ...f, postcode: "", address: sel.address, postcodePrecision: "none" }));
      track(EVENTS.COVERAGE_CHECKED, {
        postcode: "", coverage_result: "needs_house_number", location_name: sel.town || "",
        form_name: formName, form_position: "hero", postcode_precision: "none",
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
      form_name: formName, form_position: "hero", postcode_precision: sel.precision,
    });
  }

  useEffect(() => {
    if (step === 1) nameRef.current?.focus();
    else if (step === 2) phoneRef.current?.focus();
    else if (step === 3) emailRef.current?.focus();
  }, [step]);

  // Per-step funnel tracking, so PostHog shows exactly where people drop off.
  useEffect(() => {
    // Step 0 is still "postcode", as on every other page, so the funnels stay
    // comparable. The tap before it reports as "intent", numbered -1.
    if (step === 0 && !started) {
      track(EVENTS.FORM_STEP_VIEWED, { step_number: -1, step_name: "intent", form_name: formName });
      return;
    }
    const names = ["postcode", "name", "phone", "email", "install_type"];
    track(EVENTS.FORM_STEP_VIEWED, { step_number: step, step_name: names[step], form_name: formName });
  }, [step, started, formName]);

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
    const res = await checkUkPostcode(pc);
    if (res.status === "available") {
      setRegion(res.region);
      setStatus("available");
      setFormData((f) => ({ ...f, postcode: pc, postcodePrecision: "exact" }));
      track(EVENTS.COVERAGE_CHECKED, {
        postcode: pc, coverage_result: "available", location_name: res.region,
        form_name: formName, form_position: "hero",
      });
    } else if (res.status === "invalid") {
      setStatus("invalid");
      setError("That doesn't look like a valid UK postcode. Please check and try again.");
      track(EVENTS.COVERAGE_CHECKED, {
        postcode: pc, coverage_result: "invalid", form_name: formName, form_position: "hero",
      });
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
   * NOTE: do not reformat this field on blur.
   *
   * Tidying "SW1A1AA" into "SW1A 1AA" when the field loses focus looks
   * harmless, but blur fires on mousedown, i.e. *inside* the click on the
   * Continue button. The resulting state update re-renders the button between
   * mousedown and mouseup and the first press is swallowed, the user has to
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
      // Consent deliberately NOT gated here. `submit()` already handles it , 
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
    // recorded, but it never blocks submission, clicking "Get My Free Quote"
    // is itself the request. Legal sign-off pending before removing the box.
    setIsSubmitting(true);
    try {
      const leadId = await submitLead({
        zipCode: formData.postcode, state: region, fullName: formData.fullName,
        phone: formData.phone, email: formData.email, address: formData.address || undefined,
        installationType: formData.installationType, source: "hero_funnel",
        marketingConsent: consent, formName, postcodePrecision: formData.postcodePrecision,
        intent: intent ?? undefined,
        // The plan from a planner, if they made one (migration 0024); not for
        // a repair, where the places do not matter.
        cameraPlan: intent === "repair" ? undefined : storedPlanForLead(),
      });
      toast.success("Quote request submitted!");
      // Its own thank-you page: thankYouPath() maps install_type security to
      // the Ajax one, and this page shares that install type. The intent rides
      // along so the page can ask an owner for the recorder's label.
      router.push(`/thank-you-hikvision?leadId=${encodeURIComponent(leadId)}${intent ? `&intent=${intent}` : ""}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false);
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
            <HikvisionNeedStep tone="dark" name="hero-intent" onChoose={chooseIntent} className={anim} />
          )}
          {step === 0 && started && (
            <div className={`space-y-6 ${anim}`}>
              <div className="space-y-2 text-center">
                <p className="text-body font-semibold text-white/80">Step 1 of {totalSteps}</p>
                <h2 className="h2-form text-white">Where&apos;s the property?</h2>
              </div>
              <div className="relative !mt-4">
                {addressMode ? (
                  <AddressAutocomplete
                    value={address}
                    onChange={(v) => {
                      markStarted("address");
                      setAddress(v);
                      // Always clear: the street warning leaves us on "idle",
                      // so the old guard would have kept it on screen.
                      setError("");
                      if (status !== "idle") setStatus("idle");
                    }}
                    onSelect={onAddressSelect}
                    placeholder="Start typing your address…"
                    className="text-body md:text-lg"
                  />
                ) : (
                  <>
                    <Input
                      ref={postcodeRef}
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
              {error && (
                <p id="err-postcode" role="alert" className="text-center text-body text-error">{error}</p>
              )}
            </div>
          )}

          {step === 1 && (
            <StepField anim={anim} stepLabel={`Step 2 of ${totalSteps}`} title="What's your name?" error={errors.fullName} errorId="err-name">
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
            <StepField anim={anim} stepLabel={`Step 3 of ${totalSteps}`} title="What's your phone number?" error={errors.phone} errorId="err-phone">
              <div className="relative">
                <Input
                  ref={phoneRef} type="tel" value={formData.phone} onChange={onPhoneChange}
                  // Surfaces the error as soon as they leave the field, instead of
                  // making them press a button to find out what is wrong.
                  onBlur={() => { if (formData.phone.trim()) checkPhone(); }}
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
            <StepField anim={anim} stepLabel={`Step 4 of ${totalSteps}`} title="What's your email?" error={errors.email} errorId="err-email">
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

          {/* The consent box and the legal notice belong to the last step,
              wherever that is. Without this they would vanish with step 4. */}
          {skipService && step === 3 && (
            <div className={`mt-6 ${anim}`}>
              <ConsentCheckbox
                checked={consent}
                onChange={setConsent}
                tone="dark"
                id="hero-marketing"
                label={<MarketingConsentLabel tone="dark" />}
              />
            </div>
          )}

          {step === 4 && (
            <div className={`space-y-6 ${anim}`}>
              <div className="space-y-2 text-center">
                <p className="text-body font-semibold text-white/80">Step 5 of {totalSteps}</p>
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
                label={<MarketingConsentLabel tone="dark" />}
              />
            </div>
          )}
        </div>

        {started && (
          <div className="flex gap-3">
            {/* "Back" plus "Get My Free Quote" need 309px, which the hero has
                from 341px. Narrower, Back keeps only its arrow (the word stays
                for screen readers) and the submit may wrap rather than run off
                the edge. */}
            <Button onClick={step === 0 ? backToStart : back} variant="secondary" disabled={isTransitioning}>
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
