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
import { readdirSync } from "node:fs";
import { cn } from "../src/lib/utils.ts";

const fail = [];

const config = readFileSync("tailwind.config.ts", "utf8");
const utils = readFileSync("src/lib/utils.ts", "utf8");

/** Keys inside the fontSize block, minus Tailwind's own scale. */
const fontSizeBlock = /fontSize:\s*\{([\s\S]*?)\n\s{6}\},/.exec(config)?.[1] ?? "";
const heightBlock = /\n\s{6}height:\s*\{([\s\S]*?)\n\s{6}\},/.exec(config)?.[1] ?? "";
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

// Same two checks for the control ladder. h-* is the group tailwind-merge is
// most likely to guess wrong, because its own table only knows h-{number}.
const heights = [...heightBlock.matchAll(/^\s*"?([a-z0-9-]+)"?:/gm)].map((m) => m[1]);
const knownH = new Set([...(/\bh:\s*\[\{\s*h:\s*\[([^\]]*)\]/.exec(utils)?.[1] ?? "")
  .matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]));
for (const key of heights) {
  if (!knownH.has(key)) fail.push(`height "${key}" is in tailwind.config but not registered in cn().`);
  if (!cn(`h-${key}`, "h-10").includes("h-10")) fail.push(`cn() mishandles h-${key} against a core height.`);
  if (cn(`h-10`, `h-${key}`) !== `h-${key}`) fail.push(`cn() does not let h-${key} override a core height.`);
}

// A fontSize key that also exists as a colour is the nastiest of these,
// because it does not drop anything — it emits two rules under one class
// name and the sheet order decides. `text-field` set a font size AND a
// colour, so every Select that did not also pass text-foreground rendered
// its value in border-grey and read as disabled.
const colourBlock = /colors:\s*\{([\s\S]*?)\n\s{6}\},/.exec(config)?.[1] ?? "";
const colours = new Set([...colourBlock.matchAll(/^\s{8}"?([a-z0-9-]+)"?:/gm)].map((m) => m[1]));
for (const key of declared) {
  if (colours.has(key)) {
    fail.push(`"${key}" is both a fontSize and a colour. Tailwind builds text-${key} ` +
              `from both, so it emits two rules under one class name and sheet order ` +
              `picks the winner. Rename one of them.`);
  }
}

// Motion durations. tailwind-merge only knows duration-{number}, so a named
// one is guessed as a different group and two durations can survive together —
// the element then gets whichever CSS rule happens to win, not the last class.
const durBlock = /transitionDuration:\s*\{([\s\S]*?)\n\s{6}\},/.exec(config)?.[1] ?? "";
const durations = [...durBlock.matchAll(/^\s*"?([a-z0-9-]+)"?:/gm)].map((m) => m[1]);
const knownD = new Set([...(/\bduration:\s*\[\{\s*duration:\s*\[([^\]]*)\]/.exec(utils)?.[1] ?? "")
  .matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]));
for (const key of durations) {
  if (!knownD.has(key)) fail.push(`transitionDuration "${key}" is in tailwind.config but not registered in cn().`);
  if (cn("duration-200", `duration-${key}`) !== `duration-${key}`) {
    fail.push(`cn() does not let duration-${key} override a core duration — both survive.`);
  }
}

// Elevation. Same tailwind-merge trap as the durations: a named shadow it has
// not seen is sorted elsewhere, so shadow-sm and shadow-overlay can both
// survive and the element gets whichever rule wins, not the last class.
const shadowBlock = /boxShadow:\s*\{([\s\S]*?)\n\s{6}\},/.exec(config)?.[1] ?? "";
const shadows = [...shadowBlock.matchAll(/^\s*"?([a-z0-9-]+)"?:/gm)].map((m) => m[1]);
const knownS = new Set([...(/\bshadow":?\s*\[\{\s*shadow:\s*\[([^\]]*)\]/.exec(utils)?.[1] ?? "")
  .matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]));
for (const key of shadows) {
  if (!knownS.has(key)) fail.push(`boxShadow "${key}" is in tailwind.config but not registered in cn().`);
  if (cn("shadow-sm", `shadow-${key}`) !== `shadow-${key}`) {
    fail.push(`cn() does not let shadow-${key} override a core shadow — both survive.`);
  }
}

// The type tokens carry their own line-height, and tailwind-merge lists
// `leading` as a group that `font-size` conflicts with. So `leading-relaxed
// text-body` silently loses the leading while `text-body leading-relaxed`
// keeps it. Nothing in the CSS or the types says so — the only symptom is
// paragraph spacing that looks wrong. Assert the order in source.
const ORDER = /leading-(?:relaxed|tight|snug|loose|none|\[[0-9.]+\])[^"'`]{0,70}?\btext-(?:micro|label|caption|body-sm|body|field|lead|title)\b/;
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(`${dir}/${e.name}`) : e.name.endsWith(".tsx") ? [`${dir}/${e.name}`] : []);
let scanned = 0;
for (const file of walk("src")) {
  scanned++;
  readFileSync(file, "utf8").split("\n").forEach((line, i) => {
    if (ORDER.test(line)) {
      fail.push(`${file}:${i + 1} puts leading-* before a type token. ` +
                `cn() will drop the leading — put it after the text-* class.`);
    }
  });
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
console.log(`✓ ${declared.length} type sizes, ${heights.length} heights, ${durations.length} durations, ${shadows.length} shadows OK · no size/colour name clashes · leading order clean in ${scanned} files`);
