export const dynamic = "force-dynamic";

import { PageShell } from "@/components/editor/page-shell";
import { getPageData } from "@/lib/content";
import { isAdmin } from "@/lib/auth";
import { migratePageData } from "@/lib/migrate-page";
import seed from "@/content/events-programs.json";

// Fallback when Blob is unavailable: the same file that seeds it, so the two cannot drift apart.
const DEFAULT_DATA = seed as Record<string, unknown>;

export default async function EventsPage() {
  const raw = (await getPageData("events-programs")) ?? DEFAULT_DATA;
  const data = migratePageData("events-programs", raw);
  const admin = await isAdmin();

  return <PageShell slug="events-programs" data={data} isAdmin={admin} />;
}
