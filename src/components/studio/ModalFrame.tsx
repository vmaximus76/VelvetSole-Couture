"use client";

import { useCallback, useEffect } from "react";

interface ModalFrameProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized: boolean;
  onMinimize: () => void;
  title: string;
  children: React.ReactNode;
}

export function ModalFrame({
  isOpen,
  onClose,
  isMinimized,
  onMinimize,
  title,
  children,
}: ModalFrameProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isMinimized) onClose();
    },
    [isOpen, isMinimized, onClose],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  useEffect(() => {
    document.body.style.overflow = isOpen && !isMinimized ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, isMinimized]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.82)",
          opacity: isMinimized ? 0 : 1,
          pointerEvents: isMinimized ? "none" : "auto",
          transition: "opacity 0.3s ease",
        }}
        onClick={!isMinimized ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Frame */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: "relative",
          background: "#1a1a1a",
          border: "1px solid #2e2e2e",
          boxShadow: "0 32px 100px rgba(0,0,0,0.85)",
          overflow: "hidden",
          transition: "all 0.46s cubic-bezier(0.34,1.56,0.64,1)",
          ...(isMinimized
            ? {
                width: 280,
                height: 40,
                transform: "translateY(calc(50vh - 20px)) scale(0.95)",
                opacity: 0.92,
              }
            : {
                width: "95vw",
                maxWidth: 1240,
                height: "87vh",
              }),
        }}
      >
        {/* Window controls */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            display: "flex",
            zIndex: 20,
          }}
        >
          <button
            onClick={onMinimize}
            aria-label="Minimize"
            style={{
              width: 32,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#2a2a2a",
              border: "none",
              borderLeft: "1px solid #333",
              borderBottom: "1px solid #333",
              color: "#999",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              transition: "background 0.18s, color 0.18s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#3a3a3a";
              (e.currentTarget as HTMLButtonElement).style.color = "#eee";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#2a2a2a";
              (e.currentTarget as HTMLButtonElement).style.color = "#999";
            }}
          >
            −
          </button>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 32,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#c0392b",
              border: "none",
              borderLeft: "1px solid #333",
              borderBottom: "1px solid #333",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              transition: "background 0.18s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#e74c3c"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#c0392b"; }}
          >
            ×
          </button>
        </div>

        {/* Minimized label bar */}
        {isMinimized && (
          <div
            onClick={onMinimize}
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              padding: "0 12px",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                color: "#999",
                fontSize: "0.70rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontFamily: "var(--font-jost), system-ui, sans-serif",
              }}
            >
              {title}
            </span>
            <span
              style={{
                marginLeft: "auto",
                color: "#555",
                fontSize: "0.66rem",
                fontFamily: "var(--font-jost), system-ui, sans-serif",
              }}
            >
              Click to restore
            </span>
          </div>
        )}

        {/* Content area */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden",
            opacity: isMinimized ? 0 : 1,
            pointerEvents: isMinimized ? "none" : "auto",
            transition: "opacity 0.28s",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
