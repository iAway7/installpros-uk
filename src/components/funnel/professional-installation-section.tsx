import { Check } from "lucide-react";
import { Button } from "@/components/system/button";

const FEATURES = [
  { title: "Customised Setup", description: "We customise installations for Residential, Commercial, Marine, and Mobile needs." },
  { title: "Complete Installation", description: "We take care of everything—mounting, cabling, and router setup. Prices start at £899." },
  {
    title: "Quick Install: Within 7 Days",
    description:
      "We supply and install your Starlink system, typically within 7 days. Installations take 1-3 hours, with optimal performance within 12 hours.",
  },
  {
    title: "Nationwide Coverage",
    description: "Our expert installation services are available across the UK, no matter where you're located.",
  },
];

export function ProfessionalInstallationSection() {
  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="container mx-auto max-w-[1280px]">
        <h2
          className="mb-4 text-center text-[2.5rem] font-bold italic text-foreground md:text-[3.25rem]"
          style={{ lineHeight: "1.1em", letterSpacing: "-1px" }}
        >
          Professional Installation
        </h2>
        <p className="mx-auto mb-12 max-w-3xl text-center text-base text-muted-foreground md:text-lg">
          Durable, all-metal mounts for high-quality, long-lasting installations.
        </p>

        <div className="mx-auto max-w-3xl space-y-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-4 rounded-xl border border-border bg-background p-6 shadow-sm">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-foreground">
                <Check className="h-6 w-6 text-background" />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-bold text-foreground">{f.title}</h3>
                <p className="text-muted-foreground" style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild>
            <a href="#quote">Check Availability</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
