import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

interface VariantInput {
  key: string;
  name: string;
  is_control?: boolean;
  allocation?: number;
  config?: Record<string, unknown>;
}
interface CreateBody {
  name: string;
  key: string;
  hypothesis?: string;
  primary_metric?: string;
  variants: VariantInput[];
}

async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, status: 401 };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return { ok: false as const, status: 403 };
  return { ok: true as const };
}

/** Create an experiment + its variants (admin only). Starts in "draft". */
export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: "forbidden" }, { status: gate.status });

  let body: CreateBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  if (!body.name?.trim() || !body.key?.trim() || !Array.isArray(body.variants) || body.variants.length < 2) {
    return NextResponse.json({ error: "need a name, key and at least two variants" }, { status: 422 });
  }

  const admin = createServiceClient();
  const { data: exp, error: expErr } = await admin
    .from("experiments")
    .insert({
      key: body.key.trim(),
      name: body.name.trim(),
      hypothesis: body.hypothesis?.trim() || null,
      primary_metric: body.primary_metric || "lead_created",
      status: "draft",
    })
    .select("id")
    .single();

  if (expErr || !exp) {
    return NextResponse.json({ error: expErr?.message ?? "create_failed" }, { status: 500 });
  }

  const rows = body.variants.map((v, i) => ({
    experiment_id: exp.id,
    key: v.key?.trim() || `variant_${i}`,
    name: v.name?.trim() || `Variant ${i + 1}`,
    is_control: Boolean(v.is_control),
    allocation: typeof v.allocation === "number" ? v.allocation : 1 / body.variants.length,
    config: v.config ?? {},
  }));
  const { error: varErr } = await admin.from("experiment_variants").insert(rows);
  if (varErr) return NextResponse.json({ error: varErr.message }, { status: 500 });

  return NextResponse.json({ id: exp.id });
}
