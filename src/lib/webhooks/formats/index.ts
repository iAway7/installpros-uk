import type { WebhookFormat, WebhookPayload } from "../types";
import { toSuperchat } from "./superchat";
import { toZapier } from "./zapier";

/** Shape the outbound body for one endpoint. `generic` is our payload untouched. */
export function formatPayload(format: WebhookFormat | undefined, payload: WebhookPayload): unknown {
  switch (format) {
    case "superchat":
      return toSuperchat(payload);
    case "zapier":
      return toZapier(payload);
    case "generic":
    default:
      return payload;
  }
}
