export const dynamic = "force-dynamic";

import { PageShell } from "@/components/editor/page-shell";
import { getPageData } from "@/lib/content";
import { isAdmin } from "@/lib/auth";
import { migratePageData } from "@/lib/migrate-page";
import seed from "@/content/projects-cooperation.json";

// Fallback when Blob is unavailable: the same file that seeds it, so the two cannot drift apart.
const DEFAULT_DATA = seed as Record<string, unknown>;

export default async function ProjectsCooperationPage() {
  const raw = (await getPageData("projects-cooperation")) ?? DEFAULT_DATA;
  const data = migratePageData("projects-cooperation", raw);
  const admin = await isAdmin();

  return (
    <PageShell slug="projects-cooperation" data={data} isAdmin={admin} />
  );
}
