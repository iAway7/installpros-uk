-- ════════════════════════════════════════════════════════════════════════
-- Property photos (Phase 4a):
--   storage bucket `property-photos` (private; dashboard uses signed URLs)
--   lead_photos — one row per uploaded photo, linked to the lead
-- Run after 0006_alerts.sql.
-- ════════════════════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public)
values ('property-photos', 'property-photos', false)
on conflict (id) do nothing;

create table if not exists lead_photos (
  id           uuid primary key default gen_random_uuid(),
  lead_id      uuid not null references leads(id) on delete cascade,
  path         text not null,           -- storage object path within the bucket
  content_type text,
  size_bytes   integer,
  created_at   timestamptz not null default now()
);

create index if not exists lead_photos_lead_idx on lead_photos (lead_id);

alter table lead_photos enable row level security;

-- Team reads in the dashboard; uploads go through /api/property-photos with
-- the service role (RLS bypass). No public policies on the bucket — the
-- dashboard mints short-lived signed URLs server-side.
create policy "photos_auth_read" on lead_photos
  for select using (auth.role() = 'authenticated');
