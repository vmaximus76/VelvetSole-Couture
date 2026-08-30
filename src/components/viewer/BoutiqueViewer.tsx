"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useViewerStore, type VariantKey } from "@/store/viewerStore";

// ── Data ────────────────────────────────────────────────────────────────────

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

const DIALS: { key: VariantKey; label: string; sub: string }[] = [
  { key: "nails",     label: "Nails",     sub: "Style" },
  { key: "stilettos", label: "Stilettos", sub: "Footwear" },
  { key: "nylons",    label: "Nylons",    sub: "Hosiery" },
];

const CATALOG = Array.from({ length: 6 }, (_, i) => ({ id: `c${i + 1}` }));

const IDLE_MS = 3500;

// Parabolic arc: center raised, edges at baseline
function arcOffsetY(i: number, total: number, amplitude = 16): number {
  const t = (i / (total - 1)) * 2 - 1;
  return -amplitude * (1 - t * t);
}

// ── Component ────────────────────────────────────────────────────────────────

export function BoutiqueViewer({ onExit }: { onExit?: () => void }) {
  const { activeVariant, setActiveVariant } = useViewerStore();
  const [activeSwatch, setActiveSwatch] = useState<string | null>(null);
  const [swatchesVisible, setSwatchesVisible] = useState(true);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetIdle = useCallback(() => {
    setSwatchesVisible(true);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setSwatchesVisible(false), IDLE_MS);
  }, []);

  useEffect(() => {
    resetIdle();
    return () => { if (idleTimer.current) clearTimeout(idleTimer.current); };
  }, [resetIdle]);

  return (
    <div
      onMouseMove={resetIdle}
      onTouchStart={resetIdle}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "linear-gradient(148deg, #1a1520 0%, #111012 55%, #0d0b0e 100%)",
        userSelect: "none",
      }}
    >

      {/* ── Top swatch rail ── */}
      <AnimatePresence>
        {swatchesVisible && (
          <motion.div
            key="swatch-rail"
            initial={{ y: -88 }}
            animate={{ y: 0 }}
            exit={{ y: -88 }}
            transition={{ type: "spring", stiffness: 300, damping: 34 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 20,
              paddingTop: 18,
              paddingBottom: 28,
              background: "linear-gradient(to bottom, rgba(13,11,14,0.95) 0%, transparent 100%)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: 0,
            }}
          >
            {/* Exit button */}
            <button
              type="button"
              onClick={onExit}
              style={{
                position: "absolute",
                left: 24,
                top: 22,
                fontSize: "0.72rem",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: "rgba(237,233,228,0.30)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-jost), system-ui, sans-serif",
                transition: "color 0.2s",
                padding: 0,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(237,233,228,0.75)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(237,233,228,0.30)"; }}
            >
              ← Exit
            </button>

            {/* Swatch arc */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, paddingBottom: 4 }}>
              {SWATCHES.map((sw, i) => {
                const yOff = arcOffsetY(i, SWATCHES.length, 14);
                const active = activeSwatch === sw.id;
                return (
                  <motion.button
                    key={sw.id}
                    onClick={() => setActiveSwatch(active ? null : sw.id)}
                    whileTap={{ scale: 0.85 }}
                    title={sw.label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 6,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      transform: `translateY(${yOff}px)`,
                      padding: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: sw.color,
                        border: active
                          ? "2px solid #750851"
                          : "1.5px solid rgba(255,255,255,0.13)",
                        boxShadow: active
                          ? "0 0 14px rgba(117,8,81,0.65), inset 0 0 0 1px rgba(255,255,255,0.08)"
                          : "none",
                        transition: "border 0.2s, box-shadow 0.2s",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.10em",
                        textTransform: "uppercase",
                        color: active ? "#ede9e4" : "rgba(237,233,228,0.28)",
                        fontFamily: "var(--font-jost), system-ui, sans-serif",
                        transition: "color 0.2s",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {sw.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Catalog browse button */}
            <button
              onClick={() => setCatalogOpen(true)}
              title="Browse catalog"
              style={{
                position: "absolute",
                right: 24,
                top: 20,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(237,233,228,0.32)",
                padding: 4,
                lineHeight: 0,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(237,233,228,0.85)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(237,233,228,0.32)"; }}
            >
              {/* 2×2 grid icon */}
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="2" y="2" width="7" height="7" rx="1" />
                <rect x="11" y="2" width="7" height="7" rx="1" />
                <rect x="2" y="11" width="7" height="7" rx="1" />
                <rect x="11" y="11" width="7" height="7" rx="1" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main stage ── */}
      <div
        style={{
          position: "absolute",
          top: 80,
          bottom: "16.67vw",
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 24px",
        }}
      >
        <div
          style={{
            aspectRatio: "16/9",
            maxHeight: "100%",
            maxWidth: "100%",
            background: "#18141a",
            boxShadow: "0 0 100px rgba(0,0,0,0.85), 0 0 40px rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Placeholder — video goes here */}
          <span
            style={{
              fontSize: "0.68rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(237,233,228,0.10)",
              fontFamily: "var(--font-jost), system-ui, sans-serif",
            }}
          >
            Studio
          </span>
        </div>
      </div>

      {/* ── Bottom semicircle dials ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        {DIALS.map(({ key, label, sub }) => {
          const isActive = activeVariant === key;
          return (
            <motion.button
              key={key}
              onClick={() => setActiveVariant(isActive ? null : key)}
              whileTap={{ scale: 0.97 }}
              aria-pressed={isActive}
              style={{
                width: "33.333vw",
                height: "16.667vw",
                borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
                background: isActive
                  ? "linear-gradient(175deg, rgba(117,8,81,0.32) 0%, rgba(117,8,81,0.08) 100%)"
                  : "linear-gradient(175deg, rgba(38,30,40,0.90) 0%, rgba(20,18,22,0.90) 100%)",
                border: `1.5px solid ${isActive ? "rgba(117,8,81,0.55)" : "rgba(161,163,166,0.14)"}`,
                borderBottom: "none",
                boxShadow: isActive
                  ? "inset 0 1px 0 rgba(255,255,255,0.06), 0 -12px 40px rgba(117,8,81,0.18)"
                  : "inset 0 1px 0 rgba(255,255,255,0.03)",
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
              <span
                style={{
                  fontSize: "0.80rem",
                  letterSpacing: "0.20em",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-jost), system-ui, sans-serif",
                  fontWeight: 400,
                  color: isActive ? "#ede9e4" : "rgba(237,233,228,0.38)",
                  transition: "color 0.25s",
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontSize: "0.62rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-jost), system-ui, sans-serif",
                  color: isActive ? "rgba(237,233,228,0.50)" : "rgba(237,233,228,0.16)",
                  transition: "color 0.25s",
                }}
              >
                {sub}
              </span>

              {/* Active indicator dot */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    key="dot"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "#750851",
                      marginTop: 4,
                      boxShadow: "0 0 8px rgba(117,8,81,0.8)",
                    }}
                  />
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* ── Catalog popup ── */}
      <AnimatePresence>
        {catalogOpen && (
          <motion.div
            key="catalog-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setCatalogOpen(false); }}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 40,
              background: "rgba(6,4,8,0.88)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.div
              key="catalog-panel"
              initial={{ scale: 0.97, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.97, opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              style={{
                background: "#1c171d",
                border: "1px solid rgba(117,8,81,0.22)",
                borderRadius: 3,
                padding: "32px 28px",
                width: "min(500px, 88vw)",
                boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
                <span
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize: "1.2rem",
                    fontWeight: 300,
                    letterSpacing: "0.05em",
                    color: "#ede9e4",
                  }}
                >
                  Collection
                </span>
                <button
                  type="button"
                  onClick={() => setCatalogOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(237,233,228,0.30)",
                    cursor: "pointer",
                    fontSize: "1.3rem",
                    lineHeight: 1,
                    padding: "2px 6px",
                    borderRadius: 2,
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(237,233,228,0.75)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(237,233,228,0.30)"; }}
                >
                  ×
                </button>
              </div>

              {/* Accent rule */}
              <div style={{ height: 1, background: "rgba(117,8,81,0.30)", marginBottom: 22 }} />

              {/* Grid of thumbnails */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {CATALOG.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ borderColor: "rgba(117,8,81,0.45)" }}
                    onClick={() => setCatalogOpen(false)}
                    style={{
                      aspectRatio: "9/16",
                      background: idx % 3 === 0 ? "#231e23" : idx % 3 === 1 ? "#1e1a1f" : "#261f26",
                      border: "1px solid rgba(255,255,255,0.05)",
                      borderRadius: 2,
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>

              <p
                style={{
                  marginTop: 16,
                  fontSize: "0.72rem",
                  color: "rgba(237,233,228,0.22)",
                  letterSpacing: "0.06em",
                  textAlign: "center",
                  fontFamily: "var(--font-jost), system-ui, sans-serif",
                }}
              >
                Content populates as it is added
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
