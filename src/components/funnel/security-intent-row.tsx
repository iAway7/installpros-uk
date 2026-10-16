"use client";

/**
 * The optional "what is this for?" row on the last step of the Ajax forms.
 *
 * About a fifth of security enquiries are repairs, additions or takeovers of
 * a system someone else fitted (docs/SECURITY-AJAX-CUSTOMER-INSIGHTS.md), and
 * they used to arrive looking like new installs. One tap tells the team
 * which, before the call.
 *
 * On the last step, never earlier, so it cannot cost anyone the first step.
 * Optional: nothing is selected to start with, a second tap clears it, and
 * submit never waits on it. Toggle buttons (aria-pressed) rather than radios,
 * because "none" is a valid answer and radios cannot go back to it.
 */

export type SecurityIntent = "new" | "add" | "repair";

export const SECURITY_INTENT_LABEL: Record<SecurityIntent, string> = {
  new: "New system",
  add: "Add to what I have",
  repair: "Something stopped working",
};

const ORDER: SecurityIntent[] = ["new", "add", "repair"];

export function SecurityIntentRow({
  tone,
  name,
  value,
  onChange,
  className = "",
}: {
  /** "dark" for the hero, "light" for the closing form. */
  tone: "dark" | "light";
  /** Prefix for the label id; must differ between the two forms on the page. */
  name: string;
  value: SecurityIntent | null;
  onChange: (value: SecurityIntent | null) => void;
  className?: string;
}) {
  const id = `${name}-intent-label`;
  const dark = tone === "dark";
  return (
    <div role="group" aria-labelledby={id} className={className}>
      <p id={id} className={`text-center text-body-sm ${dark ? "text-white/70" : "text-muted-foreground"}`}>
        What&apos;s this for? <span className={dark ? "text-white/50" : "text-muted-foreground/70"}>(optional)</span>
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {ORDER.map((v) => {
          const on = value === v;
          return (
            <button
              key={v}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(on ? null : v)}
              className={`focus-ring-solid h-9 rounded-full border px-3.5 text-body-sm font-medium transition-colors duration-quick ease-ds ${
                dark
                  ? on
                    ? "border-white bg-white text-foreground"
                    : "border-white/25 bg-white/5 text-white/90 hover:border-white/50"
                  : on
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-foreground hover:border-foreground/40"
              }`}
            >
              {SECURITY_INTENT_LABEL[v]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
