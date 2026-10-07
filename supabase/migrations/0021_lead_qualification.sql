-- Qualification answers collected after the lead exists.
--
-- The commercial funnel asks five questions and takes a note, but not in the
-- hero form. Every field added there is a field between a visitor and a lead,
-- and a business that wants a quote should not have to list its tills before
-- we know its phone number. So the hero stays contact-only and the
-- /thank-you-commercial page asks the rest once the lead is already in the
-- CRM. Nothing here is required, and a lead with all of it null is a normal
-- lead, not a broken one.
--
-- Real columns rather than a jsonb blob or an append to `notes`: 0019 moved
-- every synthetic value out of that pipe-delimited string precisely because
-- nothing could read it back, and putting a second generation of the same
-- thing in a jsonb column would repeat the mistake with better syntax.
--
-- `notes` itself is reused for the visitor's free text. 0019 freed it for
-- "actual notes" and this is one: a sentence the customer wrote about their
-- own site. A separate survey_notes column beside a permanently empty `notes`
-- would be the confusing arrangement, not the tidy one.

alter table leads add column if not exists company_name text;
alter table leads add column if not exists business_type text;
alter table leads add column if not exists timeframe text;
alter table leads add column if not exists has_starlink boolean;
alter table leads add column if not exists systems text[];

-- Set the first time the answers land. Two jobs: it tells the dashboard the
-- difference between "did not answer" and "answered nothing", and it is the
-- guard that makes the public endpoint single-write, so a replayed or shared
-- link cannot overwrite what the customer already sent.
alter table leads add column if not exists qualified_at timestamptz;

-- Checks on the two small closed sets the dashboard will group by, matching
-- how 0019 treated install_type and postcode_precision. business_type is
-- deliberately left unchecked for the same reason `sector` is: its vocabulary
-- is the sector cards on the landing, and Will renames those.
alter table leads drop constraint if exists leads_timeframe_check;
alter table leads
  add constraint leads_timeframe_check
  check (timeframe is null or timeframe in ('asap', 'within_month', 'one_to_three_months', 'planning'));

comment on column leads.company_name is
  'Trading name the visitor gave after submitting. Distinct from `name`, which is the person.';
comment on column leads.business_type is
  'Self-described sector. Tracks the sector-card vocabulary on the commercial landing; unchecked so it can change without a migration.';
comment on column leads.timeframe is
  'How soon they want the work. Closed set, see leads_timeframe_check.';
comment on column leads.has_starlink is
  'Already has a Starlink on site. Changes the job from supply-and-install to survey-and-move, so it is asked rather than inferred.';
comment on column leads.systems is
  'Which systems need connecting, from the vocabulary in lib/funnel/qualification.ts. Array, because the answer is almost never one thing.';
comment on column leads.qualified_at is
  'When the post-submit answers were saved. Null means the page was never completed.';

-- Partial index: the dashboard will want "leads that answered" far more often
-- than it wants a full scan, and the column is null for every residential lead.
create index if not exists leads_qualified_at_idx on leads (qualified_at desc) where qualified_at is not null;
