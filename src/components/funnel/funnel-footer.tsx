/** Funnel footer — a single slim bar: copyright + accepted payment methods. */
export function FunnelFooter() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="container mx-auto py-6" style={{ maxWidth: "1140px" }}>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-base text-muted-foreground">© 2026 Install Pros®</p>
          <nav className="flex items-center gap-6 text-base text-muted-foreground">
            <a href="/terms" className="transition-colors hover:text-primary">Terms and Conditions</a>
            <a href="/privacy" className="transition-colors hover:text-primary">Privacy Policy</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
