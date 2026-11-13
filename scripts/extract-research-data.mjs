// Extracts the inline data constants from a research applet (the standalone
// HTML files Andrea exports) into data/research/<slug>.json, so the React pages
// can be refreshed when a new export arrives without touching components.
//
//   node scripts/extract-research-data.mjs "<applet.html>" <slug> CONST [CONST...]
//
// Example:
//   node scripts/extract-research-data.mjs \
//     "_library/I3NYC-artifacts/NYC University Startup Map.html" \
//     nyc-university-startup-map STAGES GROUPS TOPICS P CASES
//
// The constants are JS literals (unquoted keys, comments), not strict JSON, so
// each one is cut out by bracket matching and evaluated on its own in an empty
// VM context — none of the applet's DOM code runs.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";

const [file, slug, ...names] = process.argv.slice(2);
if (!file || !slug || names.length === 0) {
  console.error('Usage: node scripts/extract-research-data.mjs "<applet.html>" <slug> CONST [CONST...]');
  process.exit(1);
}

const html = readFileSync(file, "utf-8");
const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
const source = scripts.join("\n");

/** Returns the literal that follows `const NAME=`, matched bracket to bracket. */
function sliceLiteral(name) {
  // Matches `const NAME=` and also later declarators in a list (`const A=[..],NAME=[..]`).
  const decl = new RegExp(`(?:\\b(?:const|let|var)\\s+|[\\]}]\\s*,\\s*)${name}\\s*=\\s*(?=[\\[{])`).exec(source);
  if (!decl) throw new Error(`const ${name} not found in ${file}`);
  const start = decl.index + decl[0].length;
  const open = source[start];
  if (open !== "[" && open !== "{") throw new Error(`const ${name} is not an array or object literal`);

  let depth = 0;
  for (let i = start; i < source.length; i++) {
    const c = source[i];
    if (c === '"' || c === "'" || c === "`") {
      // Skip the string, honouring escapes.
      for (i++; i < source.length && source[i] !== c; i++) if (source[i] === "\\") i++;
    } else if (c === "/" && source[i + 1] === "/") {
      while (i < source.length && source[i] !== "\n") i++;
    } else if (c === "/" && source[i + 1] === "*") {
      i = source.indexOf("*/", i + 2) + 1;
    } else if (c === "[" || c === "{") {
      depth++;
    } else if (c === "]" || c === "}") {
      if (--depth === 0) return source.slice(start, i + 1);
    }
  }
  throw new Error(`const ${name}: unbalanced brackets`);
}

const out = {};
for (const name of names) {
  const value = vm.runInNewContext(`(${sliceLiteral(name)})`, Object.create(null), { timeout: 2000 });
  // Round-trip through JSON so anything that is not plain data fails loudly.
  out[name] = JSON.parse(JSON.stringify(value));
  const size = Array.isArray(out[name]) ? `${out[name].length} items` : `${Object.keys(out[name]).length} keys`;
  console.log(`  ${name}: ${size}`);
}

const dir = join(process.cwd(), "data", "research");
mkdirSync(dir, { recursive: true });
const dest = join(dir, `${slug}.json`);
writeFileSync(dest, JSON.stringify(out, null, 2) + "\n");
console.log(`Wrote ${dest}`);
