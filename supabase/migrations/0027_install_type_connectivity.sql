-- Adds `connectivity` to the install types and four answers to `need`, for
-- the 4G/5G and fibre page (/4g-5g-fibre, built 9 November 2026).
--
--   install_type connectivity   the page's leads, labelled "4G/5G and fibre"
--                               for Will's Zap (lib/webhooks/formats/superchat.ts).
--   need                        the form's first tap, "What's your internet
--                               now?": slow_line, mobile, no_line or fibre_drops.
--
-- Apply BEFORE the page ships: the lists below include 0025's and 0026's
-- values (both applied 4 November), and /api/lead mirrors them, so until the
-- constraints know the new ones the insert fails and the visitor gets an
-- error instead of a quote. Never send a test lead before it runs.
--
-- The webhook step, as in 0025 and 0026: the Starlink endpoint only gets the
-- types it lists, so connectivity is added to the Starlink Zap. Will still
-- needs a Path there for "4G/5G and fibre" (4g-5g-fibre-research/
-- preguntas-will.md, question 11), or the leads arrive untagged.

alter table leads drop constraint if exists leads_install_type_check;
alter table leads
  add constraint leads_install_type_check
  check (install_type in ('residential', 'commercial', 'mobile_rv', 'marine', 'security', 'business', 'rural', 'events', 'voip', 'managed', 'connectivity'));

alter table leads drop constraint if exists leads_need_check;
alter table leads
  add constraint leads_need_check
  check (need is null or need in ('alarm', 'cameras', 'both', 'self', 'relative', 'business', 'managed', 'cctv', 'vpn', 'support', 'slow_line', 'mobile', 'no_line', 'fibre_drops'));

update webhook_endpoints
  set install_types = array_append(install_types, 'connectivity')
  where name = 'Will - Zapier (Starlink)'
    and install_types is not null
    and not ('connectivity' = any(install_types));
