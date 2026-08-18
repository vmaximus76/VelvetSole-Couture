import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { createUploadUrl, buildObjectKey } from "@/lib/s3";

const UPLOAD_ROLES = new Set(["CREATOR", "ADMIN"]);
const ALLOWED_CATEGORIES = new Set(["base", "thumbnail"]);

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !UPLOAD_ROLES.has(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json()) as { filename?: string; contentType?: string; category?: string };
  if (!body.filename || !body.contentType) {
    return NextResponse.json({ error: "Missing filename or contentType" }, { status: 400 });
  }

  const category = ALLOWED_CATEGORIES.has(body.category ?? "") ? (body.category as "base" | "thumbnail") : "base";

  const key = buildObjectKey(session.user.tenantId, category, body.filename);
  const uploadUrl = await createUploadUrl(key, body.contentType);

  return NextResponse.json({ uploadUrl, key });
}
