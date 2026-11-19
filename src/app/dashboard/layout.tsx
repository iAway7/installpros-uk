import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site-config";
import { evaluateAlerts, HIDDEN_ALERT_TYPES } from "@/lib/alerts/evaluate";
import { NotificationsBell, type AlertItem } from "@/components/dashboard/notifications-bell";
import { DashboardNav, SettingsNavItem, TopBarCrumbs } from "@/components/dashboard/dashboard-nav";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { CommandPalette } from "@/components/dashboard/command-palette";
import { ProductBodyTheme } from "@/components/dashboard/product-body-theme";
import { InstallProsLogo } from "@/components/funnel/ui/installpros-logo";
import { GeistSans } from "geist/font/sans";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const { data: profile } = await supabase.from("profiles").select("full_name, role").eq("id", user.id).single();
  const role = (profile?.role ?? "team_member").replace("_", " ");
  const name = profile?.full_name || user.email || "";

  // Run the alert rules (throttled to 15 min internally), then load recent alerts.
  await evaluateAlerts();
  const { data: alertRows } = await supabase
    .from("alerts")
    .select("id, created_at, type, severity, title, body, lead_id, read_at")
    .not("type", "in", `(${HIDDEN_ALERT_TYPES.join(",")})`)
    .order("created_at", { ascending: false })
    .limit(30);
  const alerts = (alertRows as AlertItem[] | null) ?? [];

  return (
    <div className={`theme-product ${GeistSans.variable} flex min-h-dvh bg-secondary/30`}>
      <ProductBodyTheme className={GeistSans.variable} />
      {/* Sidebar (desktop). It stays put while the page scrolls: the nav used
          to leave with the top of a long Leads table. */}
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col self-start border-r border-border bg-sidebar md:flex">
        <div className="flex h-16 shrink-0 items-center border-b border-border px-5">
          <HomeLink className="w-32" />
        </div>
        <SidebarBody name={name} role={role} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar. On a phone: the menu, the logo, search and alerts. From md
            up the sidebar holds the first two, so it shows where you are. */}
        <header className="flex h-16 items-center gap-2 border-b border-border bg-background px-4 md:px-6">
          <MobileNav header={<HomeLink className="w-28" />}>
            <SidebarBody name={name} role={role} touch />
          </MobileNav>
          <HomeLink className="w-28 md:hidden" />
          <TopBarCrumbs className="hidden md:block" />

          <div className="ml-auto flex items-center gap-1 md:gap-2">
            <CommandPalette />
            <NotificationsBell initialAlerts={alerts} />
            <form action="/auth/signout" method="post" className="hidden md:block">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-body-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </form>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

/** The logo, linking home. `text-black` is the lockup for light surfaces. */
function HomeLink({ className }: { className?: string }) {
  return (
    <a href="/dashboard" aria-label={`${siteConfig.name} dashboard`} className={`block rounded-sm focus-ring-solid ${className ?? ""}`}>
      <InstallProsLogo className="h-auto w-full text-black" />
    </a>
  );
}

/**
 * Everything under the logo, shared by the sidebar and the phone drawer: the
 * grouped links, then Settings and who is signed in. The drawer (`touch`) gets
 * thumb-sized rows and the sign out button, which the top bar has no room for
 * on a phone.
 */
function SidebarBody({ name, role, touch }: { name: string; role: string; touch?: boolean }) {
  return (
    <>
      <DashboardNav touch={touch} className="min-h-0 flex-1 overflow-y-auto p-3" />
      <div className="shrink-0 space-y-3 border-t border-border p-3">
        <SettingsNavItem touch={touch} />
        <div className="rounded-lg bg-secondary/60 p-3 text-label">
          <p className="truncate font-medium text-foreground">{name}</p>
          <p className="capitalize text-muted-foreground">{role}</p>
        </div>
        {touch && (
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="flex h-control w-full items-center gap-2.5 rounded-md px-3 text-body font-medium text-muted-foreground transition-colors duration-quick hover:bg-foreground/[0.04] hover:text-foreground focus-ring-solid"
            >
              <LogOut className="h-4 w-4 shrink-0" aria-hidden /> Sign out
            </button>
          </form>
        )}
      </div>
    </>
  );
}
