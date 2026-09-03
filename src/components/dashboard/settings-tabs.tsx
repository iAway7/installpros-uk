import Link from "next/link";

const TABS = [
  { id: "apis", label: "APIs", href: "/dashboard/settings" },
  { id: "webhooks", label: "Webhooks", href: "/dashboard/settings/webhooks" },
  { id: "team", label: "Team", href: "/dashboard/settings/team" },
] as const;

/** Settings sub-navigation. Tabs without a page yet render as disabled text. */
export function SettingsTabs({ active }: { active: "apis" | "webhooks" | "team" }) {
  return (
    <div className="flex w-fit gap-1 rounded-lg bg-secondary p-1 text-body-sm font-medium">
      {TABS.map((t) =>
        t.id === active ? (
          <span key={t.id} className="rounded-md bg-background px-4 py-1.5 shadow-sm">
            {t.label}
          </span>
        ) : (
          <Link key={t.id} href={t.href} className="rounded-md px-4 py-1.5 text-muted-foreground hover:text-foreground">
            {t.label}
          </Link>
        ),
      )}
    </div>
  );
}
