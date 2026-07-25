import crypto from "crypto";

/**
 * Mints a short-lived Google OAuth access token from a service-account key,
 * using a signed JWT (RS256) — no external SDK needed. Returns null when the
 * service account isn't configured, so the dashboard can show a "connect" state
 * instead of erroring.
 *
 * Setup: create a service account, grant it read access in Search Console /
 * GA4, and put its email + private key in the env (see GOOGLE-SETUP.md).
 */
const TOKEN_URI = "https://oauth2.googleapis.com/token";

let cached: { token: string; expiresAt: number } | null = null;

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function isGoogleConfigured(): boolean {
  return Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY);
}

export async function getGoogleAccessToken(scope: string): Promise<string | null> {
  if (!isGoogleConfigured()) return null;

  // Reuse a still-valid token (tokens last ~1h).
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
  // Support keys stored with literal "\n" in the env.
  const privateKey = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n");

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64url(
    JSON.stringify({ iss: email, scope, aud: TOKEN_URI, iat: now, exp: now + 3600 }),
  );
  const signingInput = `${header}.${claim}`;

  let signature: string;
  try {
    signature = base64url(crypto.sign("RSA-SHA256", Buffer.from(signingInput), privateKey));
  } catch {
    return null; // malformed key
  }

  const assertion = `${signingInput}.${signature}`;
  const res = await fetch(TOKEN_URI, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
  });

  if (!res.ok) return null;
  const json = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!json.access_token) return null;

  cached = { token: json.access_token, expiresAt: Date.now() + (json.expires_in ?? 3600) * 1000 };
  return cached.token;
}
