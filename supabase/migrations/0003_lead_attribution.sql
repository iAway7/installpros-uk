-- ════════════════════════════════════════════════════════════════════════
-- Full attribution set on leads — UTM params, click IDs, session/experiment.
-- Run after 0002_experiments.sql (Supabase SQL editor or `supabase db push`).
-- ════════════════════════════════════════════════════════════════════════

alter table leads
  add column if not exists utm_source    text,
  add column if not exists utm_medium    text,
  add column if not exists utm_campaign  text,
  add column if not exists utm_term      text,
  add column if not exists utm_content   text,
  add column if not exists gclid         text,
  add column if not exists fbclid        text,
  add column if not exists session_id    text,
  add column if not exists variant_id    text,
  add column if not exists experiment_id text;

comment on column leads.session_id is 'Client-generated session id shared with analytics events';
comment on column leads.gclid      is 'Google Ads click id (first touch)';
comment on column leads.fbclid     is 'Meta Ads click id (first touch)';
