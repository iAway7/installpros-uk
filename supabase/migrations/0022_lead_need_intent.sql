-- Two answers from the Ajax forms, each in its own column.
--
--   need    "What do you need?", the first tap: alarm, cameras or both. It
--           was asked from the start but stored nowhere, so the lead reached
--           the team without saying which.
--   intent  new (a new system), add (add to what I have) or repair
--           (something stopped working). The forms set only repair, from
--           "Existing system not working?" under the chips; new and add came
--           from a row on the email step, removed on 17 October, and stay
--           allowed. About a fifth of security enquiries are repairs,
--           additions or takeovers of someone else's system, and they used
--           to arrive looking like new installs.
--
-- Both nullable and set only by the Ajax forms, so every other lead is
-- untouched. The API sends them only when they have a value, and if this
-- migration has not run it saves the lead without them rather than failing;
-- the webhook reads them in a query of their own for the same reason.
--
-- Apply together with 0021, which lets the Ajax leads in at all.

alter table leads add column if not exists need text;
alter table leads add column if not exists intent text;

alter table leads drop constraint if exists leads_need_check;
alter table leads
  add constraint leads_need_check
  check (need is null or need in ('alarm', 'cameras', 'both'));

alter table leads drop constraint if exists leads_intent_check;
alter table leads
  add constraint leads_intent_check
  check (intent is null or intent in ('new', 'add', 'repair'));
