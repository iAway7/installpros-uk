# Production deploy + launch runbook

For Option A: point Google Ads at this funnel and run the
`/install-quote` vs `/starlink-installation` test inside Google Ads.

The first real traffic this funnel sees will be **paid** traffic. The gates
below exist so nothing is discovered with Will's budget running. Do not skip a
gate.

---

## 0. Current state — verified 19 Aug 2026

Checked directly against Vercel and Supabase, not assumed.

| | Status |
|---|---|
| Vercel project `installpros-uk` | **deployed**, production READY, last deploy **17 Aug** |
| Domains | `installpros-uk.vercel.app` only — **no custom domain attached** |
| Supabase | project **"Will UK"** (`pytqozytnxdowjxotogr`, London / eu-west-2) — the same project `.env.local` points at, so dev and production share one database |
| Migrations 0001–0013 | **already applied** — every table exists |
| Migration 0014 (webhooks) | **applied 19 Aug** — `webhook_endpoints` + `webhook_deliveries` exist |
| Webhooks + `/dashboard/landings` code | **not deployed** — built 19 Aug, exists only on the dev machine |
| `leads` table | **0 rows** |
| `profiles` table | **0 rows** |

Two of those deserve to be read twice.

**`leads` is empty.** Not "empty in production" — empty everywhere, because dev
and production are the same database. This funnel has never captured a single
lead in its life. Everything downstream of the form — enrichment, scoring, the
webhook, the landings counter — has therefore never run on real input. That is
what Gate 1 exists to fix, and it is why it comes before any ad spend.

**`profiles` is empty.** No account exists, so nobody can log into
`/dashboard` at all right now. You can't check leads, webhook deliveries or the
landings counter until you sign up on the deployed site and promote yourself to
admin. Do this early — it blocks every verification step below.

---

## 0b. Three things found in the code

Read these before anything else — two of them are launch blockers that aren't
obvious from the code.

**a. The Google Ads conversion needs TWO env vars, not one.**
The conversion fires via `gtag`, and `gtag` is only loaded when
`NEXT_PUBLIC_GA4_ID` (or `NEXT_PUBLIC_GTM_ID`) is set. Both are currently
**empty** in `.env.local`. So even with Will's conversion label in place,
nothing would fire. This is not just "waiting on Will" — the analytics
container was never configured either.

**b. What to actually ask Will for.**
Not "the conversion tracking code". Ask for two specific values:
- the **Google Ads conversion ID** — looks like `AW-123456789`
- the **conversion label** — a short string like `AbCdEfGhIj`

They combine into `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=AW-123456789/AbCdEfGhIj`.
Also ask for the **GA4 Measurement ID** (`G-XXXXXXXXXX`) from the same account.

**c. The conversion fires on the upload step, not on form submit.**
`property-image-upload.tsx` fires it when `/upload-property-images` loads,
which is where both funnels redirect after submit. Consequences:

- **Both landing pages behave identically** (both forms route there), so the
  A/B comparison stays fair. This is the important part and it checks out.
- But Google Ads will count **slightly fewer** conversions than the leads in
  `/dashboard/landings`, because anyone who closes the tab during the redirect
  is a lead we saved and a conversion Google never saw.
- **Expect Google to read lower than our gclid count. That direction is
  normal.** Google reading *higher* would mean something is wrong.

---

## 1. Environment variables

Current state of `.env.local` on the dev machine, and what each one does at
launch. Everything in **Required** must be set in Vercel before the first
deploy; **Measurement** must be set before spending on ads.

### Required — the site doesn't work without these

| Variable | Local | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | set | Must be the **production** URL, not localhost. Used for the dashboard links inside webhook payloads. |
| `NEXT_PUBLIC_SUPABASE_URL` | set | Use the **production** Supabase project if it differs from dev. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | set | |
| `SUPABASE_SERVICE_ROLE_KEY` | set | Server-only. Never prefix with `NEXT_PUBLIC_`. |
| `GOOGLE_PLACES_API_KEY` | set | Address autocomplete on `/starlink-installation`. Without it that page's hero degrades — and it's half the test. Confirm the key allows the production domain. |

### Measurement — required before any ad spend

| Variable | Local | Notes |
|---|---|---|
| `NEXT_PUBLIC_GA4_ID` | **EMPTY** | `G-XXXXXXXXXX`. Without this `gtag` never loads and **no conversion can fire**. |
| `NEXT_PUBLIC_GTM_ID` | **EMPTY** | Optional if GA4 is set directly. Set one or the other. |
| `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL` | **EMPTY** | `AW-123456789/AbCdEfGhIj` — from Will. |

### Lead delivery

| Variable | Local | Notes |
|---|---|---|
| `LEAD_WEBHOOK_URL` | **not in file** | Will's Zapier/Make catch hook. Leads still save without it — they just don't leave the system. |
| `LEAD_WEBHOOK_EVENTS` | — | Defaults to `lead.enriched` (carries the score). Use `lead.created,lead.enriched` for both. |
| `LEAD_WEBHOOK_SECRET` | — | Optional HMAC signing. Leave blank for Zapier. |

### Enrichment — all optional, degrade gracefully

| Variable | Local | Notes |
|---|---|---|
| `HOMEDATA_API_KEY` | set | Broadband max-down. |
| `EPC_BEARER_TOKEN` | set | Property + energy data. |
| `PROPALT_API_KEY` | set | Actual speed in use. Off by default behind the Settings toggle. |
| `OFCOM_API_KEY` | EMPTY | Subscription still pending approval. homedata covers it meanwhile. |
| `GOOGLE_MAPS_API_KEY` | EMPTY | Satellite view falls back to free Esri imagery. Fine to leave. |
| `NEXT_PUBLIC_POSTHOG_KEY` / `_HOST` | set | Product analytics + session replay. |
| `POSTHOG_PERSONAL_API_KEY` / `POSTHOG_PROJECT_ID` | set | Dashboard funnel page. |
| `GOOGLE_PLACE_ID` | set | Google reviews block. |

### Contact / site config

`NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_CONTACT_PHONE`,
`NEXT_PUBLIC_CONTACT_EMAIL` — all set. Confirm they're the numbers Will
actually wants a paid lead to ring.

> Set every variable for **Production**, **Preview** and **Development** in
> Vercel unless you deliberately want previews pointing at a different Supabase.

---

## 2. Supabase — migration done, account still needed

0001–0013 were already applied on **"Will UK"**, and **0014 was applied on
19 Aug** — `webhook_endpoints` and `webhook_deliveries` now exist. Nothing to
run here.

> If you ever need to re-run it: open the **file**
> `supabase/migrations/0014_webhooks.sql` and paste its *contents* into the SQL
> editor. Pasting the filename gets you
> `ERROR 42601: trailing junk after numeric literal`. It's idempotent
> (`create table if not exists`), so re-running is harmless.

What is still missing is a login, because `profiles` is empty and the dashboard
is currently unreachable. **There is no public signup — it's off by design.**
Accounts are created by hand in Supabase:

1. Supabase → **Authentication → Users → Add user → Create new user**. Email +
   password, and tick **"Auto Confirm User"**.
2. The `on_auth_user_created` trigger writes the `profiles` row automatically,
   with role `team_member`.
3. Promote to admin in the SQL editor — **Experiments and Webhooks are
   admin-only**, so `team_member` is not enough to verify today's work:

```sql
update profiles set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');
```

4. Supabase → **Authentication → URL Configuration**: Site URL and Redirect
   URLs still point at `localhost:3035`. Add the production domain or
   password-reset links arrive broken.

> Dev and production share this database. Anything you submit while testing
> locally lands in the same `leads` table you'll be reading in production —
> useful, but tag test submissions clearly (an obvious fake name) so they don't
> pollute the first real numbers.

---

## 3. Redeploy + domain

The project is live but **two days behind**: the webhooks and
`/dashboard/landings` were built after the last deploy.

1. `npm run build` **locally first**. `tsc --noEmit` and `eslint` are clean, but
   a full build has not been run since the webhook work — do not push blind.
2. Commit and push; the Git integration deploys `main` to production.
3. Add the missing env vars from section 1 (`NEXT_PUBLIC_GA4_ID`,
   `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL`, `LEAD_WEBHOOK_URL`) for
   **Production**, **Preview** and **Development**, then redeploy — the
   `NEXT_PUBLIC_` ones are baked in at build time.
4. Check the Google Cloud restrictions on `GOOGLE_PLACES_API_KEY`: it must
   allow the production domain, or autocomplete works locally and dies live.

### The domain question — decide before running ads

Right now the only address is **`installpros-uk.vercel.app`**. Pointing paid
ads at a `vercel.app` URL is a bad idea for three separate reasons:

- **Trust.** A stranger clicking an ad for a £1,000+ home installation lands on
  something that doesn't carry the brand they were just shown.
- **Quality Score.** Google's landing page experience signal reads the domain
  as unrelated to the business in the ad.
- **It isn't Will's.** Every link, every screenshot, every shared URL points at
  a personal Vercel account rather than his company.

Attach a real subdomain — `get.installpros.co.uk` is the one the code already
assumes (`siteConfig.url`) — before any spend. It's a DNS record and a redeploy
with `NEXT_PUBLIC_SITE_URL` updated. This needs Will, since he controls the
`installpros.co.uk` DNS.

---

## 4. Smoke test — GATE 1

**No ad spend until every line passes.** Do this on the production URL, on a
real phone over mobile data, not just desktop.

`leads` currently has 0 rows, so this is not a regression check — it is the
**first time the funnel will be asked to produce a lead end to end**. Expect to
find something.

### Page `/install-quote`

- [ ] Page loads, no console errors
- [ ] Postcode check returns "available" for a real postcode (e.g. `LS18 5QB`)
- [ ] Complete the form with a **real email you can check**
- [ ] It redirects to `/upload-property-images`

### Page `/starlink-installation`

- [ ] Page loads, no console errors
- [ ] **Address autocomplete returns suggestions** after 3+ characters
      (if not: `GOOGLE_PLACES_API_KEY` missing or domain-restricted)
- [ ] Picking a suggestion fills the address
- [ ] Complete the form; it redirects to `/upload-property-images`

### After each submission, verify the whole chain

- [ ] **Supabase → `leads`**: row exists, with `landing_page` matching the page
      you used, and `device_type` correct
- [ ] Wait ~10s, then **`lead_intel`**: a row exists with a `score`
- [ ] **Dashboard → Leads**: the lead shows a score badge and the intel panel
      is populated
- [ ] **Dashboard → Landings**: the lead is counted under the right page
- [ ] **Dashboard → Settings → Webhooks**: a delivery is logged (once
      `LEAD_WEBHOOK_URL` or an endpoint exists)
- [ ] The receiving side (Zapier task history, or Will's system) actually shows it

### Attribution test — the one people skip

Open the page with fake ad parameters:

```
https://<domain>/install-quote?gclid=TEST123&utm_source=google&utm_medium=cpc&utm_campaign=smoketest
```

Submit, then check the `leads` row:

- [ ] `gclid` = `TEST123`
- [ ] `utm_source` / `utm_medium` / `utm_campaign` all populated
- [ ] `traffic_source` = `google`

Repeat on `/starlink-installation`. **If the gclid doesn't land, stop** —
closed-loop reporting and the whole test depend on it.

---

## 5. Conversion tracking — GATE 2

Needs Will's values from section 0b.

1. Set `NEXT_PUBLIC_GA4_ID` and `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL` in
   Vercel, redeploy (both are build-time `NEXT_PUBLIC_` vars).
2. Install **Google Tag Assistant** and walk the funnel on production.
3. Verify on **both** landing pages:
   - [ ] `gtag` loads (the GA4 tag is detected)
   - [ ] on reaching `/upload-property-images`, a `conversion` event fires with
         the correct `send_to`
4. In Google Ads → Goals → Conversions, the action moves to **"Recording
   conversions"** within a few hours.

Do not proceed until it says Recording. An experiment started before this
cannot be salvaged — the pre-tag data is unusable and the test has to restart.

---

## 6. Soft launch — GATE 3

Small budget, single campaign, **only `/install-quote`**, 3–5 days. This is not
a measurement — it's a live-fire test.

- [ ] Real leads arriving in the dashboard
- [ ] Scores look sane (not everything capped at 7 — that means no broadband
      data is resolving)
- [ ] `gclid` present on real paid leads, not just the smoke test
- [ ] Google Ads conversion count is **close to, and slightly below**, the
      Google Ads column in `/dashboard/landings` for the same days
- [ ] **Will confirms he is receiving and working them**

That last one is the real gate. If leads pile up unworked, more traffic makes
it worse, not better.

---

## 7. The experiment

Only now.

1. Google Ads → the campaign → **Experiments** → new **Custom experiment**.
2. Duplicate the campaign. Change **only** the final URL to
   `/starlink-installation`. Nothing else — not bids, not copy, not budget.
3. Split **50/50**. Ad rotation: **do not optimize** in both arms.
4. Start. Then leave it alone.

**How long.** At ~10% form conversion, detecting a 20% relative difference
needs roughly 3,800 clicks per arm — 3 to 6 weeks at current spend. A 50%
difference would show in about 700 per arm. Checking daily is fine; *deciding*
early is how these tests lie.

**What to read at the end.** Google reports conversions and conversion rate.
Read that alongside `/dashboard/landings` for the same window: the page that
wins on volume is not necessarily the one that wins on **qualified leads
(score 8+)**. If they disagree, the score column is the one that predicts
revenue — and that disagreement is itself the most valuable finding the test
can produce.

---

## Known gaps, deliberately not fixed

- **`/go` drops the query string** on redirect, losing the gclid, and records
  `landing_page` as `/go`. Irrelevant while the test runs inside Google Ads.
  Becomes a real bug the moment anyone points paid traffic at `/go`.
- **`postcode_broadband_cache`** has `postcode` as its only primary key while
  rows carry a `source`, so propalt/homedata/ofcom rows overwrite each other.
  Wastes the odd API call. Needs a migration.
- **Ofcom** subscription pending; homedata covers broadband meanwhile.
- **Google Business Profile** reviews need Will to submit the access form as
  the listing owner — see `docs/GBP-REVIEWS.md`.
