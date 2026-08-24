"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Forbidden: ADMIN role required");
  }
  return session.user;
}

// ── Tenant Management ────────────────────────────────────────────────────────

const createTenantSchema = z.object({
  brandName: z.string().trim().min(1).max(200),
  domain: z.string().trim().min(1).max(200).toLowerCase(),
  ccbillSubAcc: z.string().trim().optional(),
});

export async function createTenant(input: z.infer<typeof createTenantSchema>) {
  await requireAdmin();
  const parsed = createTenantSchema.parse(input);
  return prisma.tenant.create({ data: parsed });
}

const updateCcbillSubAccSchema = z.object({
  tenantId: z.string().uuid(),
  ccbillSubAcc: z.string().trim().min(1).max(20),
});

export async function updateTenantCcbillSubAccount(
  input: z.infer<typeof updateCcbillSubAccSchema>,
) {
  await requireAdmin();
  const { tenantId, ccbillSubAcc } = updateCcbillSubAccSchema.parse(input);
  return prisma.tenant.update({
    where: { id: tenantId },
    data: { ccbillSubAcc },
  });
}

// ── Tenant User Onboarding ───────────────────────────────────────────────────

const onboardAdminSchema = z.object({
  tenantId: z.string().uuid(),
  email: z.string().email().toLowerCase(),
  name: z.string().trim().min(1).max(200),
  password: z.string().min(10, "Password must be at least 10 characters"),
});

export async function onboardTenantAdmin(input: z.infer<typeof onboardAdminSchema>) {
  await requireAdmin();
  const parsed = onboardAdminSchema.parse(input);

  // Confirm the target tenant exists — prevents orphaned user creation
  const tenant = await prisma.tenant.findUnique({ where: { id: parsed.tenantId } });
  if (!tenant) throw new Error("Tenant not found");

  const passwordHash = await bcrypt.hash(parsed.password, 12);

  return prisma.user.create({
    data: {
      tenantId: parsed.tenantId,
      email: parsed.email,
      name: parsed.name,
      role: "ADMIN",
      passwordHash,
    },
    select: { id: true, email: true, name: true, role: true, tenantId: true },
  });
}

// ── Tenant-Scoped Reads ───────────────────────────────────────────────────────

export async function listTenants() {
  await requireAdmin();
  return prisma.tenant.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { users: true, products: true } } },
  });
}

export async function getTenantUsers(tenantId: string) {
  await requireAdmin();
  return prisma.user.findMany({
    where: { tenantId },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
}
