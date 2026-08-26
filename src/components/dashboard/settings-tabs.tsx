import Link from "next/link";

const TABS = [
  { id: "apis", label: "APIs", href: "/dashboard/settings" },
  { id: "webhooks", label: "Webhooks", href: "/dashboard/settings/webhooks" },
] as const;

/** Settings sub-navigation. Tabs without a page yet render as disabled text. */
export function SettingsTabs({ active }: { active: "apis" | "webhooks" }) {
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
      <span className="cursor-default px-4 py-1.5 text-muted-foreground/60">
        Team <span className="ml-1 rounded bg-muted px-1.5 py-0.5 text-micro uppercase">soon</span>
      </span>
    </div>
  );
}
