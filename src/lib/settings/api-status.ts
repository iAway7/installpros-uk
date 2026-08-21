import { createServiceClient } from "@/lib/supabase/server";
import { getSearchConsole } from "@/lib/google/search-console";
import { hogql, posthogConfigured } from "@/lib/posthog/query";
import { pingPropalt, propaltConfigured } from "@/lib/broadband/propalt";
import { getSetting } from "@/lib/settings/app-settings";

/**
 * Live status for every external integration, shown on Settings → APIs.
 * Checks run in parallel with short timeouts; a failing check never throws.
 *
 * homedata is deliberately NOT live-tested: every call burns trial quota, so
 * its row reports key presence + cached-lookup usage instead.
 */

export type ApiHealth = "connected" | "error" | "not_configured" | "pending";

export interface ApiStatus {
  id: string;
  name: string;
  purpose: string;
  health: ApiHealth;
  detail: string;
  usage: string | null;
  docsHint: string | null;
  /** Present when the integration has an on/off switch in Settings. */
  toggleKey?: string;
  toggleOn?: boolean;
  toggleDisabled?: boolean;
}

const TIMEOUT_MS = 5000;
const TEST_POSTCODE = "SW1A2AA";

async function probe(url: string, headers: Record<string, string> = {}): Promise<{ ok: boolean; status: number }> {
  try {
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store" });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  }
}

function envSet(...names: string[]): boolean {
  return names.every((n) => Boolean(process.env[n]));
}

export async function getApiStatuses(): Promise<ApiStatus[]> {
  const hasSupabase = envSet("NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY");
  const supabase = hasSupabase ? createServiceClient() : null;

  const [supabaseCheck, posthogQueryCheck, searchConsole, ofcomCheck, epcCheck, postcodesIoCheck, cacheStats, intelStats, propaltPing, propaltEnabled] =
    await Promise.all([
      // Supabase: cheap head-count on leads
      (async () => {
        if (!supabase) return { ok: false, detail: "Env vars missing" };
        try {
          const { count, error } = await supabase.from("leads").select("id", { count: "exact", head: true });
          return error ? { ok: false, detail: error.message } : { ok: true, detail: `${count ?? 0} leads stored` };
        } catch {
          return { ok: false, detail: "Unreachable" };
        }
      })(),
      // PostHog query API
      (async () => {
        if (!posthogConfigured()) return { ok: false, configured: false };
        const r = await hogql("SELECT 1");
        return { ok: r.ok, configured: true, error: r.error };
      })(),
      // Search Console
      getSearchConsole(1).catch(() => ({ configured: false, ok: false }) as Awaited<ReturnType<typeof getSearchConsole>>),
      // Ofcom
      (async () => {
        if (!envSet("OFCOM_API_KEY")) return { configured: false, ok: false, status: 0 };
        const r = await probe(`https://api-proxy.ofcom.org.uk/broadband/coverage/${TEST_POSTCODE}`, {
          "Ofcom-API-Key": process.env.OFCOM_API_KEY as string,
        });
        return { configured: true, ...r };
      })(),
      // EPC (new EPB bearer API preferred, legacy Basic as fallback)
      (async () => {
        if (envSet("EPC_BEARER_TOKEN")) {
          const r = await probe(
            `https://api.get-energy-performance-data.communities.gov.uk/api/domestic/search?postcode=SW1A%202AA&page_size=1`,
            { Authorization: `Bearer ${process.env.EPC_BEARER_TOKEN}`, Accept: "application/json" },
          );
          // 404 = "no certificates for query" — auth worked, so that's healthy.
          return { configured: true, ok: r.ok || r.status === 404, status: r.status, mode: "bearer" };
        }
        if (envSet("EPC_API_EMAIL", "EPC_API_KEY")) {
          const auth = Buffer.from(`${process.env.EPC_API_EMAIL}:${process.env.EPC_API_KEY}`).toString("base64");
          const r = await probe("https://epc.opendatacommunities.org/api/v1/domestic/search?postcode=SW1A&size=1", {
            Authorization: `Basic ${auth}`, Accept: "application/json",
          });
          return { configured: true, ok: r.ok, status: r.status, mode: "legacy" };
        }
        return { configured: false, ok: false, status: 0, mode: "none" };
      })(),
      // postcodes.io (keyless)
      probe(`https://api.postcodes.io/postcodes/${TEST_POSTCODE}`),
      // Broadband cache usage
      (async () => {
        if (!supabase) return null;
        try {
          const [{ count: total }, { count: homedata }] = await Promise.all([
            supabase.from("postcode_broadband_cache").select("postcode", { count: "exact", head: true }),
            supabase.from("postcode_broadband_cache").select("postcode", { count: "exact", head: true }).eq("source", "homedata"),
          ]);
          return { total: total ?? 0, homedata: homedata ?? 0 };
        } catch {
          return null;
        }
      })(),
      // Enrichment usage
      (async () => {
        if (!supabase) return null;
        try {
          const { count } = await supabase.from("lead_intel").select("lead_id", { count: "exact", head: true });
          return { enriched: count ?? 0 };
        } catch {
          return null;
        }
      })(),
      // Propalt health (documented /ping — no data credits)
      propaltConfigured() ? pingPropalt() : Promise.resolve({ ok: false, status: 0 }),
      getSetting("propalt_enabled", false),
    ]);

  const statuses: ApiStatus[] = [
    {
      id: "supabase",
      name: "Supabase",
      purpose: "Lead storage, auth, photos, alerts",
      health: supabaseCheck.ok ? "connected" : hasSupabase ? "error" : "not_configured",
      detail: supabaseCheck.detail,
      usage: intelStats ? `${intelStats.enriched} leads enriched with property intel` : null,
      docsHint: "SETUP-INTEGRATIONS.md",
    },
    {
      id: "posthog_tracking",
      name: "PostHog (tracking)",
      purpose: "Product analytics + session replay on the site",
      health: envSet("NEXT_PUBLIC_POSTHOG_KEY") ? "connected" : "not_configured",
      detail: envSet("NEXT_PUBLIC_POSTHOG_KEY") ? "Events fire from the browser (client key)" : "NEXT_PUBLIC_POSTHOG_KEY missing",
      usage: null,
      docsHint: "SETUP-INTEGRATIONS.md",
    },
    {
      id: "posthog_query",
      name: "PostHog (dashboard queries)",
      purpose: "Powers the Funnel page + form-rate alerts",
      health: !("configured" in posthogQueryCheck) || !posthogQueryCheck.configured
        ? "not_configured"
        : posthogQueryCheck.ok ? "connected" : "error",
      detail: !posthogQueryCheck.configured
        ? "POSTHOG_PERSONAL_API_KEY / POSTHOG_PROJECT_ID missing"
        : posthogQueryCheck.ok ? "HogQL queries working" : `Query failed${posthogQueryCheck.error ? `: ${posthogQueryCheck.error.slice(0, 80)}` : ""}`,
      usage: null,
      docsHint: "PostHog → Settings → Personal API keys",
    },
    {
      id: "search_console",
      name: "Google Search Console",
      purpose: "SEO clicks/impressions on the Marketing page",
      health: !searchConsole.configured ? "not_configured" : searchConsole.ok ? "connected" : "error",
      detail: !searchConsole.configured
        ? "Service account not configured"
        : searchConsole.ok ? "Reporting live" : "Configured but query failed. Check property access",
      usage: null,
      docsHint: "GOOGLE-SETUP.md",
    },
    {
      id: "ga4",
      name: "GA4 + GTM",
      purpose: "Acquisition analytics + ad conversions",
      health: envSet("NEXT_PUBLIC_GA4_ID") || envSet("NEXT_PUBLIC_GTM_ID") ? "connected" : "not_configured",
      detail: envSet("NEXT_PUBLIC_GA4_ID") || envSet("NEXT_PUBLIC_GTM_ID")
        ? "Tags load client-side (no server check possible)"
        : "NEXT_PUBLIC_GA4_ID / NEXT_PUBLIC_GTM_ID missing",
      usage: null,
      docsHint: "SETUP-INTEGRATIONS.md",
    },
    {
      id: "ofcom",
      name: "Ofcom Connected Nations API",
      purpose: "Broadband speed per postcode: top lead-scoring signal",
      health: !ofcomCheck.configured
        ? "not_configured"
        : ofcomCheck.ok ? "connected" : ofcomCheck.status === 401 || ofcomCheck.status === 403 ? "pending" : "error",
      detail: !ofcomCheck.configured
        ? "OFCOM_API_KEY missing"
        : ofcomCheck.ok
          ? "Live lookups working"
          : ofcomCheck.status === 401 || ofcomCheck.status === 403
            ? "Key set but rejected. Subscription likely still awaiting Ofcom approval"
            : `Check failed (HTTP ${ofcomCheck.status || "timeout"})`,
      usage: ofcomCheck.configured ? "Plan: Broadband Basic, 50,000 requests/month, 100/min (no remaining-quota endpoint)" : null,
      docsHint: "INTEL-SETUP.md",
    },
    {
      id: "epc",
      name: "EPC / EPB Data (MHCLG)",
      purpose: "Property type, age, floor area for lead scoring",
      health: !epcCheck.configured ? "not_configured" : epcCheck.ok ? "connected" : "error",
      detail: !epcCheck.configured
        ? "EPC_BEARER_TOKEN missing"
        : epcCheck.ok
          ? epcCheck.mode === "bearer" ? "New EPB API (bearer) working" : "Legacy API (Basic) working. Migrate to bearer"
          : `Auth failed (HTTP ${epcCheck.status || "timeout"}). Check the token`,
      usage: epcCheck.configured ? "Rate limit: 6,000 requests / 5 min per IP" : null,
      docsHint: "INTEL-SETUP.md",
    },
    {
      id: "homedata",
      name: "homedata.co.uk",
      purpose: "Broadband coverage message on /starlink-installation",
      health: envSet("HOMEDATA_API_KEY") ? "connected" : "not_configured",
      detail: envSet("HOMEDATA_API_KEY")
        ? "Key set (not live-tested, each test burns trial quota). Falls back to Ofcom + bundled data."
        : "HOMEDATA_API_KEY missing. Coverage message uses Ofcom + bundled dataset instead",
      usage: cacheStats ? `${cacheStats.homedata} postcodes fetched from homedata · ${cacheStats.total} total cached lookups` : null,
      docsHint: "homedata.co.uk → dashboard",
    },
    {
      id: "public_apis",
      name: "postcodes.io + Land Registry + Ofcom bundle",
      purpose: "Postcode validation, value bands, offline broadband data",
      health: postcodesIoCheck.ok ? "connected" : "error",
      detail: postcodesIoCheck.ok
        ? "Keyless public APIs reachable · bundled Ofcom dataset: 2,853 districts (Jan 2025 release)"
        : "postcodes.io unreachable. Postcode validation degraded",
      usage: null,
      docsHint: null,
    },
    {
      id: "propalt",
      name: "Propalt AI",
      purpose: "Reserve property-data source (1,000 free credits), off by default",
      health: !propaltConfigured()
        ? "not_configured"
        : !propaltEnabled ? "pending" : propaltPing.ok ? "connected" : "error",
      detail: !propaltConfigured()
        ? "PROPALT_API_KEY missing"
        : !propaltEnabled
          ? "Key set but integration deactivated. Flip the switch to use it in the coverage chain"
          : propaltPing.ok
            ? "Active: first paid source in the coverage chain (before homedata and Ofcom)"
            : `Active but health check failed (HTTP ${propaltPing.status || "timeout"}). Check key / PROPALT_API_BASE`,
      usage: propaltConfigured()
        ? `Free tier: 1,000 credits · used lookups appear in the broadband cache${cacheStats ? ` (${cacheStats.total} cached total)` : ""}`
        : null,
      docsHint: "docs.propalt.co.uk",
      toggleKey: "propalt_enabled",
      toggleOn: propaltEnabled,
      toggleDisabled: !propaltConfigured(),
    },
    {
      id: "whatsapp",
      name: "WhatsApp Business API",
      purpose: "Auto-message leads within seconds of form submit",
      health: "not_configured",
      detail: "Awaiting Meta Business verification. Start at business.facebook.com",
      usage: null,
      docsHint: "BUILD-PLAN.md Phase 4",
    },
    {
      id: "google_ads",
      name: "Google Ads API",
      purpose: "Cost per lead/quote/won by campaign",
      health: "not_configured",
      detail: "Needs a developer token (Google Ads → API Center). GCLID capture is already live",
      usage: null,
      docsHint: "BUILD-PLAN.md Phase 7",
    },
  ];

  return statuses;
}
