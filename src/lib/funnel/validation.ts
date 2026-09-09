/** Plain-function validators replacing the original zod schemas (no extra dep). */

export function validateName(v: string): string | null {
  const t = v.trim();
  if (t.length < 1) return "Name is required";
  if (t.length > 100) return "Name must be less than 100 characters";
  if (!/^[a-zA-Z\s'-]+$/.test(t))
    return "Name can only contain letters, spaces, hyphens, and apostrophes";
  return null;
}

export function validateEmail(v: string): string | null {
  const t = v.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) return "Please enter a valid email address";
  if (t.length > 255) return "Email must be less than 255 characters";
  return null;
}

/**
 * Strips formatting and international prefixes. Length is NOT checked here, so
 * a caller can tell a half-typed number apart from a malformed one and say
 * something useful about it. Use toUkNationalDigits for the validated form.
 */
function stripToNational(v: string): string {
  let d = v.replace(/[^\d+]/g, "");
  if (d.startsWith("+44")) d = "0" + d.slice(3);
  else if (d.startsWith("0044")) d = "0" + d.slice(4);
  else if (d.startsWith("44") && !d.startsWith("440")) d = "0" + d.slice(2);
  return d;
}

/**
 * Reduces any UK phone input to canonical national digits ("02033977003"),
 * accepting +44, 0044 and bare 44 international prefixes.
 * Returns "" when the input can't be reduced to something plausible.
 *
 * Mobiles are checked separately because they have no exceptions: every UK
 * mobile is 07 plus nine digits, always eleven. The general rule below allows
 * ten because a few real numbers are ten (016977 in Brampton, most 0800
 * service numbers), and that leniency was letting a ten-digit 07 through with
 * a green tick. Will spotted it on 0712389128.
 */
export function toUkNationalDigits(v: string): string {
  const d = stripToNational(v);
  if (!/^0\d{9,10}$/.test(d)) return "";
  if (d.startsWith("07") && d.length !== 11) return "";
  return d;
}

export const isValidUkPhone = (v: string): boolean => toUkNationalDigits(v) !== "";

export function validatePhone(v: string): string | null {
  if (!v.trim()) return "Phone number is required";
  if (isValidUkPhone(v)) return null;
  // Naming the actual problem beats repeating the generic hint. Someone one
  // digit short of a mobile has made a typo, not chosen the wrong format.
  const d = stripToNational(v);
  if (/^07\d*$/.test(d) && d.length !== 11) {
    return "A UK mobile is 11 digits, e.g. 07700 900123";
  }
  return "Enter a UK phone number, e.g. 07700 900123";
}

/**
 * Deliberately NOT an input mask.
 *
 * UK numbering has several incompatible grouping rules — 020 XXXX XXXX,
 * 07XXX XXXXXX, 01XXX XXXXXX, 011X XXX XXXX — so any single mask guesses wrong
 * for most callers and rewrites their number under the cursor while they type.
 * (The previous version applied the US "(XXX) XXX-XXXX" mask, which turned a
 * valid London number into "(020) 339-77003" and then failed its own
 * validation.) We strip characters that can't belong in a phone number, tidy
 * whitespace, and otherwise leave the user's formatting alone.
 */
export function formatPhone(value: string): string {
  return value
    .replace(/[^\d+\s()-]/g, "")
    .replace(/\s{2,}/g, " ")
    .slice(0, 20);
}
