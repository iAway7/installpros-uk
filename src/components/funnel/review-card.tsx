"use client";

import { useState } from "react";
import type { Review } from "@/lib/reviews/google-reviews";

const CLAMP = 165; // characters before truncating with "Read more"

function GoogleG({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

/** Trustpilot green star mark. */
function TrustpilotStar({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#00B67A" aria-hidden="true">
      <path d="M12 1.5l3.09 6.83 7.41.66-5.62 4.93 1.68 7.26L12 17.35l-6.56 3.83 1.68-7.26L1.5 8.99l7.41-.66L12 1.5z" />
    </svg>
  );
}

/** Blue "verified" seal like Google's. */
function VerifiedBadge() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-label="Verified" role="img">
      <path
        fill="#4285F4"
        d="M12 1l2.4 1.8 3-.2 1 2.8 2.6 1.5-.7 2.9L23 12l-1.7 2.4.7 2.9-2.6 1.5-1 2.8-3-.2L12 23l-2.4-1.8-3 .2-1-2.8L3 17.3l.7-2.9L2 12l1.7-2.4L3 6.7l2.6-1.5 1-2.8 3 .2z"
      />
      <path fill="#fff" d="M10.6 14.6l-2.2-2.2-1.1 1.1 3.3 3.3 5.8-5.8-1.1-1.1z" />
    </svg>
  );
}

export function ReviewCard({ r, source = "google" }: { r: Review; source?: "google" | "trustpilot" }) {
  const [open, setOpen] = useState(false);
  const long = r.q.length > CLAMP;
  const text = open || !long ? r.q : r.q.slice(0, CLAMP).trimEnd() + "…";
  const label = source === "trustpilot" ? "Trustpilot review" : "Google review";

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm">
      {/* Top: avatar + name/time + Google mark */}
      <div className="flex items-center gap-3">
        {r.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={r.photo}
            alt={r.name}
            width={48}
            height={48}
            // The reviews sit well below the fold, but these five avatars were
            // being fetched during the initial load — 52 KB from Google's CDN
            // competing with the LCP image for bandwidth on a slow connection.
            loading="lazy"
            decoding="async"
            className="h-12 w-12 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-[17px] font-medium text-foreground">
            {r.initial}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="truncate text-body font-semibold text-foreground">{r.name}</div>
          <div className="text-caption text-muted-foreground">{label}</div>
        </div>
        {source === "trustpilot" ? <TrustpilotStar size={24} /> : <GoogleG size={24} />}
      </div>

      {/* Stars + verified */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-body-sm tracking-[2px] text-gold">{"★".repeat(Math.min(5, Math.max(4, r.rating)))}</span>
        <VerifiedBadge />
      </div>

      {/* Text + read more */}
      <p className="mt-3 text-body-sm text-foreground" style={{ lineHeight: "1.6", textWrap: "pretty" }}>
        {text}
      </p>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="-mb-2 mt-1 flex min-h-[48px] items-center self-start pr-6 text-body-sm font-medium text-muted-foreground transition-colors duration-quick hover:text-foreground"
        >
          {open ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
