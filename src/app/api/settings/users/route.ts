import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getCurrentRole, type AppRole } from "@/lib/auth/role";

export const runtime = "nodejs";

/**
 * Team management. Admin-only, every verb.
 *
 * The service-role key is unavoidable here: listing accounts needs
 * auth.admin.listUsers (emails live in auth.users, which the anon key can
 * never read), and creating one needs auth.admin.createUser. Both stay
 * server-side; nothing about this route is reachable from the browser without
 * an admin session.
 *
 * Two locks throughout, so the dashboard can't be locked out of itself:
 *   · you cannot change or delete your own account here
 *   · you cannot remove the last remaining admin
 */

const ROLES: AppRole[] = ["admin", "team_member"];

export interface TeamMember {
  id: string;
  email: string;
  full_name: string | null;
  role: AppRole;
  created_at: string;
  last_sign_in_at: string | null;
}

async function guard() {
  const me = await getCurrentRole();
  if (!me) return { error: NextResponse.json({ error: "unauthorized" }, { status: 401 }) };
  if (me.role !== "admin") return { error: NextResponse.json({ error: "forbidden" }, { status: 403 }) };
  return { me };
}

/** Roles keyed by user id, for the whole team (service role bypasses RLS). */
async function roleMap(admin: ReturnType<typeof createServiceClient>) {
  const { data } = await admin.from("profiles").select("id, full_name, role");
  const map = new Map<string, { full_name: string | null; role: AppRole }>();
  for (const p of data ?? []) {
    map.set(p.id as string, { full_name: p.full_name as string | null, role: p.role as AppRole });
  }
  return map;
}

async function adminCount(admin: ReturnType<typeof createServiceClient>): Promise<number> {
  const { count } = await admin.from("profiles").select("id", { count: "exact", head: true }).eq("role", "admin");
  return count ?? 0;
}

export async function GET() {
  const g = await guard();
  if (g.error) return g.error;

  const admin = createServiceClient();
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const roles = await roleMap(admin);
  const users: TeamMember[] = data.users.map((u) => ({
    id: u.id,
    email: u.email ?? "—",
    full_name: roles.get(u.id)?.full_name ?? null,
    role: roles.get(u.id)?.role ?? "team_member",
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at ?? null,
  }));
  users.sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));

  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const g = await guard();
  if (g.error) return g.error;

  let body: { email?: string; password?: string; full_name?: string; role?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  const fullName = (body.full_name ?? "").trim();
  const role = (body.role ?? "team_member") as AppRole;

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 422 });
  }
  if (password.length < 8) return NextResponse.json({ error: "weak_password" }, { status: 422 });
  if (!ROLES.includes(role)) return NextResponse.json({ error: "invalid_role" }, { status: 422 });

  const admin = createServiceClient();
  // Auto-confirm: there is no public signup, so an invitation email would only
  // be a second step between an admin and a colleague who is already expecting
  // the account.
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: fullName ? { full_name: fullName } : undefined,
  });
  if (error) {
    const already = /already|exists|registered/i.test(error.message);
    return NextResponse.json({ error: already ? "email_taken" : error.message }, { status: already ? 409 : 500 });
  }

  // handle_new_user() has created the profile row with full_name; only the
  // role still needs setting, and only when it isn't the default.
  if (data.user && role !== "team_member") {
    await admin.from("profiles").update({ role }).eq("id", data.user.id);
  }

  return NextResponse.json({ ok: true, id: data.user?.id });
}

export async function PATCH(request: Request) {
  const g = await guard();
  if (g.error) return g.error;

  let body: { id?: string; role?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }
  const { id } = body;
  const role = body.role as AppRole;
  if (!id || !ROLES.includes(role)) return NextResponse.json({ error: "invalid_request" }, { status: 422 });
  if (id === g.me.userId) return NextResponse.json({ error: "cannot_change_self" }, { status: 409 });

  const admin = createServiceClient();
  if (role !== "admin") {
    const { data: target } = await admin.from("profiles").select("role").eq("id", id).maybeSingle();
    if (target?.role === "admin" && (await adminCount(admin)) <= 1) {
      return NextResponse.json({ error: "last_admin" }, { status: 409 });
    }
  }

  const { error } = await admin.from("profiles").update({ role }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const g = await guard();
  if (g.error) return g.error;

  let body: { id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }
  const { id } = body;
  if (!id) return NextResponse.json({ error: "invalid_request" }, { status: 422 });
  if (id === g.me.userId) return NextResponse.json({ error: "cannot_delete_self" }, { status: 409 });

  const admin = createServiceClient();
  const { data: target } = await admin.from("profiles").select("role").eq("id", id).maybeSingle();
  if (target?.role === "admin" && (await adminCount(admin)) <= 1) {
    return NextResponse.json({ error: "last_admin" }, { status: 409 });
  }

  // profiles cascades with auth.users; leads.assigned_to is set null.
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
