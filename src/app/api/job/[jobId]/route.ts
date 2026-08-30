import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { checkFalJob } from "@/lib/fal";

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
    select: {
      id: true, status: true, resultS3Url: true,
      outputType: true, prompt: true, createdAt: true,
      falRequestId: true, falModelId: true, falStatusUrl: true,
    },
  });

  if (!job) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // If job is still in-flight, check FAL.ai for the latest status
  if ((job.status === "PENDING" || job.status === "PROCESSING") && job.falRequestId && job.falModelId) {
    try {
      const fal = await checkFalJob(job.falModelId, job.falRequestId, job.falStatusUrl);
      console.log(`[job ${job.id}] FAL status: ${fal.status}`, fal.resultUrl ?? "");

      const statusMap: Record<string, string> = {
        IN_QUEUE: "PENDING", IN_PROGRESS: "PROCESSING",
        COMPLETED: "COMPLETED", FAILED: "FAILED",
      };
      const newStatus = statusMap[fal.status] ?? job.status;

      if (newStatus !== job.status || fal.resultUrl) {
        await prisma.generationJob.update({
          where: { id: job.id },
          data: {
            status: newStatus,
            ...(fal.resultUrl ? { resultS3Url: fal.resultUrl } : {}),
          },
        });
        return NextResponse.json({
          ...job,
          status: newStatus,
          resultS3Url: fal.resultUrl ?? job.resultS3Url,
        });
      }
    } catch (err) {
      console.error(`[job ${job.id}] FAL check failed:`, err instanceof Error ? err.message : err);
    }
  }

  return NextResponse.json(job);
}
