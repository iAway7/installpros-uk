import { Star } from "lucide-react";
import { trustStats } from "@/lib/site-config";

export function TrustBar() {
  return (
    <section aria-label="Trust and credentials" className="border-b border-border bg-card">
      <div className="container py-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {trustStats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-extrabold text-primary sm:text-3xl">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="rounded-xl border border-border bg-background p-4">
              <div className="flex gap-0.5" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="mt-2 text-sm text-foreground">&ldquo;{r.quote}&rdquo;</blockquote>
              <figcaption className="mt-2 text-xs text-muted-foreground">
                {r.name} — {r.location}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

const REVIEWS = [
  {
    name: "Sarah M.",
    location: "Penrith, Cumbria",
    quote: "Went from 1.5 Mbps to 180 Mbps in one afternoon. The engineer was spotless and tidy.",
  },
  {
    name: "Tom & Rachel",
    location: "Isle of Skye",
    quote: "We run a holiday let off-grid — guests finally have proper wifi. Booking was effortless.",
  },
  {
    name: "Greenfield Farm",
    location: "Powys",
    quote: "Reliable connection for our cameras and card machine. Best decision we made this year.",
  },
];
