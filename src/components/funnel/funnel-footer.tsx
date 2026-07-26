/** Funnel footer — a single slim bar: copyright + accepted payment methods. */
export function FunnelFooter() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="container mx-auto py-6" style={{ maxWidth: "1140px" }}>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-base text-muted-foreground">© 2026 Install Pros®</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/funnel/payment-methods.svg" alt="Accepted payment methods" className="h-5" />
        </div>
      </div>
    </footer>
  );
}
