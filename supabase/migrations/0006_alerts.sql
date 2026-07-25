-- ════════════════════════════════════════════════════════════════════════
-- In-dashboard alerts (Phase 6):
--   alerts       — one row per triggered alert; dedupe_key stops repeats.
--                  Read state is team-wide (read_at), matching a small team.
--   alert_state  — key/value scratch (throttles the rule engine).
-- Email/WhatsApp delivery intentionally NOT included yet — bell icon only.
-- Run after 0005_lead_intel.sql.
-- ════════════════════════════════════════════════════════════════════════

create table if not exists alerts (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  type        text not null,             -- volume_drop | uncontacted | cluster | form_rate
  severity    text not null default 'warning',  -- info | warning | critical
  title       text not null,
  body        text,
  lead_id     uuid references leads(id) on delete cascade,
  dedupe_key  text not null unique,
  read_at     timestamptz
);

create index if not exists alerts_created_idx on alerts (created_at desc);

create table if not exists alert_state (
  key        text primary key,
  value      text,
  updated_at timestamptz not null default now()
);

alter table alerts      enable row level security;
alter table alert_state enable row level security;

-- Team reads alerts and can mark them read; the rule engine writes via the
-- service role (RLS bypass).
create policy "alerts_auth_read"   on alerts for select using (auth.role() = 'authenticated');
create policy "alerts_auth_update" on alerts for update using (auth.role() = 'authenticated');
