-- ════════════════════════════════════════════════════════════════════════
-- District-level rollup of ofcom_postcode_coverage.
--
-- The map page needs "which postcode districts are worst served", which is a
-- GROUP BY over 1.7M rows. PostgREST can't express that and we don't want to
-- pay for it on every page load, so it is precomputed here.
--
-- The averages are UNWEIGHTED: Ofcom publishes percentages per postcode but
-- not how many premises each postcode holds, so every postcode in a district
-- counts the same. That is fine for ranking districts and wrong for quoting a
-- district-wide premises count — the UI says so.
--
-- Refresh after reloading ofcom_postcode_coverage:
--   refresh materialized view ofcom_outcode_coverage;
-- ════════════════════════════════════════════════════════════════════════

drop materialized view if exists ofcom_outcode_coverage;

create materialized view ofcom_outcode_coverage as
select
  left(postcode, length(postcode) - 3)        as outcode,
  count(*)::int                               as postcodes,
  round(avg(pct_unable_10))::smallint         as pct_unable_10,
  round(avg(pct_unable_30))::smallint         as pct_unable_30,
  round(avg(pct_sfbb))::smallint              as pct_sfbb,
  round(avg(pct_300plus))::smallint           as pct_300plus,
  round(avg(pct_gigabit))::smallint           as pct_gigabit,
  min(release)                                as release
from ofcom_postcode_coverage
where length(postcode) > 3
group by 1;

create unique index if not exists ofcom_outcode_coverage_pk
  on ofcom_outcode_coverage (outcode);
-- The map orders by "worst first"; keep that path indexed.
create index if not exists ofcom_outcode_coverage_unable10_idx
  on ofcom_outcode_coverage (pct_unable_10 desc);

-- A materialized view can't carry RLS, so it is locked down by grant instead.
-- Signed-in dashboard users read it; the public anon role does not.
revoke all on ofcom_outcode_coverage from anon, authenticated;
grant select on ofcom_outcode_coverage to authenticated, service_role;

comment on materialized view ofcom_outcode_coverage is
  'Postcode-district rollup of ofcom_postcode_coverage. Unweighted mean of the postcode percentages. Refresh after each Ofcom reload.';
