import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
});

function redirectTo(req: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, req.url));
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const parsed = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return redirectTo(req, "/register?error=invalid");
  }

  const { email, password, confirmPassword } = parsed.data;

  if (password !== confirmPassword) {
    return redirectTo(req, "/register?error=mismatch");
  }

  // Resolve tenant from request hostname
  const host = (req.headers.get("host") ?? "").split(":")[0];
  const tenant = await prisma.tenant.findFirst({
    where: {
      OR: [
        { domain: host },
        { domain: `www.${host}` },
      ],
    },
    select: { id: true },
  });

  // Fall back to env-configured default tenant for local dev
  const tenantId = tenant?.id ?? process.env.DEFAULT_TENANT_ID;
  if (!tenantId) {
    return redirectTo(req, "/register?error=tenant");
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existing) {
    return redirectTo(req, "/register?error=exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      tenantId,
      email,
      passwordHash,
      role: "SUBSCRIBER",
    },
  });

  return redirectTo(req, "/login?registered=1");
}
