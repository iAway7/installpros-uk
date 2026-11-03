-- Adds `managed` to the install types and three answers to `need`, for the
-- managed service page (/starlink-business, built 4 November 2026).
--
--   install_type managed   the page's leads, labelled "Managed service" for
--                          Will's Zap (lib/webhooks/formats/superchat.ts).
--   need                   the form's first tap, "What does your connection
--                          need to run?": cctv, vpn or support.
--
-- Apply AFTER 0025 and BEFORE the page ships: the lists below include 0025's
-- values, and /api/lead mirrors both, so until the constraints know the new
-- ones the insert fails and the visitor gets an error instead of a quote.
--
-- The webhook step, as in 0025: the Starlink endpoint only gets the types it
-- lists, so managed is added to the Starlink Zap. Every managed buyer in the
-- chats was a Starlink customer (managed-research, section 1).

alter table leads drop constraint if exists leads_install_type_check;
alter table leads
  add constraint leads_install_type_check
  check (install_type in ('residential', 'commercial', 'mobile_rv', 'marine', 'security', 'business', 'rural', 'events', 'voip', 'managed'));

alter table leads drop constraint if exists leads_need_check;
alter table leads
  add constraint leads_need_check
  check (need is null or need in ('alarm', 'cameras', 'both', 'self', 'relative', 'business', 'managed', 'cctv', 'vpn', 'support'));

update webhook_endpoints
  set install_types = array_append(install_types, 'managed')
  where name = 'Will - Zapier (Starlink)'
    and install_types is not null
    and not ('managed' = any(install_types));
