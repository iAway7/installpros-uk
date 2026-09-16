-- Widen the per-endpoint payload format to allow 'zapier'.
--
-- 0015 pinned `format` to ('generic', 'superchat'). Will is pausing the rollout
-- of the new system and wants leads to keep landing in the Superchat flow his
-- team already runs, reached through a Zapier Catch Hook, so there is now a
-- third shape: flat, plainly named, built to be mapped by hand in Zapier rather
-- than read by an edge function.
--
-- The application already refuses anything outside WEBHOOK_FORMATS, so this
-- constraint is the backstop rather than the gate. Until it is applied, saving
-- an endpoint with format 'zapier' fails on the check and the dashboard shows
-- the database error.
--
-- Drop and recreate rather than alter: Postgres has no "modify constraint" for
-- a check, and the table holds a single row, so there is nothing to revalidate.

alter table webhook_endpoints
  drop constraint if exists webhook_endpoints_format_check;

alter table webhook_endpoints
  add constraint webhook_endpoints_format_check
  check (format in ('generic', 'superchat', 'zapier'));
