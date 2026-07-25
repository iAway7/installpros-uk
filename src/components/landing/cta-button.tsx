"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { track, EVENTS } from "@/lib/analytics";

interface CtaButtonProps extends ButtonProps {
  ctaId: string;
  ctaLabel: string;
  ctaLocation: string;
  href?: string;
}

/** A CTA that auto-fires a standardized cta_clicked event with location context. */
export function CtaButton({ ctaId, ctaLabel, ctaLocation, href, onClick, children, ...props }: CtaButtonProps) {
  function handle(e: React.MouseEvent<HTMLButtonElement>) {
    track(EVENTS.CTA_CLICKED, { cta_id: ctaId, cta_label: ctaLabel, cta_location: ctaLocation });
    onClick?.(e);
  }
  if (href) {
    return (
      <Button asChild {...props}>
        <a href={href} onClick={() => track(EVENTS.CTA_CLICKED, { cta_id: ctaId, cta_label: ctaLabel, cta_location: ctaLocation })}>
          {children}
        </a>
      </Button>
    );
  }
  return (
    <Button onClick={handle} {...props}>
      {children}
    </Button>
  );
}

/** A WhatsApp CTA that fires whatsapp_clicked (a conversion event). */
export function WhatsAppButton({
  href,
  ctaLocation,
  children,
  ...props
}: ButtonProps & { href: string; ctaLocation: string }) {
  return (
    <Button asChild variant="whatsapp" {...props}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track(EVENTS.WHATSAPP_CLICKED, { channel: "whatsapp", cta_location: ctaLocation })}
      >
        {children}
      </a>
    </Button>
  );
}
