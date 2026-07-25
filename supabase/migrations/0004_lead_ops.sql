-- ════════════════════════════════════════════════════════════════════════
-- Phase-1 ops columns on leads:
--   device_type / landing_page  — captured at submit for per-lead segmentation
--   service                     — promoted out of the notes blob
--   contacted_at / quoted_at    — auto-stamped on status change; powers the
--                                 time-to-first-contact / time-to-quote KPIs
-- Run after 0003_lead_attribution.sql.
-- ════════════════════════════════════════════════════════════════════════

alter table leads
  add column if not exists device_type  text,
  add column if not exists landing_page text,
  add column if not exists service      text,
  add column if not exists contacted_at timestamptz,
  add column if not exists quoted_at    timestamptz;

comment on column leads.device_type  is 'mobile | tablet | desktop at submit time';
comment on column leads.landing_page is 'First-touch landing path for the session';
comment on column leads.service      is 'Human-selected service (Starlink, Security, …)';
comment on column leads.contacted_at is 'Set automatically the first time status moves to contacted (or beyond)';
comment on column leads.quoted_at    is 'Set automatically the first time status moves to quoted (or beyond)';
