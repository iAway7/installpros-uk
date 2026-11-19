-- ════════════════════════════════════════════════════════════════════════
-- Nobody can change their own role.
--
-- profiles_self_update (0001) lets a signed-in user update their own row,
-- every column included. With no WITH CHECK, a user could set their own
-- role to 'admin' through the REST API and then do everything the admin
-- checks guard: experiments, webhooks, integrations, team. Found by the
-- dashboard audit of 18 November 2026.
--
-- Roles are only ever changed from Settings > Team, through
-- /api/settings/users, which writes with the service role. So the guard is
-- on who is writing, not on the policy: any role change made as the
-- `authenticated` or `anon` database role is refused. The service role, the
-- dashboard's own writes and migrations are not affected.
--
-- A trigger rather than a WITH CHECK that reads profiles: a policy on
-- profiles that queries profiles recurses.
-- ════════════════════════════════════════════════════════════════════════

create or replace function public.profiles_role_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.role is distinct from old.role and current_user in ('authenticated', 'anon') then
    raise exception 'A role can only be changed by an admin, from Settings > Team.'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_role_guard on public.profiles;
create trigger profiles_role_guard
  before update on public.profiles
  for each row execute function public.profiles_role_guard();
