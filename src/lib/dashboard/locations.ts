import type { LocationMap } from "@/lib/dashboard/leads";

/**
 * Resolve postcodes → city/region via postcodes.io bulk lookup (free, no key).
 * The DB only stores the postcode, so the dashboard enriches server-side.
 * Failures degrade gracefully: missing entries fall back to the raw postcode.
 */
export async function lookupLocations(postcodes: string[]): Promise<LocationMap> {
  const unique = Array.from(new Set(postcodes.map((p) => p.trim().toUpperCase()).filter(Boolean)));
  const map: LocationMap = {};

  // Bulk endpoint accepts max 100 postcodes per request.
  for (let i = 0; i < unique.length; i += 100) {
    const chunk = unique.slice(i, i + 100);
    try {
      const res = await fetch("https://api.postcodes.io/postcodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postcodes: chunk }),
        next: { revalidate: 86400 },
      });
      if (!res.ok) continue;

      const json = (await res.json()) as {
        result: Array<{
          query: string;
          result: { admin_district?: string; parish?: string; region?: string; country?: string } | null;
        }>;
      };

      for (const item of json.result ?? []) {
        const r = item.result;
        if (!r) continue;
        map[item.query.toUpperCase()] = {
          city: r.admin_district || r.parish || r.region || item.query,
          region: r.region || r.country || null,
        };
      }
    } catch {
      // Network hiccup: table falls back to showing the postcode.
    }
  }

  return map;
}
