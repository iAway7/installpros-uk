-- The address the visitor actually chose, as its own column.
--
-- Until now `leads` held a postcode and nothing else about where the customer
-- lives. The street they picked in the autocomplete was pushed into the notes
-- as free text ("... | Address: De La Bere Cl, Evesham, UK | ..."), which meant
-- the dashboard could not show it: its "Full address" field was built as
-- `${admin_district}, ${postcode}` from a postcodes.io lookup, so a lead from
-- Evesham displayed as "Wychavon, WR11 4PW" — the right place, under a district
-- name no customer would recognise and no engineer could navigate to.
--
-- Two columns, both nullable, because plenty of leads arrive through the
-- postcode-only funnel and never have either:
--   address — the formatted address Google returned for the chosen suggestion.
--   town    — Google's postal_town, the name a person actually uses ("Evesham"),
--             as opposed to the administrative district that covers it.
--
-- Additive and idempotent: safe to run against a live database before the
-- application that writes to them is deployed.

alter table leads add column if not exists address text;
alter table leads add column if not exists town    text;

comment on column leads.address is
  'Formatted address from the address autocomplete. Null for postcode-only submissions.';
comment on column leads.town is
  'Google postal_town for the address — the everyday place name, not the admin district.';
