-- ════════════════════════════════════════════════════════════════════════
-- Key/value app settings (Phase: Settings page). First use: the Propalt
-- integration on/off toggle. Team reads; writes go through /api/settings
-- with the service role after an auth check.
-- Run after 0008_broadband_cache.sql.
-- ════════════════════════════════════════════════════════════════════════

create table if not exists app_settings (
  key        text primary key,
  value      jsonb,
  updated_at timestamptz not null default now()
);

alter table app_settings enable row level security;

create policy "settings_auth_read" on app_settings
  for select using (auth.role() = 'authenticated');
