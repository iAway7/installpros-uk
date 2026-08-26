import { cn } from "@/lib/utils";

const TERMS_URL = "https://installpros.co.uk/terms-and-conditions/";
const PRIVACY_URL = "https://installpros.co.uk/privacy-policy/";

/**
 * Legal notice shown UNDER the submit button. Terms acceptance is a contract
 * (not GDPR consent), so it needs no checkbox — submitting the form is the
 * agreement. "tone" adapts to the dark hero vs a light card.
 */
export function FormLegalNotice({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const link = cn(
    "underline underline-offset-2 transition-colors",
    dark ? "text-white/90 hover:text-white" : "text-foreground hover:text-brand-hover",
  );
  return (
    <p className={cn("mt-4 text-center text-caption leading-relaxed", dark ? "text-white/70" : "text-muted-foreground")}>
      By submitting, you agree to our{" "}
      <a href={TERMS_URL} target="_blank" rel="noopener noreferrer" className={link}>
        Terms
      </a>{" "}
      and acknowledge our{" "}
      <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" className={link}>
        Privacy&nbsp;Policy
      </a>
      .
    </p>
  );
}
