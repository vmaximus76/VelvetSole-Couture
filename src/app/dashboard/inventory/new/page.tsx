import { redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/inventory/product-form";

const MANAGE_ROLES = new Set(["CREATOR", "ADMIN"]);

export default async function NewProductPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/inventory/new");
  }
  if (!MANAGE_ROLES.has(session.user.role)) {
    redirect("/dashboard");
  }

  const baseVideos = await prisma.baseVideo.findMany({
    where: { tenantId: session.user.tenantId },
    select: { id: true, title: true, s3Url: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-xl px-8 py-16">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Publishing Studio</p>
        <h1 className="mt-2 text-2xl font-light tracking-wide text-neutral-100">New product</h1>
      </div>
      <ProductForm baseVideos={baseVideos} />
    </main>
  );
}
