"use server";

import { z } from "zod";
import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { getRedis } from "@/lib/redis";

const QUEUE_KEY = "render-jobs:queue";
const ALLOWED_ROLES = new Set(["CREATOR", "ADMIN"]);

const createRenderJobSchema = z.object({
  videoId: z.string().uuid(),
  parameters: z.object({
    denoiseStrength: z.number().min(0.1).max(1.0),
    styleScale: z.number().min(1).max(10),
  }),
});

export type CreateRenderJobInput = z.infer<typeof createRenderJobSchema>;

export async function createRenderJob(input: CreateRenderJobInput) {
  const session = await auth();
  if (!session?.user || !ALLOWED_ROLES.has(session.user.role)) {
    throw new Error("Forbidden");
  }

  const parsed = createRenderJobSchema.parse(input);

  const baseVideo = await prisma.baseVideo.findFirst({
    where: { id: parsed.videoId, tenantId: session.user.tenantId },
  });
  if (!baseVideo) throw new Error("Video not found");

  const job = await prisma.renderJob.create({
    data: {
      userId: session.user.id,
      baseVideoId: parsed.videoId,
      status: "PENDING",
      parameters: parsed.parameters,
    },
  });

  const redis = getRedis();
  await redis.rpush(
    QUEUE_KEY,
    JSON.stringify({ jobId: job.id, videoId: parsed.videoId, parameters: parsed.parameters }),
  );

  return { jobId: job.id };
}
