import { MapPin } from "lucide-react";

const REGIONS = [
  "Scotland & Highlands",
  "North East & Cumbria",
  "North West",
  "Yorkshire",
  "Wales",
  "Midlands",
  "East Anglia",
  "South West",
  "South East & London",
  "Northern Ireland",
];

export function CoverageMap() {
  return (
    <section id="coverage" className="scroll-mt-20 py-16 sm:py-20">
      <div className="container grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Coverage across the whole of the UK</h2>
          <p className="mt-3 text-lg text-muted-foreground">
            We install Starlink everywhere from the Highlands to the South Coast — including the rural and island
            locations where traditional broadband never arrives.
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {REGIONS.map((r) => (
              <li key={r} className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" aria-hidden /> {r}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Not sure about your spot? The coverage checker at the top of the page confirms your exact postcode in seconds.
          </p>
        </div>

        {/* Stylised UK map — decorative SVG, full coverage shading */}
        <div className="relative mx-auto w-full max-w-sm">
          <div
            aria-hidden
            className="aspect-[3/4] w-full rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-accent/10 to-success/10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 40% 25%, hsl(var(--primary)/0.25), transparent 35%), radial-gradient(circle at 55% 55%, hsl(var(--accent)/0.2), transparent 40%), radial-gradient(circle at 45% 80%, hsl(var(--success)/0.2), transparent 35%)",
            }}
          />
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <MapPin className="h-10 w-10 text-primary" aria-hidden />
            <p className="mt-2 text-2xl font-extrabold">Full UK mainland</p>
            <p className="text-sm text-muted-foreground">+ islands &amp; offshore</p>
          </div>
        </div>
      </div>
    </section>
  );
}
