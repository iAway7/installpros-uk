import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Plain service-role client — no cookies, no `next/headers`.
 *
 * `lib/supabase/server.ts` builds its clients on @supabase/ssr, which imports
 * `next/headers` at module scope. That is correct for anything reading the
 * user's session, but it drags a dynamic API into every module that touches it,
 * and it cannot be used inside `unstable_cache` (cached work has no request to
 * read cookies from).
 *
 * Use this one for trusted, request-independent server work: cached reads and
 * webhook writes. NEVER import it into client code — it carries the service key.
 */
export function createPlainServiceClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

/** True when both env vars needed by the service client are present. */
export function supabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
