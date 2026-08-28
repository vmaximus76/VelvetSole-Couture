import Link from "next/link";
import { VscLogo } from "./VscLogo";
import type { Session } from "next-auth";

interface SiteNavProps {
  session: Session | null;
}

export function SiteNav({ session }: SiteNavProps) {
  return (
    <nav style={{ padding: "28px 0 22px" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/" aria-label="VelvetSole Couture — Home" style={{ display: "block", lineHeight: 0 }}>
          <VscLogo height={68} />
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--font-jost), system-ui, sans-serif",
            fontSize: "0.83rem",
            letterSpacing: "0.07em",
            color: "#7e7a84",
          }}
        >
          {session?.user ? (
            <>
              <Link href="/generate" style={navLinkStyle}>Create</Link>
              <span style={{ opacity: 0.35 }}>·</span>
              <Link href="/library" style={navLinkStyle}>Library</Link>
              <span style={{ opacity: 0.35 }}>·</span>
              <Link href="/store" style={navLinkStyle}>Browse</Link>
            </>
          ) : (
            <>
              <Link href="/login" style={navLinkStyle}>Login</Link>
              <span style={{ opacity: 0.35 }}>·</span>
              <Link href="/register" style={navLinkStyle}>Join</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const navLinkStyle: React.CSSProperties = {
  color: "#7e7a84",
  textDecoration: "none",
};
