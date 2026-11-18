/**
 * Filters that survive the sidebar.
 *
 * Funnel, Targets and Landing pages keep their filters in the URL, and a nav
 * link is a bare path, so every trip through the sidebar reset them: pick the
 * Ajax landing on Targets, click Funnel, and the funnel was back on every page
 * at once. Two rules fix that, both applied to the nav links only:
 *
 *   1. Each of those pages remembers its last query string, for as long as the
 *      tab stays open, and its nav link carries it.
 *   2. Between Funnel and Targets the landing page follows you: the link to
 *      the other one carries the landing you are looking at now.
 *
 * Dates do not cross over. Funnel counts rolling windows ("last 28 days") and
 * Targets counts from a fixed date, so there is no honest way to turn one
 * into the other; each page keeps its own.
 *
 * Pure, with the storage passed in, so the rules can be checked outside a
 * browser. The URL stays the source of truth: nothing here changes what a page
 * shows for a given address.
 */

export const FUNNEL_PATH = "/dashboard/funnel";
export const TARGETS_PATH = "/dashboard/targets";
export const LANDINGS_PATH = "/dashboard/landings";

/** Targets always shows one landing; this is the one it shows with no `page`
 *  in the URL. The Targets page reads it from here so the two cannot drift. */
export const TARGETS_DEFAULT_PAGE = "/install-quote";

export const STICKY_PATHS: readonly string[] = [FUNNEL_PATH, TARGETS_PATH, LANDINGS_PATH];

/** The pages that filter by landing, with what an absent `page` means on
 *  each: null is "every landing". */
const LANDING_DEFAULT: Record<string, string | null> = {
  [FUNNEL_PATH]: null,
  [TARGETS_PATH]: TARGETS_DEFAULT_PAGE,
};

type Store = Pick<Storage, "getItem" | "setItem">;

const key = (path: string) => `ip:filters:${path}`;

/** "/dashboard/funnel/" and "/dashboard/funnel" are the same page. */
function clean(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

/** Record the filters of the page being looked at. `search` has no "?". */
export function rememberFilters(store: Store, pathname: string, search: string): void {
  const path = clean(pathname);
  if (!STICKY_PATHS.includes(path)) return;
  try {
    store.setItem(key(path), search);
  } catch {
    /* storage full or blocked: the links fall back to bare paths */
  }
}

/** Where a nav link should point, given where the user is now. */
export function stickyHref(store: Store, target: string, pathname: string, search: string): string {
  const here = clean(pathname);
  // The link to the page you are on is the way back to its defaults.
  if (!STICKY_PATHS.includes(target) || target === here) return target;

  let remembered = "";
  try {
    remembered = store.getItem(key(target)) ?? "";
  } catch {
    /* blocked storage reads as nothing remembered */
  }
  const params = new URLSearchParams(remembered);

  if (target in LANDING_DEFAULT && here in LANDING_DEFAULT) {
    const page = new URLSearchParams(search).get("page") ?? LANDING_DEFAULT[here];
    if (page) params.set("page", page);
    else params.delete("page");
  }

  const qs = params.toString();
  return qs ? `${target}?${qs}` : target;
}
