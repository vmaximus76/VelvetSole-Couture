"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGenerationJob } from "@/app/actions/generation-queue";

const DIALS = [
  { key: "nails",     label: "Nails",     sub: "Style" },
  { key: "stilettos", label: "Stilettos", sub: "Footwear" },
  { key: "nylons",    label: "Nylons",    sub: "Hosiery" },
] as const;

type DialKey = typeof DIALS[number]["key"];

export function GenerateForm() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [outputType, setOutputType] = useState<"IMAGE" | "VIDEO">("VIDEO");
  const [activeDials, setActiveDials] = useState<Set<DialKey>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleDial(key: DialKey) {
    setActiveDials((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const parameters: Record<string, string | string[]> = {
        styles: [...activeDials],
      };
      const { jobId } = await createGenerationJob({
        prompt: prompt.trim(),
        outputType,
        parameters,
      });
      router.push(`/viewer/${jobId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "64px 28px 96px" }}>
      {/* Heading */}
      <div style={{ marginBottom: 52 }}>
        <p style={{
          fontFamily: "var(--font-jost), system-ui, sans-serif",
          fontSize: "0.70rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#750851",
          marginBottom: 14,
        }}>
          AI Studio
        </p>
        <h1 style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: 300,
          letterSpacing: "0.02em",
          color: "#ede9e4",
          lineHeight: 1.15,
          marginBottom: 16,
        }}>
          Describe Your Vision
        </h1>
        <p style={{
          fontFamily: "var(--font-jost), system-ui, sans-serif",
          fontSize: "0.92rem",
          fontWeight: 300,
          color: "#7e7a84",
          lineHeight: 1.70,
          maxWidth: "52ch",
        }}>
          Our AI composes an original piece from your description. Be as specific or as poetic as you like.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Prompt */}
        <div style={{ marginBottom: 40 }}>
          <label
            htmlFor="prompt"
            style={{
              display: "block",
              fontFamily: "var(--font-jost), system-ui, sans-serif",
              fontSize: "0.72rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#7e7a84",
              marginBottom: 10,
            }}
          >
            Your Description
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A close-up of arched feet in silk stockings, candlelit studio, slow movement…"
            maxLength={1000}
            rows={5}
            required
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 2,
              color: "#ede9e4",
              fontFamily: "var(--font-jost), system-ui, sans-serif",
              fontSize: "0.95rem",
              fontWeight: 300,
              lineHeight: 1.65,
              padding: "18px 20px",
              resize: "vertical",
              outline: "none",
              transition: "border-color 0.2s",
              boxSizing: "border-box",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(117,8,81,0.55)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; }}
          />
          <div style={{
            marginTop: 6,
            display: "flex",
            justifyContent: "flex-end",
            fontFamily: "var(--font-jost), system-ui, sans-serif",
            fontSize: "0.70rem",
            color: "rgba(126,122,132,0.50)",
            letterSpacing: "0.04em",
          }}>
            {prompt.length} / 1000
          </div>
        </div>

        {/* Style dials */}
        <div style={{ marginBottom: 40 }}>
          <p style={{
            fontFamily: "var(--font-jost), system-ui, sans-serif",
            fontSize: "0.72rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#7e7a84",
            marginBottom: 14,
          }}>
            Emphasize
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            {DIALS.map(({ key, label, sub }) => {
              const active = activeDials.has(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleDial(key)}
                  style={{
                    flex: 1,
                    padding: "18px 12px 14px",
                    background: active
                      ? "linear-gradient(175deg, rgba(117,8,81,0.28) 0%, rgba(117,8,81,0.06) 100%)"
                      : "rgba(255,255,255,0.03)",
                    border: active
                      ? "1.5px solid rgba(117,8,81,0.52)"
                      : "1.5px solid rgba(255,255,255,0.07)",
                    borderRadius: 2,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    transition: "background 0.22s, border-color 0.22s",
                  }}
                >
                  <span style={{
                    fontFamily: "var(--font-jost), system-ui, sans-serif",
                    fontSize: "0.80rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    fontWeight: 400,
                    color: active ? "#ede9e4" : "rgba(237,233,228,0.38)",
                    transition: "color 0.22s",
                  }}>
                    {label}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-jost), system-ui, sans-serif",
                    fontSize: "0.62rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: active ? "rgba(237,233,228,0.5)" : "rgba(237,233,228,0.18)",
                    transition: "color 0.22s",
                  }}>
                    {sub}
                  </span>
                  {active && (
                    <div style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "#750851",
                      boxShadow: "0 0 8px rgba(117,8,81,0.8)",
                      marginTop: 4,
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Output type */}
        <div style={{ marginBottom: 48 }}>
          <p style={{
            fontFamily: "var(--font-jost), system-ui, sans-serif",
            fontSize: "0.72rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#7e7a84",
            marginBottom: 14,
          }}>
            Output Format
          </p>
          <div style={{ display: "flex", gap: 0, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 2, overflow: "hidden", width: "fit-content" }}>
            {(["VIDEO", "IMAGE"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setOutputType(type)}
                style={{
                  padding: "10px 28px",
                  background: outputType === type ? "#750851" : "transparent",
                  border: "none",
                  color: outputType === type ? "#ede9e4" : "#7e7a84",
                  fontFamily: "var(--font-jost), system-ui, sans-serif",
                  fontSize: "0.78rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "background 0.18s, color 0.18s",
                }}
              >
                {type === "VIDEO" ? "Video" : "Image"}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p style={{
            marginBottom: 20,
            color: "#c0384a",
            fontFamily: "var(--font-jost), system-ui, sans-serif",
            fontSize: "0.85rem",
          }}>
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!prompt.trim() || submitting}
          style={{
            padding: "14px 48px",
            background: (!prompt.trim() || submitting) ? "rgba(117,8,81,0.35)" : "#750851",
            border: "none",
            color: "#ede9e4",
            fontFamily: "var(--font-jost), system-ui, sans-serif",
            fontSize: "0.82rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            cursor: (!prompt.trim() || submitting) ? "not-allowed" : "pointer",
            borderRadius: 2,
            transition: "background 0.22s",
          }}
        >
          {submitting ? "Generating…" : "Generate"}
        </button>
      </form>
    </main>
  );
}
