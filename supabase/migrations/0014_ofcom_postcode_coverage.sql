-- ════════════════════════════════════════════════════════════════════════
-- Ofcom Connected Nations fixed coverage, at POSTCODE level.
--
-- Replaces the need for the Ofcom API (still unapproved after months) and the
-- district-level bundled dataset. Same underlying data the API serves, loaded
-- from the published open-data release, so there is no key, no quota and no
-- external call at enrichment time.
--
-- Ofcom does not publish a "max download" figure per postcode. It publishes
-- the distribution of premises across speed bands, which is a stronger signal
-- anyway: "82% of premises here can't get 30 Mbit/s" sells better than an
-- estimated maximum.
--
-- Loaded by scripts/load-ofcom-postcode-coverage.mjs from the
-- "Fixed broadband coverage and full fibre take-up" ZIP.
-- ════════════════════════════════════════════════════════════════════════

create table if not exists ofcom_postcode_coverage (
  postcode      text primary key,           -- compact, uppercase: "LS185QB"
  -- Percentages of premises, 0-100, rounded to whole numbers: the source has
  -- one decimal but the extra precision means nothing at this sample size.
  pct_300plus   smallint,                   -- >= 300 Mbit/s available
  pct_sfbb      smallint,                   -- superfast (>= 30) available
  pct_gigabit   smallint,
  pct_unable_10 smallint,                   -- below the USO
  pct_unable_30 smallint,                   -- the headline "poor broadband" number
  release       text not null,              -- e.g. '202601'
  updated_at    timestamptz not null default now()
);

alter table ofcom_postcode_coverage enable row level security;
-- No policies: read through the service role from server code only, same as
-- postcode_broadband_cache.

-- Per-lead snapshot of the above, so a lead card keeps the figures it was
-- scored on even after the next annual release lands.
alter table lead_intel
  add column if not exists broadband_coverage jsonb;

comment on table ofcom_postcode_coverage is
  'Ofcom Connected Nations fixed coverage by postcode. Annual open-data release, reloaded with scripts/load-ofcom-postcode-coverage.mjs.';
comment on column lead_intel.broadband_coverage is
  'Snapshot of ofcom_postcode_coverage for this lead''s postcode at enrichment time.';
