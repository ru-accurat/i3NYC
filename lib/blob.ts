import { put, get } from "@vercel/blob";

export async function uploadToBlob(
  pathname: string,
  body: string | Buffer | ReadableStream,
  contentType?: string
) {
  const blob = await put(pathname, body, {
    access: "private",
    contentType: contentType ?? "text/plain",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return blob.url;
}

export async function readFromBlob(
  pathname: string
): Promise<string | null> {
  try {
    const result = await get(pathname, { access: "private" });
    if (!result) return null;
    const text = await new Response(result.stream).text();
    return text;
  } catch {
    // Token not available (e.g. during build) — return null gracefully
    return null;
  }
}
