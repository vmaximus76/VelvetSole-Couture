"use client";

import { useState } from "react";
import Link from "next/link";
import { ModalFrame } from "./ModalFrame";
import { GeneratorShell } from "./GeneratorShell";
import { BoutiqueViewer } from "@/components/viewer/BoutiqueViewer";

interface DigitalModel {
  id: string;
  name: string;
  identityAssetKey: string | null;
}

interface RecentJob {
  id: string;
  status: string;
  outputType: string;
  resultS3Url: string | null;
  prompt: string;
  createdAt: string;
}

interface Props {
  models: DigitalModel[];
  recentJobs: RecentJob[];
  userName?: string | null;
}

const SECONDARY: { label: string; href: string }[] = [
  { label: "Library", href: "/library" },
  { label: "Store",   href: "/store" },
];

export function StudioHub({ models, recentJobs, userName }: Props) {
  const [genOpen,    setGenOpen]    = useState(false);
  const [genMin,     setGenMin]     = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerMin,  setViewerMin]  = useState(false);

  function openGenerator() { setGenOpen(true);   setGenMin(false); }
  function openViewer()    { setViewerOpen(true); setViewerMin(false); }

  return (
    <>
      {/* ── Accent stripe ── */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ height: 1, background: "#750851", width: "100%", maxWidth: 1300 }} />
      </div>

      {/* ── Page ── */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "80px 28px 0",
        }}
      >
        {/* Header */}
        <p
          style={{
            fontFamily: "var(--font-jost), system-ui, sans-serif",
            fontSize: "0.60rem",
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "rgba(237,233,228,0.26)",
            marginBottom: 10,
          }}
        >
          Studio
        </p>
        <h1
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)",
            fontWeight: 300,
            letterSpacing: "0.04em",
            color: "#ede9e4",
            margin: "0 0 64px",
          }}
        >
          Welcome back{userName ? `, ${userName.split(" ")[0]}` : ""}.
        </h1>

        {/* ── Primary launchers ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 48,
          }}
        >
          {/* Generate tile */}
          <button
            type="button"
            onClick={openGenerator}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-between",
              padding: "36px 32px 28px",
              background: "rgba(117,8,81,0.07)",
              border: "1px solid rgba(117,8,81,0.28)",
              cursor: "pointer",
              textAlign: "left",
              transition: "background 0.22s, border-color 0.22s",
              minHeight: 180,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = "rgba(117,8,81,0.14)";
              el.style.borderColor = "rgba(117,8,81,0.55)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = "rgba(117,8,81,0.07)";
              el.style.borderColor = "rgba(117,8,81,0.28)";
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "var(--font-jost), system-ui, sans-serif",
                  fontSize: "0.58rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(117,8,81,0.80)",
                  marginBottom: 10,
                }}
              >
                Open
              </p>
              <p
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
                  fontWeight: 300,
                  letterSpacing: "0.04em",
                  color: "#ede9e4",
                  lineHeight: 1.1,
                }}
              >
                Generator
              </p>
            </div>
            <p
              style={{
                fontFamily: "var(--font-jost), system-ui, sans-serif",
                fontSize: "0.74rem",
                color: "rgba(237,233,228,0.32)",
                letterSpacing: "0.04em",
                marginTop: 20,
              }}
            >
              Create new AI content →
            </p>
          </button>

          {/* Viewer tile */}
          <button
            type="button"
            onClick={openViewer}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-between",
              padding: "36px 32px 28px",
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              cursor: "pointer",
              textAlign: "left",
              transition: "background 0.22s, border-color 0.22s",
              minHeight: 180,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = "rgba(255,255,255,0.05)";
              el.style.borderColor = "rgba(255,255,255,0.14)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = "rgba(255,255,255,0.025)";
              el.style.borderColor = "rgba(255,255,255,0.07)";
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "var(--font-jost), system-ui, sans-serif",
                  fontSize: "0.58rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(237,233,228,0.28)",
                  marginBottom: 10,
                }}
              >
                Open
              </p>
              <p
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
                  fontWeight: 300,
                  letterSpacing: "0.04em",
                  color: "#ede9e4",
                  lineHeight: 1.1,
                }}
              >
                Viewer
              </p>
            </div>
            <p
              style={{
                fontFamily: "var(--font-jost), system-ui, sans-serif",
                fontSize: "0.74rem",
                color: "rgba(237,233,228,0.32)",
                letterSpacing: "0.04em",
                marginTop: 20,
              }}
            >
              Browse the boutique →
            </p>
          </button>
        </div>

        {/* ── Secondary nav ── */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.055)",
            display: "flex",
            gap: 40,
            paddingTop: 20,
            paddingBottom: 96,
          }}
        >
          {SECONDARY.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                fontFamily: "var(--font-jost), system-ui, sans-serif",
                fontSize: "0.78rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(237,233,228,0.32)",
                textDecoration: "none",
                transition: "color 0.18s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(237,233,228,0.72)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(237,233,228,0.32)"; }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
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

      {/* ── Generator modal ── */}
      <ModalFrame
        isOpen={genOpen}
        onClose={() => setGenOpen(false)}
        isMinimized={genMin}
        onMinimize={() => setGenMin((p) => !p)}
        title="VelvetSole · Generator"
      >
        <GeneratorShell models={models} recentJobs={recentJobs} />
      </ModalFrame>

      {/* ── Viewer modal ── */}
      <ModalFrame
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        isMinimized={viewerMin}
        onMinimize={() => setViewerMin((p) => !p)}
        title="VelvetSole · Viewer"
      >
        <BoutiqueViewer onExit={() => setViewerOpen(false)} />
      </ModalFrame>
    </>
  );
}
