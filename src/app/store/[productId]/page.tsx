import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CheckoutPanel } from "@/components/checkout/checkout-panel";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product || !product.published) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-16">
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
        <div className="aspect-[4/5] w-full overflow-hidden rounded-lg bg-gradient-to-br from-neutral-900 via-neutral-950 to-black">
          {product.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.thumbnailUrl} alt={product.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-xs uppercase tracking-[0.25em] text-neutral-700">VelvetSole</span>
            </div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">VelvetSole Couture</p>
          <h1 className="mt-2 text-2xl font-light tracking-wide text-neutral-100">{product.title}</h1>
          <p className="mt-4 text-sm leading-relaxed text-neutral-400">{product.description}</p>

          <div className="mt-8">
            <CheckoutPanel productId={product.id} title={product.title} priceCents={product.priceCents} />
          </div>
        </div>
      </div>
    </main>
  );
}
