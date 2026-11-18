"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/system/button";
import { NAV_LINKS, useStickyHrefs, type NavLink } from "@/components/dashboard/dashboard-nav";
import { formatDate, installTypeLabel } from "@/lib/dashboard/leads";
import { LEAD_SEARCH_MIN_CHARS, type LeadSearchResult } from "@/lib/dashboard/lead-search";
import { cn } from "@/lib/utils";

/**
 * Search from anywhere in the dashboard: Cmd+K (Ctrl+K off a Mac), or the
 * field in the top bar. Finds a lead by name, phone, email or postcode and
 * opens it on the Leads page; with nothing typed it is a list of the pages.
 *
 * The Leads page has its own search, but it filters a table you have to be
 * looking at. This one answers "who was that person Will asked about" from
 * whichever page that question arrives on.
 *
 * A native <dialog>, like system/modal, for the focus trap and Escape. The
 * input keeps the focus the whole time and the list is driven from it
 * (combobox with aria-activedescendant), so the arrows and Enter work without
 * tabbing into the results.
 */

type Item =
  | { kind: "page"; key: string; href: string; link: NavLink }
  | { kind: "lead"; key: string; href: string; lead: LeadSearchResult };

type Status = "idle" | "loading" | "error" | "signed-out";

const KBD =
  "rounded border border-border bg-secondary px-1.5 py-0.5 font-sans text-label font-medium text-muted-foreground";

export function CommandPalette() {
  const router = useRouter();
  const hrefs = useStickyHrefs();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [leads, setLeads] = useState<LeadSearchResult[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [active, setActive] = useState(0);
  const [going, setGoing] = useState<string | null>(null);
  const [navigating, startNavigation] = useTransition();
  // The server renders the Mac hint; anything else corrects itself on mount.
  const [shortcut, setShortcut] = useState("⌘K");

  const q = query.trim();
  const searching = q.length >= LEAD_SEARCH_MIN_CHARS;

  const pages = NAV_LINKS.filter((l) => !q || l.label.toLowerCase().includes(q.toLowerCase()));
  const items: Item[] = [
    ...pages.map((link): Item => ({ kind: "page", key: link.href, href: hrefs[link.href] ?? link.href, link })),
    ...leads.map((lead): Item => ({ kind: "lead", key: lead.id, href: `/dashboard/leads?lead=${lead.id}`, lead })),
  ];
  const activeIndex = Math.min(active, Math.max(items.length - 1, 0));
  const optionId = (i: number) => `${listId}-option-${i}`;

  useEffect(() => {
    if (!/mac|iphone|ipad/i.test(navigator.userAgent)) setShortcut("Ctrl K");
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      inputRef.current?.focus();
    }
    if (!open && el.open) el.close();
    if (!open) {
      setQuery("");
      setLeads([]);
      setStatus("idle");
      setActive(0);
      setGoing(null);
    }
  }, [open]);

  // Debounced, and only the latest answer counts: a slow reply to "ja" must
  // not land on top of the results for "jane".
  useEffect(() => {
    if (!searching) {
      setLeads([]);
      setStatus("idle");
      return;
    }
    setStatus("loading");
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      try {
        // POST, so a name or a phone number never sits in a URL or a log line.
        const res = await fetch("/api/leads/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ q }),
          signal: ctrl.signal,
        });
        if (res.status === 401) {
          setLeads([]);
          setStatus("signed-out");
          return;
        }
        if (!res.ok) throw new Error(String(res.status));
        const json = (await res.json()) as { leads?: LeadSearchResult[] };
        setLeads(json.leads ?? []);
        setStatus("idle");
      } catch {
        if (ctrl.signal.aborted) return;
        setLeads([]);
        setStatus("error");
      }
    }, 180);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [q, searching]);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    if (open) document.getElementById(optionId(activeIndex))?.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, open]);

  // Close once the navigation has been taken, not before: the chosen row
  // shows it is busy until then, and from there the dashboard's own loading
  // state (app/dashboard/loading.tsx) covers the wait for the page.
  useEffect(() => {
    if (going && !navigating) setOpen(false);
  }, [going, navigating]);

  function choose(item: Item) {
    setGoing(item.key);
    startNavigation(() => router.push(item.href));
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (items.length === 0) return;
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((activeIndex + step + items.length) % items.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = items[activeIndex];
      if (item && !going) choose(item);
    } else if (e.key === "Escape") {
      // The dialog closes itself on Escape. Keep the key from reaching the
      // lead panel underneath, which listens on the window and would close too.
      e.stopPropagation();
    }
  }

  const firstLead = pages.length;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-keyshortcuts="Meta+K Control+K"
        className="hidden h-control-sm w-64 items-center gap-2 rounded-md border-[length:var(--border-field)] border-field bg-background px-3 text-body-sm text-muted-foreground transition-colors duration-quick hover:border-field-hover focus-ring lg:flex"
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden />
        <span className="flex-1 text-left">Search leads</span>
        <kbd className={KBD}>{shortcut}</kbd>
      </button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="Search leads"
        aria-haspopup="dialog"
        className="text-muted-foreground lg:hidden"
      >
        <Search />
      </Button>

      <dialog
        ref={dialogRef}
        aria-label="Search leads and pages"
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) setOpen(false);
        }}
        className="mx-auto mb-auto mt-[12vh] w-[calc(100%-2rem)] max-w-[560px] overflow-hidden rounded-lg border border-border bg-card p-0 text-foreground shadow-overlay backdrop:bg-black/40 backdrop:backdrop-blur-[2px]"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" aria-hidden />
          ) : (
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          )}
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Name, phone, email or postcode"
            role="combobox"
            aria-label="Search leads and pages"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={items.length ? optionId(activeIndex) : undefined}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="h-control-lg min-w-0 flex-1 bg-transparent text-entry text-foreground outline-none placeholder:text-muted-foreground"
          />
          <kbd className={cn(KBD, "hidden sm:block")}>esc</kbd>
        </div>

        <div id={listId} role="listbox" aria-label="Results" className="max-h-[min(60vh,26rem)] overflow-y-auto p-2">
          {pages.length > 0 && (
            <Section label={q ? "Pages" : "Go to"}>
              {pages.map((link, i) => {
                const Icon = link.icon;
                return (
                  <Row
                    key={link.href}
                    id={optionId(i)}
                    active={i === activeIndex}
                    busy={going === link.href}
                    onHover={() => setActive(i)}
                    onChoose={() => !going && choose(items[i])}
                    className="h-control-sm"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                    <span className="text-body">{link.label}</span>
                  </Row>
                );
              })}
            </Section>
          )}

          {leads.length > 0 && (
            <Section label="Leads">
              {leads.map((lead, n) => {
                const i = firstLead + n;
                return (
                  <Row
                    key={lead.id}
                    id={optionId(i)}
                    active={i === activeIndex}
                    busy={going === lead.id}
                    onHover={() => setActive(i)}
                    onChoose={() => !going && choose(items[i])}
                    className="py-2"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-body font-medium">
                        {lead.name}
                        {lead.is_test && <span className="ml-2 text-caption font-normal text-muted-foreground">Test</span>}
                      </span>
                      <span className="block truncate text-caption text-muted-foreground">
                        {lead.phone} · {lead.postcode.toUpperCase()} · {lead.email}
                      </span>
                    </span>
                    <span className="shrink-0 text-right text-caption text-muted-foreground">
                      <span className="block">{installTypeLabel(lead.install_type)}</span>
                      <span className="block tabular-nums">{formatDate(lead.created_at)}</span>
                    </span>
                  </Row>
                );
              })}
            </Section>
          )}

          {status === "signed-out" ? (
            <p className="px-3 py-6 text-center text-body-sm text-muted-foreground">
              You have been signed out. Reload the page to sign in again.
            </p>
          ) : status === "error" ? (
            <p className="px-3 py-6 text-center text-body-sm text-muted-foreground">
              The search did not answer. Check the connection and type again.
            </p>
          ) : searching && status === "idle" && leads.length === 0 ? (
            <p className="px-3 py-6 text-center text-body-sm text-muted-foreground">
              No lead matches &ldquo;{q}&rdquo;. Try the phone number or the postcode.
            </p>
          ) : !searching && items.length > 0 ? (
            <p className="px-3 pb-1 pt-3 text-caption text-muted-foreground">
              Type a name, a phone number, an email or a postcode to find a lead.
            </p>
          ) : null}
        </div>
      </dialog>
    </>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={label} className="[&+&]:mt-2">
      <p aria-hidden className="px-3 pb-1 pt-1 text-caption font-medium text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}

function Row({
  id,
  active,
  busy,
  onHover,
  onChoose,
  className,
  children,
}: {
  id: string;
  active: boolean;
  busy: boolean;
  onHover: () => void;
  onChoose: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      role="option"
      aria-selected={active}
      onMouseMove={onHover}
      onClick={onChoose}
      className={cn("flex cursor-pointer items-center gap-3 rounded-md px-3", active && "bg-accent", className)}
    >
      {children}
      {busy && <Loader2 className="ml-auto h-4 w-4 shrink-0 animate-spin text-muted-foreground" aria-label="Opening" />}
    </div>
  );
}
