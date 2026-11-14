export const dynamic = "force-dynamic";

import { PageShell } from "@/components/editor/page-shell";
import { getPageData } from "@/lib/content";
import { isAdmin } from "@/lib/auth";
import { migratePageData } from "@/lib/migrate-page";
import seed from "@/content/contact-us.json";

// Fallback when Blob is unavailable: the same file that seeds it, so the two cannot drift apart.
const DEFAULT_DATA = seed as Record<string, unknown>;

export default async function ContactPage() {
  const raw = (await getPageData("contact-us")) ?? DEFAULT_DATA;
  const data = migratePageData("contact-us", raw);
  const admin = await isAdmin();

  return <PageShell slug="contact-us" data={data} isAdmin={admin} />;
}
