import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { SiteNav } from "@/components/site/SiteNav";

export const metadata = {
  title: "Library — VelvetSole Couture",
};

export default async function LibraryPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/library");

  const [jobs, purchases] = await Promise.all([
    prisma.generationJob.findMany({
      where: { userId: session.user.id, status: "COMPLETED" },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.purchase.findMany({
      where: { userId: session.user.id },
      include: { product: true },
      distinct: ["productId"],
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const isEmpty = jobs.length === 0 && purchases.length === 0;

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#ede9e4" }}>
      <SiteNav session={session} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ height: 1, background: "#750851", width: "100%", maxWidth: 1300 }} />
      </div>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 28px 96px" }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <p style={{
            fontFamily: "var(--font-jost), system-ui, sans-serif",
            fontSize: "0.70rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#750851",
            marginBottom: 12,
          }}>
            Your Collection
          </p>
          <h1 style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            fontWeight: 300,
            letterSpacing: "0.02em",
            color: "#ede9e4",
          }}>
            Library
          </h1>
        </div>

        {isEmpty ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "1.3rem",
              fontWeight: 300,
              color: "rgba(237,233,228,0.35)",
              marginBottom: 32,
            }}>
              Your library is empty
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/generate" style={ctaStyle("#750851")}>Create Something</Link>
              <Link href="/store" style={ctaStyle("transparent", true)}>Browse Collection</Link>
            </div>
          </div>
        ) : (
          <>
            {jobs.length > 0 && (
              <section style={{ marginBottom: 64 }}>
                <SectionHeading>Generated</SectionHeading>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                  {jobs.map((job) => (
                    <Link
                      key={job.id}
                      href={`/viewer/${job.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 2,
                        overflow: "hidden",
                        transition: "border-color 0.2s",
                      }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(117,8,81,0.40)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
                      >
                        <div style={{ aspectRatio: "16/9", background: "#18141a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {job.resultS3Url && job.outputType === "IMAGE" ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={job.resultS3Url} alt={job.prompt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : job.resultS3Url ? (
                            <video src={job.resultS3Url} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <span style={{ fontSize: "0.60rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(237,233,228,0.14)" }}>
                              {job.outputType === "VIDEO" ? "Video" : "Image"}
                            </span>
                          )}
                        </div>
                        <div style={{ padding: "14px 16px" }}>
                          <p style={{
                            fontFamily: "var(--font-jost), system-ui, sans-serif",
                            fontSize: "0.80rem",
                            color: "rgba(237,233,228,0.55)",
                            letterSpacing: "0.03em",
                            lineHeight: 1.5,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}>
                            {job.prompt}
                          </p>
                          <p style={{
                            marginTop: 8,
                            fontFamily: "var(--font-jost), system-ui, sans-serif",
                            fontSize: "0.68rem",
                            letterSpacing: "0.10em",
                            textTransform: "uppercase",
                            color: "rgba(237,233,228,0.22)",
                          }}>
                            {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {purchases.length > 0 && (
              <section>
                <SectionHeading>Purchased</SectionHeading>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                  {purchases.map((purchase) => (
                    <div key={purchase.id} style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}>
                      <div style={{ aspectRatio: "16/9", background: "#18141a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: "0.60rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(237,233,228,0.14)" }}>
                          {purchase.product.title}
                        </span>
                      </div>
                      <div style={{ padding: "14px 16px" }}>
                        <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1rem", fontWeight: 300, color: "#ede9e4" }}>
                          {purchase.product.title}
                        </p>
                        {purchase.product.description && (
                          <p style={{ marginTop: 4, fontFamily: "var(--font-jost), system-ui, sans-serif", fontSize: "0.78rem", color: "rgba(237,233,228,0.40)", lineHeight: 1.5 }}>
                            {purchase.product.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontFamily: "var(--font-jost), system-ui, sans-serif",
      fontSize: "0.72rem",
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "rgba(237,233,228,0.35)",
      marginBottom: 20,
      paddingBottom: 10,
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      {children}
    </h2>
  );
}

function ctaStyle(bg: string, outline = false): React.CSSProperties {
  return {
    display: "inline-block",
    padding: "12px 32px",
    background: bg,
    border: outline ? "1px solid rgba(255,255,255,0.12)" : "none",
    color: "#ede9e4",
    fontFamily: "var(--font-jost), system-ui, sans-serif",
    fontSize: "0.78rem",
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    textDecoration: "none",
    borderRadius: 2,
  };
}
