import { benefits } from "@/lib/site-config";
import { Icon } from "./icon";

export function Benefits() {
  return (
    <section id="benefits" className="scroll-mt-20 py-16 sm:py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Why thousands of UK homes choose Starlink</h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Satellite broadband that performs like fibre — without the cabinet, the phone line or the wait.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon name={b.icon} className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold">{b.title}</h3>
              <p className="mt-2 text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
