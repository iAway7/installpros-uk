-- Adds `security` to the install types a lead can carry.
--
-- For the Ajax alarm and CCTV landing (/ajax-security-installation), the
-- first page that sells something other than Starlink. Its leads need their
-- own value so Will's Zap can split them from the Starlink ones: the webhook
-- formats turn `security` into "Ajax Security" (lib/webhooks/formats/
-- superchat.ts), and without a branch for that label in his Zapier the leads
-- still arrive, but untagged.
--
-- This is the two-line change 0019 was written to allow. Apply it BEFORE the
-- page ships: /api/lead mirrors this list, so until the constraint knows the
-- value the insert fails and the visitor gets an error instead of a quote.

alter table leads drop constraint if exists leads_install_type_check;
alter table leads
  add constraint leads_install_type_check
  check (install_type in ('residential', 'commercial', 'mobile_rv', 'marine', 'security', 'business', 'rural', 'events'));
