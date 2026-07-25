# get.installpros.co.uk

High-converting Starlink installation landing page for the UK, built as the foundation of a scalable growth, analytics and experimentation platform for InstallPros.

**Phase 1 (this build): the marketing landing page is complete and runnable.**
Phases 2–5 (auth, dashboards, product analytics, A/B testing) are architected here and stubbed in the schema/folders so they drop in without restructuring.

---

## Quick start

```bash
cp .env.example .env.local      # fill in keys (works with defaults — see below)
npm install
npm run dev                     # http://localhost:3000
```

The page runs with **zero config**: the coverage checker uses the free
[postcodes.io](https://postcodes.io) API, and the lead form returns a generated
id when Supabase isn't connected, so the full funnel is clickable out of the box.
Add env keys to switch on real persistence and analytics.

```bash
npm run build      # production build
npm run typecheck  # tsc --noEmit
```

---

## What's built in Phase 1

A mobile-first, WCAG-minded, SEO-ready landing page that **mirrors the superior
US funnel** (installpros.io) the audit identified as the benchmark:

- **Real postcode coverage check with location echo** — "Starlink is live in
  Penrith, Cumbria" instead of the UK site's generic, fake-feeling "Starlink is
  Available!". This was the single most impactful qualitative gap in the audit.
- **Install-type selector** (home / rural / business / marine / events) to
  qualify the lead _before_ the form — the US funnel's other key advantage.
- **Sticky mobile CTA** that outranks navigation, directly countering the audit
  finding that the hamburger menu was out-clicking the quote CTA on mobile.
- Hero, trust bar (reviews + install count + coverage + guarantee), benefits,
  4-step process, coverage map, quote form, FAQ, final CTA, footer.
- **Standardized analytics event layer** wired to GA4/GTM **and** PostHog from
  one `track()` call, fixing the audit's event-hygiene findings (mixed casing,
  ambiguous duplicate lead events, un-flagged conversions).

---

## 1. Information architecture

```
get.installpros.co.uk
├── /                 Landing page (public)            ← Phase 1 ✅
├── /privacy /terms   Legal (public)                   ← stub
├── /login            Auth (public)                    ← Phase 2
├── /forgot-password  Auth (public)                    ← Phase 2
└── /dashboard        Private (auth-gated)             ← Phase 3–5
    ├── /             Overview KPIs
    ├── /ga4          Acquisition (GA4)
    ├── /ads          Google Ads
    ├── /search       Search Console
    ├── /product      PostHog funnels & paths
    ├── /experiments  A/B testing
    └── /leads        Lead inbox (team workflow)
```

Public marketing and private platform share one design system but are isolated
route groups: `(marketing)` is statically rendered for speed/SEO; `(app)` is
dynamic and behind middleware.

## 2. User flows

**Lead (primary):** Land → check postcode → see location-echoed result →
pick install type → "Get my free quote" (prefilled) → submit → confirmation +
WhatsApp upsell. Events: `page_view → coverage_checked → quote_started →
quote_submitted → lead_created`.

**WhatsApp lead:** Land → "WhatsApp us" (hero / sticky / final) → conversation.
Event: `whatsapp_clicked` (conversion).

**Team member (Phase 2–3):** `/login` → session → `/dashboard` overview → drill
into a channel → open `/leads`, update status.

**Admin (Phase 5):** Dashboard → `/experiments` → create experiment + variants →
set allocation → monitor significance → declare winner.

Every screen specifies **loading / empty / error** states (see §UX states).

## 3. Database schema

Full SQL in [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
Tables: `profiles` (role: admin | team_member), `leads` (with attribution +
assignment + status), `analytics_events` (warehouse mirror), `experiments`,
`experiment_variants`, `experiment_results`. RLS enabled on all; public lead
inserts go through the service-role API route, not a public policy.

## 4. Event tracking plan

One taxonomy → GA4 (via GTM dataLayer) **and** PostHog, defined in
[`src/lib/analytics/events.ts`](src/lib/analytics/events.ts).

| Event | When | Conversion? |
|---|---|---|
| `page_view` | every route | — |
| `cta_clicked` | any CTA (carries `cta_location`) | — |
| `coverage_checked` | postcode submitted (carries result + location) | — |
| `quote_started` | first form interaction / proceed | micro |
| `quote_submitted` | form submitted | ✅ |
| `lead_created` | server confirmed lead | ✅ |
| `whatsapp_clicked` | WhatsApp CTA | ✅ |
| `email_clicked` / `phone_clicked` | contact intent | — |
| `scroll_depth` | 25/50/75/90/100% | — |
| `experiment_viewed` / `experiment_converted` | A/B exposure + goal | ✅ |

Every event carries the required context: `page_url`, `page_path`, `page_title`,
`device_type`, `traffic_source`, `campaign`, `medium`, `variant_id`,
`experiment_id` (see `src/lib/analytics/context.ts`). Attribution is first-touch,
persisted per session, so `traffic_source` stays consistent across the funnel.

## 5. Dashboard wireframes (Phase 3–4)

Overview = KPI card row (Sessions, Users, Leads, Conv. Rate, Cost/Lead, Revenue)
+ trend chart + channel table. Each integration tab (GA4 / Ads / Search Console /
PostHog) = filter bar → KPI row → Recharts visualisations → data table.
Layout component contract documented in §Folder structure (`(app)/dashboard`).

## 6. Landing page wireframes

Implemented 1:1 in `src/components/landing/*`. Section order top-to-bottom:
Header → Hero(+coverage checker) → TrustBar → Benefits → Process → CoverageMap →
QuoteSection → FAQ → FinalCta → Footer, with StickyMobileCta overlaying on
mobile.

## 7. Component architecture

- `components/ui/*` — shadcn primitives (Button, Input, Select, Accordion…).
- `components/landing/*` — page sections; `cta-button.tsx` auto-fires events;
  `quote-context.tsx` shares postcode/install-type between hero and form.
- `components/analytics/*` — PostHog provider, page-view + scroll trackers,
  GTM/GA4 script loaders.
- `lib/analytics/*` — the event layer (the platform's spine).
- `lib/supabase/*` — browser + server + service-role clients.

## 8. API architecture

- `POST /api/coverage` — postcode → real location + availability (edge runtime).
- `POST /api/lead` — validate → persist to Supabase (or echo id) → (hook point
  for CRM/email/WhatsApp forwarding).
- Phase 3 adds `/api/metrics/{ga4,ads,search}` server routes that proxy Google
  APIs with cached service-account auth, keeping secrets server-side.

## 9. Folder structure

```
src/
├── app/
│   ├── layout.tsx              root: providers, analytics, SEO, JSON-LD
│   ├── page.tsx                landing page composition
│   ├── globals.css             design tokens (HSL CSS vars)
│   ├── sitemap.ts / robots.ts  SEO
│   └── api/
│       ├── coverage/route.ts
│       └── lead/route.ts
│   # Phase 2+: (auth)/login, (app)/dashboard/...
├── components/
│   ├── ui/                     shadcn primitives
│   ├── landing/                marketing sections
│   └── analytics/              tracking + script loaders
├── lib/
│   ├── analytics/              events.ts · context.ts · track.ts
│   ├── supabase/               client.ts · server.ts
│   ├── site-config.ts          copy, CTAs, install types, FAQs
│   └── utils.ts                cn() + UK postcode helpers
supabase/migrations/0001_init.sql
```

## 10. Implementation roadmap

- **Phase 1 — Landing page** ✅ this build. Next: real review data, OG image,
  `/privacy` + `/terms`, connect GA4/GTM/PostHog keys.
- **Phase 2 — Auth.** Supabase Auth, `(auth)` routes, middleware session refresh,
  `profiles.role` route guards. Schema already in place.
- **Phase 3 — Dashboards.** Google service-account proxy routes, Recharts views
  for GA4 / Ads / Search Console, Overview KPIs.
- **Phase 4 — Product analytics.** PostHog already initialised + recording;
  build Funnel / Landing / Paths / Retention / Conversion dashboards from the
  standardized events.
- **Phase 5 — A/B testing.** PostHog feature flags drive variants; `window.__ipExperiment`
  is already read by the event context; `experiments`/`variants`/`results` tables
  power significance + winner detection in the dashboard.

---

## UX states (applied across screens)

- **Loading** — coverage check spinner; quote-form "Sending…"; dashboards use
  skeletons.
- **Empty** — dashboards ship empty-state copy + CTA when a connector returns no
  rows (e.g. "No leads yet — share your page").
- **Error** — coverage `error` path with retry + WhatsApp fallback; lead-form
  inline + alert errors; invalid-postcode guidance.
- **Responsive** — mobile-first; sticky mobile CTA; container caps at 1200px.

## Deployment (Vercel)

Connect the repo, set env vars from `.env.example`, point
`get.installpros.co.uk` at the Vercel project. PostHog is proxied via
`/ingest/*` rewrites to stay first-party and dodge ad-blockers.

> Starlink is a trademark of SpaceX. InstallPros is an independent installer.
