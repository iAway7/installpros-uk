/**
 * The phone in the Hikvision page's app section: four live tiles and one alert, in the spirit of Hik-Connect's
 * own screens, drawn here rather than a screenshot (no Hikvision assets;
 * their brand guidelines want written permission, and the store screenshots
 * show an Italian city, a US porch and business-only features). Static, so
 * no Motion.
 *
 * The feeds are crops of the placement renders (28 October), framed as what
 * each camera sees rather than the camera itself. The alert is the night
 * scene, hence its earlier time.
 */

const TILES: { name: string; src: string }[] = [
  { name: "Front door", src: "/funnel/hikvision-feed-door.webp" },
  { name: "Drive", src: "/funnel/hikvision-feed-drive.webp" },
  { name: "Side gate", src: "/funnel/hikvision-feed-side.webp" },
  { name: "Garden", src: "/funnel/hikvision-feed-garden.webp" },
];

export function HikvisionPhoneMock() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[280px] md:max-w-[320px]">
      <div className="absolute -inset-10 rounded-[4rem] bg-[radial-gradient(closest-side,rgba(13,27,42,0.10),transparent)]" />
      <div className="relative overflow-hidden rounded-[2.75rem] border-[9px] border-[#0c100e] bg-[#101418] shadow-raised">
        <div className="mx-auto mt-2.5 h-[22px] w-[92px] rounded-full bg-[#0c100e]" />

        <div className="flex items-center justify-between px-4 pb-3 pt-4 text-white">
          <span className="text-[15px] font-semibold">Home</span>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff453a]" />
            Live
          </span>
        </div>

        <ul className="grid grid-cols-2 gap-1.5 px-2">
          {TILES.map((t) => (
            <li key={t.name} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#1b2430]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.src} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
              <span className="absolute left-1.5 top-1.5 rounded bg-black/45 px-1.5 py-0.5 text-[10px] font-medium text-white/90">
                {t.name}
              </span>
              <span className="absolute bottom-1.5 right-1.5 rounded bg-black/45 px-1 text-[10px] tabular-nums text-white/90">08:15</span>
            </li>
          ))}
        </ul>

        <div className="px-3 pb-4 pt-4">
          <div className="flex items-start gap-2.5 rounded-[18px] bg-[#2a2b2d]/90 px-3 py-2.5 text-left text-white ring-1 ring-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/funnel/hikvision-feed-alert.webp" alt="" loading="lazy" decoding="async" className="mt-0.5 h-9 w-9 shrink-0 rounded-[9px] object-cover" />
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-white/55">Drive</span>
                <span className="shrink-0 text-[11px] tabular-nums text-white/55">02:14</span>
              </span>
              <span className="mt-0.5 block text-[14px] font-semibold leading-tight">Person detected</span>
              <span className="mt-0.5 block text-[12.5px] leading-snug text-white/75">Tap to watch it back.</span>
            </span>
          </div>
        </div>

        <div className="mx-auto mb-2.5 h-[5px] w-[110px] rounded-full bg-white/50" />
      </div>
    </div>
  );
}
