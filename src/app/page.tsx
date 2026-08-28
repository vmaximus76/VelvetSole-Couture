import Link from "next/link";
import { auth } from "../../auth";
import { SiteNav } from "@/components/site/SiteNav";
import { HeroShape } from "@/components/site/HeroShape";
import { EnterStudioButton } from "@/components/site/EnterStudioButton";
import { JoinButton } from "@/components/site/JoinButton";

const PAGE_BG: React.CSSProperties = {
  background: "#0a0a0a",
  minHeight: "100vh",
  color: "#ede9e4",
};

export default async function HomePage() {
  const session = await auth();

  return (
    <div style={PAGE_BG}>
      <SiteNav session={session} />

      {/* Accent stripe — 1300px centered */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ height: 1, background: "#750851", width: "100%", maxWidth: 1300 }} />
      </div>

      {/* Hero shape container */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px", position: "relative" }}>
        <div style={{ position: "relative", width: "100%", height: 480 }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <HeroShape />
          </div>
        </div>
      </div>

      {/* Below hero: copy left, CTA right */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "40px 28px 96px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          alignItems: "center",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "1.22rem",
              fontWeight: 300,
              lineHeight: 1.80,
              color: "#7e7a84",
              maxWidth: "40ch",
            }}
          >
            <em style={{ fontStyle: "italic", color: "#ede9e4" }}>Exclusive digital experiences</em>{" "}
            curated for the discerning collector. Artfully crafted content where aesthetic meets desire.
          </p>
          <p
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "1.22rem",
              fontWeight: 300,
              lineHeight: 1.80,
              color: "#7e7a84",
              maxWidth: "40ch",
              marginTop: 22,
            }}
          >
            A private studio of AI-crafted and creator-produced works. Every piece a statement. Every session an experience.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          {session?.user ? (
            <EnterStudioButton />
          ) : (
            <JoinButton />
          )}
          <Link
            href="/store"
            style={{
              color: "#7e7a84",
              fontFamily: "var(--font-jost), system-ui, sans-serif",
              fontSize: "0.78rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderBottom: "1px solid rgba(126,122,132,0.30)",
              paddingBottom: 2,
              transition: "color 0.2s, border-color 0.2s",
            }}
          >
            Browse Collection
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.055)",
          padding: "24px 28px",
          textAlign: "center",
          color: "#7e7a84",
          fontSize: "0.76rem",
          letterSpacing: "0.06em",
          opacity: 0.7,
          fontFamily: "var(--font-jost), system-ui, sans-serif",
        }}
      >
        &copy; 2026 VelvetSole Couture &nbsp;&middot;&nbsp;
        <Link href="/2257" style={{ color: "inherit", textDecoration: "none" }}>18 U.S.C. &sect;&nbsp;2257</Link>
        &nbsp;&middot;&nbsp;
        <Link href="/privacy-policy" style={{ color: "inherit", textDecoration: "none" }}>Privacy</Link>
        &nbsp;&middot;&nbsp;
        <Link href="/terms-of-service" style={{ color: "inherit", textDecoration: "none" }}>Terms</Link>
      </footer>
    </div>
  );
}
