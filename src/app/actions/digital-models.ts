"use server";

import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";

const ALLOWED = new Set(["CREATOR", "ADMIN"]);

export async function createDigitalModel(input: { name: string; identityAssetKey: string }) {
  const session = await auth();
  if (!session?.user || !ALLOWED.has(session.user.role)) throw new Error("Forbidden");

  return prisma.digitalModel.create({
    data: {
      tenantId: session.user.tenantId,
      name: input.name,
      identityAssetKey: input.identityAssetKey,
    },
  });
}

export async function listDigitalModels() {
  const session = await auth();
  if (!session?.user || !ALLOWED.has(session.user.role)) throw new Error("Forbidden");

  return prisma.digitalModel.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteDigitalModel(id: string) {
  const session = await auth();
  if (!session?.user || !ALLOWED.has(session.user.role)) throw new Error("Forbidden");

  const model = await prisma.digitalModel.findFirst({
    where: { id, tenantId: session.user.tenantId },
  });
  if (!model) throw new Error("Not found");

  return prisma.digitalModel.delete({ where: { id } });
}
