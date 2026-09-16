// Supabase is contacted straight from the browser on the auth pages, so its
// origin has to be in connect-src. Derived from env so staging/prod differ.
const supabaseOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin;
  } catch {
    return "https://*.supabase.co";
  }
})();

/**
 * Content-Security-Policy, shipped in Report-Only.
 *
 * The funnel pulls from a lot of third parties (GTM, Trustpilot, YouTube,
 * ArcGIS tiles, Cloudflare's speed test) and an enforcing policy that missed
 * one would silently break analytics or a section of the page in production.
 * Report-Only gives identical console violations with nothing blocked.
 *
 * To promote: watch the console on the funnel, the dashboard and /login for a
 * few days, fold in whatever legitimately reports, then rename the header to
 * "Content-Security-Policy".
 *
 * 'unsafe-inline' in script-src is load-bearing for now: GTM injects inline
 * snippets and the pages carry inline JSON-LD. Removing it needs nonces, which
 * is a bigger change than this pass.
 */
// Grouped by who needs what, because a bare list of hostnames tells you
// nothing about which one you are allowed to remove.
const CSP_SOURCES = {
  // Tag Manager loads, then injects GA4, Google Ads and the CookieYes CMP.
  google: {
    script: ["https://www.googletagmanager.com", "https://www.googleadservices.com", "https://googleads.g.doubleclick.net"],
    // GA4 posts to a regional collector: region1 today, a different number for
    // a visitor elsewhere. The wildcard is what stops this breaking the first
    // time somebody loads the site from another country.
    connect: [
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
      "https://*.google-analytics.com",
      "https://*.analytics.google.com",
      "https://pagead2.googlesyndication.com",
      "https://*.g.doubleclick.net",
    ],
    img: ["https://www.googletagmanager.com", "https://www.google-analytics.com", "https://www.google.com", "https://www.google.co.uk", "https://googleads.g.doubleclick.net"],
    frame: ["https://td.doubleclick.net"],
  },
  // The consent banner, injected by GTM on Consent Initialization. If any of
  // these is missing once the policy is enforced, the CMP silently disappears
  // and a UK site is left with no consent banner at all, which is the worst
  // thing on this list to get wrong. cdn-cookieyes.com is a separate domain
  // from cookieyes.com, so neither covers the other.
  cookieyes: {
    script: ["https://cdn-cookieyes.com"],
    connect: ["https://cdn-cookieyes.com", "https://log.cookieyes.com"],
    img: ["https://cdn-cookieyes.com"],
  },
  trustpilot: {
    script: ["https://widget.trustpilot.com", "https://cdn.trustindex.io"],
    img: ["https://widget.trustpilot.com", "https://cdn.trustindex.io"],
    frame: ["https://widget.trustpilot.com"],
  },
  // Avatars on the Google reviews we render.
  reviews: { img: ["https://lh3.googleusercontent.com"] },
  funnel: {
    // postcodes.io for coverage, Places for the address autocomplete,
    // Cloudflare for the speed test.
    connect: ["https://api.postcodes.io", "https://places.googleapis.com", "https://speed.cloudflare.com"],
    img: ["https://i.ytimg.com", "https://maps.googleapis.com", "https://server.arcgisonline.com"],
    frame: ["https://www.youtube-nocookie.com"],
  },
};

/** Every source declared for one directive, deduped and in a stable order. */
const sources = (kind) =>
  [...new Set(Object.values(CSP_SOURCES).flatMap((group) => group[kind] ?? []))].join(" ");

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${sources("script")}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${sources("img")}`,
  "font-src 'self' data:",
  `connect-src 'self' ${supabaseOrigin} ${sources("connect")}`,
  `frame-src 'self' ${sources("frame")}`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

/**
 * Headers that carry no compatibility risk, enforced.
 * HSTS is two years with preload — only safe because the whole site is HTTPS.
 */
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Content-Security-Policy-Report-Only", value: csp },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    // AVIF is deliberately off: GHSA-2xp9-vwfh-vxw4 is an unauthenticated RCE
    // in the Image Optimization API reachable through the AVIF decode path, and
    // it has no fix in the 14.x line (only 16.3+). /_next/image is served even
    // when next/image is never imported, so the route is live regardless.
    // Nothing in src/ imports next/image today, so this costs us zero bytes —
    // put "image/avif" back once we are on Next 16.
    formats: ["image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // (The old /starlink-installation → /install-quote redirect was removed:
  // /starlink-installation is now a real page — the A/B variant.)
  // Root → the funnel. The old marketing home (components/landing) is retired;
  // anyone hitting "/" lands on the postcode variant. Temporary (307) so it's
  // easy to change later (e.g. point at /go for a 50/50 split).
  async redirects() {
    return [
      { source: "/", destination: "/install-quote", permanent: false },
    ];
  },
  // Proxy PostHog through our domain to avoid ad-blockers and keep events first-party.
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: "https://eu-assets.i.posthog.com/static/:path*" },
      { source: "/ingest/:path*", destination: "https://eu.i.posthog.com/:path*" },
    ];
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
