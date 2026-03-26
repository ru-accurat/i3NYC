import { put, list } from "@vercel/blob";

export async function uploadToBlob(
  pathname: string,
  body: string | Buffer | ReadableStream,
  contentType?: string
) {
  const blob = await put(pathname, body, {
    access: "public",
    contentType: contentType ?? "text/plain",
    addRandomSuffix: false,
  });
  return blob.url;
}

export async function readFromBlob(
  pathname: string
): Promise<string | null> {
  const { blobs } = await list({ prefix: pathname, limit: 1 });
  const match = blobs.find((b) => b.pathname === pathname);
  if (!match) return null;
  const res = await fetch(match.url, { next: { revalidate: 0 } });
  return res.text();
}
