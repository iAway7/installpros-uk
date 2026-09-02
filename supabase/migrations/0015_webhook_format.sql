-- ════════════════════════════════════════════════════════════════════════
-- Per-endpoint payload format.
--
--   generic    — our native nested payload (default, unchanged behaviour).
--   superchat  — the flat shape Will's Superchat edge function expects
--                (event_type, first_name, last_name, phone in +44 form, ...).
--
-- Additive and backwards compatible: existing rows default to 'generic'.
-- Run after 0014_webhooks.sql.
-- ════════════════════════════════════════════════════════════════════════

alter table webhook_endpoints
  add column if not exists format text not null default 'generic';

alter table webhook_endpoints
  drop constraint if exists webhook_endpoints_format_check;

alter table webhook_endpoints
  add constraint webhook_endpoints_format_check
  check (format in ('generic', 'superchat'));
