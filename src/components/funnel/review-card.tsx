"use client";

import { useState } from "react";
import type { Review } from "@/lib/reviews/google-reviews";
import { TrustpilotStars, TrustpilotStarMark, TrustpilotVerified, avatarTone } from "./trustpilot-marks";

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

/**
 * Blue seal. The lobes are placed by trigonometry rather than drawn by hand —
 * the previous path had uneven points and read as a squashed blob at 16px.
 * Twelve circles on a common orbit, unioned by a shared fill, give a perfectly
 * regular scallop at any size.
 */
const SEAL_LOBES = 12;
const SEAL_ORBIT = 8.3; // distance from centre to each lobe's centre
const SEAL_LOBE_R = 2.35; // lobe radius; outer edge lands at 10.65 of 12

function VerifiedBadge({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label="Verified" role="img">
      <g fill="#4285F4">
        {Array.from({ length: SEAL_LOBES }, (_, i) => {
          const a = (i / SEAL_LOBES) * Math.PI * 2;
          return (
            <circle
              key={i}
              cx={12 + SEAL_ORBIT * Math.cos(a)}
              cy={12 + SEAL_ORBIT * Math.sin(a)}
              r={SEAL_LOBE_R}
            />
          );
        })}
        <circle cx="12" cy="12" r={SEAL_ORBIT + 0.2} />
      </g>
      <path
        d="M7.9 12.3l2.8 2.8 5.4-5.6"
        fill="none"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ReviewCard({ r, source = "google" }: { r: Review; source?: "google" | "trustpilot" }) {
  const [open, setOpen] = useState(false);
  const long = r.q.length > CLAMP;
  const text = open || !long ? r.q : r.q.slice(0, CLAMP).trimEnd() + "…";
  const label = source === "trustpilot" ? "Trustpilot review" : "Google review";
  // The date is the stronger signal: it proves the review is recent. Fall back
  // to the source label only when we have no date for that review.
  const meta = r.when ?? label;
  // Trustpilot tells us per review whether it is Verified, so the seal only
  // shows when it does. Google has no such concept, so `verified` is undefined
  // there and the badge stays on as before.
  const showVerified = r.verified ?? true;
  // Only Trustpilot cards get the pastel monogram; Google's usually have a photo.
  const tone = source === "trustpilot" ? avatarTone(r.name) : null;

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
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-lead font-medium text-foreground"
            style={tone ? { backgroundColor: tone.bg, color: tone.fg } : undefined}
          >
            {r.initial}
          </div>
        )}
        <div className="min-w-0 flex-1">
          {/* The name is the way to go and check the review at the source, which
              is what makes a wall of praise verifiable rather than a claim. */}
          {r.link ? (
            <a
              href={r.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate text-body font-semibold text-foreground underline-offset-4 transition-colors duration-quick hover:underline"
            >
              {r.name}
            </a>
          ) : (
            <div className="truncate text-body font-semibold text-foreground">{r.name}</div>
          )}
          <div className="text-caption text-muted-foreground">{meta}</div>
        </div>
        {source === "trustpilot" ? <TrustpilotStarMark size={26} /> : <GoogleG size={24} />}
      </div>

      {/* Stars + verified */}
      <div className="mt-4 flex items-center gap-2">
        {source === "trustpilot" ? (
          <>
            <TrustpilotStars rating={r.rating} height={18} />
            {showVerified && <TrustpilotVerified />}
          </>
        ) : (
          <>
            <span className="text-lead tracking-[3px] text-gold">{"★".repeat(Math.min(5, Math.max(4, r.rating)))}</span>
            {showVerified && <VerifiedBadge />}
          </>
        )}
      </div>

      {/* Text + read more */}
      <p className="mt-4 text-body text-foreground" style={{ lineHeight: "1.6", textWrap: "pretty" }}>
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
