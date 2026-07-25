import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
