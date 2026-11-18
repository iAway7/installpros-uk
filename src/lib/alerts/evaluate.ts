import { createServiceClient } from "@/lib/supabase/server";
import { fetchAll } from "@/lib/supabase/fetch-all";
import { posthogConfigured, hogql } from "@/lib/posthog/query";

/**
 * Alert rule engine. Runs opportunistically when the dashboard loads,
 * throttled to once per 15 minutes via alert_state. Rules dedupe through
 * alerts.dedupe_key, so re-running never duplicates.
 *
 * Delivery is in-app only (bell icon). Email/WhatsApp come later.
 */

const THROTTLE_MINUTES = 15;
const DAY = 864e5;

/** Alert types no rule writes any more. Their rows stay in the table, so the
 *  places that read alerts leave them out. */
export const HIDDEN_ALERT_TYPES = ["uncontacted"] as const;

interface NewAlert {
  type: string;
  severity: "info" | "warning" | "critical";
  title: string;
  body?: string;
  lead_id?: string;
  dedupe_key: string;
}

export async function evaluateAlerts(): Promise<void> {
  const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!hasSupabase) return;

  try {
    const supabase = createServiceClient();

    // Throttle.
    const { data: state } = await supabase.from("alert_state").select("value").eq("key", "last_check").maybeSingle();
    if (state?.value && Date.now() - new Date(state.value).getTime() < THROTTLE_MINUTES * 60_000) return;
    await supabase.from("alert_state").upsert({ key: "last_check", value: new Date().toISOString(), updated_at: new Date().toISOString() });

    const since14d = new Date(Date.now() - 14 * DAY).toISOString();
    const { data } = await fetchAll(() =>
      supabase
        .from("leads")
        .select("id, postcode, created_at")
        .eq("is_test", false)
        .gte("created_at", since14d)
        .order("created_at", { ascending: false }),
    );
    const leads = (data as { id: string; postcode: string; created_at: string }[] | null) ?? [];

    const alerts: NewAlert[] = [];
    const now = Date.now();
    const today = new Date().toISOString().slice(0, 10);

    // ── 1. Lead volume drop: last 24h vs same 24h window a week earlier ──
    const last24 = leads.filter((l) => now - +new Date(l.created_at) < DAY).length;
    const prevWindow = leads.filter((l) => {
      const age = now - +new Date(l.created_at);
      return age >= 7 * DAY && age < 8 * DAY;
    }).length;
    if (prevWindow >= 5 && last24 < prevWindow * 0.7) {
      alerts.push({
        type: "volume_drop",
        severity: "critical",
        title: `Lead volume down ${Math.round((1 - last24 / prevWindow) * 100)}% vs last week`,
        body: `${last24} lead(s) in the last 24h vs ${prevWindow} in the same window last week. Check ads, the form, and tracking.`,
        dedupe_key: `volume:${today}`,
      });
    }

    // There used to be a rule here for leads still marked New after 24 hours.
    // Nobody updates lead statuses (0 of 2,137 leads had moved by 17 November
    // 2026), so it fired for every lead and buried the other alerts: 2,130 of
    // the 2,201 rows in the table were this one. Its old rows are left in the
    // table and filtered out where alerts are read (HIDDEN_ALERT_TYPES).

    // ── 2. Postcode cluster: 3+ leads from one outcode in 7 days ──
    const week = leads.filter((l) => now - +new Date(l.created_at) < 7 * DAY);
    const byOutcode = new Map<string, number>();
    for (const l of week) {
      const outcode = l.postcode.trim().toUpperCase().split(/\s+/)[0] || l.postcode.trim().toUpperCase().slice(0, 4);
      byOutcode.set(outcode, (byOutcode.get(outcode) || 0) + 1);
    }
    const isoWeek = `${new Date().getUTCFullYear()}-w${Math.ceil(((Date.now() - Date.UTC(new Date().getUTCFullYear(), 0, 1)) / DAY + 1) / 7)}`;
    byOutcode.forEach((count, outcode) => {
      if (count >= 3) {
        alerts.push({
          type: "cluster",
          severity: "info",
          title: `${count} leads from ${outcode} this week`,
          body: `Unusual volume from one postcode district. Consider targeting ${outcode} with ads.`,
          dedupe_key: `cluster:${outcode}:${isoWeek}`,
        });
      }
    });

    // ── 3. Form submission rate drop (only when PostHog queries configured) ──
    if (posthogConfigured()) {
      const r = await hogql(
        `SELECT
           count(DISTINCT if(event = 'page_view' AND timestamp >= now() - interval 1 day, distinct_id, NULL)) AS v1,
           count(DISTINCT if(event = 'quote_submitted' AND timestamp >= now() - interval 1 day, distinct_id, NULL)) AS s1,
           count(DISTINCT if(event = 'page_view' AND timestamp < now() - interval 1 day AND timestamp >= now() - interval 8 day, distinct_id, NULL)) AS v7,
           count(DISTINCT if(event = 'quote_submitted' AND timestamp < now() - interval 1 day AND timestamp >= now() - interval 8 day, distinct_id, NULL)) AS s7
         FROM events WHERE timestamp >= now() - interval 8 day`,
      );
      if (r.ok && r.results.length) {
        const [v1, s1, v7, s7] = (r.results[0] as number[]).map((n) => Number(n) || 0);
        const rate1 = v1 ? s1 / v1 : null;
        const rate7 = v7 ? s7 / v7 : null;
        if (rate1 !== null && rate7 !== null && v1 >= 50 && rate7 > 0 && rate1 < rate7 * 0.5) {
          alerts.push({
            type: "form_rate",
            severity: "critical",
            title: "Form submission rate dropped sharply",
            body: `Submit rate last 24h is ${(rate1 * 100).toFixed(1)}% vs ${(rate7 * 100).toFixed(1)}% weekly average. Check the form end-to-end.`,
            dedupe_key: `form_rate:${today}`,
          });
        }
      }
    }

    if (alerts.length) {
      await supabase.from("alerts").upsert(alerts, { onConflict: "dedupe_key", ignoreDuplicates: true });
    }
  } catch {
    // Alerts must never break the dashboard.
  }
}
