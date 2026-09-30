import { get } from "@vercel/blob";
import { readdirSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

// Downloads the live content JSONs from Vercel Blob (the source of truth,
// which may contain inline admin edits) into the given directory.
// Usage: BLOB_READ_WRITE_TOKEN=... npx tsx scripts/pull-blob.ts [outDir=content]

const CONTENT_DIR = join(process.cwd(), "content");
const outDir = process.argv[2] ?? CONTENT_DIR;

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error(
    "Missing BLOB_READ_WRITE_TOKEN. Run `vercel env pull .env.local` or set it in your shell, then retry."
  );
  process.exit(1);
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".json"));
  for (const f of files) {
    const result = await get(`content/${f}`, { access: "private" });
    if (!result) {
      console.log(`  ✗ content/${f} not found in Blob`);
      continue;
    }
    const text = await new Response(result.stream).text();
    let out = text;
    try {
      out = JSON.stringify(JSON.parse(text), null, 2) + "\n";
    } catch {
      console.log(`  ⚠ content/${f} is not valid JSON — saved raw`);
    }
    writeFileSync(join(outDir, f), out);
    console.log(`  ✓ content/${f} → ${join(outDir, f)}`);
  }
}

main();
