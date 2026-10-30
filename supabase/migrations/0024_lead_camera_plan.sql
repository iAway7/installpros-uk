-- The camera plan from the Hikvision planners, saved with the lead.
--
--   camera_plan  what the visitor picked on a planner, as one line for Will's
--                team: "3 cameras. Outside: front door, drive and car, back
--                door." It used to live only in the visitor's browser and
--                reached the team only if they sent the thank-you page's
--                WhatsApp message.
--
-- Nullable and set only by the Hikvision forms, and only when a planner was
-- used and the lead is not a repair, so every other lead is untouched. The
-- API sends it only when it has a value and, as with 0022, saves the lead
-- without it if this migration has not run; the webhook reads it in a query
-- of its own and sends it to Zapier as `cameras`.

alter table leads add column if not exists camera_plan text;

alter table leads drop constraint if exists leads_camera_plan_check;
alter table leads
  add constraint leads_camera_plan_check
  check (camera_plan is null or char_length(camera_plan) <= 300);
