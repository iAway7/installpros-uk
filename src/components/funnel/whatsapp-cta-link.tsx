"use client";

import type { ReactNode } from "react";
import { track, EVENTS } from "@/lib/analytics";

const WHATSAPP_URL = "https://wa.me/447446112343";

/**
 * The "Talk on WhatsApp" anchor used by the section CTAs. It exists so that
 * server-rendered sections can still report the click: without it these were
 * the only WhatsApp buttons on the landing that fired no event, so a visitor
 * who chose chat over the form left no trace anywhere. Wrap it in
 * <Button asChild variant="outline"> exactly like the plain <a> it replaces.
 */
export function WhatsAppCtaLink({ ctaLocation, children, ...rest }: { ctaLocation: string; children: ReactNode } & Omit<React.ComponentProps<"a">, "href" | "onClick">) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track(EVENTS.WHATSAPP_CLICKED, { channel: "whatsapp", cta_location: ctaLocation })}
      {...rest}
    >
      {children}
    </a>
  );
}
