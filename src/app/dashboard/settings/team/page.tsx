import { Card, CardContent } from "@/components/system/card";
import { SettingsTabs } from "@/components/dashboard/settings-tabs";
import { TeamTable } from "@/components/dashboard/team-table";
import { getCurrentRole } from "@/lib/auth/role";
import { createServiceClient } from "@/lib/supabase/server";
import type { TeamMember } from "@/app/api/settings/users/route";
import type { AppRole } from "@/lib/auth/role";

export const dynamic = "force-dynamic";

/** Who can sign in, and what they're allowed to do. Admin-only. */
export default async function TeamSettingsPage() {
  const me = await getCurrentRole();

  const header = (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <p className="text-muted-foreground">Integrations, connections and configuration.</p>
    </div>
  );

  if (me?.role !== "admin") {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        {header}
        <SettingsTabs active="team" />
        <Card>
          <CardContent className="py-10 text-center">
            <p className="font-medium">Admins only</p>
            <p className="mt-1 text-body-sm text-muted-foreground">
              Ask an admin if you need an account created or a role changed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Read straight from the service client rather than fetching our own API:
  // this is a server component, so it would only be an HTTP round trip to the
  // same process. The route exists for the mutations the client makes.
  const admin = createServiceClient();
  const [{ data: authData }, { data: profiles }] = await Promise.all([
    admin.auth.admin.listUsers({ page: 1, perPage: 200 }),
    admin.from("profiles").select("id, full_name, role"),
  ]);

  const byId = new Map((profiles ?? []).map((p) => [p.id as string, p]));
  const users: TeamMember[] = (authData?.users ?? [])
    .map((u) => ({
      id: u.id,
      email: u.email ?? "—",
      full_name: (byId.get(u.id)?.full_name as string | null) ?? null,
      role: ((byId.get(u.id)?.role as AppRole) ?? "team_member") as AppRole,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at ?? null,
    }))
    .sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {header}
      <SettingsTabs active="team" />
      <TeamTable users={users} currentUserId={me.userId} />
    </div>
  );
}
