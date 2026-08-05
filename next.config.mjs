/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
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
