-- Give the funnel's data real columns, and stop the enum lying about every lead.
--
-- Five values were being packed into the free-text `notes` string because the
-- schema had nowhere to put them:
--
--   "Service: x | State: y | ZIP: z | Address: a | Consent: yes | Sector: s | Form: f"
--
-- Service, ZIP, State and Address now have columns (0017 added the last two).
-- Consent, sector, form name and postcode precision did not, so the only way to
-- read them back was to split a string on pipes. That is a poor way to store
-- anything, and an especially poor way to store a consent flag that decides
-- whether a person may be marketed to.
--
-- Safe to run now and awkward later: every row in the table today is a test
-- lead, so nothing needs backfilling or reconciling.

-- 1. install_type: from a rigid enum to text plus a check.
--
-- The enum was created as ('residential','business','rural','marine','events'),
-- a taxonomy nothing in the product uses: `installTypes` in site-config, the
-- only place those five appear together, is dead code. What the landings
-- actually submit is residential, commercial and mobile_rv, none of which
-- except the first the enum would accept. So the insert hardcoded
-- 'residential' for every lead and put the real answer in `service`, which
-- left the column reading "Residential" on commercial and motorhome jobs alike.
--
-- Text plus a check rather than a wider enum, for two reasons. Postgres cannot
-- remove an enum value, so every future vocabulary change would be one-way, and
-- `webhook_endpoints.format` already uses text plus a check, so this matches
-- how the rest of the schema does the same job. Widening or narrowing it later
-- is then a two-line migration instead of a type rebuild.
alter table leads alter column install_type drop default;
alter table leads alter column install_type type text using install_type::text;
alter table leads alter column install_type set default 'residential';

alter table leads drop constraint if exists leads_install_type_check;
alter table leads
  add constraint leads_install_type_check
  check (install_type in ('residential', 'commercial', 'mobile_rv', 'marine', 'business', 'rural', 'events'));

-- 2. Marketing consent, as a flag rather than a substring.
--
-- Nullable on purpose, and deliberately not defaulted to false: null means
-- nobody was asked, false means they were asked and did not tick. Collapsing
-- those two into one value loses the distinction that matters if anyone ever
-- has to show why a given person was contacted.
alter table leads add column if not exists marketing_consent boolean;
alter table leads add column if not exists consent_at timestamptz;

-- 3. How the postcode was arrived at.
--
-- "approximate" means it came from the coordinates of a street the visitor
-- picked rather than their own premise: the right outcode, so area data holds,
-- but not guaranteed the right house. It was being written as the English
-- sentence "Postcode: APPROXIMATE (street-level ...)" inside the notes.
alter table leads add column if not exists postcode_precision text;
alter table leads drop constraint if exists leads_postcode_precision_check;
alter table leads
  add constraint leads_postcode_precision_check
  check (postcode_precision is null or postcode_precision in ('exact', 'approximate', 'none'));

-- 4. Where the lead came from within the site.
--   sector    set when they arrived through a sector card (commercial only).
--   form_name which landing's form produced it, e.g. "starlink_commercial".
alter table leads add column if not exists sector text;
alter table leads add column if not exists form_name text;

comment on column leads.install_type is
  'Installation category the visitor selected. Text with a check, not an enum, so the vocabulary can change both ways.';
comment on column leads.marketing_consent is
  'True ticked, false asked and declined, null never asked. Do not collapse null into false.';
comment on column leads.consent_at is
  'When the consent value was captured. Null when marketing_consent is null.';
comment on column leads.postcode_precision is
  'exact = the visitor premise. approximate = nearest unit to a street they picked. none = no postcode established.';
comment on column leads.sector is
  'Sector card the visitor entered through, when they used one.';
comment on column leads.form_name is
  'Which landing form produced the lead, e.g. starlink_commercial.';
