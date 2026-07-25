-- ════════════════════════════════════════════════════════════════════════
-- Exact-property resolution (Propalt, on-demand from the lead panel):
-- stores the confirmed address + property-level facts, replacing the
-- street-level EPC/price aggregates for that lead.
-- Run after 0011_intel_actual_speed.sql.
-- ════════════════════════════════════════════════════════════════════════

alter table lead_intel
  add column if not exists resolved_address text,
  add column if not exists uprn             text,
  add column if not exists propalt_property_id bigint,
  add column if not exists avm_value        integer,   -- Propalt automated valuation (£)
  add column if not exists bedrooms         smallint,
  add column if not exists tax_band         text;
