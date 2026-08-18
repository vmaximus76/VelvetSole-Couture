"use server";

import { z } from "zod";
import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const UPLOAD_ROLES = new Set(["CREATOR", "ADMIN"]);

const createBaseVideoSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  performerName: z.string().trim().min(1, "Performer name is required").max(200),
  documentId2257: z.string().trim().min(1, "2257 document ID is required").max(200),
  s3Url: z.string().trim().min(1, "Missing uploaded file reference"),
});

export type CreateBaseVideoInput = z.infer<typeof createBaseVideoSchema>;

export async function createBaseVideo(input: CreateBaseVideoInput) {
  const session = await auth();
  if (!session?.user || !UPLOAD_ROLES.has(session.user.role)) {
    throw new Error("Forbidden");
  }

  const parsed = createBaseVideoSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const video = await prisma.baseVideo.create({
    data: {
      tenantId: session.user.tenantId,
      title: parsed.data.title,
      performerName: parsed.data.performerName,
      documentId2257: parsed.data.documentId2257,
      s3Url: parsed.data.s3Url,
    },
  });

  revalidatePath("/dashboard/upload");
  return video;
}
