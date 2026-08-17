"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, TriangleAlert, Info, CircleAlert, CheckCheck } from "lucide-react";

export interface AlertItem {
  id: string;
  created_at: string;
  type: string;
  severity: "info" | "warning" | "critical";
  title: string;
  body: string | null;
  lead_id: string | null;
  read_at: string | null;
}

function timeAgo(iso: string): string {
  const mins = Math.max(0, Math.round((Date.now() - +new Date(iso)) / 60000));
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  const h = Math.round(mins / 60);
  if (h < 48) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

const SEVERITY_ICON = {
  critical: <CircleAlert className="h-4 w-4 shrink-0 text-destructive" />,
  warning: <TriangleAlert className="h-4 w-4 shrink-0 text-amber-500" />,
  info: <Info className="h-4 w-4 shrink-0 text-primary" />,
};

export function NotificationsBell({ initialAlerts }: { initialAlerts: AlertItem[] }) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = alerts.filter((a) => !a.read_at).length;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  async function markAllRead() {
    const now = new Date().toISOString();
    setAlerts((as) => as.map((a) => ({ ...a, read_at: a.read_at ?? now })));
    try {
      await fetch("/api/alerts", { method: "PATCH" });
    } catch {
      /* best effort */
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
        className="relative rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border bg-background shadow-popover">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <span className="text-body-sm font-semibold">Notifications</span>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="inline-flex items-center gap-1 text-label font-medium text-muted-foreground hover:text-primary"
              >
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {alerts.length === 0 ? (
              <p className="p-6 text-center text-body-sm text-muted-foreground">
                All clear. Alerts appear here when something needs attention.
              </p>
            ) : (
              alerts.map((a) => (
                <a
                  key={a.id}
                  href={a.lead_id ? "/dashboard/leads" : "/dashboard"}
                  className={`flex gap-3 border-b border-border px-4 py-3 last:border-0 hover:bg-secondary/50 ${
                    a.read_at ? "opacity-60" : ""
                  }`}
                >
                  <span className="mt-0.5">{SEVERITY_ICON[a.severity] ?? SEVERITY_ICON.info}</span>
                  <span className="min-w-0">
                    <span className="block text-body-sm font-medium leading-snug">{a.title}</span>
                    {a.body && <span className="mt-0.5 block text-label text-muted-foreground">{a.body}</span>}
                    <span className="mt-1 block text-[11px] text-muted-foreground/70">{timeAgo(a.created_at)}</span>
                  </span>
                  {!a.read_at && <span className="ml-auto mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                </a>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
