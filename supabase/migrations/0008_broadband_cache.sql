-- ════════════════════════════════════════════════════════════════════════
-- Postcode broadband cache for the /starlink-installation smart coverage
-- message. Broadband availability changes at most every few months, and the
-- homedata.co.uk trial quota is small — so every lookup is cached hard.
--   found=true  rows are considered fresh for 90 days
--   found=false rows (postcode not in the dataset) for 30 days
-- Run after 0007_lead_photos.sql.
-- ════════════════════════════════════════════════════════════════════════

create table if not exists postcode_broadband_cache (
  postcode   text primary key,          -- normalised, no spaces, uppercase
  data       jsonb,                     -- raw payload from the source API
  source     text,                      -- 'homedata' | 'ofcom'
  found      boolean not null default true,
  fetched_at timestamptz not null default now()
);

alter table postcode_broadband_cache enable row level security;
-- No policies: only the service role (server functions) reads/writes this.
