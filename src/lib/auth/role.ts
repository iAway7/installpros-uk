import { createClient } from "@/lib/supabase/server";

/** Mirrors the app_role enum in 0001_init.sql. */
export type AppRole = "admin" | "team_member";

/**
 * The signed-in user's role, or null when nobody is signed in.
 *
 * Reads `profiles` under the caller's own session: the profiles_self_read RLS
 * policy lets a user see their own row, so this needs no service-role key and
 * cannot be used to inspect anyone else.
 *
 * Missing profile row falls back to team_member — the least privilege, never
 * the most.
 */
export async function getCurrentRole(): Promise<{ userId: string; role: AppRole } | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  return { userId: user.id, role: (data?.role as AppRole) ?? "team_member" };
}

export async function isAdmin(): Promise<boolean> {
  return (await getCurrentRole())?.role === "admin";
}
