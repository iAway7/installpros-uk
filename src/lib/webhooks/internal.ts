import { createHmac, timingSafeEqual } from "crypto";

/**
 * Signature for the internal server→server hop that triggers a dispatch.
 * Derived from the service-role key, which only ever exists on the server, so
 * the public internet can't make us fire outbound requests. The key itself is
 * never transmitted.
 */
export function internalSignature(event: string, leadId: string): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return createHmac("sha256", key).update(`${event}.${leadId}`).digest("hex");
}

export function verifyInternalSignature(event: string, leadId: string, provided: string | null): boolean {
  if (!provided) return false;
  // No key means no secret to derive from: the HMAC would be keyed on "" and
  // anyone could compute it. Deployed without the service key (Supabase off but
  // LEAD_WEBHOOK_URL set), that would leave the fan-out open to the internet.
  // Fail closed — the dispatch route is the only caller and it is internal.
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return false;
  const expected = internalSignature(event, leadId);
  const a = Buffer.from(expected);
  const b = Buffer.from(provided);
  return a.length === b.length && timingSafeEqual(a, b);
}
