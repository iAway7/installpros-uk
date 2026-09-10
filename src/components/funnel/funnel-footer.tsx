const TERMS_URL = "https://installpros.co.uk/terms-and-conditions/";
const PRIVACY_URL = "https://installpros.co.uk/privacy-policy/";

/** Funnel footer — a single slim bar: copyright + accepted payment methods. */
export function FunnelFooter() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="container mx-auto py-6" style={{ maxWidth: "1140px" }}>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-body text-muted-foreground">© {new Date().getFullYear()} Install Pros®</p>
          <nav className="flex items-center gap-2 text-body text-muted-foreground">
            <a href={TERMS_URL} target="_blank" rel="noopener noreferrer" className="flex min-h-[48px] items-center px-2 transition-colors duration-quick hover:text-brand-hover">Terms and Conditions</a>
            <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" className="flex min-h-[48px] items-center px-2 transition-colors duration-quick hover:text-brand-hover">Privacy Policy</a>
            {/* `cky-banner-element` is CookieYes's own hook: their script binds to
                that class and reopens the consent panel. Documented at
                cookieyes.com/documentation/add-revisit-consent-button-footer/,
                and it needs no JavaScript of ours.

                This replaces their floating revisit widget, which is switched
                off in the CookieYes dashboard. That widget sits bottom-left and
                the WhatsApp float sits bottom-right, so the page would have
                carried two permanent circles. A footer link is where people
                look for cookie settings anyway.

                A button rather than an anchor: with CookieYes not yet live, an
                <a href="#"> would jump the visitor to the top of the page. A
                button that nothing is listening to does nothing at all. */}
            <button
              type="button"
              className="cky-banner-element flex min-h-[48px] items-center px-2 text-body text-muted-foreground transition-colors duration-quick hover:text-brand-hover"
            >
              Cookie Settings
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
