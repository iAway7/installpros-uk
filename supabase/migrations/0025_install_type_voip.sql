-- Adds `voip` to the install types and four answers to `need`, for the
-- digital landline page (/digital-landline, built 3 November 2026).
--
--   install_type voip   the page's leads, labelled "VoIP" for Will's Zap
--                       (lib/webhooks/formats/superchat.ts).
--   need                the form's first tap, "Who's the phone for?":
--                       self, relative or business, and managed from the
--                       "fixed IP or managed support" link under it.
--
-- Apply BEFORE the page ships: /api/lead mirrors both lists, so until the
-- constraints know the values the insert fails and the visitor gets an error
-- instead of a quote.
--
-- The webhook step: since 0023 an endpoint with install_types set only gets
-- those types, and the Starlink endpoint lists the seven non-security ones.
-- A voip lead would reach nobody, so it is added to the Starlink Zap, where
-- every VoIP buyer in the chats came from (voip-research, section 1). If Will
-- wants it elsewhere (question 13), move it there instead.

alter table leads drop constraint if exists leads_install_type_check;
alter table leads
  add constraint leads_install_type_check
  check (install_type in ('residential', 'commercial', 'mobile_rv', 'marine', 'security', 'business', 'rural', 'events', 'voip'));

alter table leads drop constraint if exists leads_need_check;
alter table leads
  add constraint leads_need_check
  check (need is null or need in ('alarm', 'cameras', 'both', 'self', 'relative', 'business', 'managed'));

update webhook_endpoints
  set install_types = array_append(install_types, 'voip')
  where name = 'Will - Zapier (Starlink)'
    and install_types is not null
    and not ('voip' = any(install_types));
