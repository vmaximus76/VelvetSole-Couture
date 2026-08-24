"use server";

import { z } from "zod";
import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { getRedis } from "@/lib/redis";

const QUEUE_KEY = "render-jobs:queue";
const UPLOAD_ROLES = new Set(["CREATOR", "ADMIN"]);

const enqueueSchema = z.object({
  baseVideoId: z.string().uuid(),
  config: z.object({
    stylePreset: z.string().trim().min(1),
    skinTone: z.string().trim().optional(),
    outputResolution: z.enum(["1080p", "4k"]).default("1080p"),
  }),
});

export async function enqueueRenderJob(input: z.infer<typeof enqueueSchema>) {
  const session = await auth();
  if (!session?.user || !UPLOAD_ROLES.has(session.user.role)) {
    throw new Error("Forbidden");
  }

  const parsed = enqueueSchema.parse(input);

  // Verify the base video belongs to the caller's tenant
  const baseVideo = await prisma.baseVideo.findFirst({
    where: { id: parsed.baseVideoId, tenantId: session.user.tenantId },
  });
  if (!baseVideo) throw new Error("Base video not found");

  const job = await prisma.renderJob.create({
    data: {
      userId: session.user.id,
      baseVideoId: parsed.baseVideoId,
      status: "PENDING",
      parameters: parsed.config,
    },
  });

  const redis = getRedis();
  await redis.rpush(
    QUEUE_KEY,
    JSON.stringify({ jobId: job.id, videoId: parsed.baseVideoId, config: parsed.config }),
  );

  return { jobId: job.id, status: job.status };
}

export async function getRenderJob(jobId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  return prisma.renderJob.findFirst({
    where: { id: jobId, userId: session.user.id },
    select: { id: true, status: true, resultS3Url: true, createdAt: true },
  });
}
