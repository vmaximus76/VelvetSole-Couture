"use server";

import { z } from "zod";
import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";

const ALLOWED = new Set(["CREATOR", "ADMIN"]);

const modelSchema = z.object({
  name:       z.string().min(1).max(80),
  bio:        z.string().max(500).optional(),
  parameters: z.object({
    subject:   z.enum(["FEMALE", "MALE"]).default("FEMALE"),
    ethnicity: z.string().default("auto"),
    skinTone:  z.string().default("auto"),
    hairColor: z.string().default("auto"),
    hairType:  z.string().default("auto"),
    age:       z.string().default("auto"),
  }).default({ subject: "FEMALE", ethnicity: "auto", skinTone: "auto", hairColor: "auto", hairType: "auto", age: "auto" }),
});

export type DigitalModelInput = z.infer<typeof modelSchema>;

export async function createDigitalModel(input: DigitalModelInput) {
  const session = await auth();
  if (!session?.user || !ALLOWED.has(session.user.role)) {
    return { error: "Permission denied." };
  }
  const parsed = modelSchema.parse(input);
  const model = await prisma.digitalModel.create({
    data: {
      tenantId:   session.user.tenantId,
      name:       parsed.name,
      bio:        parsed.bio ?? null,
      parameters: parsed.parameters,
    },
  });
  return { modelId: model.id };
}

export async function updateDigitalModel(id: string, input: DigitalModelInput) {
  const session = await auth();
  if (!session?.user || !ALLOWED.has(session.user.role)) {
    return { error: "Permission denied." };
  }
  const parsed = modelSchema.parse(input);
  const existing = await prisma.digitalModel.findFirst({
    where: { id, tenantId: session.user.tenantId },
  });
  if (!existing) return { error: "Not found." };

  await prisma.digitalModel.update({
    where: { id },
    data: {
      name:       parsed.name,
      bio:        parsed.bio ?? null,
      parameters: parsed.parameters,
    },
  });
  return { modelId: id };
}

export async function deleteDigitalModel(id: string) {
  const session = await auth();
  if (!session?.user || !ALLOWED.has(session.user.role)) {
    return { error: "Permission denied." };
  }
  const existing = await prisma.digitalModel.findFirst({
    where: { id, tenantId: session.user.tenantId },
  });
  if (!existing) return { error: "Not found." };

  await prisma.digitalModel.delete({ where: { id } });
  return { ok: true };
}

export async function listDigitalModels() {
  const session = await auth();
  if (!session?.user) return [];

  return prisma.digitalModel.findMany({
    where:   { tenantId: session.user.tenantId },
    orderBy: { createdAt: "desc" },
    select:  { id: true, name: true, bio: true, parameters: true, createdAt: true },
  });
}
