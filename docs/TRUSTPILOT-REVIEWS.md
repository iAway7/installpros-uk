# Trustpilot reviews without the API

Trustpilot's read API is a paid add-on we do not have, so the reviews on the
funnel come from **their webhooks into our own table**, rendered with our own
card component. No TrustBox script, no iframe.

What that buys us: the real review date and the real **Verified** flag per
review (both come straight from Trustpilot), review text that is actually in
our HTML, and no third-party JavaScript on a mobile-heavy paid funnel.

What it costs us: the webhook only fires on new activity, so the first batch of
reviews is seeded by hand, and the **total review count** has to be seeded by
hand too and then moved by the webhook, because Trustpilot never sends it.

---

## The pieces

| File | Role |
|---|---|
| `supabase/migrations/0011_trustpilot_reviews.sql` | `trustpilot_reviews` table + the `trustpilot_stats` settings key |
| `src/app/api/trustpilot/webhook/route.ts` | Receives created / updated / deleted, moves the counter, busts the cache |
| `src/lib/reviews/trustpilot.ts` | Cached server-side read, newest 15, ≥4★ |
| `src/components/funnel/trustpilot-section.tsx` | The section, same cards as the Google one |
| `scripts/seed-trustpilot-reviews.mjs` | One-off import of the manual batch |

---

## Setup

### 1. Run the migration

Supabase dashboard → SQL Editor → paste `supabase/migrations/0011_trustpilot_reviews.sql` → Run.

### 2. Generate the webhook secret

```bash
openssl rand -hex 32
```

Put it in `.env.local` **and** in Vercel → Settings → Environment Variables:

```
TRUSTPILOT_WEBHOOK_TOKEN=<the value>
```

This secret is the only thing standing between the endpoint and anyone who
guesses the URL. Without it they could publish fake reviews on our site.

### 3. Seed the first batch

Copy the most recent ~15 reviews out of the Trustpilot portal into a JSON file
(`src/data/trustpilot-seed.example.json` shows the shape), then:

```bash
node scripts/seed-trustpilot-reviews.mjs src/data/trustpilot-seed.json --count 323 --score 4.8
```

`--count` is today's real total from the portal, `--score` today's TrustScore.

> **Read `is_verified` off each review, do not guess it.** It decides whether
> the card shows the verification seal, and a seal we invented is a claim
> Trustpilot never made. If you can't tell, use `false`.

### 4. Deploy, then wire up the webhook

Trustpilot portal → Developers → Webhook Notifications → Service reviews.
Add the same URL under **all three** events:

```
https://get.installpros.co.uk/api/trustpilot/webhook?token=<TRUSTPILOT_WEBHOOK_TOKEN>
```

- **New Review** → inserts, and adds 1 to the counter
- **Review Updated** → updates in place; if the rating drops below 4★ the card leaves the carousel on its own
- **Review Deleted** → soft-deletes, and takes 1 off the counter

Press **Test** on each. A 200 means you are good; a 401 means the token is
wrong or is not deployed yet. Then flip **Enabled** on.

The webhook cannot be tested from localhost. Deploy first.

---

## Notes

- **The counter drifts, slowly.** It is seeded once and moved by events. If
  Trustpilot ever removes reviews without firing the event, it will be off by a
  few. Re-check the real number in the portal every few months and re-run the
  seed script with a new `--count`. Nothing else needs to change.
- **The score is manual.** At 300+ reviews a single new one moves the average by
  under 0.001, so it is stable for a long time, but it is still a number we
  typed. Update it with `--score` when you update the count.
- **New reviews appear immediately.** The webhook calls `revalidateTag`, so the
  section does not wait for the hourly cache to expire.
- **Older reviews are kept**, not deleted. The carousel shows the newest 15; the
  table keeps everything, which is what a future `/reviews` page would use.
- **If the table is empty** the section falls back to four hand-picked reviews
  with no dates and no seals, so a fresh environment never renders an empty block.
- If we ever buy the API add-on, all of this collapses into one cached fetch,
  the same shape as `lib/reviews/google-reviews.ts`.
