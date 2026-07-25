# Connect Google Search Console (for the Marketing dashboard)

The Marketing dashboard (`/dashboard/marketing`) shows your leads + SEO in one
place. Leads already work; this connects **Search Console** so you see clicks,
impressions, average position and top queries/pages. It uses a **service
account** — a robot Google login the app uses to read your data. ~10 minutes,
all point-and-click.

Until this is done, the dashboard shows a tidy "Connect Search Console" card —
nothing breaks.

## 1. Create a Google Cloud project + service account

1. Go to **https://console.cloud.google.com** and sign in with the Google
   account that has access to your Search Console.
2. Top bar → project dropdown → **New Project** → name it `installpros` → Create.
3. Search bar → **"Search Console API"** → open it → **Enable**.
4. Left menu → **APIs & Services → Credentials** → **Create credentials →
   Service account**.
   - Name: `installpros-dashboard` → **Create and continue** → skip the optional
     roles → **Done**.
5. Click the new service account → **Keys** tab → **Add key → Create new key →
   JSON** → **Create**. A `.json` file downloads. Keep it safe.

## 2. Give the service account access to Search Console

1. Open the downloaded JSON — copy the value of **`client_email`** (looks like
   `installpros-dashboard@installpros-xxxx.iam.gserviceaccount.com`).
2. Go to **https://search.google.com/search-console** → select your property.
3. **Settings → Users and permissions → Add user** → paste that email →
   permission **Full** (or Restricted) → **Add**.

## 3. Put the credentials in the app

From the same JSON file, copy into `.env.local`:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=  → the "client_email" value
GOOGLE_PRIVATE_KEY=            → the "private_key" value (see note below)
GOOGLE_SEARCH_CONSOLE_SITE=    → your property (see below)
```

- **GOOGLE_PRIVATE_KEY:** the JSON's `private_key` is a long value beginning
  `-----BEGIN PRIVATE KEY-----\n…`. Paste it **exactly as it appears in the JSON**
  (keep the `\n` sequences and wrap it in double quotes), e.g.
  `GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"`
- **GOOGLE_SEARCH_CONSOLE_SITE:** if your Search Console property is a **domain**
  property, use `sc-domain:installpros.co.uk`. If it's a **URL-prefix** property,
  use the exact URL, e.g. `https://get.installpros.co.uk/`.

Then restart `npm run dev`. Open **`/dashboard → Marketing`** and your Search
Console data appears. (Search Console data is ~2 days delayed — that's Google, not us.)

## Notes

- These three values are **secret** — they live in `.env.local` (gitignored)
  and, for production, in **Vercel → Settings → Environment Variables**. Never
  commit them.
- **GA4** can reuse the *same* service account later (enable the "Google
  Analytics Data API" and add the service-account email as a Viewer on the GA4
  property). Say the word and I'll wire the GA4 section too.
- **Google Ads** is separate and needs a developer token Google must approve —
  that's the "Cost / lead" card that currently shows "—".
