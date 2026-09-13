/**
 * Load Ofcom Connected Nations fixed coverage into `ofcom_postcode_coverage`.
 *
 * One-off (annual) job. Run it from your own terminal, not from the sandbox:
 *
 *   node scripts/load-ofcom-postcode-coverage.mjs \
 *     "../202601_fixed_broadband_coverage_and_full_fibre_take-up-r1.zip"
 *
 * Reads the per-area CSVs under 202601_fixed_pc_coverage/postcode_files_r2/
 * straight out of the ZIP (via `unzip -p`, no temp files, no extra deps) and
 * upserts them in batches. Idempotent: rerun it for the next release and every
 * row is overwritten in place.
 *
 * Ofcom publishes percentages of premises per speed band rather than a single
 * max speed, so that is what we store. "82% of premises here can't get 30
 * Mbit/s" is both more honest and a better sales line than an estimated max.
 */

import { createClient } from "@supabase/supabase-js";
import { execFile, execFileSync } from "node:child_process";
import { createInterface } from "node:readline";
import { readFileSync } from "node:fs";

const ZIP = process.argv[2];
if (!ZIP) {
  console.error("Usage: node scripts/load-ofcom-postcode-coverage.mjs <path-to-ofcom-zip>");
  process.exit(1);
}

// ── env (.env.local, same file Next reads) ───────────────────────────────
const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// ── locate the postcode-level CSVs inside the ZIP ────────────────────────
const listing = execFileSync("unzip", ["-Z1", ZIP], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
const entries = listing.split("\n").filter((n) => /postcode_files_r2\/.*\.csv$/i.test(n));
if (!entries.length) {
  console.error("No postcode-level CSVs found. Expected files under postcode_files_r2/.");
  process.exit(1);
}
// "202601_fixed_pc_coverage" → release "202601"
const release = (ZIP.match(/(\d{6})/) ?? ["", "unknown"])[1];
console.log(`${entries.length} area files, release ${release}`);

/** Header name → index, tolerant of the BOM and of spacing changes. */
function columnIndex(header) {
  const cols = header.replace(/^﻿/, "").split(",").map((c) => c.trim().toLowerCase());
  const find = (re) => {
    const i = cols.findIndex((c) => re.test(c));
    if (i === -1) throw new Error(`Column not found: ${re}`);
    return i;
  };
  return {
    postcode: find(/^postcode$/),
    pct300: find(/>=\s*300mbit\/s download/),
    sfbb: find(/^sfbb availability/),
    gigabit: find(/^gigabit availability/),
    unable10: find(/unable to receive 10mbit/),
    unable30: find(/unable to receive 30mbit/),
  };
}

const pct = (v) => {
  const n = Math.round(parseFloat(v));
  return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : null;
};

const BATCH = 2000;
let total = 0;
let failed = 0;

async function flush(rows) {
  if (!rows.length) return;
  const { error } = await supabase.from("ofcom_postcode_coverage").upsert(rows, { onConflict: "postcode" });
  if (error) {
    failed += rows.length;
    console.error(`  batch failed: ${error.message}`);
  } else {
    total += rows.length;
  }
}

/** Stream one CSV out of the ZIP without extracting it to disk. */
function readEntry(entry, onLine) {
  return new Promise((resolve, reject) => {
    const child = execFile("unzip", ["-p", ZIP, entry], { maxBuffer: 1024 * 1024 * 1024 });
    const rl = createInterface({ input: child.stdout, crlfDelay: Infinity });
    rl.on("line", onLine);
    rl.on("close", resolve);
    child.on("error", reject);
  });
}

for (const [n, entry] of entries.entries()) {
  const area = entry.split("/").pop();
  let cols = null;
  let rows = [];
  const pending = [];

  await readEntry(entry, (line) => {
    if (!line.trim()) return;
    if (!cols) {
      cols = columnIndex(line);
      return;
    }
    const f = line.split(",");
    const postcode = (f[cols.postcode] ?? "").replace(/\s+/g, "").toUpperCase();
    if (!postcode) return;
    rows.push({
      postcode,
      pct_300plus: pct(f[cols.pct300]),
      pct_sfbb: pct(f[cols.sfbb]),
      pct_gigabit: pct(f[cols.gigabit]),
      pct_unable_10: pct(f[cols.unable10]),
      pct_unable_30: pct(f[cols.unable30]),
      release,
    });
    if (rows.length >= BATCH) {
      pending.push(rows);
      rows = [];
    }
  });
  if (rows.length) pending.push(rows);

  // Upload this area's batches sequentially: parallel writes to the same table
  // buy nothing and make a failure harder to read.
  for (const batch of pending) await flush(batch);
  console.log(`[${n + 1}/${entries.length}] ${area} → ${total.toLocaleString("en-GB")} rows loaded`);
}

console.log(`\nDone. ${total.toLocaleString("en-GB")} postcodes loaded${failed ? `, ${failed} failed` : ""}.`);
