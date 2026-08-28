"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { confirmAge } from "@/app/actions/age-gate";

export function JoinButton() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleConfirm() {
    setPending(true);
    await confirmAge();
    router.push("/register");
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 264,
          height: 152,
          borderRadius: "50%",
          background: "transparent",
          border: "1.5px solid rgba(117,8,81,0.55)",
          color: "#ede9e4",
          fontFamily: "var(--font-jost), system-ui, sans-serif",
          fontSize: "0.82rem",
          fontWeight: 400,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          cursor: "pointer",
          transition: "border-color 0.22s, background 0.22s, transform 0.18s",
          boxShadow: "0 4px 24px rgba(117,8,81,0.12)",
        }}
        onMouseEnter={(e) => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.borderColor = "rgba(117,8,81,0.85)";
          btn.style.background = "rgba(117,8,81,0.08)";
          btn.style.transform = "scale(1.035)";
        }}
        onMouseLeave={(e) => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.borderColor = "rgba(117,8,81,0.55)";
          btn.style.background = "transparent";
          btn.style.transform = "scale(1)";
        }}
      >
        Join
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="age-gate-title"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(6,4,8,0.90)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div
            style={{
              background: "#1c1c1c",
              border: "1px solid rgba(117,8,81,0.30)",
              borderRadius: 3,
              padding: "56px 48px 48px",
              maxWidth: 400,
              width: "90%",
              textAlign: "center",
              boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
            }}
          >
            <div style={{ width: 36, height: 1, background: "#750851", margin: "0 auto 32px" }} />
            <h2
              id="age-gate-title"
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontWeight: 400,
                fontSize: "1.55rem",
                letterSpacing: "0.03em",
                color: "#ede9e4",
                marginBottom: 14,
              }}
            >
              Verify Your Age
            </h2>
            <p
              style={{
                color: "#7e7a84",
                fontSize: "0.87rem",
                lineHeight: 1.68,
                marginBottom: 36,
                maxWidth: "30ch",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              This studio contains adult content intended for viewers 18 years of age or older.
              By joining you confirm you are of legal age in your jurisdiction.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={pending}
                style={{
                  padding: "11px 30px",
                  background: "#750851",
                  color: "#ede9e4",
                  border: "none",
                  fontFamily: "var(--font-jost), system-ui, sans-serif",
                  fontSize: "0.80rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  cursor: pending ? "not-allowed" : "pointer",
                  borderRadius: 2,
                  opacity: pending ? 0.6 : 1,
                }}
              >
                {pending ? "Continuing…" : "I am 18 or older"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  padding: "11px 30px",
                  background: "transparent",
                  color: "#7e7a84",
                  border: "1px solid rgba(255,255,255,0.10)",
                  fontFamily: "var(--font-jost), system-ui, sans-serif",
                  fontSize: "0.80rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  borderRadius: 2,
                }}
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
