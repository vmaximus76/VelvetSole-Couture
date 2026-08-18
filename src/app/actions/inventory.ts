"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { buildPublicAssetUrl } from "@/lib/s3";

const MANAGE_ROLES = new Set(["CREATOR", "ADMIN"]);

const createProductSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().min(1, "Description is required").max(2000),
  priceUsd: z.coerce.number().positive("Price must be greater than zero").max(10000, "Price is too high"),
  deliverableS3Key: z.string().trim().min(1).optional(),
  thumbnailKey: z.string().trim().min(1).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export async function createProduct(input: CreateProductInput) {
  const session = await auth();
  if (!session?.user || !MANAGE_ROLES.has(session.user.role)) {
    throw new Error("Forbidden");
  }

  const parsed = createProductSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  await prisma.product.create({
    data: {
      tenantId: session.user.tenantId,
      title: parsed.data.title,
      description: parsed.data.description,
      priceCents: Math.round(parsed.data.priceUsd * 100),
      deliverableS3Key: parsed.data.deliverableS3Key,
      thumbnailUrl: parsed.data.thumbnailKey ? buildPublicAssetUrl(parsed.data.thumbnailKey) : null,
      published: false,
    },
  });

  revalidatePath("/dashboard/inventory");
  revalidatePath("/store");
  redirect("/dashboard/inventory");
}

export async function setProductPublished(productId: string, published: boolean) {
  const session = await auth();
  if (!session?.user || !MANAGE_ROLES.has(session.user.role)) {
    throw new Error("Forbidden");
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.tenantId !== session.user.tenantId) {
    throw new Error("Not found");
  }

  await prisma.product.update({ where: { id: productId }, data: { published } });

  revalidatePath("/dashboard/inventory");
  revalidatePath("/store");
}
