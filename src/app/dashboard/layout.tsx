import { redirect } from "next/navigation";
import { LayoutDashboard, Users, BarChart3, FlaskConical, Filter, Map, Settings, Satellite, LogOut, ExternalLink, LayoutTemplate } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site-config";
import { evaluateAlerts } from "@/lib/alerts/evaluate";
import { NotificationsBell, type AlertItem } from "@/components/dashboard/notifications-bell";
import { NavItem } from "@/components/dashboard/nav-item";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const { data: profile } = await supabase.from("profiles").select("full_name, role").eq("id", user.id).single();
  const role = profile?.role ?? "team_member";

  // Run the alert rules (throttled to 15 min internally), then load recent alerts.
  await evaluateAlerts();
  const { data: alertRows } = await supabase
    .from("alerts")
    .select("id, created_at, type, severity, title, body, lead_id, read_at")
    .order("created_at", { ascending: false })
    .limit(30);
  const alerts = (alertRows as AlertItem[] | null) ?? [];

  return (
    <div className="theme-product flex min-h-dvh bg-secondary/30">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-background md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-5 font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Satellite className="h-4 w-4" />
          </span>
          {siteConfig.name}
        </div>
        <nav className="flex-1 space-y-1 p-3">
          <NavItem href="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />} label="Overview" />
          <NavItem href="/dashboard/leads" icon={<Users className="h-4 w-4" />} label="Leads" />
          <NavItem href="/dashboard/funnel" icon={<Filter className="h-4 w-4" />} label="Funnel" />
          <NavItem href="/dashboard/map" icon={<Map className="h-4 w-4" />} label="Map" />
          <NavItem href="/dashboard/landings" icon={<LayoutTemplate className="h-4 w-4" />} label="Landings" />
          <NavItem href="/dashboard/marketing" icon={<BarChart3 className="h-4 w-4" />} label="Marketing" />
          <NavItem href="/dashboard/experiments" icon={<FlaskConical className="h-4 w-4" />} label="Experiments" />
          <NavItem href="/dashboard/settings" icon={<Settings className="h-4 w-4" />} label="Settings" />
        </nav>
        <div className="border-t border-border p-3">
          <a
            href="/install-quote"
            target="_blank"
            className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-body-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" /> View landing page
          </a>
          <div className="rounded-lg bg-secondary/60 p-3 text-label">
            <p className="truncate font-medium text-foreground">{profile?.full_name || user.email}</p>
            <p className="capitalize text-muted-foreground">{role.replace("_", " ")}</p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-6">
          <div className="flex items-center gap-2 md:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Satellite className="h-4 w-4" />
            </span>
            <span className="font-bold">{siteConfig.name}</span>
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-1">
          <NotificationsBell initialAlerts={alerts} />
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-body-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </form>
          </div>
        </header>

        {/* Mobile nav */}
        <nav className="flex gap-1 border-b border-border bg-background px-2 py-2 md:hidden">
          <NavItem href="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />} label="Overview" compact />
          <NavItem href="/dashboard/leads" icon={<Users className="h-4 w-4" />} label="Leads" compact />
        </nav>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

