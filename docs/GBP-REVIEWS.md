# Live Google reviews via the Business Profile API

Goal: show **all** your Google reviews, **newest-first**, for free — the legit
alternative to Trustindex. The code is already wired (`lib/reviews/business-profile.ts`);
you just need to obtain 5 values and paste them into `.env.local`:

```
GBP_CLIENT_ID=
GBP_CLIENT_SECRET=
GBP_REFRESH_TOKEN=
GBP_ACCOUNT_ID=
GBP_LOCATION_ID=
```

Until all 5 are set, the section keeps using the Places API (5 reviews) → curated fallback. Nothing breaks.

---

## Step 1 — Request access to the Business Profile APIs (do this first, it takes days)

Google gates these APIs. Until approved, calls return `PERMISSION_DENIED`.

1. Open the access request form: **https://support.google.com/business/contact/api_default**
2. Sign in with the Google account that **owns the InstallPros Google Business listing**.
3. Enter your **GCP project** (the `installpros-uk` project, project number `586667432301`).
4. Submit. Approval typically lands in a few days by email.

## Step 2 — Enable the APIs in Google Cloud

Console → APIs & Services → Library → enable all of these on the `installpros-uk` project:

- **Google My Business API** (this is the v4 API that serves reviews)
- **My Business Account Management API**
- **My Business Business Information API**

## Step 3 — Create an OAuth client

Console → APIs & Services → **Credentials** → Create credentials → **OAuth client ID**

- Application type: **Web application**
- Authorised redirect URI: `https://developers.google.com/oauthplayground`
- Create → copy the **Client ID** and **Client secret** → these are `GBP_CLIENT_ID` / `GBP_CLIENT_SECRET`.

(If it asks you to configure the OAuth consent screen: set it to **External**, add your Google account as a **Test user**, scope `.../auth/business.manage`. Test mode is fine — no verification needed for your own use.)

## Step 4 — Get the refresh token (OAuth Playground, no code)

1. Go to **https://developers.google.com/oauthplayground**
2. Click the ⚙️ (top-right) → tick **"Use your own OAuth credentials"** → paste your Client ID + Secret.
3. In the left "Input your own scopes" box, enter:
   `https://www.googleapis.com/auth/business.manage`
4. Click **Authorize APIs** → sign in as the **listing owner** → allow.
5. Click **Exchange authorization code for tokens**.
6. Copy the **Refresh token** → that's `GBP_REFRESH_TOKEN`.

## Step 5 — Find your Account ID and Location ID

Grab a fresh **Access token** from the Playground (same screen, step 5 shows it), then run these on your Mac (replace `ACCESS_TOKEN`):

```bash
# Account ID → look for "name": "accounts/XXXXXXXXXX"
curl -s "https://mybusinessaccountmanagement.googleapis.com/v1/accounts" \
  -H "Authorization: Bearer ACCESS_TOKEN"

# Location ID → use the account id above; look for "name": "locations/YYYYYYYYYY"
curl -s "https://mybusinessbusinessinformation.googleapis.com/v1/accounts/XXXXXXXXXX/locations?readMask=name,title" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

- `GBP_ACCOUNT_ID` = the number after `accounts/`
- `GBP_LOCATION_ID` = the number after `locations/`

## Step 6 — Fill `.env.local` and restart

Paste all 5 values, then `Ctrl+C` and `npm run dev` again. The Customer Stories
section now pulls the **full review list, newest-first, filtered to ≥4★**, cached
6h. You can cancel Trustindex.

---

### Notes
- **Cost: £0.** Business Profile API has no per-call charge, and we cache 6h.
- The access token is refreshed automatically from the refresh token (cached ~50 min).
- If the refresh token ever stops working (e.g. password change), redo Step 4.
- Ordering is `updateTime desc` = newest first, exactly like Trustindex.
