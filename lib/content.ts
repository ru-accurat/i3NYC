import { readFromBlob, uploadToBlob } from "./blob";

const CONTENT_PREFIX = "content/";

export async function getPageData(
  slug: string
): Promise<Record<string, unknown> | null> {
  const raw = await readFromBlob(`${CONTENT_PREFIX}${slug}.json`);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function savePageData(
  slug: string,
  data: Record<string, unknown>
): Promise<void> {
  await uploadToBlob(
    `${CONTENT_PREFIX}${slug}.json`,
    JSON.stringify(data, null, 2),
    "application/json"
  );
}
