-- ════════════════════════════════════════════════════════════════════════
-- Fuller property detail from the same Propalt /property/get-property call
-- that 0012 already pays for, plus the planning constraints that decide
-- whether a dish can go on a visible elevation at all.
--
-- Nothing here costs an extra API call except planning_constraints, which is
-- fetched alongside the property record when the team resolves an address.
-- Run after 0012_intel_resolved_property.sql.
-- ════════════════════════════════════════════════════════════════════════

alter table lead_intel
  -- Room counts: Propalt models these rather than observing them, so treat as
  -- estimates (their `modelled_features` flag).
  add column if not exists bathrooms         smallint,
  add column if not exists reception_rooms   smallint,
  -- Plot area as Propalt returns it. Their docs don't state the unit; the
  -- values are consistent with square feet. Stored raw, converted for display.
  add column if not exists plot_size         integer,
  -- Built form at property level ("Terraced", "Semi-Detached"…), which beats
  -- the postcode-modal value from the EPC register.
  add column if not exists property_built_form text,
  add column if not exists tenure            text,
  add column if not exists title_number      text,
  add column if not exists is_hmo            boolean,
  -- Exact coordinates of the resolved property. The satellite view falls back
  -- to the postcode centroid without these.
  add column if not exists property_lat      double precision,
  add column if not exists property_lng      double precision,
  -- [{ type, name, start_date, end_date }] — article_4, conservation_area,
  -- listed_building, flood_zone, green_belt. Empty array = checked, none found;
  -- null = never checked.
  add column if not exists planning_constraints jsonb;

comment on column lead_intel.plot_size is
  'Propalt plot area, unit undocumented — values are consistent with sq ft.';
comment on column lead_intel.planning_constraints is
  'Propalt planning constraints for the resolved property. [] = checked, none found. null = not checked.';
