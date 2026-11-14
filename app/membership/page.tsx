export const dynamic = "force-dynamic";

import { PageShell } from "@/components/editor/page-shell";
import { getPageData } from "@/lib/content";
import { isAdmin } from "@/lib/auth";
import { migratePageData } from "@/lib/migrate-page";
import seed from "@/content/membership.json";

// Fallback when Blob is unavailable: the same file that seeds it, so the two cannot drift apart.
const DEFAULT_DATA = seed as Record<string, unknown>;

export default async function MembershipPage() {
  const raw = (await getPageData("membership")) ?? DEFAULT_DATA;
  const data = migratePageData("membership", raw);
  const admin = await isAdmin();

  return <PageShell slug="membership" data={data} isAdmin={admin} />;
}
