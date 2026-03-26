import { NextRequest, NextResponse } from "next/server";
import { getPageData, savePageData } from "@/lib/content";
import { isAdmin } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const data = await getPageData(slug);
  if (!data)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = await params;
  const data = await req.json();
  if (!data || typeof data !== "object" || Array.isArray(data))
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  await savePageData(slug, data);
  return NextResponse.json({ ok: true });
}
