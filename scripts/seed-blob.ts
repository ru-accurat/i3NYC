import { put } from "@vercel/blob";
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const CONTENT_DIR = join(process.cwd(), "content");

async function seed() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error(
      "Missing BLOB_READ_WRITE_TOKEN. Run `vercel env pull .env.local` or set it in your shell, then retry."
    );
    process.exit(1);
  }

  // Optional: name the files to seed (e.g. `npm run seed -- events-programs.json`)
  // so one page can be updated without overwriting live edits to the others.
  const only = process.argv.slice(2);
  const files = readdirSync(CONTENT_DIR).filter((f) => {
    if (!f.endsWith(".json")) return false;
    if (only.length > 0 && !only.includes(f)) return false;
    return statSync(join(CONTENT_DIR, f)).isFile();
  });
  if (only.length > 0 && files.length !== only.length) {
    console.error(`Not found in content/: ${only.filter((f) => !files.includes(f)).join(", ")}`);
    process.exit(1);
  }

  console.log(`Seeding ${files.length} content files to Vercel Blob (private, overwrite)...`);

  for (const file of files) {
    const content = readFileSync(join(CONTENT_DIR, file), "utf-8");
    const pathname = `content/${file}`;

    const blob = await put(pathname, content, {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    console.log(`  ✓ ${pathname} → ${blob.url}`);
  }

  console.log("Done.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
