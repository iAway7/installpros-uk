"use client";

import { useState, type ReactNode } from "react";

/**
 * The fold on the review wall: the grid is cut at a fixed height with a fade
 * into the background, like the reference Gus sent, and one button opens the
 * rest. Client-side only for that toggle; the cards themselves are
 * server-rendered.
 */
export function VoipReviewsWallFold({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className={`relative ${open ? "" : "max-h-[920px] overflow-hidden md:max-h-[1040px]"}`}>
        {children}
        {!open && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-[#f4f4f5]/0 to-[#f4f4f5]"
          />
        )}
      </div>
      {!open && (
        <div className="mt-2 flex justify-center">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="focus-ring-solid flex h-control-lg items-center justify-center rounded-full bg-white px-7 text-body-sm font-semibold text-foreground shadow-sm transition-colors duration-quick ease-ds hover:bg-white/80"
          >
            Show more reviews
          </button>
        </div>
      )}
    </div>
  );
}
