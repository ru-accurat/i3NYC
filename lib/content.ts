import matter from "gray-matter";
import { readFromBlob, uploadToBlob } from "./blob";

export interface PageContent {
  slug: string;
  frontmatter: Record<string, unknown>;
  body: string;
  raw: string;
}

const CONTENT_PREFIX = "content/";

export async function getPageContent(
  slug: string
): Promise<PageContent | null> {
  const raw = await readFromBlob(`${CONTENT_PREFIX}${slug}.md`);
  if (!raw) return null;
  const { data, content } = matter(raw);
  return { slug, frontmatter: data, body: content, raw };
}

export async function savePageContent(
  slug: string,
  raw: string
): Promise<void> {
  await uploadToBlob(`${CONTENT_PREFIX}${slug}.md`, raw, "text/markdown");
}

export function serializeContent(
  frontmatter: Record<string, unknown>,
  body: string
): string {
  return matter.stringify(body, frontmatter);
}
