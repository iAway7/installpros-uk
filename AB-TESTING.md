# A/B testing (Phase 5)

A built-in experimentation system: create experiments + variants, split traffic,
and read conversion rate, uplift and **statistical significance** with automatic
winner detection — all in the dashboard at **`/dashboard/experiments`**.

## One-time setup

Run **`supabase/migrations/0002_experiments.sql`** in the Supabase SQL editor
(same as you did for `0001`). It adds:
- `record_experiment_event(...)` — atomic daily counter for visitors/conversions.
- Public read policies so the landing page can assign variants to anonymous visitors.

The `experiments`, `experiment_variants` and `experiment_results` tables already
exist from `0001`.

## How it works

- **Assignment** — each visitor gets a stable anonymous id (localStorage) and is
  bucketed into a variant by that id + the experiment key, honouring each
  variant's traffic split. Sticky: the same visitor always sees the same variant.
- **Exposure + conversion** — on first view we record an exposure; when a lead is
  submitted we record a conversion. Counts roll up per variant per day in
  `experiment_results`. Standardized `experiment_viewed` / `experiment_converted`
  events also fire to GA4 + PostHog.
- **Stats** — the dashboard computes conversion rate, uplift vs control, and a
  two-proportion z-test confidence for each variant. A variant is flagged
  **Winner** when it beats control with ≥95% confidence (and ≥30 visitors each side).
- **What's wired** — the **hero headline** swaps per variant. The default headline
  still renders server-side (good for SEO); variants swap in on the client. The
  mechanism is generic (`config` is free-form), so CTA text, colours etc. can be
  wired the same way.

## Create your first test

1. Go to **Dashboard → Experiments** (you must be an **admin** — see AUTH-SETUP.md
   to promote your account).
2. **New experiment** → name it (e.g. "Hero headline test"), key `hero_headline`,
   pick the metric (`lead_created`).
3. Leave **Control** headline blank (uses the default) and give **Variant A** a
   different headline, e.g. *"Same-week Starlink, professionally installed."*
   Set the split (50/50).
4. **Create** → it starts as a **draft**. Press **Start** to run it.
5. Open `/install-quote` in a couple of browsers/incognito windows — you'll be
   bucketed into a variant. Submit the form to register conversions.
6. Watch the results fill in on the Experiments page. Pause or Complete anytime.

## Notes

- Without Supabase configured, the system fails open — the landing page just shows
  the default headline and nothing breaks.
- Only admins can create/start/stop experiments; the API enforces this.
- For production, remember to run `0002` on your production database and set the
  same env vars in Vercel.
