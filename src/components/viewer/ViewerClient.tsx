"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

const SWATCHES = [
  { id: "s1", label: "Ruby",     color: "#8B1A3A" },
  { id: "s2", label: "Onyx",     color: "#1d1a23" },
  { id: "s3", label: "Ivory",    color: "#ddd5c4" },
  { id: "s4", label: "Midnight", color: "#0d0c18" },
  { id: "s5", label: "Velvet",   color: "#750851" },
  { id: "s6", label: "Noir",     color: "#2a2028" },
  { id: "s7", label: "Crimson",  color: "#6b0f1a" },
  { id: "s8", label: "Pearl",    color: "#e8e0d8" },
];

function arcY(i: number, total: number, amp: number) {
  const t = (i / (total - 1)) * 2 - 1;
  return -amp * (1 - t * t);
}

type JobStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

interface ViewerClientProps {
  jobId: string;
  initialStatus: string;
  initialResultUrl: string | null;
  outputType: string;
  prompt: string;
}

export function ViewerClient({
  jobId,
  initialStatus,
  initialResultUrl,
  outputType,
  prompt,
}: ViewerClientProps) {
  const [status, setStatus] = useState<JobStatus>(initialStatus as JobStatus);
  const [resultUrl, setResultUrl] = useState<string | null>(initialResultUrl);
  const [railHidden, setRailHidden] = useState(false);
  const [activeSwatch, setActiveSwatch] = useState<string | null>(null);
  const [activeDial, setActiveDial] = useState<string | null>(null);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const idleTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollTimer   = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollCount   = useRef(0);
  const MAX_POLLS   = 200; // ~13 minutes at 4s interval before giving up

  const resetIdle = useCallback(() => {
    setRailHidden(false);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setRailHidden(true), 3500);
  }, []);

  // Poll for job completion while pending/processing
  useEffect(() => {
    if (status === "COMPLETED" || status === "FAILED") return;

    pollTimer.current = setInterval(async () => {
      pollCount.current += 1;
      if (pollCount.current > MAX_POLLS) {
        if (pollTimer.current) clearInterval(pollTimer.current);
        setStatus("FAILED");
        return;
      }
      try {
        const res = await fetch(`/api/job/${jobId}`);
        if (!res.ok) return;
        const data = await res.json();
        setStatus(data.status as JobStatus);
        if (data.resultS3Url) setResultUrl(data.resultS3Url);
        if (data.status === "COMPLETED" || data.status === "FAILED") {
          if (pollTimer.current) clearInterval(pollTimer.current);
        }
      } catch {
        // non-fatal, keep polling
      }
    }, 4000);

    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
  }, [jobId, status]);

  // Initial idle timer + mouse tracking
  useEffect(() => {
    resetIdle();
    window.addEventListener("mousemove", resetIdle);
    window.addEventListener("touchstart", resetIdle);
    return () => {
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("touchstart", resetIdle);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [resetIdle]);

  const pending = status === "PENDING" || status === "PROCESSING";

  return (
    <div style={{ position: "fixed", inset: 0, background: "linear-gradient(148deg, #1a1520 0%, #111012 55%, #0d0b0e 100%)", color: "#ede9e4", fontFamily: "var(--font-jost), system-ui, sans-serif", fontWeight: 300, userSelect: "none" }}>

      {/* ── Swatch rail ── */}
      <div style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 20,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: "18px 0 28px",
        background: "linear-gradient(to bottom, rgba(13,11,14,0.96) 0%, transparent 100%)",
        transition: "transform 0.48s cubic-bezier(0.4,0,0.2,1), opacity 0.48s ease",
        transform: railHidden ? "translateY(-100%)" : "translateY(0)",
        opacity: railHidden ? 0 : 1,
      }}>
        <Link href="/library" style={{ position: "absolute", left: 24, top: 22, fontSize: "0.70rem", letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(237,233,228,0.28)", textDecoration: "none" }}>
          ← Library
        </Link>

        {/* Swatch arc */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, paddingBottom: 4 }}>
          {SWATCHES.map((sw, i) => {
            const y = arcY(i, SWATCHES.length, 14);
            const active = activeSwatch === sw.id;
            return (
              <button
                key={sw.id}
                title={sw.label}
                onClick={() => {
                  setActiveSwatch(active ? null : sw.id);
                  resetIdle();
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transform: `translateY(${y}px)`,
                }}
              >
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: sw.color,
                  border: active ? "2px solid #750851" : "1.5px solid rgba(255,255,255,0.13)",
                  boxShadow: active ? "0 0 14px rgba(117,8,81,0.65), inset 0 0 0 1px rgba(255,255,255,0.07)" : "none",
                  transition: "border 0.2s, box-shadow 0.2s",
                }} />
                <span style={{
                  fontSize: 9,
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                  color: active ? "#ede9e4" : "rgba(237,233,228,0.26)",
                  whiteSpace: "nowrap",
                  transition: "color 0.2s",
                }}>
                  {sw.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Catalog icon */}
        <button
          onClick={() => { setCatalogOpen(true); resetIdle(); }}
          title="Browse catalog"
          style={{ position: "absolute", right: 24, top: 20, background: "none", border: "none", cursor: "pointer", color: "rgba(237,233,228,0.28)", padding: 4, lineHeight: 0, transition: "color 0.2s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(237,233,228,0.80)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(237,233,228,0.28)"; }}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <rect x="2" y="2" width="7" height="7" rx="1"/>
            <rect x="11" y="2" width="7" height="7" rx="1"/>
            <rect x="2" y="11" width="7" height="7" rx="1"/>
            <rect x="11" y="11" width="7" height="7" rx="1"/>
          </svg>
        </button>
      </div>

      {/* ── Stage ── */}
      <div style={{
        position: "fixed",
        top: 80,
        bottom: "16.667vw",
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px 24px",
      }}>
        <div style={{
          maxHeight: "100%",
          maxWidth: "100%",
          background: "#18141a",
          boxShadow: "0 0 100px rgba(0,0,0,0.85), 0 0 40px rgba(0,0,0,0.55)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          {status === "COMPLETED" && !resultUrl && (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.66rem", letterSpacing: "0.20em", textTransform: "uppercase", color: "rgba(192,56,74,0.7)", marginBottom: 8 }}>Generation Failed</p>
              <Link href="/generate" style={{ fontSize: "0.70rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(237,233,228,0.35)", textDecoration: "none" }}>Try Again →</Link>
            </div>
          )}
          {status === "COMPLETED" && resultUrl ? (
            /\.(mp4|webm|mov)(\?|$)/i.test(resultUrl) ? (
              <video
                src={resultUrl}
                autoPlay
                loop
                playsInline
                controls
                controlsList="nodownload"
                disablePictureInPicture
                style={{ maxHeight: "calc(100vh - 200px)", maxWidth: "100%", display: "block" }}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={resultUrl} alt={prompt} style={{ maxHeight: "calc(100vh - 200px)", maxWidth: "100%", display: "block", objectFit: "contain" }} />
            )
          ) : status === "FAILED" ? (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.66rem", letterSpacing: "0.20em", textTransform: "uppercase", color: "rgba(192,56,74,0.7)", marginBottom: 8 }}>Generation Failed</p>
              <Link href="/generate" style={{ fontSize: "0.70rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(237,233,228,0.35)", textDecoration: "none" }}>
                Try Again →
              </Link>
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <PulseRing />
              <p style={{ marginTop: 20, fontSize: "0.66rem", letterSpacing: "0.30em", textTransform: "uppercase", color: "rgba(237,233,228,0.20)" }}>
                {status === "PROCESSING" ? "Composing" : "Queued"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Semicircle dials ── */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
        {[
          { key: "nails",     label: "Nails",     sub: "Style" },
          { key: "stilettos", label: "Stilettos", sub: "Footwear" },
          { key: "nylons",    label: "Nylons",    sub: "Hosiery" },
        ].map(({ key, label, sub }) => {
          const active = activeDial === key;
          return (
            <button
              key={key}
              onClick={() => { setActiveDial(active ? null : key); resetIdle(); }}
              style={{
                width: "33.333vw",
                height: "16.667vw",
                borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
                background: active
                  ? "linear-gradient(175deg, rgba(117,8,81,0.30) 0%, rgba(117,8,81,0.07) 100%)"
                  : "linear-gradient(175deg, rgba(38,30,40,0.90) 0%, rgba(20,18,22,0.90) 100%)",
                border: `1.5px solid ${active ? "rgba(117,8,81,0.52)" : "rgba(161,163,166,0.13)"}`,
                borderBottom: "none",
                boxShadow: active ? "inset 0 1px 0 rgba(255,255,255,0.06), 0 -14px 44px rgba(117,8,81,0.16)" : "inset 0 1px 0 rgba(255,255,255,0.03)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                paddingTop: "10%",
                gap: 5,
                transition: "background 0.28s, border-color 0.28s, box-shadow 0.28s",
              }}
            >
              <span style={{ fontSize: "0.78rem", letterSpacing: "0.20em", textTransform: "uppercase", fontWeight: 400, color: active ? "#ede9e4" : "rgba(237,233,228,0.36)", transition: "color 0.25s" }}>
                {label}
              </span>
              <span style={{ fontSize: "0.60rem", letterSpacing: "0.16em", textTransform: "uppercase", color: active ? "rgba(237,233,228,0.48)" : "rgba(237,233,228,0.15)", transition: "color 0.25s" }}>
                {sub}
              </span>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#750851", boxShadow: "0 0 8px rgba(117,8,81,0.8)", marginTop: 4, opacity: active ? 1 : 0, transform: active ? "scale(1)" : "scale(0)", transition: "opacity 0.22s, transform 0.22s" }} />
            </button>
          );
        })}
      </div>

      {/* ── Catalog overlay ── */}
      {catalogOpen && (
        <div
          onClick={() => setCatalogOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(6,4,8,0.88)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "#1c1c1c", border: "1px solid rgba(117,8,81,0.22)", borderRadius: 3, padding: "32px 28px", width: "min(500px, 88vw)", boxShadow: "0 40px 100px rgba(0,0,0,0.75)" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <span style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1.2rem", fontWeight: 300, letterSpacing: "0.05em", color: "#ede9e4" }}>
                Collection
              </span>
              <button onClick={() => setCatalogOpen(false)} style={{ background: "none", border: "none", color: "rgba(237,233,228,0.28)", cursor: "pointer", fontSize: "1.4rem", lineHeight: 1, padding: "2px 8px", borderRadius: 2 }}>×</button>
            </div>
            <div style={{ height: 1, background: "rgba(117,8,81,0.28)", marginBottom: 20 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ aspectRatio: "9/16", background: i % 3 === 0 ? "#231e23" : i % 3 === 1 ? "#1e1a1f" : "#261f26", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 2 }} />
              ))}
            </div>
            <p style={{ marginTop: 14, fontSize: "0.70rem", color: "rgba(237,233,228,0.18)", letterSpacing: "0.06em", textAlign: "center" }}>
              Content populates as it is added
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function PulseRing() {
  return (
    <div style={{ position: "relative", width: 48, height: 48, margin: "0 auto" }}>
      <style>{`
        @keyframes vsc-pulse {
          0%   { transform: scale(0.8); opacity: 0.6; }
          50%  { transform: scale(1.2); opacity: 0.2; }
          100% { transform: scale(0.8); opacity: 0.6; }
        }
        .vsc-pulse-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1.5px solid rgba(117,8,81,0.6);
          animation: vsc-pulse 2s ease-in-out infinite;
        }
        .vsc-pulse-ring:nth-child(2) { animation-delay: 0.5s; }
        .vsc-pulse-ring:nth-child(3) { animation-delay: 1s; }
      `}</style>
      <div className="vsc-pulse-ring" />
      <div className="vsc-pulse-ring" />
      <div className="vsc-pulse-ring" />
      <div style={{ position: "absolute", inset: "35%", borderRadius: "50%", background: "#750851", boxShadow: "0 0 12px rgba(117,8,81,0.8)" }} />
    </div>
  );
}
