-- ════════════════════════════════════════════════════════════════════════
-- Keep the tags Trustpilot sends with each review.
--
-- Tags are set by us, either on the invitation (from the CRM: service, area,
-- installer) or by hand in the portal afterwards. They arrive in the webhook
-- payload as [{ "group": "...", "value": "..." }] and were being dropped.
--
-- Nothing reads this yet. It is stored now because the data only comes past
-- once: a review that arrives untagged today cannot be back-filled later
-- without the API we do not have. When there is enough of it, this is what
-- lets the marine landing show marine reviews and the commercial one show
-- commercial, instead of all three pages showing the same fifteen.
--
-- Run after 0011_trustpilot_reviews.sql.
-- ════════════════════════════════════════════════════════════════════════

alter table trustpilot_reviews
  add column if not exists tags jsonb not null default '[]'::jsonb;

-- Containment index, for the eventual `tags @> '[{"value":"marine"}]'`.
create index if not exists trustpilot_reviews_tags_idx
  on trustpilot_reviews using gin (tags);
