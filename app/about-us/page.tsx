export const dynamic = "force-dynamic";

import { PageShell } from "@/components/editor/page-shell";
import { getPageData } from "@/lib/content";
import { isAdmin } from "@/lib/auth";
import { migratePageData } from "@/lib/migrate-page";
import seed from "@/content/about-us.json";

// Fallback when Blob is unavailable: the same file that seeds it, so the two cannot drift apart.
const DEFAULT_DATA = seed as Record<string, unknown>;

export default async function AboutPage() {
  const raw = (await getPageData("about-us")) ?? DEFAULT_DATA;
  const data = migratePageData("about-us", raw);
  const admin = await isAdmin();

  return <PageShell slug="about-us" data={data} isAdmin={admin} />;
}
