"use server";

import { z } from "zod";
import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import refinePromptWithClaude from "@/lib/claude";

const ALLOWED = new Set(["SUBSCRIBER", "CREATOR", "ADMIN"]);

const createGenerationJobSchema = z.object({
  digitalModelId:    z.string().uuid().optional(),
  prompt:            z.string().min(1).max(1000),
  poseReferenceS3Key: z.string().optional(),
  outputType:        z.enum(["IMAGE", "VIDEO"]).default("VIDEO"),
  parameters:        z.record(z.string(), z.any()).default({}),
});

export type CreateGenerationJobInput = z.infer<typeof createGenerationJobSchema>;

export async function createGenerationJob(input: CreateGenerationJobInput) {
  const session = await auth();
  if (!session?.user || !ALLOWED.has(session.user.role)) throw new Error("Forbidden");

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId },
    select: { syntheticGenerationEnabled: true },
  });
  if (!tenant?.syntheticGenerationEnabled) {
    throw new Error("Synthetic generation is not enabled for this tenant");
  }

  const parsed = createGenerationJobSchema.parse(input);

  // If caller requested Claude refinement, attempt it (non-fatal)
  let finalPrompt = parsed.prompt;
  if (parsed.parameters && (parsed.parameters as any).useClaude) {
    try {
      finalPrompt = await refinePromptWithClaude(parsed.prompt);
    } catch (err) {
      // log and continue with original prompt
      console.error("Claude prompt refinement failed:", err instanceof Error ? err.message : err);
    }
  }

  let digitalModelLoraKey: string | null = null;
  if (parsed.digitalModelId) {
    const model = await prisma.digitalModel.findFirst({
      where: { id: parsed.digitalModelId, tenantId: session.user.tenantId },
    });
    if (!model) throw new Error("Digital model not found");
    digitalModelLoraKey = model.identityAssetKey;
  }

  const job = await prisma.generationJob.create({
    data: {
      tenantId:           session.user.tenantId,
      userId:             session.user.id,
      digitalModelId:     parsed.digitalModelId ?? null,
      prompt:             finalPrompt,
      poseReferenceS3Key: parsed.poseReferenceS3Key ?? null,
      outputType:         parsed.outputType,
      status:             "PENDING",
      parameters:         parsed.parameters,
    },
  });

  const endpointId = process.env.RUNPOD_ENDPOINT_ID;
  const apiKey = process.env.RUNPOD_API_KEY;
  if (!endpointId || !apiKey) throw new Error("RunPod is not configured");

  const runpodRes = await fetch(`https://api.runpod.ai/v2/${endpointId}/run`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: {
        jobId:               job.id,
        digitalModelId:      job.digitalModelId,
        digitalModelLoraKey,
        prompt:              job.prompt,
        poseReferenceS3Key:  job.poseReferenceS3Key,
        parameters:          job.parameters,
      },
    }),
  });

  if (!runpodRes.ok) {
    await prisma.generationJob.update({ where: { id: job.id }, data: { status: "FAILED" } });
    throw new Error(`RunPod submission failed (${runpodRes.status})`);
  }

  return { jobId: job.id };
}

export async function getGenerationJob(jobId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  return prisma.generationJob.findFirst({
    where: { id: jobId, userId: session.user.id },
    select: { id: true, status: true, resultS3Url: true, promotedBaseVideoId: true, createdAt: true },
  });
}

const promoteSchema = z.object({
  title:           z.string().min(1),
  performerName:   z.string().min(1),
  documentId2257:  z.string().default("AI_SYNTHETIC"),
});

export async function promoteToBaseVideo(jobId: string, input: z.infer<typeof promoteSchema>) {
  const session = await auth();
  if (!session?.user || !ALLOWED.has(session.user.role)) throw new Error("Forbidden");

  const parsed = promoteSchema.parse(input);

  const job = await prisma.generationJob.findFirst({
    where: { id: jobId, tenantId: session.user.tenantId, status: "COMPLETED" },
  });
  if (!job)            throw new Error("Job not found or not completed");
  if (!job.resultS3Url) throw new Error("Job has no result URL");
  if (job.promotedBaseVideoId) throw new Error("Already promoted to base library");

  const baseVideo = await prisma.baseVideo.create({
    data: {
      tenantId:      session.user.tenantId,
      title:         parsed.title,
      performerName: parsed.performerName,
      documentId2257: parsed.documentId2257,
      s3Url:         job.resultS3Url,
      contentSource: "AI_SYNTHETIC",
    },
  });

  await prisma.generationJob.update({
    where: { id: jobId },
    data:  { promotedBaseVideoId: baseVideo.id },
  });

  return { baseVideoId: baseVideo.id };
}
