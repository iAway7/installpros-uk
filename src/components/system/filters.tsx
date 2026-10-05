"use client";

import { useCallback, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/system/select";
import { Calendar } from "@/components/system/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/utils";

/**
 * URL-backed filters. Each control writes its value into the query string and
 * re-renders the server page, so there is no Apply button and every view
 * stays linkable: a filtered Targets page is a URL you can send.
 *
 * Both controls are the small field: control-sm tall, radius md, the 1.5px
 * field border. They used to disagree side by side — the date trigger was a
 * 1px border-border box at rounded-md next to a Select at rounded-lg.
 *
 * For dashboards and other read-only views. A form that submits keeps its own
 * controls; these push to the URL on every change.
 */

function useSetParam() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, start] = useTransition();
  const set = useCallback(
    (name: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(name, value);
      else next.delete(name);
      const qs = next.toString();
      start(() => router.push(qs ? `${pathname}?${qs}` : pathname));
    },
    [params, pathname, router],
  );
  return { set, pending };
}

export function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 text-label text-muted-foreground">
      <span>{label}</span>
      {children}
    </div>
  );
}

/** Radix Select forbids "" as an item value, so "all" style options use a sentinel. */
const EMPTY = "__all__";

export function SelectFilter({
  name,
  value,
  options,
  label,
  className,
}: {
  name: string;
  value: string;
  options: [string, string][];
  label: string;
  className?: string;
}) {
  const { set, pending } = useSetParam();
  return (
    <FilterField label={label}>
      <Select value={value || EMPTY} onValueChange={(v) => set(name, v === EMPTY ? "" : v)} disabled={pending}>
        <SelectTrigger className={cn("h-control-sm min-w-40 rounded-md px-3 text-body-sm", className)} aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(([v, text]) => (
            <SelectItem key={v || EMPTY} value={v || EMPTY}>{text}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FilterField>
  );
}

const parse = (s: string): Date | null => (/^\d{4}-\d{2}-\d{2}$/.test(s) ? new Date(`${s}T00:00:00`) : null);
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const pretty = (s: string) =>
  parse(s)?.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) ?? s;

export function DateFilter({
  name,
  value,
  label,
  min,
  max,
  placeholder = "Any date",
  clearable = false,
}: {
  name: string;
  /** YYYY-MM-DD or "" for unset. */
  value: string;
  label: string;
  min?: string;
  max?: string;
  placeholder?: string;
  clearable?: boolean;
}) {
  const { set, pending } = useSetParam();
  const [open, setOpen] = useState(false);
  return (
    <FilterField label={label}>
      <div className="flex items-center gap-1">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={pending}
              aria-label={label}
              className={cn(
                "flex h-control-sm min-w-40 items-center gap-2 rounded-md border-[length:var(--border-field)] border-field bg-background px-3 text-body-sm text-foreground transition-colors duration-quick hover:border-field-hover focus-visible:border-selection-border focus-ring",
                !value && "text-muted-foreground",
              )}
            >
              <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
              {value ? pretty(value) : placeholder}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto border-0 p-0">
            <Calendar
              value={parse(value)}
              onChange={(d) => { set(name, iso(d)); setOpen(false); }}
              minDate={min ? parse(min) ?? undefined : undefined}
              maxDate={max ? parse(max) ?? undefined : new Date()}
            />
          </PopoverContent>
        </Popover>
        {clearable && value && (
          <button
            type="button"
            onClick={() => set(name, "")}
            aria-label={`Clear ${label}`}
            className="flex h-control-sm w-control-sm items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground focus-ring"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </FilterField>
  );
}
