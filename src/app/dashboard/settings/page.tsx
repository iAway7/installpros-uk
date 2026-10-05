import { Card, CardContent } from "@/components/system/card";
import { RefreshButton } from "@/components/dashboard/refresh-button";
import { SettingToggle } from "@/components/dashboard/setting-toggle";
import { SettingsTabs } from "@/components/dashboard/settings-tabs";
import { getApiStatuses, type ApiHealth } from "@/lib/settings/api-status";
import { isAdmin } from "@/lib/auth/role";
import { PageHeader } from "@/components/system/page-header";
import { Pill, type PillVariant } from "@/components/system/badge";

export const dynamic = "force-dynamic";

// A Pill per integration state: the word in the text colour, the state in the
// dot. It was an icon plus a tinted pill, success and error text on their own
// tint — under AA — with the icon repeating what the colour already said.
const HEALTH_META: Record<ApiHealth, { label: string; tone: PillVariant }> = {
  connected: { label: "Connected", tone: "success" },
  error: { label: "Error", tone: "error" },
  pending: { label: "Pending approval", tone: "warning" },
  not_configured: { label: "Not connected", tone: "muted" },
};

export default async function SettingsPage() {
  // Admin-only: these toggles spend API credits and change what every lead is
  // enriched with. The API route enforces this too — hiding the UI alone would
  // only be cosmetic.
  if (!(await isAdmin())) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <PageHeader title="Settings" description="Integrations, connections and configuration." />
        <Card>
          <CardContent className="py-10 text-center">
            <p className="font-medium">Admins only</p>
            <p className="mt-1 text-body-sm text-muted-foreground">
              Ask an admin if you need an integration turned on or off.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statuses = await getApiStatuses();
  const connected = statuses.filter((s) => s.health === "connected").length;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader title="Settings" description="Integrations, connections and configuration." />

      <SettingsTabs active="apis" />

      <div className="flex items-center justify-between">
        <p className="text-body-sm text-muted-foreground">
          {connected} of {statuses.length} integrations connected · checks run live against each service
        </p>
        <RefreshButton />
      </div>

      <div className="space-y-3">
        {statuses.map((s) => {
          const meta = HEALTH_META[s.health];
          return (
            <Card key={s.id}>
              <CardContent className="flex flex-col gap-2 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{s.name}</span>
                    <Pill variant={meta.tone}>{meta.label}</Pill>
                  </div>
                  <span className="flex items-center gap-3">
                    {s.docsHint && <span className="text-label text-muted-foreground">{s.docsHint}</span>}
                    {s.toggleKey && (
                      <SettingToggle settingKey={s.toggleKey} initial={Boolean(s.toggleOn)} disabled={s.toggleDisabled} label={s.name} />
                    )}
                  </span>
                </div>
                <p className="text-body-sm text-muted-foreground">{s.purpose}</p>
                <p className="text-body-sm">{s.detail}</p>
                {s.usage && <p className="text-label text-muted-foreground">{s.usage}</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-label text-muted-foreground">
        Keys live in <code className="rounded bg-secondary px-1">.env.local</code> (dev) and Vercel env vars
        (production). They&apos;re never stored in the database or shown here.
      </p>
    </div>
  );
}

