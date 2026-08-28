import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { jobId } = await params;

  const job = await prisma.generationJob.findFirst({
    where: { id: jobId, userId: session.user.id },
    select: { id: true, status: true, resultS3Url: true, outputType: true, prompt: true, createdAt: true },
  });

  if (!job) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(job);
}
