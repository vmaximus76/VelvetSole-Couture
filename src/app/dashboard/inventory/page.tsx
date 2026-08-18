import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProductRowActions } from "@/components/inventory/product-row-actions";

const MANAGE_ROLES = new Set(["CREATOR", "ADMIN"]);

export default async function InventoryPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/inventory");
  }
  if (!MANAGE_ROLES.has(session.user.role)) {
    redirect("/dashboard");
  }

  const products = await prisma.product.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-4xl px-8 py-16">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Publishing Studio</p>
          <h1 className="mt-2 text-2xl font-light tracking-wide text-neutral-100">Inventory</h1>
        </div>
        <Link href="/dashboard/inventory/new" className={buttonVariants({})}>
          Create New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-neutral-500">No products yet — create your first one.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-neutral-800">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-800 hover:bg-transparent">
                <TableHead className="text-neutral-400">Title</TableHead>
                <TableHead className="text-neutral-400">Price</TableHead>
                <TableHead className="text-neutral-400">Status</TableHead>
                <TableHead className="text-right text-neutral-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="border-neutral-800">
                  <TableCell className="font-light text-neutral-100">{product.title}</TableCell>
                  <TableCell className="text-neutral-300">{formatPrice(product.priceCents)}</TableCell>
                  <TableCell>
                    <Badge variant={product.published ? "default" : "secondary"}>
                      {product.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ProductRowActions productId={product.id} published={product.published} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </main>
  );
}
