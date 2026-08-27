#!/usr/bin/env node
/**
 * Seeds the trustpilot_reviews table from a JSON file.
 *
 * Trustpilot's webhooks only fire on new activity and we have no API key, so
 * the first batch of reviews has to be copied by hand from the business portal
 * (Manage reviews). After this runs once, the webhook keeps the table current.
 *
 *   node scripts/seed-trustpilot-reviews.mjs src/data/trustpilot-seed.json
 *   node scripts/seed-trustpilot-reviews.mjs src/data/trustpilot-seed.json --count 303 --score 4.8
 *
 * Each entry needs: id, stars, text, consumer_name, created_at (YYYY-MM-DD or
 * ISO), is_verified. `title` and `link` are optional.
 *
 * IMPORTANT — is_verified must be read off each review in Trustpilot, not
 * guessed. It drives the seal we show on the card, and a seal we invented is a
 * claim Trustpilot never made. When in doubt, set it to false.
 *
 * Re-running is safe: rows are upserted on id.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

/** Minimal .env.local reader — no dotenv dependency in this project. */
function loadEnv() {
  try {
    for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* fall back to the ambient environment */
  }
}

function fail(msg) {
  console.error(`\n  ✗ ${msg}\n`);
  process.exit(1);
}

loadEnv();

const file = process.argv[2];
if (!file) fail("Usage: node scripts/seed-trustpilot-reviews.mjs <file.json> [--count N] [--score N]");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) fail("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");

const argOf = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? Number(process.argv[i + 1]) : null;
};
const count = argOf("count");
const score = argOf("score");

let entries;
try {
  entries = JSON.parse(readFileSync(file, "utf8"));
} catch (err) {
  fail(`Could not read ${file}: ${err.message}`);
}
if (!Array.isArray(entries) || !entries.length) fail("The file must be a non-empty JSON array");

const pending = entries.filter((e) => e._todo);
if (pending.length) {
  fail(
    `${pending.length} entr${pending.length === 1 ? "y is" : "ies are"} still marked _todo (truncated text):\n` +
      pending.map((e) => `      · ${e.consumer_name}`).join("\n") +
      "\n    Paste the full review text from Trustpilot and remove the _todo key.",
  );
}

const rows = entries.map((e, i) => {
  const missing = ["id", "stars", "text", "consumer_name", "created_at"].filter((k) => !e[k]);
  if (missing.length) fail(`Entry ${i + 1} is missing: ${missing.join(", ")}`);
  if (typeof e.is_verified !== "boolean") {
    fail(`Entry ${i + 1} ("${e.consumer_name}") needs an explicit is_verified true/false`);
  }
  const created = new Date(e.created_at);
  if (Number.isNaN(created.getTime())) fail(`Entry ${i + 1} has an unreadable created_at: ${e.created_at}`);

  return {
    id: String(e.id),
    stars: Math.max(1, Math.min(5, Math.round(Number(e.stars)))),
    title: e.title ?? null,
    text: String(e.text).trim(),
    consumer_name: String(e.consumer_name).trim(),
    language: e.language ?? "en",
    link: e.link ?? null,
    is_verified: e.is_verified,
    created_at: created.toISOString(),
    source: "seed",
    deleted_at: null,
    raw: e,
    synced_at: new Date().toISOString(),
  };
});

const supabase = createClient(url, key, { auth: { persistSession: false } });

const { error } = await supabase.from("trustpilot_reviews").upsert(rows, { onConflict: "id" });
if (error) fail(`Upsert failed: ${error.message}`);

console.log(`\n  ✓ Seeded ${rows.length} reviews (${rows.filter((r) => r.is_verified).length} verified)`);

if (count !== null || score !== null) {
  const { data: existing } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "trustpilot_stats")
    .maybeSingle();
  const value = {
    ...(existing?.value ?? {}),
    ...(count !== null ? { count } : {}),
    ...(score !== null ? { score } : {}),
  };
  const { error: sErr } = await supabase
    .from("app_settings")
    .upsert({ key: "trustpilot_stats", value, updated_at: new Date().toISOString() });
  if (sErr) fail(`Could not write trustpilot_stats: ${sErr.message}`);
  console.log(`  ✓ trustpilot_stats = ${JSON.stringify(value)}`);
}

console.log("");
