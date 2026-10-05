import { WebhooksView } from "@/components/dashboard/webhooks-view";
import { SettingsTabs } from "@/components/dashboard/settings-tabs";
import { PageHeader } from "@/components/system/page-header";

export const dynamic = "force-dynamic";

export default function WebhooksSettingsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader title="Settings" description="Integrations, connections and configuration." />
      <SettingsTabs active="webhooks" />
      <WebhooksView />
    </div>
  );
}
