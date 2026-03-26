import { NextRequest, NextResponse } from "next/server";
import { getPageContent, savePageContent } from "@/lib/content";
import { isAdmin } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const content = await getPageContent(slug);
  if (!content)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    raw: content.raw,
    frontmatter: content.frontmatter,
    body: content.body,
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = await params;
  const { raw } = await req.json();
  await savePageContent(slug, raw);
  return NextResponse.json({ ok: true });
}
