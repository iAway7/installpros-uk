"use client";

import { useEffect, useState, type ReactNode } from "react";
import { SecurityHeroFunnel } from "./security-hero-funnel";
import type { SecurityNeed } from "./security-need-step";
import type { PhotoSpots } from "./security-hero-decor";
import { LazyHeroDecor } from "./security-lazy";

export type { PhotoSpots };

/**
 * The Ajax hero's inner part: the camera behind the centred copy and form,
 * and the alerts that answer the form. 15 October 2026.
 *
 * Gus tried a split hero first (copy left, camera right with alert cards),
 * liked the treatment, and asked for it centred: the same centred layout as
 * before, with the camera behind it. Then: a side view, at the edge, looking
 * in. So the camera sits at the right edge, part of it off-canvas, its lens
 * turned towards the copy and the form, and the alerts float in the left
 * margin, where it is looking, which a centred layout leaves empty on wide
 * screens. The hero's rings stay centred on the form.
 *
 * The alerts answer "What do you need?": they take turns until the visitor
 * picks, then settle on a person on the drive camera for Cameras, the front
 * door and the arming for Alarm, one of each for Both. Cards only from xl
 * (1280): narrower, the margins are too small and they would cover the
 * headline. Phones get the camera, the glow, the rings and the light.
 * Everything stops for prefers-reduced-motion.
 *
 * The decoration (camera, rings, light, LIVE and the alert cards) is drawn in
 * security-hero-decor.tsx and loaded as a chunk of its own: it is the only
 * part of the first screen that needs Motion, about 48 KB gzipped, and on a
 * slow phone that download competed with the hero photo, the largest thing
 * on screen (22 October 2026). This file keeps the copy, the form and the
 * state the alerts follow.
 *
 * PLACEHOLDER IMAGE. The side view here is the one Gus sent first, which is
 * mirrored: the logo reads backwards. It shows the composition until he finds
 * a left-facing render with the logo the right way round; swap the three
 * ajax-turretcam-side-*.webp files and re-check the lens (30% / 78%) and
 * light (15% / 65%) positions. Exported at 400, 640 and 960 px (15, 33 and
 * 69 KB). Ajax's own product render, transparent background.
 *
 * BEFORE THIS GOES LIVE:
 *   - Rights. It is Ajax's image and InstallPros is not an Ajax partner yet.
 *     Confirm with the distributor or Ajax that it can be used.
 *   - Cameras are settled (Jordan, 15 October): with an Ajax alarm the
 *     cameras are Ajax too, one app. Hikvision has its own page, so an Ajax
 *     camera is the right hero for this one.
 */

export function SecurityHeroInteractive({
  intro,
  defaultInstallType,
  formName,
  photo = false,
  photoSpots,
}: {
  /** The hero has a photograph with its own camera: drop the drawn camera
   *  and its rings, keep the alerts. */
  photo?: boolean;
  /** Where the photograph's camera is, for the recording light and LIVE. */
  photoSpots?: PhotoSpots;
  /** Badge, H1 and subheadline, rendered by the server component. */
  intro: ReactNode;
  defaultInstallType: string;
  formName: string;
}) {
  const [need, setNeed] = useState<SecurityNeed | null>(null);
  const [tick, setTick] = useState(0);

  // The alerts take turns only until the visitor answers. Reduced motion is
  // read here with matchMedia, not Motion's hook, so this file does not pull
  // Motion into the first chunk.
  useEffect(() => {
    if (need !== null || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 3200);
    return () => window.clearInterval(id);
  }, [need]);

  return (
    <div className="relative z-20 flex flex-1 justify-center pt-28 pb-16 md:pt-36">
      <LazyHeroDecor photo={photo} photoSpots={photoSpots} need={need} tick={tick} />

      <div className="container relative mx-auto my-auto text-center text-white">
        {intro}
        <div className="animate-slide-up animate-delay-300 mx-auto w-full md:max-w-2xl">
          <SecurityHeroFunnel defaultInstallType={defaultInstallType} skipServiceStep formName={formName} onNeedChange={setNeed} />
        </div>
      </div>
    </div>
  );
}
