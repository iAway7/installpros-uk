/** Plain-function validators replacing the original zod schemas (no extra dep). */

export const isZip = (v: string) => /^\d{5}$/.test(v);

export function validateName(v: string): string | null {
  const t = v.trim();
  if (t.length < 1) return "Name is required";
  if (t.length > 100) return "Name must be less than 100 characters";
  if (!/^[a-zA-Z\s'-]+$/.test(t))
    return "Name can only contain letters, spaces, hyphens, and apostrophes";
  return null;
}

export function validatePhone(v: string): string | null {
  return /^\(\d{3}\) \d{3}-\d{4}$/.test(v) ? null : "Phone number must be in format (XXX) XXX-XXXX";
}

export function validateEmail(v: string): string | null {
  const t = v.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) return "Please enter a valid email address";
  if (t.length > 255) return "Email must be less than 255 characters";
  return null;
}

/** (XXX) XXX-XXXX progressive formatter. */
export function formatPhone(value: string): string {
  const cleaned = value.replace(/\D/g, "");
  const m = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
  if (!m) return value;
  return !m[2] ? m[1] : `(${m[1]}) ${m[2]}${m[3] ? `-${m[3]}` : ""}`;
}
