-- ════════════════════════════════════════════════════════════════════════
-- Cross-sell signals on lead_intel:
--   crime_*            — police.uk street-level counts (latest full month,
--                        ~1 mile radius around the postcode). CCTV pitch.
--   energy_cost_annual — heating + lighting + hot water £/yr from the EPC
--                        certificate. Smart-home / energy pitch.
-- Run after 0009_app_settings.sql.
-- ════════════════════════════════════════════════════════════════════════

alter table lead_intel
  add column if not exists crime_month     text,     -- e.g. '2026-05'
  add column if not exists crime_total     integer,
  add column if not exists crime_burglary  integer,
  add column if not exists crime_vehicle   integer,
  add column if not exists energy_cost_annual numeric;
