# Wiring up real data + analytics

This connects the live landing funnel to real services: **Supabase** (so leads
save), **PostHog** (product analytics + session replay), and **GA4 / GTM**
(acquisition analytics). All keys go in `.env.local` (already created for you —
just fill the blanks). Nothing here is committed to git.

Work top-to-bottom; each section is ~5 minutes. After each one, restart
`npm run dev` so Next.js picks up the new env values.

---

## 1. Supabase — lead storage (do this first)

**a. Create the project**
1. Go to https://supabase.com → New project. Pick the **London (eu-west-2)**
   region for UK latency + data residency.
2. Wait for it to provision (~2 min).

**b. Create the tables**
1. In the Supabase dashboard → **SQL Editor** → New query.
2. Open `supabase/migrations/0001_init.sql` from this repo, paste the whole file
   in, and click **Run**. This creates `leads`, `profiles`, `experiments`,
   `analytics_events`, etc., with row-level security already configured.
   - You should see "Success. No rows returned."

**c. Grab the keys** (Settings → API)
| Key | Env var | Public? |
|---|---|---|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` | yes |
| `anon` `public` key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes |
| `service_role` key | `SUPABASE_SERVICE_ROLE_KEY` | **SECRET — server only** |

Paste those three into `.env.local`.

> The lead form posts to `/api/lead`, which uses the **service-role** key on the
> server to insert. That's why there's no public insert policy — the browser
> never touches the service key.

**d. Confirm it works**
- Restart `npm run dev`, open `/install-quote`, complete the funnel with a real
  postcode. In Supabase → **Table editor → leads** you should see a new row,
  with the chosen service + area captured in the `notes` column.

---

## 2. PostHog — product analytics + session replay

1. Create a project at https://eu.posthog.com (EU cloud keeps data in the EU).
2. **Project Settings → Project API Key** → copy it into
   `NEXT_PUBLIC_POSTHOG_KEY`. Leave `NEXT_PUBLIC_POSTHOG_HOST` as the EU host.
3. Restart dev. The app already:
   - initialises PostHog and **session recording** (inputs masked),
   - fires the standardized events — `page_view`, `coverage_checked`,
     `quote_started`, `quote_submitted`, `lead_created`, `cta_clicked`,
     `scroll_depth`, `whatsapp_clicked` — each with device, traffic_source,
     campaign, variant/experiment context.
4. Verify: in PostHog → **Activity / Events**, walk the funnel and watch the
   events arrive live. Then build the funnel insight: `page_view →
   coverage_checked → quote_started → quote_submitted → lead_created`.

---

## 3. GA4 + GTM

1. **GA4:** Admin → Data streams → your web stream → copy the **Measurement ID**
   (`G-XXXXXXXXXX`) into `NEXT_PUBLIC_GA4_ID`.
2. **GTM:** create a container, copy the **Container ID** (`GTM-XXXXXXX`) into
   `NEXT_PUBLIC_GTM_ID`.
3. Restart dev. Both load automatically. Every event the app fires is also
   pushed to the GTM `dataLayer`, and conversions get a normalized
   `event: "conversion"` alias — so you can build GA4 conversions / Google Ads
   imports off one clean signal (this is the fix for the double-counting issue
   from the audit).
4. Verify with GTM **Preview** mode: complete the funnel and watch `page_view`,
   `quote_submitted`, `lead_created`, and `conversion` land in the dataLayer.

**Google Ads conversion (optional):** when you have a Google Ads conversion
action, put its full target (`AW-XXXXXXXXX/AbCdEf…`) in
`NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL`. It fires once, in **GBP**, on the
photo-upload-complete step. Left blank, nothing fires.

---

## 4. End-to-end test checklist

- [ ] Valid postcode (e.g. `SW1A 1AA`) → "We're available in Westminster".
- [ ] Invalid postcode → inline error, can't proceed.
- [ ] Complete funnel → redirect to `/upload-property-images?leadId=…`.
- [ ] New row in Supabase `leads` with correct name/email/phone/postcode +
      service & area in `notes`.
- [ ] Events visible in PostHog and in the GTM dataLayer (Preview).
- [ ] Upload a photo → progress bar → lands on `/same-day-quote`.

---

## Notes & gotchas

- **Postcode lookup** uses the free postcodes.io API via `/api/coverage` — no
  key needed. (It returns an error only in fully offline/air-gapped envs.)
- **Reviews + Trustpilot** widgets are third-party scripts; they render with
  internet but stay empty offline.
- **install_type** in the `leads` table is a fixed enum
  (`residential|business|rural|marine|events`); the funnel stores the exact
  service the user picked (e.g. "Starlink Installation", "Marine") in `notes`.
  If you'd rather have it in its own column for reporting, say so and I'll add a
  `service_requested` column + migration.
- For production, set the same vars in **Vercel → Project → Settings →
  Environment Variables**, and change `NEXT_PUBLIC_SITE_URL` to
  `https://get.installpros.co.uk`.
