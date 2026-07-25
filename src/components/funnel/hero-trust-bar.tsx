/** Google "G" mark. */
function GoogleG({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

/**
 * Hero trust bar — ported from the /starlink-installations landing. Google
 * rating, Trustpilot, install count, The Times, and the Authorized Starlink
 * Installer badge, in one centered row. On the dark hero (white text).
 */
export function HeroTrustBar() {
  return (
    <div className="relative z-10 w-full border-t border-white/10 bg-black/85 backdrop-blur">
      <div
        className="container mx-auto flex flex-wrap items-center justify-center gap-y-3 px-6 py-4 text-white"
        style={{ maxWidth: "1160px" }}
      >
        {/* Google rating */}
        <a
          href="https://maps.app.goo.gl/UvqYwqVrAV6R9T5m6"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Read our reviews on Google"
          className="flex items-center gap-2 px-4 transition-opacity hover:opacity-80 lg:px-6"
        >
          <GoogleG size={20} />
          <span className="text-sm font-semibold">5.0</span>
          <span className="text-sm tracking-[2px] text-[#fbbc04]">★★★★★</span>
        </a>

        {/* Trustpilot */}
        <a
          href="https://uk.trustpilot.com/review/installpros.co.uk"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Read our reviews on Trustpilot"
          className="flex items-center gap-2 px-4 transition-opacity hover:opacity-80 sm:border-l sm:border-white/15 lg:px-6"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#00B67A" aria-hidden="true">
            <path d="M12 1.5l3.09 6.83 7.41.66-5.62 4.93 1.68 7.26L12 17.35l-6.56 3.83 1.68-7.26L1.5 8.99l7.41-.66L12 1.5z" />
          </svg>
          <span className="text-sm text-white/70">
            <b className="text-white">Excellent</b> on Trustpilot
          </span>
        </a>

        {/* Install count */}
        <div className="flex items-center gap-2 px-4 sm:border-l sm:border-white/15 lg:px-6">
          <span className="text-sm font-semibold">9,163+</span>
          <span className="text-sm text-white/70">UK installations</span>
        </div>

        {/* As featured in The Times */}
        <div className="flex flex-col items-start gap-0.5 px-4 sm:border-l sm:border-white/15 lg:px-6">
          <span className="text-[8.5px] font-medium uppercase tracking-[0.24em] text-white/70">As featured in</span>
          <span
            className="text-[15px] font-semibold text-white"
            style={{ fontFamily: "Georgia, serif", letterSpacing: "0.03em" }}
          >
            THE TIMES
          </span>
        </div>

        {/* Authorized Starlink Installer */}
        <div className="flex items-center gap-2.5 px-4 sm:border-l sm:border-white/15 lg:px-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/funnel/Authorised-Starlink-Installer-Getmedigital.png"
            alt="Authorized Starlink Installer"
            className="block h-[72px] w-[72px] rounded-[9px]"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-sm text-white/70">Authorized</span>
            <span className="text-sm font-semibold text-white">Starlink Installer</span>
          </div>
        </div>
      </div>
    </div>
  );
}
