import type { PostgrestError } from "@supabase/supabase-js";

/**
 * Reads every row a query matches, not just the first 1,000.
 *
 * PostgREST caps a single response at the project's "Max rows" setting
 * (1,000 by default), and it does so silently: the dashboard asked for
 * "all leads", got the oldest 1,000, and every rate computed from them was
 * wrong once the table passed that size (24 Oct 2026, ~1,480 leads). The
 * Targets page was the visible symptom: picking an earlier start date made
 * conversion drop, because the newest leads fell off the end of the page.
 *
 * `make` must return a fresh builder each time (builders are mutable), with
 * a deterministic `.order()` so pages do not overlap. Pages are fetched one
 * after another until a short page arrives.
 */
export async function fetchAll<T>(
  make: () => { range(from: number, to: number): PromiseLike<{ data: T[] | null; error: PostgrestError | null }> },
  pageSize = 1000,
): Promise<{ data: T[]; error: PostgrestError | null }> {
  const rows: T[] = [];
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await make().range(from, from + pageSize - 1);
    if (error) return { data: rows, error };
    const page = data ?? [];
    rows.push(...page);
    if (page.length < pageSize) return { data: rows, error: null };
  }
}
