# Lead webhooks

Forwards every lead to an external system — Zapier, Make, n8n, a CRM endpoint —
so leads reach whoever is selling **without anyone opening this dashboard**.

Two events fire per lead:

| Event | When | Carries |
|---|---|---|
| `lead.created` | instantly at submit | contact + full attribution (landing page, UTMs, gclid) |
| `lead.enriched` | ~4s later, when scoring finishes | everything above **plus** the 1–10 score, property intel and pitch angles |

`lead.created` is the speed-to-lead one (fire a WhatsApp/SMS within seconds).
`lead.enriched` is the useful one for routing — "if score ≥ 9, notify Will
directly". Most setups want `lead.enriched`; subscribe to both if you want the
instant ping as well.

## One-time setup

Run **`supabase/migrations/0014_webhooks.sql`** in the Supabase SQL editor.
It adds `webhook_endpoints` and `webhook_deliveries` (the delivery log).

## Two ways to configure a destination

**A. Env var — zero config, no database.**

```
LEAD_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/123456/abcdef/
LEAD_WEBHOOK_EVENTS=lead.enriched        # default; use "lead.created,lead.enriched" for both
LEAD_WEBHOOK_SECRET=                     # optional, see Signing below
```

Set it in `.env.local` (dev) and Vercel env vars (production). Nothing else to do.

**B. Dashboard → Settings → Webhooks** (admin only) — add as many endpoints as
you like, each with its own events, optional signing secret, and a
**Send test** button that posts a realistic fake lead so you can confirm the
receiving side works *before* a real lead depends on it. The same page shows
the last 50 deliveries with status, HTTP code, attempts and error.

Both work at the same time. The env destination isn't listed in the table (it
isn't a database row) but its deliveries do appear in the log.

## Getting a URL from Zapier

1. New Zap → trigger **Webhooks by Zapier** → **Catch Hook**.
2. Copy the custom webhook URL it gives you.
3. Paste it into `LEAD_WEBHOOK_URL` or into a new endpoint in the dashboard.
4. Press **Send test** here, then **Test trigger** in Zapier — it picks up the
   payload and every field becomes mappable.
5. Add whatever action you want: Google Sheets row, HubSpot contact, WhatsApp,
   email, Slack.

## Payload

```jsonc
{
  "event": "lead.enriched",
  "sent_at": "2026-08-19T14:02:11.000Z",
  "lead": {
    "id": "…", "created_at": "…", "name": "…", "email": "…", "phone": "…",
    "postcode": "LS18 5QB", "service": "…", "install_type": "residential",
    "notes": "…", "status": "new",
    "score": 9                       // null on lead.created — not scored yet
  },
  "attribution": {
    "landing_page": "/install-quote", "traffic_source": "google",
    "campaign": "…", "device_type": "mobile", "source_url": "…",
    "utm_source": "…", "utm_medium": "…", "utm_campaign": "…",
    "utm_term": null, "utm_content": null,
    "gclid": "…", "fbclid": null,
    "session_id": "…", "variant_id": null, "experiment_id": null
  },
  "intel": { /* score, broadband, EPC, crime, value band… — null on lead.created */ },
  "pitch_angles": ["Slow broadband — lead with Starlink"],
  "links": { "dashboard": "https://…/dashboard/leads?lead=…" }
}
```

Nested, but Zapier and Make flatten it automatically — you'll see
`lead__email`, `attribution__gclid` and so on.

## Signing (optional)

Set a secret and every request carries:

```
X-InstallPros-Timestamp: 1755612131
X-InstallPros-Signature: sha256=<hex>
```

The signature is `HMAC-SHA256(secret, "<timestamp>.<raw body>")`. Zapier ignores
it; a custom receiver should recompute it and reject a mismatch. Leave the
secret blank for Zapier/Make.

## Reliability

- **Never blocks lead capture.** Dispatch runs outside the form's response
  path, and every failure is swallowed — a broken endpoint cannot stop a lead
  being saved.
- **Retries.** 3 attempts with backoff (0 / 0.5s / 2s), 8s timeout each. A 4xx
  other than 408/429 stops retrying — the receiver rejected the body, and
  resending the identical body gets the identical answer.
- **Idempotent** per (lead, event, destination). `lead.created` is triggered
  from two places on purpose — server-side in `/api/lead`, and from the browser
  via `/api/leads/{id}/notify`, because a serverless function can be frozen the
  moment it returns and drop a send in flight. The idempotency check means the
  belt and the braces can never both deliver.
- **Everything is logged**, successes and failures, in `webhook_deliveries`.

## Files

| Path | What |
|---|---|
| `supabase/migrations/0014_webhooks.sql` | tables + RLS |
| `src/lib/webhooks/dispatch.ts` | target resolution, signing, retries, idempotency, logging |
| `src/lib/webhooks/payload.ts` | payload assembly + the test payload |
| `src/lib/webhooks/types.ts` | shared types |
| `src/app/api/webhooks/*` | admin CRUD, test send, internal fan-out |
| `src/app/api/leads/[id]/notify/route.ts` | browser-side backstop for `lead.created` |
| `src/components/dashboard/webhooks-view.tsx` | Settings → Webhooks UI |
