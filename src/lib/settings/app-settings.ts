import { createServiceClient } from "@/lib/supabase/server";

/** Tiny key/value store on app_settings. Reads fail soft (return fallback). */

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return fallback;
  try {
    const supabase = createServiceClient();
    const { data } = await supabase.from("app_settings").select("value").eq("key", key).maybeSingle();
    return data ? (data.value as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function setSetting(key: string, value: unknown): Promise<boolean> {
  try {
    const supabase = createServiceClient();
    const { error } = await supabase
      .from("app_settings")
      .upsert({ key, value, updated_at: new Date().toISOString() });
    return !error;
  } catch {
    return false;
  }
}
