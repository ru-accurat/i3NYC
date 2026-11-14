export const dynamic = "force-dynamic";

import { PageShell } from "@/components/editor/page-shell";
import { getPageData } from "@/lib/content";
import { isAdmin } from "@/lib/auth";
import { migratePageData } from "@/lib/migrate-page";
import seed from "@/content/home.json";

// Fallback when Blob is unavailable: the same file that seeds it, so the two cannot drift apart.
const DEFAULT_DATA = seed as Record<string, unknown>;

export default async function HomePage() {
  const raw = (await getPageData("home")) ?? DEFAULT_DATA;
  const data = migratePageData("home", raw);
  const admin = await isAdmin();

  return <PageShell slug="home" data={data} isAdmin={admin} />;
}
