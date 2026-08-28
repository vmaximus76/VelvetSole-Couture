"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createGenerationJob } from "@/app/actions/generation-queue";

// ── Types ─────────────────────────────────────────────────────────────────────

type ContentType = "REALISTIC" | "ARTISTIC";
type Subject     = "FEMALE" | "MALE";
type OutputType  = "IMAGE" | "VIDEO";
type JobStatus   = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

interface JobState {
  id: string;
  status: JobStatus;
  resultUrl: string | null;
  outputType: OutputType;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const STYLES = ["Classic", "Elegant", "Glamour", "Boudoir", "Editorial"] as const;

const ASPECT_RATIOS: Record<string, string> = {
  portrait:  "2 / 3",
  tall:      "9 / 16",
  square:    "1 / 1",
  landscape: "16 / 9",
};

// ── Tiny helper components ────────────────────────────────────────────────────

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "11px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#ede9e4",
          fontFamily: "var(--font-jost), system-ui, sans-serif",
          fontSize: "0.68rem",
          fontWeight: 400,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#750851", display: "inline-block", flexShrink: 0 }} />
          {title}
        </span>
        <span style={{ color: "rgba(237,233,228,0.25)", fontSize: "0.60rem" }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && <div style={{ paddingBottom: 14 }}>{children}</div>}
    </div>
  );
}

function Sel({
  value,
  onChange,
  opts,
}: {
  value: string;
  onChange: (v: string) => void;
  opts: [string, string][];
}) {
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          appearance: "none",
          WebkitAppearance: "none",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 2,
          color: "#ede9e4",
          fontFamily: "var(--font-jost), system-ui, sans-serif",
          fontSize: "0.74rem",
          padding: "6px 26px 6px 9px",
          cursor: "pointer",
          outline: "none",
        }}
      >
        {opts.map(([v, l]) => (
          <option key={v} value={v} style={{ background: "#1a1a1a" }}>{l}</option>
        ))}
      </select>
      <span style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "rgba(237,233,228,0.30)", fontSize: "0.60rem" }}>▾</span>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "var(--font-jost), system-ui, sans-serif",
      fontSize: "0.62rem",
      letterSpacing: "0.10em",
      textTransform: "uppercase",
      color: "rgba(237,233,228,0.32)",
      marginBottom: 5,
    }}>
      {children}
    </p>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "4px 11px",
        background: active ? "#750851" : "rgba(255,255,255,0.04)",
        border: `1px solid ${active ? "#750851" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 2,
        color: active ? "#ede9e4" : "rgba(237,233,228,0.42)",
        fontFamily: "var(--font-jost), system-ui, sans-serif",
        fontSize: "0.70rem",
        letterSpacing: "0.06em",
        cursor: "pointer",
        transition: "all 0.16s",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

function Check({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label
      style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", userSelect: "none" }}
      onClick={() => onChange(!checked)}
    >
      <div style={{
        width: 14,
        height: 14,
        borderRadius: 2,
        border: `1.5px solid ${checked ? "#750851" : "rgba(255,255,255,0.15)"}`,
        background: checked ? "#750851" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "all 0.14s",
      }}>
        {checked && <span style={{ color: "#ede9e4", fontSize: "0.52rem", lineHeight: 1, fontWeight: "bold" }}>✓</span>}
      </div>
      <span style={{
        fontFamily: "var(--font-jost), system-ui, sans-serif",
        fontSize: "0.72rem",
        color: checked ? "#ede9e4" : "rgba(237,233,228,0.42)",
        transition: "color 0.14s",
      }}>
        {label}
      </span>
    </label>
  );
}

function PulseRing() {
  return (
    <div style={{ position: "relative", width: 40, height: 40, margin: "0 auto" }}>
      <style>{`
        @keyframes vscPulse {
          0%,100% { transform:scale(0.8); opacity:0.6; }
          50%      { transform:scale(1.4); opacity:0.1; }
        }
        .vsc-pr { position:absolute; inset:0; border-radius:50%; border:1.5px solid rgba(117,8,81,0.55); animation:vscPulse 2s ease-in-out infinite; }
        .vsc-pr:nth-child(2){ animation-delay:0.65s; }
        .vsc-pr:nth-child(3){ animation-delay:1.3s; }
      `}</style>
      <div className="vsc-pr" />
      <div className="vsc-pr" />
      <div className="vsc-pr" />
      <div style={{ position: "absolute", inset: "35%", borderRadius: "50%", background: "#750851" }} />
    </div>
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────

export function GenerateForm() {
  // Mode
  const [contentType, setContentType] = useState<ContentType>("REALISTIC");
  const [subject,     setSubject]     = useState<Subject>("FEMALE");
  const [outputType,  setOutputType]  = useState<OutputType>("IMAGE");

  // Style
  const [style, setStyle] = useState("CLASSIC");

  // Appearance
  const [ethnicity, setEthnicity] = useState("auto");
  const [skinTone,  setSkinTone]  = useState("auto");
  const [hairColor, setHairColor] = useState("auto");
  const [hairType,  setHairType]  = useState("auto");
  const [age,       setAge]       = useState("auto");
  const [attire,    setAttire]    = useState("auto");
  const [location,  setLocation]  = useState("auto");

  // Foot & leg
  const [nailColor,  setNailColor]  = useState("auto");
  const [nailShape,  setNailShape]  = useState("auto");
  const [hosiery,    setHosiery]    = useState("bare");
  const [footwear,   setFootwear]   = useState("bare");
  const [heelHeight, setHeelHeight] = useState("auto");
  const [toerings,   setToerings]   = useState(false);
  const [anklet,     setAnklet]     = useState(false);
  const [scrunch,    setScrunch]    = useState(false);

  // Prompt
  const [promptTab,      setPromptTab]      = useState<"prompt" | "negative">("prompt");
  const [prompt,         setPrompt]         = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [promptPower,    setPromptPower]    = useState("HIGH");

  // Additional
  const [aspectRatio,   setAspectRatio]   = useState("portrait");
  const [poseStrength,  setPoseStrength]  = useState(0.4);

  // Job tracking
  const [job,        setJob]        = useState<JobState | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const heelTypes = ["stiletto", "platform", "kitten", "mules", "heels"];
  const showHeelHeight = heelTypes.some((h) => footwear === h);

  // Poll while job is active
  useEffect(() => {
    if (!job || job.status === "COMPLETED" || job.status === "FAILED") {
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }
    pollRef.current = setInterval(async () => {
      try {
        const res  = await fetch(`/api/job/${job.id}`);
        if (!res.ok) return;
        const data = await res.json() as { status: JobStatus; resultS3Url: string | null };
        setJob((prev) => prev ? { ...prev, status: data.status, resultUrl: data.resultS3Url } : prev);
        if (data.status === "COMPLETED" || data.status === "FAILED") {
          clearInterval(pollRef.current!);
          setSubmitting(false);
        }
      } catch { /* non-fatal */ }
    }, 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [job?.id, job?.status]);

  async function handleGenerate() {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    setJob(null);
    if (pollRef.current) clearInterval(pollRef.current);

    try {
      const accessories: string[] = [
        ...(toerings ? ["toerings"] : []),
        ...(anklet   ? ["anklet"]   : []),
        ...(scrunch  ? ["scrunch"]  : []),
      ];
      const parameters = {
        contentType, subject, style,
        ethnicity, skinTone, hairColor, hairType, age, attire, location,
        nailColor, nailShape, hosiery, footwear, heelHeight,
        accessories, negativePrompt, promptPower, aspectRatio, poseStrength,
      };

      const { jobId } = await createGenerationJob({
        prompt: prompt.trim() || "(auto)",
        outputType,
        parameters,
      });
      setJob({ id: jobId, status: "PENDING", resultUrl: null, outputType });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  const previewAspect = ASPECT_RATIOS[aspectRatio] ?? "2 / 3";

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

      {/* ── Left sidebar ─────────────────────────────────────────── */}
      <div style={{
        width: 292,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}>

        {/* Scrollable settings area */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px 14px 0",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(117,8,81,0.25) transparent",
        }}>

          {/* Mode pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: 2 }}>
            <Pill active={contentType === "REALISTIC"} onClick={() => setContentType("REALISTIC")}>Realistic</Pill>
            <Pill active={contentType === "ARTISTIC"}  onClick={() => setContentType("ARTISTIC")}>Artistic</Pill>
            <Pill active={subject === "FEMALE"} onClick={() => setSubject("FEMALE")}>Female</Pill>
            <Pill active={subject === "MALE"}   onClick={() => setSubject("MALE")}>Male</Pill>
            <Pill active={outputType === "IMAGE"} onClick={() => setOutputType("IMAGE")}>⊡ Image</Pill>
            <Pill active={outputType === "VIDEO"} onClick={() => setOutputType("VIDEO")}>▷ Video</Pill>
          </div>

          {/* Style */}
          <Section title="Style">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 5 }}>
              {STYLES.map((s) => {
                const key = s.toUpperCase();
                const active = style === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setStyle(key)}
                    style={{
                      padding: "9px 6px",
                      background: active ? "rgba(117,8,81,0.22)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${active ? "rgba(117,8,81,0.48)" : "rgba(255,255,255,0.06)"}`,
                      borderRadius: 2,
                      color: active ? "#ede9e4" : "rgba(237,233,228,0.38)",
                      fontFamily: "var(--font-jost), system-ui, sans-serif",
                      fontSize: "0.70rem",
                      letterSpacing: "0.06em",
                      cursor: "pointer",
                      transition: "all 0.16s",
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Appearance */}
          <Section title="Appearance Settings">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div><Label>Ethnicity</Label><Sel value={ethnicity} onChange={setEthnicity} opts={[
                ["auto","Auto"],["white","White"],["black","Black"],["asian","Asian"],
                ["latina","Latina"],["south_asian","South Asian"],["middle_eastern","Middle Eastern"],["mixed","Mixed"],
              ]} /></div>
              <div><Label>Skin Tone</Label><Sel value={skinTone} onChange={setSkinTone} opts={[
                ["auto","Auto"],["fair","Fair"],["light","Light"],["medium","Medium"],
                ["olive","Olive"],["dark","Dark"],["deep","Deep"],
              ]} /></div>
              <div><Label>Hair Color</Label><Sel value={hairColor} onChange={setHairColor} opts={[
                ["auto","Auto"],["blonde","Blonde"],["brown","Brown"],["black","Black"],
                ["red","Red"],["auburn","Auburn"],["gray","Gray"],
              ]} /></div>
              <div><Label>Hair Type</Label><Sel value={hairType} onChange={setHairType} opts={[
                ["auto","Auto"],["straight","Straight"],["wavy","Wavy"],["curly","Curly"],
                ["updo","Updo"],["short","Short"],
              ]} /></div>
              <div><Label>Age</Label><Sel value={age} onChange={setAge} opts={[
                ["auto","Auto"],["20s","20s"],["30s","30s"],["40s","40s"],["50s","50s"],["60s","60s"],
              ]} /></div>
              <div><Label>Attire</Label><Sel value={attire} onChange={setAttire} opts={[
                ["auto","Auto"],["casual","Casual"],["elegant","Elegant"],["lingerie","Lingerie"],
                ["business","Business"],["sportswear","Sportswear"],["swimwear","Swimwear"],["bare","Bare / Minimal"],
              ]} /></div>
            </div>
            <div style={{ marginTop: 8 }}>
              <Label>Location / Setting</Label>
              <Sel value={location} onChange={setLocation} opts={[
                ["auto","Auto"],["studio","Studio"],["bedroom","Bedroom"],["living_room","Living Room"],
                ["outdoors","Outdoors"],["pool","Pool / Patio"],["bathroom","Bathroom"],["luxury","Luxury Interior"],
              ]} />
            </div>
          </Section>

          {/* Foot & Leg Detail */}
          <Section title="Foot & Leg Detail">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div><Label>Nail Color</Label><Sel value={nailColor} onChange={setNailColor} opts={[
                ["auto","Auto"],["red","Red"],["nude","Nude"],["black","Black"],["french","French"],
                ["pink","Pink"],["coral","Coral"],["deep_purple","Deep Purple"],["white","White"],
                ["dark_red","Dark Red"],["glitter","Glitter"],
              ]} /></div>
              <div><Label>Nail Shape</Label><Sel value={nailShape} onChange={setNailShape} opts={[
                ["auto","Auto"],["natural","Natural"],["oval","Oval"],["square","Square"],
                ["round","Round"],["coffin","Coffin"],["stiletto","Stiletto"],["almond","Almond"],
              ]} /></div>
              <div><Label>Hosiery</Label><Sel value={hosiery} onChange={setHosiery} opts={[
                ["bare","Bare"],["sheer_nude","Sheer Nude"],["sheer_black","Sheer Black"],
                ["sheer_white","Sheer White"],["opaque_black","Opaque Black"],
                ["fishnet","Fishnet"],["patterned","Patterned"],["white_socks","White Socks"],["ankle_socks","Ankle Socks"],
              ]} /></div>
              <div><Label>Footwear</Label><Sel value={footwear} onChange={setFootwear} opts={[
                ["bare","Bare"],["stiletto","Stiletto Heels"],["platform","Platform Heels"],
                ["kitten","Kitten Heels"],["mules","Mules"],["sandals","Sandals"],
                ["flats","Flats"],["sneakers","Sneakers"],["boots","Boots"],["strappy","Strappy Heels"],
              ]} /></div>
              {showHeelHeight && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <Label>Heel Height</Label>
                  <Sel value={heelHeight} onChange={setHeelHeight} opts={[
                    ["auto","Auto"],["low","Low (1–2\")"],["medium","Medium (3\")"],
                    ["high","High (4–5\")"],["extreme","Extreme (6\"+)"],
                  ]} />
                </div>
              )}
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 18, flexWrap: "wrap" }}>
              <Check checked={toerings} onChange={setToerings} label="Toe Ring" />
              <Check checked={anklet}   onChange={setAnklet}   label="Anklet" />
              <Check checked={scrunch}  onChange={setScrunch}  label="Scrunch" />
            </div>
          </Section>

          {/* Custom prompt */}
          <Section title="Custom Settings">
            <div style={{ display: "flex", gap: 0, marginBottom: 8, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 2, overflow: "hidden", width: "fit-content" }}>
              {(["prompt", "negative"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setPromptTab(tab)}
                  style={{
                    padding: "4px 13px",
                    background: promptTab === tab ? "rgba(255,255,255,0.07)" : "transparent",
                    border: "none",
                    color: promptTab === tab ? "#ede9e4" : "rgba(237,233,228,0.32)",
                    fontFamily: "var(--font-jost), system-ui, sans-serif",
                    fontSize: "0.68rem",
                    letterSpacing: "0.08em",
                    cursor: "pointer",
                  }}
                >
                  {tab === "negative" ? "Negative" : "Prompt"}
                </button>
              ))}
            </div>
            <textarea
              value={promptTab === "prompt" ? prompt : negativePrompt}
              onChange={(e) =>
                promptTab === "prompt"
                  ? setPrompt(e.target.value)
                  : setNegativePrompt(e.target.value)
              }
              placeholder={
                promptTab === "prompt"
                  ? "Add additional details to the scene…"
                  : "Elements to avoid in the generation…"
              }
              rows={4}
              maxLength={1000}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 2,
                color: "#ede9e4",
                fontFamily: "var(--font-jost), system-ui, sans-serif",
                fontSize: "0.78rem",
                fontWeight: 300,
                lineHeight: 1.58,
                padding: "9px 11px",
                resize: "vertical",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <div style={{ marginTop: 10 }}>
              <Label>Prompt Power</Label>
              <div style={{ display: "flex", gap: 4 }}>
                {["LOW", "MEDIUM", "HIGH", "MAX"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPromptPower(p)}
                    style={{
                      flex: 1,
                      padding: "5px 0",
                      background: promptPower === p ? "rgba(117,8,81,0.25)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${promptPower === p ? "rgba(117,8,81,0.48)" : "rgba(255,255,255,0.06)"}`,
                      borderRadius: 2,
                      color: promptPower === p ? "#ede9e4" : "rgba(237,233,228,0.32)",
                      fontFamily: "var(--font-jost), system-ui, sans-serif",
                      fontSize: "0.60rem",
                      letterSpacing: "0.04em",
                      cursor: "pointer",
                      transition: "all 0.14s",
                    }}
                  >
                    {p.charAt(0) + p.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          {/* Additional options */}
          <Section title="Additional Options">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div><Label>Aspect Ratio</Label><Sel value={aspectRatio} onChange={setAspectRatio} opts={[
                ["portrait","Portrait (2:3)"],["tall","Tall (9:16)"],
                ["square","Square (1:1)"],["landscape","Landscape (16:9)"],
              ]} /></div>
            </div>
            <div style={{ marginTop: 12 }}>
              <Label>Pose Strength — {poseStrength.toFixed(2)}</Label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={poseStrength}
                onChange={(e) => setPoseStrength(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: "#750851", marginTop: 4 }}
              />
            </div>
          </Section>

          <div style={{ height: 6 }} />
        </div>

        {/* Generate button — pinned at sidebar bottom */}
        <div style={{ flexShrink: 0, padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {error && (
            <p style={{ fontFamily: "var(--font-jost), system-ui, sans-serif", fontSize: "0.74rem", color: "#c0384a", marginBottom: 8 }}>
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={submitting}
            style={{
              width: "100%",
              padding: "12px",
              background: submitting ? "rgba(117,8,81,0.38)" : "#750851",
              border: "none",
              borderRadius: 2,
              color: "#ede9e4",
              fontFamily: "var(--font-jost), system-ui, sans-serif",
              fontSize: "0.76rem",
              letterSpacing: "0.20em",
              textTransform: "uppercase",
              cursor: submitting ? "not-allowed" : "pointer",
              transition: "background 0.18s",
            }}
          >
            {submitting
              ? job?.status === "PROCESSING" ? "Composing…"
              : "Queued…"
              : "Generate"}
          </button>
        </div>
      </div>

      {/* ── Right panel: preview ──────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#050505",
        padding: 32,
        gap: 20,
      }}>
        {!job ? (
          /* Empty state */
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              border: "1.5px solid rgba(117,8,81,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 18px",
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(117,8,81,0.40)" strokeWidth="1.2" strokeLinecap="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="rgba(117,8,81,0.40)" stroke="none"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
            </div>
            <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1.05rem", fontWeight: 300, color: "rgba(237,233,228,0.22)", letterSpacing: "0.04em" }}>
              Preview Area
            </p>
            <p style={{ marginTop: 5, fontFamily: "var(--font-jost), system-ui, sans-serif", fontSize: "0.68rem", letterSpacing: "0.06em", color: "rgba(237,233,228,0.12)" }}>
              Configure settings and press Generate
            </p>
          </div>
        ) : (
          /* Result frame */
          <>
            <div style={{
              aspectRatio: previewAspect,
              maxWidth: aspectRatio === "landscape" ? "100%" : 400,
              maxHeight: "calc(100vh - 220px)",
              width: "100%",
              background: "#111",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}>
              {job.status === "COMPLETED" && job.resultUrl ? (
                job.outputType === "IMAGE" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={job.resultUrl} alt="Generated" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <video src={job.resultUrl} autoPlay loop playsInline muted style={{ width: "100%", height: "100%" }} />
                )
              ) : job.status === "FAILED" ? (
                <p style={{ fontFamily: "var(--font-jost), system-ui, sans-serif", fontSize: "0.74rem", color: "#c0384a", letterSpacing: "0.10em" }}>
                  Generation failed — try again
                </p>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <PulseRing />
                  <p style={{ marginTop: 16, fontFamily: "var(--font-jost), system-ui, sans-serif", fontSize: "0.60rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(237,233,228,0.16)" }}>
                    {job.status === "PROCESSING" ? "Composing" : "In Queue"}
                  </p>
                </div>
              )}
            </div>

            {/* Actions after generation */}
            {job.status === "COMPLETED" && (
              <div style={{ display: "flex", gap: 10 }}>
                <Link
                  href={`/viewer/${job.id}`}
                  style={{
                    padding: "9px 22px",
                    background: "#750851",
                    color: "#ede9e4",
                    textDecoration: "none",
                    fontFamily: "var(--font-jost), system-ui, sans-serif",
                    fontSize: "0.72rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    borderRadius: 2,
                  }}
                >
                  View in Theater
                </Link>
                <button
                  type="button"
                  onClick={handleGenerate}
                  style={{
                    padding: "9px 22px",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: "rgba(237,233,228,0.50)",
                    fontFamily: "var(--font-jost), system-ui, sans-serif",
                    fontSize: "0.72rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    borderRadius: 2,
                    cursor: "pointer",
                  }}
                >
                  Regenerate
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
