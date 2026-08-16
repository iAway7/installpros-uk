/**
 * Guards the two failure modes that make a token silently stop working. Both
 * compile, both pass lint, and both are only visible by looking at the screen —
 * which is how a whole type scale shipped doing nothing.
 *
 *   1. A fontSize key exists in tailwind.config but not in cn()'s tailwind-merge
 *      config. tailwind-merge resolves `text-*` from its own table; a key it has
 *      not seen is guessed as a colour, so the size class gets deduplicated away
 *      the moment a colour class sits beside it.
 *
 *   2. A `text-{token}` class does not survive cn() next to a colour. This is
 *      the observable consequence of (1), asserted directly rather than inferred.
 *
 *   node scripts/check-tokens.mjs
 */
import { readFileSync } from "node:fs";
import { cn } from "../src/lib/utils.ts";

const fail = [];

const config = readFileSync("tailwind.config.ts", "utf8");
const utils = readFileSync("src/lib/utils.ts", "utf8");

/** Keys inside the fontSize block, minus Tailwind's own scale. */
const fontSizeBlock = /fontSize:\s*\{([\s\S]*?)\n\s{6}\},/.exec(config)?.[1] ?? "";
const CORE = new Set(["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl", "9xl"]);
const declared = [...fontSizeBlock.matchAll(/^\s*"?([a-z0-9-]+)"?:/gm)]
  .map((m) => m[1])
  .filter((k) => !CORE.has(k));

const registered = /"font-size":\s*\[\{\s*text:\s*\[([^\]]*)\]/.exec(utils)?.[1] ?? "";
const known = new Set([...registered.matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]));

for (const key of declared) {
  if (!known.has(key)) {
    fail.push(`fontSize "${key}" is in tailwind.config but not registered in cn(). ` +
              `text-${key} will be dropped whenever a colour class sits beside it.`);
  }
}

for (const key of declared) {
  const out = cn(`text-${key}`, "text-primary-foreground");
  if (!out.includes(`text-${key}`)) {
    fail.push(`cn() drops text-${key} next to a colour class — the element will inherit its parent's size.`);
  }
}

// The dedup we DO want must still work, or every size becomes sticky.
if (cn("text-body", "text-lead") !== "text-lead") {
  fail.push("cn() no longer lets one size override another — text-body and text-lead both survived.");
}

if (fail.length) {
  console.error("✗ token check failed\n");
  for (const f of fail) console.error(`  ${f}`);
  process.exit(1);
}
console.log(`✓ ${declared.length} type-scale keys registered and surviving cn()`);
