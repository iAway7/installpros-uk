-- Which install types a webhook endpoint receives.
--
-- Until now every lead went to every active endpoint, and Will split them by
-- install_type inside one Zap. On 21 October 2026 he asked for a Zap of its
-- own for security leads: the Starlink Zap has about 30 steps left, room for
-- one more vertical at most. So an endpoint can now name the install types
-- it takes (the raw values, e.g. 'security', not the "Ajax Security" label).
--
--   install_types null or empty   every lead, as before
--   install_types {security}      only Ajax security leads
--
-- Nullable with no default, so every existing endpoint keeps receiving
-- everything until someone sets it. The dispatch code reads the column with
-- select('*') and treats a missing column as null, so it works before and
-- after this migration.

alter table webhook_endpoints add column if not exists install_types text[];

comment on column webhook_endpoints.install_types is
  'Raw leads.install_type values this endpoint receives. Null or empty = every lead.';
