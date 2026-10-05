"use client";

import { useEffect, useState } from "react";
import { Pagination } from "@/components/system/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/system/select";
import { cn } from "@/lib/utils";

export const PAGE_SIZES = [10, 20, 50] as const;
export const DEFAULT_PAGE_SIZE = 20;

/**
 * Client-side paging state for a list that is already in memory.
 *
 * `resetKey` is anything that changes the list's contents (a search, a filter,
 * a tab). When it changes the view goes back to page 1, so a new filter never
 * opens on an empty page 7. The page is also clamped, so a list that shrinks
 * under you (a lead marked as test) lands on its last real page.
 */
export function usePager(total: number, resetKey: unknown) {
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);
  const key = JSON.stringify(resetKey);

  useEffect(() => {
    setPage(1);
  }, [key]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, totalPages);
  const from = (current - 1) * pageSize;
  const to = Math.min(total, from + pageSize);

  return {
    page: current,
    totalPages,
    pageSize,
    from,
    to,
    setPage,
    setPageSize: (n: number) => {
      setPageSize(n);
      setPage(1);
    },
  };
}

/** "21–40 of 489 · Rows per page [20]" on the left, page numbers on the right. */
export function TablePager({
  pager,
  total,
  className,
}: {
  pager: ReturnType<typeof usePager>;
  total: number;
  className?: string;
}) {
  if (total === 0) return null;
  const { page, totalPages, pageSize, from, to, setPage, setPageSize } = pager;
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3", className)}>
      <div className="flex items-center gap-3 text-label text-muted-foreground">
        <span className="tabular-nums">
          {from + 1}–{to} of {total}
        </span>
        <span aria-hidden>·</span>
        <label className="flex items-center gap-2">
          Rows per page
          <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
            <SelectTrigger className="h-8 w-[4.5rem] text-body-sm" aria-label="Rows per page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((n) => (
                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
