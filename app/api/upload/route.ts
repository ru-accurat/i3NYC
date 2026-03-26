import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { isAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file)
    return NextResponse.json({ error: "No file" }, { status: 400 });
  const blob = await put(`images/${file.name}`, file, { access: "public" });
  return NextResponse.json({ url: blob.url });
}
