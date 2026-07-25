-- ════════════════════════════════════════════════════════════════════════
-- InstallPros growth platform — initial schema
-- Covers Phase 1 (leads), Phase 2 (roles/profiles), Phase 5 (experiments).
-- Run via Supabase SQL editor or `supabase db push`.
-- ════════════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ── Enums ────────────────────────────────────────────────────────────────
do $$ begin
  create type app_role as enum ('admin', 'team_member');
exception when duplicate_object then null; end $$;

do $$ begin
  create type install_type as enum ('residential','business','rural','marine','events');
exception when duplicate_object then null; end $$;

do $$ begin
  create type lead_status as enum ('new','contacted','quoted','booked','installed','lost');
exception when duplicate_object then null; end $$;

-- ── Phase 2: profiles (extends auth.users) ───────────────────────────────
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  role        app_role not null default 'team_member',
  created_at  timestamptz not null default now()
);

-- ── Phase 1: leads ───────────────────────────────────────────────────────
create table if not exists leads (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  name            text not null,
  email           text not null,
  phone           text not null,
  postcode        text not null,
  install_type    install_type not null default 'residential',
  notes           text,
  status          lead_status not null default 'new',
  -- attribution
  traffic_source  text,
  campaign        text,
  source_url      text,
  -- assignment
  assigned_to     uuid references profiles(id) on delete set null,
  estimated_value numeric(10,2)
);
create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_status_idx on leads (status);

-- ── Phase 4/5: raw analytics events (optional warehouse mirror) ───────────
create table if not exists analytics_events (
  id             bigint generated always as identity primary key,
  occurred_at    timestamptz not null default now(),
  event          text not null,
  anonymous_id   text,
  lead_id        uuid references leads(id) on delete set null,
  page_path      text,
  device_type    text,
  traffic_source text,
  campaign       text,
  variant_id     text,
  experiment_id  text,
  properties     jsonb not null default '{}'::jsonb
);
create index if not exists analytics_events_event_idx on analytics_events (event, occurred_at desc);

-- ── Phase 5: experiments ─────────────────────────────────────────────────
create table if not exists experiments (
  id            uuid primary key default gen_random_uuid(),
  key           text unique not null,           -- e.g. 'hero_headline'
  name          text not null,
  hypothesis    text,
  status        text not null default 'draft',  -- draft|running|paused|complete
  primary_metric text not null default 'lead_created',
  created_at    timestamptz not null default now(),
  started_at    timestamptz,
  ended_at      timestamptz
);

create table if not exists experiment_variants (
  id            uuid primary key default gen_random_uuid(),
  experiment_id uuid not null references experiments(id) on delete cascade,
  key           text not null,                  -- 'control' | 'variant_a'
  name          text not null,
  is_control    boolean not null default false,
  allocation    numeric(5,4) not null default 0.5, -- traffic share 0..1
  config        jsonb not null default '{}'::jsonb,
  unique (experiment_id, key)
);

-- Daily rollup the A/B dashboard reads (visitors, conversions per variant).
create table if not exists experiment_results (
  id            uuid primary key default gen_random_uuid(),
  variant_id    uuid not null references experiment_variants(id) on delete cascade,
  day           date not null,
  visitors      integer not null default 0,
  conversions   integer not null default 0,
  unique (variant_id, day)
);

-- ── Row Level Security ───────────────────────────────────────────────────
alter table profiles            enable row level security;
alter table leads               enable row level security;
alter table analytics_events    enable row level security;
alter table experiments         enable row level security;
alter table experiment_variants enable row level security;
alter table experiment_results  enable row level security;

-- helper: is the current user an admin?
create or replace function is_admin() returns boolean
language sql security definer stable as $$
  select exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin');
$$;

-- profiles: a user sees their own row; admins see all.
create policy "profiles_self_read" on profiles
  for select using (id = auth.uid() or is_admin());
create policy "profiles_self_update" on profiles
  for update using (id = auth.uid());

-- leads: any authenticated team member can read; admins manage.
create policy "leads_auth_read" on leads
  for select using (auth.role() = 'authenticated');
create policy "leads_admin_write" on leads
  for all using (is_admin()) with check (is_admin());

-- experiments + variants + results: authenticated read, admin write.
create policy "exp_read"  on experiments         for select using (auth.role() = 'authenticated');
create policy "exp_write" on experiments         for all using (is_admin()) with check (is_admin());
create policy "var_read"  on experiment_variants for select using (auth.role() = 'authenticated');
create policy "var_write" on experiment_variants for all using (is_admin()) with check (is_admin());
create policy "res_read"  on experiment_results  for select using (auth.role() = 'authenticated');

-- analytics_events: authenticated read only (writes happen via service role).
create policy "events_auth_read" on analytics_events
  for select using (auth.role() = 'authenticated');

-- Note: public lead inserts come through the /api/lead route using the
-- service-role key, so no public INSERT policy is granted on `leads`.

-- ── Auto-create a profile when a user signs up ──────────────────────────
create or replace function handle_new_user() returns trigger
language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
