import { NextRequest, NextResponse } from "next/server";
import { recordPageView } from "@/lib/adminData";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const path = typeof body?.path === "string" ? body.path.slice(0, 200) : null;
  if (path) await recordPageView(path);
  return NextResponse.json({ ok: true });
}
