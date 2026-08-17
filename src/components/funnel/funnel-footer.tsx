/** Funnel footer — a single slim bar: copyright + accepted payment methods. */
export function FunnelFooter() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="container mx-auto py-6" style={{ maxWidth: "1140px" }}>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-base text-muted-foreground">© {new Date().getFullYear()} Install Pros®</p>
          <nav className="flex items-center gap-2 text-base text-muted-foreground">
            <a href="/terms" className="flex min-h-[48px] items-center px-2 transition-colors duration-quick hover:text-brand-hover">Terms and Conditions</a>
            <a href="/privacy" className="flex min-h-[48px] items-center px-2 transition-colors duration-quick hover:text-brand-hover">Privacy Policy</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
