-- ════════════════════════════════════════════════════════════════════════
-- Actual line performance (Propalt take-up data) on lead_intel. Ofcom says
-- what CAN be delivered; this says what residents ACTUALLY get — a street
-- averaging 15 Mbps despite fibre availability is a hot Starlink prospect.
-- Populated only when the Propalt toggle in Settings is on.
-- Run after 0010_intel_crime_energy.sql.
-- ════════════════════════════════════════════════════════════════════════

alter table lead_intel
  add column if not exists actual_avg_download_mbps numeric,
  add column if not exists actual_max_download_mbps numeric;
