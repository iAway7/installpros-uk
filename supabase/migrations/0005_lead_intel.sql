-- ════════════════════════════════════════════════════════════════════════
-- Property Intelligence (Phase 2):
--   lead_intel        — one row per lead with enrichment from free UK APIs
--                       (Ofcom broadband, EPC register, Land Registry, postcodes.io)
--   leads.lead_score  — denormalised 1-10 score for cheap sorting in the table
-- Run after 0004_lead_ops.sql.
-- ════════════════════════════════════════════════════════════════════════

alter table leads
  add column if not exists lead_score smallint;

comment on column leads.lead_score is '1-10 propensity score from lead_intel enrichment (10 = call first)';

create table if not exists lead_intel (
  lead_id            uuid primary key references leads(id) on delete cascade,
  postcode           text not null,
  -- Ofcom Connected Nations
  max_download_mbps  numeric,
  max_upload_mbps    numeric,
  -- EPC register (modal values across certificates at the postcode)
  property_type      text,          -- House / Bungalow / Flat / Maisonette …
  built_form         text,          -- Detached / Semi-Detached / Terraced …
  construction_age   text,          -- e.g. "England and Wales: 1950-1966"
  floor_area_sqm     numeric,
  energy_rating      text,          -- A-G
  -- Land Registry Price Paid
  median_price_paid  integer,
  value_band         text,          -- e.g. "£300k-£500k"
  -- postcodes.io
  region             text,
  rural              boolean,       -- heuristic (parish + broadband), see lib/intel
  -- Scoring
  score              smallint,      -- 1-10
  score_reasons      jsonb,         -- [{ signal, points, detail }]
  raw                jsonb,         -- raw API payload extracts for debugging
  created_at         timestamptz not null default now()
);

alter table lead_intel enable row level security;

-- Team reads in the dashboard; writes happen via the service role (RLS bypass).
create policy "intel_auth_read" on lead_intel
  for select using (auth.role() = 'authenticated');
