import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/product-card";

export const dynamic = "force-dynamic";

export default async function StorePage() {
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">VelvetSole Couture</p>
          <h1 className="mt-2 text-3xl font-light tracking-wide text-neutral-100">The Collection</h1>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-sm text-neutral-500">No items are published yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                description={product.description}
                priceCents={product.priceCents}
                thumbnailUrl={product.thumbnailUrl}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
