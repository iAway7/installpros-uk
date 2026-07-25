import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB per photo
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Accepts one property photo per request (multipart). Uploads to the private
 * `property-photos` bucket and records a lead_photos row so the dashboard can
 * show thumbnails and a "sent photos" flag. Without Supabase configured (or
 * without a persisted lead id), the request is accepted so the funnel UX
 * still works end-to-end in local/dev.
 */
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "no_file" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "too_large" }, { status: 413 });
    }
    const contentType = file.type || "application/octet-stream";
    if (!ALLOWED.includes(contentType)) {
      return NextResponse.json({ error: "unsupported_type" }, { status: 415 });
    }

    const leadId = String(form.get("lead_id") || "");
    const hasSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Dev fallback / local_* lead ids: accept without persisting.
    if (!hasSupabase || !UUID_RE.test(leadId)) {
      return NextResponse.json({ ok: true, persisted: false, name: file.name, size: file.size });
    }

    const supabase = createServiceClient();

    // Verify the lead exists before attaching anything to it.
    const { data: lead } = await supabase.from("leads").select("id").eq("id", leadId).single();
    if (!lead) return NextResponse.json({ error: "lead_not_found" }, { status: 404 });

    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5) || "jpg";
    const path = `${leadId}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("property-photos")
      .upload(path, Buffer.from(await file.arrayBuffer()), { contentType, upsert: false });
    if (uploadError) throw uploadError;

    const { error: rowError } = await supabase.from("lead_photos").insert({
      lead_id: leadId,
      path,
      content_type: contentType,
      size_bytes: file.size,
    });
    if (rowError) throw rowError;

    return NextResponse.json({ ok: true, persisted: true, path });
  } catch {
    return NextResponse.json({ error: "upload_failed" }, { status: 500 });
  }
}
