import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { SiteNav } from "@/components/site/SiteNav";
import { ProductCard } from "@/components/store/product-card";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Browse — VelvetSole Couture",
};

export default async function StorePage() {
  const session = await auth();

  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#ede9e4" }}>
      <SiteNav session={session} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ height: 1, background: "#750851", width: "100%", maxWidth: 1300 }} />
      </div>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 28px 96px" }}>
        <div style={{ marginBottom: 48 }}>
          <p style={{
            fontFamily: "var(--font-jost), system-ui, sans-serif",
            fontSize: "0.70rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#750851",
            marginBottom: 12,
          }}>
            The Collection
          </p>
          <h1 style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            fontWeight: 300,
            letterSpacing: "0.02em",
            color: "#ede9e4",
          }}>
            Browse
          </h1>
        </div>

        {products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "1.3rem",
              fontWeight: 300,
              color: "rgba(237,233,228,0.30)",
              marginBottom: 8,
            }}>
              The collection is being curated
            </p>
            <p style={{
              fontFamily: "var(--font-jost), system-ui, sans-serif",
              fontSize: "0.80rem",
              color: "rgba(237,233,228,0.18)",
              letterSpacing: "0.06em",
            }}>
              Check back soon, or create your own
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
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
      </main>
    </div>
  );
}
