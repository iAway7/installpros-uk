# Property Intelligence + Lead Scoring

Every lead gets enriched automatically from four free UK data sources and
scored **1–10** (10 = call first). A 1960s detached farmhouse in rural Cornwall
on 2 Mbps scores a 10; a new-build flat in central Manchester on 500 Mbps fibre
scores a 2.

## One-time setup

**1. Run the migration** — `supabase/migrations/0005_lead_intel.sql` in the
Supabase SQL editor (after 0004). Adds the `lead_intel` table and
`leads.lead_score`.

**2. API keys** (both optional; ~5 min each; add to `.env.local` + Vercel):

| Source | What it gives | Key needed | Where |
|---|---|---|---|
| postcodes.io | Region, parish → rural/urban heuristic | none | — |
| Land Registry Price Paid | Median sale price → value band | none | — |
| **Ofcom Connected Nations** | Max broadband speed at the postcode — the #1 scoring signal | `OFCOM_API_KEY` | https://api.ofcom.org.uk → Products → Broadband Coverage (Basic) → subscribe (needs Ofcom approval; key then appears on your Profile) |
| **EPC / EPB Data (MHCLG)** | Property type, built form, construction age, floor area, EPC rating | `EPC_BEARER_TOKEN` | https://get-energy-performance-data.communities.gov.uk → register → My account → bearer token |

(The legacy EPC service auth — `EPC_API_EMAIL` + `EPC_API_KEY` — is still supported
as a fallback but the service was retired in May 2026; use the bearer token.)

Without keys the enrichment still runs on the two keyless sources and scores
with whatever signals it has.

## How it works

- On form submit, the funnel fires a fire-and-forget `POST
  /api/leads/{id}/enrich`. The endpoint pulls all four sources in parallel
  (4 s timeout each, failures ignored), computes the score, and writes
  `lead_intel` + `leads.lead_score`. Lead capture is never blocked or broken
  by enrichment.
- Idempotent: repeat calls are no-ops. The dashboard's lead panel has a
  **Refresh** button (`?force=1`, team only) to re-run — use it after adding
  API keys to backfill existing leads.

## Scoring model (base 5, clamped 1–10)

| Signal | Points |
|---|---|
| Broadband < 10 Mbps | +4 |
| Broadband 10–30 Mbps | +3 |
| Broadband 30–80 Mbps | +1.5 |
| Broadband ≥ 300 Mbps | −3 |
| Detached | +2 |
| Bungalow / semi | +1 |
| Flat / maisonette | −2 |
| Rural (parish heuristic) | +1.5 |
| Built pre-1967 | +0.5 |
| Submitted outside 8am–6pm | +0.5 |
| Google/paid arrival | +0.25 |
| Desktop device | +0.25 |

Tune in `src/lib/intel/score.ts` — reasons are stored per lead
(`lead_intel.score_reasons`) so you can audit any score in the lead panel.

## Where it shows up

- **Leads table** — score badge column + "Highest score" sort. Sales calls the
  9s and 10s first.
- **Lead detail panel** — Property intelligence section: broadband, property
  type, age, floor area, EPC rating, value band, rural/urban, plus the score
  breakdown.
- **CSV export** — includes `lead_score`.

## Notes

- Rural/urban is a heuristic (named civil parish ⇒ rural-ish). Upgrade path:
  ingest the ONS NSPL rural/urban classification and join on postcode.
- EPC/Land Registry values are postcode-level aggregates (modal/median), not
  the exact house — treat as strong hints, not facts.
