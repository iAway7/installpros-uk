"use client";

import { useRef, useState } from "react";
import { track } from "@/lib/analytics/track";
import { EVENTS } from "@/lib/analytics/events";

const VIDEO_ID = "nBsvd0cRUEQ";
const POSTER = "/funnel/install-video-poster.webp";

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
 */
export function InstallVideoSection() {
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
    track(EVENTS.VIDEO_PLAYED, { video_id: VIDEO_ID, video_location: "install_video" });
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
      <div className="container mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">See it done</p>
          <h2 className="mt-4 h2-section text-foreground">
            Forty seconds.
            <br />
            One real install.
          </h2>
        </div>

        {/* aspect-video reserves the box before anything loads, so neither the
            poster nor the iframe can shift the layout. */}
        <div className="mx-auto mt-12 max-w-4xl">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-secondary">
            {playing ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title="Professional Starlink installation by InstallPros"
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
                aria-label="Play the install video, 40 seconds"
                className="group absolute inset-0 h-full w-full cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={POSTER}
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
                    40 sec
                  </span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
