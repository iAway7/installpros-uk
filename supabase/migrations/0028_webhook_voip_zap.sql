-- VoIP leads get a Zap of their own (Gus, 9 November 2026), instead of a
-- Path in the Starlink Zap, which is running out of steps (see 0023).
--
--   new endpoint "Zapier (VoIP)"     install_types {voip}, Zapier format,
--                                    so the Zap sees Install Type "VoIP"
--   "Will - Zapier (Starlink)"       loses voip (added by 0025), or every
--                                    VoIP lead would reach both Zaps
--
-- No VoIP lead exists yet: /digital-landline still 404s in production. The
-- Brevo side is ready and off (list 8, automation 4); the new Zap adds
-- consenting leads to list 8.

insert into webhook_endpoints (name, url, events, headers, active, format, install_types)
select 'Zapier (VoIP)',
       'https://hooks.zapier.com/hooks/catch/3323202/49v1khk/',
       array['lead.created'],
       '{}'::jsonb,
       true,
       'zapier',
       array['voip']
where not exists (
  select 1 from webhook_endpoints
  where url = 'https://hooks.zapier.com/hooks/catch/3323202/49v1khk/'
);

update webhook_endpoints
  set install_types = array_remove(install_types, 'voip')
  where name = 'Will - Zapier (Starlink)'
    and 'voip' = any(install_types);
