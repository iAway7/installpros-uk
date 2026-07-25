import { MapPin, Phone, Satellite, Home, Mail, FileText, Shield, Facebook, Twitter, Youtube, Building2, HelpCircle } from "lucide-react";

/** Footer matching installpros.io (3-column links + bottom social bar). */
export function FunnelFooter() {
  return (
    <footer className="bg-secondary">
      <div className="container mx-auto py-8 md:py-12" style={{ maxWidth: "1140px" }}>
        <div className="mb-10">
          <a href="/install-quote">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/funnel/installpros-logo-colored-new.svg" alt="InstallPros Logo" className="h-10 transition-opacity hover:opacity-80" />
          </a>
        </div>

        <div className="mb-12 grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-sm font-bold tracking-wide text-foreground">SOLUTIONS</h3>
            <nav className="space-y-3">
              <FooterLink icon={<Satellite className="h-4 w-4" />} href="/install-quote">Satellite Broadband</FooterLink>
              <FooterLink icon={<Home className="h-4 w-4" />} href="#">Home Automation</FooterLink>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-bold tracking-wide text-foreground">OUR COMPANY</h3>
            <nav className="space-y-3">
              <FooterLink icon={<Mail className="h-4 w-4" />} href="/contact-us">Contact Us</FooterLink>
              <FooterLink icon={<HelpCircle className="h-4 w-4" />} href="/faqs">FAQs</FooterLink>
              <FooterLink icon={<Building2 className="h-4 w-4" />} href="/contact-us">Locations</FooterLink>
              <FooterLink icon={<FileText className="h-4 w-4" />} href="#">Blog</FooterLink>
              <FooterLink icon={<FileText className="h-4 w-4" />} href="/terms">Terms and Conditions</FooterLink>
              <FooterLink icon={<Shield className="h-4 w-4" />} href="/privacy">Privacy Policy</FooterLink>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-bold tracking-wide text-foreground">LOCATION</h3>
            <address className="space-y-3 not-italic">
              <p className="flex items-start gap-2 text-base text-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> Rotunda Buildings, Montpellier Exchange, Cheltenham, GL50 1SX 🇬🇧
              </p>
              <a href="tel:02033977003" className="flex items-center gap-2 text-base text-foreground transition-colors hover:text-primary">
                <Phone className="h-4 w-4" /> 020 3397 7003
              </a>
              <a href="mailto:admin@installpros.co.uk" className="flex items-center gap-2 text-base text-foreground transition-colors hover:text-primary">
                <Mail className="h-4 w-4" /> admin@installpros.co.uk
              </a>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/funnel/payment-methods.svg" alt="Accepted payment methods" className="mt-4 h-5" />
            </address>
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-secondary">
        <div className="container mx-auto py-6" style={{ maxWidth: "1140px" }}>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-base text-muted-foreground">© 2024 Install Pros® — InstallPros Group Ltd</p>
            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={Icon.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ icon, href, children }: { icon: React.ReactNode; href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="flex items-center gap-2 text-base text-foreground transition-colors hover:text-primary">
      {icon}
      {children}
    </a>
  );
}
