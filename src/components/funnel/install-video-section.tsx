"use client";

import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { track } from "@/lib/analytics/track";
import { EVENTS } from "@/lib/analytics/events";

/** The residential film, and the defaults every page had before this took
 *  props. A page that passes nothing behaves exactly as it did. */
const DEFAULT_VIDEO_ID = "nBsvd0cRUEQ";
const DEFAULT_POSTER = "/funnel/install-video-poster.webp";

/**
 * "Forty seconds. One real install." the install video, embedded as a facade.
 *
 * A plain YouTube iframe pulls roughly a megabyte of third-party JavaScript and
 * opens several Google origins before anyone presses play. This renders a
 * self-hosted poster instead and only mounts the iframe on click, which keeps
 * the section at about 3 KB on first load and contacts no third party until the
 * visitor asks for it. That also keeps the cookie story simple.
 *
 * The connection is opened on intent (hover, touch or focus) rather than on
 * load: the TLS handshake is done by the time the click lands, so the player
 * starts noticeably sooner without costing anything up front.
 *
 * Takes props since 22 September, when the vehicle page got its own film. Each
 * one needs its own `location`, or the two land in the same PostHog bucket and
 * neither play rate means anything.
 */
export function InstallVideoSection({
  videoId = DEFAULT_VIDEO_ID,
  poster = DEFAULT_POSTER,
  eyebrow = "See it done",
  heading = (
    <>
      Forty seconds.
      <br />
      One real install.
    </>
  ),
  /** Printed on the badge and read out in the play button's label. */
  duration = "40 sec",
  /** One line under the frame. Use it where the footage needs saying out loud:
   *  the vehicle film shows a drill, on a page whose mount section says we do
   *  not drill, and a reader who does not know what is being drilled will
   *  believe their own eyes. */
  caption,
  /** Distinguishes the plays in analytics. */
  location = "install_video",
  title = "Professional Starlink installation by InstallPros",
}: {
  videoId?: string;
  poster?: string;
  eyebrow?: string;
  heading?: ReactNode;
  duration?: string;
  caption?: string;
  location?: string;
  title?: string;
} = {}) {
  const [playing, setPlaying] = useState(false);
  const warmed = useRef(false);

  function warm() {
    if (warmed.current || typeof document === "undefined") return;
    warmed.current = true;
    for (const href of ["https://www.youtube-nocookie.com", "https://i.ytimg.com"]) {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = href;
      document.head.appendChild(link);
    }
  }

  function play() {
    track(EVENTS.VIDEO_PLAYED, { video_id: videoId, video_location: location });
    setPlaying(true);
  }

  return (
    <section
      id="install-video"
      className="w-full scroll-mt-28 bg-background py-16 md:py-24"
      // Skip rendering until it is near the viewport. The reserved size keeps
      // the scrollbar honest so nothing jumps.
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 700px" }}
    >
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-4 h2-section text-foreground">{heading}</h2>
        </div>

        {/* aspect-video reserves the box before anything loads, so neither the
            poster nor the iframe can shift the layout. */}
        <div className="mx-auto mt-12 max-w-4xl">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-secondary">
            {playing ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title={title}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <button
                type="button"
                onClick={play}
                onMouseEnter={warm}
                onTouchStart={warm}
                onFocus={warm}
                aria-label={`Play the install video, ${duration}`}
                className="group absolute inset-0 h-full w-full cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={poster}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  width={1280}
                  height={720}
                  className="h-full w-full object-cover"
                />
                <span aria-hidden="true" className="absolute inset-0 bg-black/25" />
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-primary text-primary-foreground shadow-raised transition-transform duration-card ease-ds group-hover:scale-105">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M8 5.2v13.6a.7.7 0 0 0 1.07.6l10.6-6.8a.7.7 0 0 0 0-1.2L9.07 4.6A.7.7 0 0 0 8 5.2z" />
                    </svg>
                  </span>
                  <span className="rounded-full border border-white/25 bg-black/45 px-3 py-1 text-label font-semibold uppercase tracking-[0.14em] text-white">
                    {duration}
                  </span>
                </span>
              </button>
            )}
          </div>
          {caption && (
            <p className="mt-3 text-center text-body-sm text-muted-foreground">{caption}</p>
          )}
        </div>
      </div>
    </section>
  );
}
