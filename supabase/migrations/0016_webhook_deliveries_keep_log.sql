-- ════════════════════════════════════════════════════════════════════════
-- Deleting an endpoint must not erase the evidence of what was sent to it.
-- endpoint_url is already denormalised on every delivery row, so the log
-- stays readable with endpoint_id set to null.
-- Run after 0015_webhook_format.sql.
-- ════════════════════════════════════════════════════════════════════════

alter table webhook_deliveries
  drop constraint if exists webhook_deliveries_endpoint_id_fkey;

alter table webhook_deliveries
  add constraint webhook_deliveries_endpoint_id_fkey
  foreign key (endpoint_id) references webhook_endpoints(id) on delete set null;
