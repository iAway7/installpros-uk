import { CheckCircle2, XCircle, CircleDashed, Clock3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshButton } from "@/components/dashboard/refresh-button";
import { SettingToggle } from "@/components/dashboard/setting-toggle";
import { getApiStatuses, type ApiHealth } from "@/lib/settings/api-status";

export const dynamic = "force-dynamic";

const HEALTH_META: Record<ApiHealth, { label: string; icon: React.ReactNode; pill: string }> = {
  connected: {
    label: "Connected",
    icon: <CheckCircle2 className="h-4 w-4" />,
    pill: "bg-success/10 text-success",
  },
  error: {
    label: "Error",
    icon: <XCircle className="h-4 w-4" />,
    pill: "bg-destructive/10 text-destructive",
  },
  pending: {
    label: "Pending approval",
    icon: <Clock3 className="h-4 w-4" />,
    pill: "bg-amber-500/10 text-amber-600",
  },
  not_configured: {
    label: "Not connected",
    icon: <CircleDashed className="h-4 w-4" />,
    pill: "bg-muted text-muted-foreground",
  },
};

export default async function SettingsPage() {
  const statuses = await getApiStatuses();
  const connected = statuses.filter((s) => s.health === "connected").length;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Integrations, connections and configuration.</p>
      </div>

      {/* Tabs — APIs is live; the rest arrive with their features. */}
      <div className="flex gap-1 rounded-lg bg-secondary p-1 w-fit text-sm font-medium">
        <span className="rounded-md bg-background px-4 py-1.5 shadow-sm">APIs</span>
        <span className="cursor-default px-4 py-1.5 text-muted-foreground/60">Alerts <Soon /></span>
        <span className="cursor-default px-4 py-1.5 text-muted-foreground/60">Team <Soon /></span>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
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
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.pill}`}>
                      {meta.icon} {meta.label}
                    </span>
                  </div>
                  <span className="flex items-center gap-3">
                    {s.docsHint && <span className="text-xs text-muted-foreground">{s.docsHint}</span>}
                    {s.toggleKey && (
                      <SettingToggle settingKey={s.toggleKey} initial={Boolean(s.toggleOn)} disabled={s.toggleDisabled} />
                    )}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{s.purpose}</p>
                <p className="text-sm">{s.detail}</p>
                {s.usage && <p className="text-xs text-muted-foreground">{s.usage}</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Keys live in <code className="rounded bg-secondary px-1">.env.local</code> (dev) and Vercel env vars
        (production) — they&apos;re never stored in the database or shown here.
      </p>
    </div>
  );
}

function Soon() {
  return <span className="ml-1 rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase">soon</span>;
}
