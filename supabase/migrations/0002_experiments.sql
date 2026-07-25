-- ════════════════════════════════════════════════════════════════════════
-- A/B testing — atomic results increment + public read of running experiments
-- Run after 0001_init.sql (Supabase SQL editor or `supabase db push`).
-- ════════════════════════════════════════════════════════════════════════

-- Atomically upsert a day's row and add visitors/conversions. Called from the
-- server (service role) by the /api/experiments/track route.
create or replace function record_experiment_event(
  p_variant uuid,
  p_day date,
  p_visitors int default 0,
  p_conversions int default 0
) returns void
language plpgsql
security definer
as $$
begin
  insert into experiment_results (variant_id, day, visitors, conversions)
  values (p_variant, p_day, greatest(p_visitors, 0), greatest(p_conversions, 0))
  on conflict (variant_id, day) do update
    set visitors = experiment_results.visitors + excluded.visitors,
        conversions = experiment_results.conversions + excluded.conversions;
end;
$$;

-- Allow anonymous visitors to READ running experiments + their variants, so the
-- public landing page can assign variants. (Writes stay admin/service-role.)
drop policy if exists "exp_public_running_read" on experiments;
create policy "exp_public_running_read" on experiments
  for select using (status = 'running');

drop policy if exists "var_public_read" on experiment_variants;
create policy "var_public_read" on experiment_variants
  for select using (
    exists (select 1 from experiments e where e.id = experiment_id and e.status = 'running')
  );
