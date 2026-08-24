import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { timingSafeEqual } from "node:crypto";

const VALID_STATUSES = new Set(["PROCESSING", "COMPLETED", "FAILED"]);

function verifyWorkerSecret(req: NextRequest): boolean {
  const secret = process.env.WORKER_CALLBACK_SECRET;
  const provided = req.headers.get("x-worker-secret");
  if (!secret || !provided) return false;
  if (secret.length !== provided.length) return false;
  return timingSafeEqual(Buffer.from(secret), Buffer.from(provided));
}

export async function POST(req: NextRequest) {
  if (!verifyWorkerSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { jobId?: string; status?: string; resultS3Url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { jobId, status, resultS3Url } = body;

  if (!jobId || !status || !VALID_STATUSES.has(status)) {
    return NextResponse.json({ error: "Missing or invalid jobId / status" }, { status: 400 });
  }

  const job = await prisma.generationJob.findUnique({ where: { id: jobId } });
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  await prisma.generationJob.update({
    where: { id: jobId },
    data: {
      status,
      ...(resultS3Url ? { resultS3Url } : {}),
    },
  });

  return NextResponse.json({ ok: true, jobId, status });
}
