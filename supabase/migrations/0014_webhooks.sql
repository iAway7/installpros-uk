-- ════════════════════════════════════════════════════════════════════════
-- Outbound lead webhooks. Forwards every lead to external systems (Zapier,
-- Make, n8n, a CRM endpoint) so Will's own stack receives leads without
-- anyone opening this dashboard.
--
-- Two events per lead:
--   lead.created   — instantly at submit. Contact + attribution only.
--   lead.enriched  — ~4s later, once scoring finishes. Adds score + intel.
--
-- Run after 0013_intel_property_detail.sql.
-- ════════════════════════════════════════════════════════════════════════

create table if not exists webhook_endpoints (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  url               text not null,
  -- Optional shared secret. When set, every request carries an HMAC-SHA256
  -- signature so the receiver can verify the payload really came from us.
  secret            text,
  -- Which events this endpoint wants. Empty array = all events.
  events            text[] not null default array['lead.created','lead.enriched'],
  -- Extra static headers (e.g. an API key the receiver expects).
  headers           jsonb  not null default '{}'::jsonb,
  active            boolean not null default true,
  created_at        timestamptz not null default now(),
  last_delivery_at  timestamptz,
  last_status       text
);

create table if not exists webhook_deliveries (
  id           uuid primary key default gen_random_uuid(),
  endpoint_id  uuid references webhook_endpoints(id) on delete cascade,
  -- Denormalised so the log survives an endpoint being deleted, and so
  -- env-var destinations (which have no row) still log.
  endpoint_url text not null,
  event        text not null,
  lead_id      uuid,
  payload      jsonb,
  status       text not null,            -- 'success' | 'failed'
  status_code  int,
  attempts     int  not null default 1,
  error        text,
  duration_ms  int,
  created_at   timestamptz not null default now()
);

create index if not exists webhook_deliveries_created_idx on webhook_deliveries (created_at desc);
create index if not exists webhook_deliveries_lead_idx    on webhook_deliveries (lead_id);
create index if not exists webhook_deliveries_endpoint_idx on webhook_deliveries (endpoint_id);

alter table webhook_endpoints  enable row level security;
alter table webhook_deliveries enable row level security;

-- Team members can read. All writes go through the API with the service role,
-- which bypasses RLS — the browser never touches these tables directly.
create policy "webhook_endpoints_auth_read" on webhook_endpoints
  for select using (auth.role() = 'authenticated');

create policy "webhook_deliveries_auth_read" on webhook_deliveries
  for select using (auth.role() = 'authenticated');
