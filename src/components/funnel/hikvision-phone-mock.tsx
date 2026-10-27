/**
 * The phone in the Hikvision page's app section: four live tiles and one
 * alert, in the spirit of Hik-Connect's own screens, drawn here rather than
 * a screenshot (no Hikvision assets; their brand guidelines want written
 * permission). Static, so no Motion and nothing to load.
 *
 * DRAFT, 27 October 2026. The tiles are gradients standing in for camera
 * pictures; when the place renders exist (prompts-imagenes.md), small crops of
 * them go in as the feeds.
 */

const TILES: { name: string; tone: string }[] = [
  { name: "Front door", tone: "linear-gradient(160deg,#3a4656 0%,#1b2430 70%)" },
  { name: "Drive", tone: "linear-gradient(160deg,#41505f 0%,#1d2733 70%)" },
  { name: "Side gate", tone: "linear-gradient(160deg,#323d4a 0%,#161e28 70%)" },
  { name: "Garden", tone: "linear-gradient(160deg,#36463f 0%,#18221d 70%)" },
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
            <li key={t.name} className="relative aspect-[4/3] overflow-hidden rounded-lg" style={{ background: t.tone }}>
              <span className="absolute left-1.5 top-1.5 rounded bg-black/45 px-1.5 py-0.5 text-[10px] font-medium text-white/90">
                {t.name}
              </span>
              <span className="absolute bottom-1.5 right-1.5 text-[10px] tabular-nums text-white/70">02:14</span>
            </li>
          ))}
        </ul>

        <div className="px-3 pb-4 pt-4">
          <div className="flex items-start gap-2.5 rounded-[18px] bg-[#2a2b2d]/90 px-3 py-2.5 text-left text-white ring-1 ring-white/10">
            <span className="mt-0.5 h-9 w-9 shrink-0 rounded-[9px]" style={{ background: TILES[1].tone }} />
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
