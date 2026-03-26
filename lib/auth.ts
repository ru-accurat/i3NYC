import { cookies } from "next/headers";

const SESSION_COOKIE = "i3nyc_session";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days

async function sign(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return `${payload}.${Buffer.from(sig).toString("base64url")}`;
}

async function verify(token: string, secret: string): Promise<string | null> {
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex === -1) return null;
  const payload = token.slice(0, dotIndex);
  const expected = await sign(payload, secret);
  return expected === token ? payload : null;
}

export async function createSession(): Promise<void> {
  const secret = process.env.SESSION_SECRET!;
  const token = await sign(`admin:${Date.now()}`, secret);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });
}

export async function isAdmin(): Promise<boolean> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return (await verify(token, secret)) !== null;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
