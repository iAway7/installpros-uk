import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge classifies `text-*` by looking the suffix up in its own table.
 * Our type scale lives in tailwind.config as custom fontSize keys, which that
 * table has never heard of — so it guessed "colour", and dropped `text-label`
 * whenever a colour class sat beside it in the same call. The class vanished and
 * the element silently inherited its parent's size.
 *
 * Registering the scale here is what makes `cn("text-label", "text-primary-foreground")`
 * keep both. Anything added to `fontSize` in tailwind.config has to be added
 * here too, or it will disappear the same way.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["micro", "label", "caption", "body-sm", "body", "entry", "lead", "title", "button"] }],
      h: [{ h: ["control-sm", "control-aux", "control", "control-lg"] }],
      w: [{ w: ["control-sm", "control-aux", "control", "control-lg"] }],
      "min-w": [{ "min-w": ["control-aux"] }],
      rounded: [{ rounded: ["xs"] }],
      duration: [{ duration: ["quick", "card", "panel"] }],
      "shadow": [{ shadow: ["raised", "popover", "overlay"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/** UK postcode validator (covers standard formats incl. GIR 0AA). */
export function isValidUkPostcode(value: string): boolean {
  const re =
    /^(GIR ?0AA|[A-PR-UWYZ]([0-9]{1,2}|([A-HK-Y][0-9]([0-9ABEHMNPRV-Y])?)|[0-9][A-HJKPS-UW]) ?[0-9][ABD-HJLNP-UW-Z]{2})$/i;
  return re.test(value.trim());
}

export function normalisePostcode(value: string): string {
  const v = value.toUpperCase().replace(/\s+/g, "");
  if (v.length < 5) return v;
  return `${v.slice(0, v.length - 3)} ${v.slice(-3)}`;
}

/**
 * Sanitises a `?next=` redirect target.
 *
 * The login form and the Supabase auth callback both forward the visitor to
 * wherever `next` points once the session exists. Taken raw that is an open
 * redirect: `next=@evil.com` resolves to `https://evil.com` (our own host is
 * parsed as URL userinfo), and `next=.evil.com` to an attacker-owned
 * `site.co.uk.evil.com` — either one lands a freshly-authenticated user on a
 * phishing page wearing our address bar.
 *
 * Only same-origin absolute paths survive. Rejected:
 *   - anything not starting with "/"  -> absolute URLs, "@evil.com"
 *   - "//host" and "/\host"           -> protocol-relative (browsers fold "\" into "/")
 *   - control characters              -> header / URL splitting
 */
export function safeNextPath(value: string | null | undefined, fallback = "/dashboard"): string {
  if (!value || typeof value !== "string") return fallback;
  if (value[0] !== "/") return fallback;
  if (value[1] === "/" || value[1] === "\\") return fallback;
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code < 0x20 || code === 0x7f) return fallback;
  }
  return value;
}
