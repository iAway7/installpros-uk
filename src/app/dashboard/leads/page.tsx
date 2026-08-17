import { createClient, createServiceClient } from "@/lib/supabase/server";
import { type Lead } from "@/lib/dashboard/leads";
import type { LeadIntel } from "@/lib/intel/types";
import { lookupLocations } from "@/lib/dashboard/locations";
import { LeadsTable } from "@/components/dashboard/leads-table";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("leads")
    .select(
      "id, created_at, name, email, phone, postcode, install_type, notes, status, traffic_source, campaign, source_url, estimated_value, utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, fbclid, session_id, variant_id, experiment_id, device_type, landing_page, service, contacted_at, quoted_at, lead_score",
    )
    .order("created_at", { ascending: false });

  const leads = (data as Lead[]) ?? [];

  const [locations, intelRes] = error
    ? [{}, null]
    : await Promise.all([
        lookupLocations(leads.map((l) => l.postcode)),
        supabase.from("lead_intel").select("*"),
      ]);

  const intel: Record<string, LeadIntel> = {};
  for (const row of (intelRes?.data as LeadIntel[] | null) ?? []) intel[row.lead_id] = row;

  // Photos: rows via RLS, thumbnails via short-lived signed URLs (private bucket).
  const photos: Record<string, string[]> = {};
  if (!error) {
    const { data: photoRows } = await supabase.from("lead_photos").select("lead_id, path").order("created_at");
    const rows = (photoRows as { lead_id: string; path: string }[] | null) ?? [];
    if (rows.length) {
      try {
        const admin = createServiceClient();
        const { data: signed } = await admin.storage
          .from("property-photos")
          .createSignedUrls(rows.map((r) => r.path), 3600);
        signed?.forEach((s, i) => {
          if (s.signedUrl) (photos[rows[i].lead_id] ??= []).push(s.signedUrl);
        });
      } catch {
        /* thumbnails degrade gracefully */
      }
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
        <p className="text-muted-foreground">Every quote request from your landing page.</p>
      </div>

      {error ? (
        <Card>
          <CardContent className="p-6 text-body-sm text-destructive">
            Couldn&apos;t load leads ({error.message}).
          </CardContent>
        </Card>
      ) : (
        <LeadsTable initialLeads={leads} locations={locations} intel={intel} photos={photos} />
      )}
    </div>
  );
}
