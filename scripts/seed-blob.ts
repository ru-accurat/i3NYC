import { put } from "@vercel/blob";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const CONTENT_DIR = join(process.cwd(), "content");

async function seed() {
  const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".json"));

  console.log(`Seeding ${files.length} content files to Vercel Blob...`);

  for (const file of files) {
    const content = readFileSync(join(CONTENT_DIR, file), "utf-8");
    const pathname = `content/${file}`;

    const blob = await put(pathname, content, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    });

    console.log(`  ✓ ${pathname} → ${blob.url}`);
  }

  console.log("Done!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
