"use client";

export default function GenerateError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{
      background: "#0a0a0a",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#ede9e4",
      fontFamily: "var(--font-jost), system-ui, sans-serif",
      flexDirection: "column",
      gap: 16,
      textAlign: "center",
      padding: "0 24px",
    }}>
      <p style={{ fontSize: "1.1rem", color: "rgba(237,233,228,0.55)", maxWidth: 420 }}>
        Something went wrong loading the studio. Please try again.
      </p>
      <button
        onClick={reset}
        style={{
          padding: "10px 28px",
          background: "#750851",
          border: "none",
          borderRadius: 2,
          color: "#ede9e4",
          fontFamily: "var(--font-jost), system-ui, sans-serif",
          fontSize: "0.76rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        Retry
      </button>
    </div>
  );
}
