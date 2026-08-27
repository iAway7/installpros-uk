-- ════════════════════════════════════════════════════════════════════════
-- Trustpilot reviews, fed by their webhooks (Developers → Webhook
-- Notifications → Service reviews). We have no API key, so this table IS our
-- copy of the review feed:
--
--   • the first ~15 rows are seeded by hand (source = 'seed') from the
--     Trustpilot business portal, because the webhook only fires on new
--     activity and gives us no history;
--   • everything after that arrives on service-review-created / -updated /
--     -deleted and keeps itself current.
--
-- The id is Trustpilot's own review id, so a webhook retry upserts instead of
-- duplicating. Deletes are soft (deleted_at) — we keep the row for the record
-- and filter it out on read.
--
-- Run after 0010_intel_crime_energy.sql.
-- ════════════════════════════════════════════════════════════════════════

create table if not exists trustpilot_reviews (
  id            text primary key,                  -- Trustpilot review id
  stars         smallint not null,
  title         text,
  text          text not null default '',
  consumer_name text not null default 'Customer',
  language      text,
  link          text,
  is_verified   boolean not null default false,    -- Trustpilot's own Verified flag
  created_at    timestamptz not null,              -- Trustpilot createdAt, NOT our insert time
  source        text not null default 'webhook',   -- 'seed' | 'webhook'
  deleted_at    timestamptz,                       -- set by service-review-deleted
  raw           jsonb,                             -- full eventData, for debugging
  synced_at     timestamptz not null default now()
);

-- The read path is always "newest first, still visible".
create index if not exists trustpilot_reviews_visible_idx
  on trustpilot_reviews (created_at desc)
  where deleted_at is null;

alter table trustpilot_reviews enable row level security;

-- No policies on purpose: the webhook writes and the site reads through the
-- service-role client. The anon key can never touch this table.

-- ── Aggregate counter ───────────────────────────────────────────────────
-- Trustpilot's webhooks do not send the total review count, and without an
-- API key we cannot query it. So we store today's real number once, by hand,
-- and let the webhook move it: +1 on created, -1 on deleted.
--
-- Set the real values from the Trustpilot portal before going live:
--   update app_settings set value = '{"count": 323, "score": 4.8}'::jsonb
--   where key = 'trustpilot_stats';
--
-- Re-sync it by hand every few months; small drift is possible if Trustpilot
-- ever removes a review without firing the event.
insert into app_settings (key, value)
values ('trustpilot_stats', '{"count": 0, "score": null}'::jsonb)
on conflict (key) do nothing;
