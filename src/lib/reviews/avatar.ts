/**
 * Google hands back reviewer avatars at `=s128`. The review cards render them
 * at 48×48 (`h-12 w-12`), so the browser downloads roughly four times the
 * pixels it shows — PageSpeed measured 62 KB wasted across three reviewers on
 * /install-quote.
 *
 * We ask Google's own CDN for the right size instead, so there is no build step
 * and no image proxying on our side. 96px = 2x the 48px display size, which
 * keeps it sharp on retina while cutting the pixel count by ~44%.
 */
export function sizedAvatar(url?: string): string | undefined {
  if (!url) return undefined;
  // Only Google's CDN understands these directives; anything else is returned
  // untouched so a future review source can't be silently mangled.
  if (!/(^|\.)googleusercontent\.com\//.test(url)) return url;

  // Swap ONLY the size token and leave the rest of the directive alone.
  // Google appends flags we do not control (-c0x00000000, -cc, -rp, -mo, -ba3…)
  // and rewriting the whole directive risks a combination its CDN rejects,
  // which would show a broken avatar on the landing page. Changing the number
  // in place cannot produce an invalid directive.
  //
  // Deliberately NOT adding the `rw` (WebP) flag: it would save more, but it is
  // unverified against this CDN and a bad flag breaks the image. Worth testing
  // separately if the extra ~25 KB matters.
  return url.replace(/=s\d+(?=-|$)/, "=s96");
}
