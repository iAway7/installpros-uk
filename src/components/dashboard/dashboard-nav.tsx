"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Filter,
  LayoutDashboard,
  LayoutTemplate,
  Map,
  Settings,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Breadcrumbs, type Crumb } from "@/components/system/breadcrumbs";
import {
  FUNNEL_PATH,
  LANDINGS_PATH,
  STICKY_PATHS,
  TARGETS_PATH,
  rememberFilters,
  stickyHref,
} from "@/lib/dashboard/sticky-filters";
import { cn } from "@/lib/utils";

/**
 * The dashboard's navigation, in one place: the sidebar, the phone drawer, the
 * breadcrumb in the top bar and the "Go to" list in the search all read this.
 *
 * It was nine links in a flat column, with only the first two reachable on a
 * phone. The pages fall into what they answer: the leads themselves, and how
 * the landings convert. The first group has no label because Overview, Leads
 * and Map need no introduction.
 *
 * Not listed, though both pages still answer at their address:
 *   Experiments  no test has ever been created.
 *   Marketing    now only Search Console, which covers installpros.co.uk;
 *                the landings are noindex, so none of it is theirs.
 * Putting either back is one line here.
 */
export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label?: string;
  items: NavLink[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/dashboard/leads", label: "Leads", icon: Users },
      { href: "/dashboard/map", label: "Map", icon: Map },
    ],
  },
  {
    label: "Conversion",
    items: [
      { href: TARGETS_PATH, label: "Targets", icon: Target },
      { href: FUNNEL_PATH, label: "Funnel", icon: Filter },
      { href: LANDINGS_PATH, label: "Landing pages", icon: LayoutTemplate },
    ],
  },
];

export const SETTINGS_LINK: NavLink = { href: "/dashboard/settings", label: "Settings", icon: Settings };

/** Every destination, flat, for the search's "Go to" list. */
export const NAV_LINKS: NavLink[] = [...NAV_GROUPS.flatMap((g) => g.items), SETTINGS_LINK];

const SETTINGS_TABS: Record<string, string> = { "": "APIs", webhooks: "Webhooks", team: "Team" };

/** "/dashboard/funnel/" and "/dashboard/funnel" are the same page. */
function usePath(): string {
  const pathname = usePathname();
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

function isActive(href: string, path: string): boolean {
  return href === "/dashboard" ? path === href : path === href || path.startsWith(`${href}/`);
}

/**
 * The nav links for the pages that keep filters in the URL, pointing at the
 * filters last used there (lib/dashboard/sticky-filters.ts has the rules).
 * Empty until the browser has mounted, so the server and the first paint both
 * render the bare paths.
 */
export function useStickyHrefs(): Record<string, string> {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const [hrefs, setHrefs] = useState<Record<string, string>>({});

  useEffect(() => {
    let store: Storage;
    try {
      store = window.sessionStorage;
    } catch {
      return; // storage blocked: bare paths
    }
    rememberFilters(store, pathname, search);
    setHrefs(Object.fromEntries(STICKY_PATHS.map((p) => [p, stickyHref(store, p, pathname, search)])));
  }, [pathname, search]);

  return hrefs;
}

/**
 * One nav link. The current page is a soft fill with full-weight ink; the rest
 * are muted until hovered. `touch` is the phone drawer: the control-sized row
 * a thumb needs, where the sidebar keeps the compact one.
 */
export function NavItem({ link, to, touch }: { link: NavLink; to?: string; touch?: boolean }) {
  const active = isActive(link.href, usePath());
  const Icon = link.icon;
  return (
    <a
      href={to ?? link.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-3 text-body font-medium transition-colors duration-quick focus-ring-solid",
        touch ? "h-control" : "h-control-sm",
        active
          ? "bg-foreground/[0.07] text-foreground"
          : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden />
      {link.label}
    </a>
  );
}

/** The grouped links. Settings sits apart, pinned under them by the shell. */
export function DashboardNav({ touch, className }: { touch?: boolean; className?: string }) {
  const hrefs = useStickyHrefs();
  return (
    <nav aria-label="Dashboard" className={cn("space-y-5", className)}>
      {NAV_GROUPS.map((group, i) => (
        <div key={group.label ?? i} role={group.label ? "group" : undefined} aria-label={group.label}>
          {group.label && (
            <p aria-hidden className="mb-1 px-3 text-caption font-medium text-muted-foreground">
              {group.label}
            </p>
          )}
          <div className="space-y-0.5">
            {group.items.map((link) => (
              <NavItem key={link.href} link={link} to={hrefs[link.href]} touch={touch} />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

/** Settings, on its own under the groups. A component because the layout is
 *  rendered on the server and cannot hand a link (it holds an icon) across. */
export function SettingsNavItem({ touch }: { touch?: boolean }) {
  return <NavItem link={SETTINGS_LINK} touch={touch} />;
}

/** Where the current page sits, for the top bar: "Conversion > Targets". */
function crumbsFor(path: string): Crumb[] {
  if (isActive(SETTINGS_LINK.href, path)) {
    const tab = path.slice(SETTINGS_LINK.href.length + 1).split("/")[0];
    return [
      { label: SETTINGS_LINK.label, href: tab ? SETTINGS_LINK.href : undefined },
      { label: SETTINGS_TABS[tab] ?? tab },
    ];
  }
  for (const group of NAV_GROUPS) {
    const link = group.items.find((l) => isActive(l.href, path));
    if (link) return group.label ? [{ label: group.label }, { label: link.label }] : [{ label: link.label }];
  }
  // A page that is not in the nav (Experiments): name it from its path.
  const last = path.split("/").filter(Boolean).pop() ?? "";
  return last && last !== "dashboard" ? [{ label: last[0].toUpperCase() + last.slice(1).replace(/-/g, " ") }] : [];
}

export function TopBarCrumbs({ className }: { className?: string }) {
  const crumbs = crumbsFor(usePath());
  if (crumbs.length === 0) return null;
  return <Breadcrumbs items={crumbs} className={className} />;
}
