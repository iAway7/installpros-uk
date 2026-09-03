import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { setSetting } from "@/lib/settings/app-settings";
import { isAdmin } from "@/lib/auth/role";

export const runtime = "nodejs";

/** Toggle keys the UI may flip — nothing else is writable through this route. */
const ALLOWED_KEYS = ["propalt_enabled"];

export async function PATCH(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  // Signed in is not enough: flipping these spends credits.
  if (!(await isAdmin())) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  let body: { key?: string; value?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  if (!body.key || !ALLOWED_KEYS.includes(body.key) || typeof body.value !== "boolean") {
    return NextResponse.json({ error: "invalid_toggle" }, { status: 422 });
  }

  const ok = await setSetting(body.key, body.value);
  if (!ok) return NextResponse.json({ error: "save_failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
