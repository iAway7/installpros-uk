-- Mark test submissions instead of deleting them.
--
-- The team submits the public form to check it works, and every one of those
-- lands in `leads` next to the real enquiries. With ~35 leads in the table,
-- eleven test rows move the visitor → lead conversion rate by several points,
-- so the dashboard cannot be trusted while they count. Deleting them is
-- tempting and irreversible; a flag is neither.
--
-- Dashboard metrics (Overview, Marketing, Landings, Map, alerts) exclude rows
-- where is_test is true. The Leads list still shows them, with a "Test" badge
-- and a toggle to set or clear the flag, so nothing ever has to be deleted.
--
-- NOT NULL with a default is metadata-only on Postgres 11+, so this adds the
-- column without rewriting or locking the table for long. Existing rows read
-- as false; the public form never writes this column.
alter table public.leads
  add column if not exists is_test boolean not null default false;

comment on column public.leads.is_test is
  'True for submissions made by the team to test the form. Excluded from every dashboard metric; still listed on the Leads page.';
