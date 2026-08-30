"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createGenerationJob, getGenerationJob } from "@/app/actions/generation-queue";
import {
  buildPrompt,
  buildParameters,
  DEFAULT_SETTINGS,
  type GeneratorSettings,
} from "@/lib/prompt-builder";
import {
  ETHNICITY_OPTIONS,
  AGE_OPTIONS,
  OUTFIT_OPTIONS,
  LOCATION_OPTIONS,
  NAIL_COLOR_OPTIONS,
  NAIL_STYLE_OPTIONS,
  NAIL_LENGTH_OPTIONS,
  FOOTWEAR_OPTIONS,
  HOSIERY_OPTIONS,
  ASPECT_RATIO_OPTIONS,
  PROMPT_POWER_OPTIONS,
  DURATION_OPTIONS,
  MOTION_OPTIONS,
  STYLE_OPTIONS,
  SKIN_TONE_OPTIONS,
  HAIR_COLOR_OPTIONS,
  HAIR_TYPE_OPTIONS,
} from "@/config/generator-options";

// ── Types ────────────────────────────────────────────────────────

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
}

// ── Design tokens ────────────────────────────────────────────────

const T = {
  bg: "#0a0a0a",
  panel: "#0e0d0e",
  border: "rgba(255,255,255,0.12)",
  accent: "#750851",
  accentFaint: "rgba(117,8,81,0.22)",
  text: "#ede9e4",
  muted: "rgba(237,233,228,0.60)",
  dim: "rgba(237,233,228,0.40)",
  input: "#1a171a",
  cormorant: "var(--font-montserrat), system-ui, sans-serif",
  jost: "var(--font-inter), system-ui, sans-serif",
};

// ── Micro-components ─────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: "0.72rem",
        letterSpacing: "0.10em",
        textTransform: "uppercase",
        color: T.dim,
        fontFamily: T.jost,
        fontWeight: 500,
        marginBottom: 5,
      }}
    >
      {children}
    </div>
  );
}

function SectionRule({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        margin: "18px 0 13px",
      }}
    >
      <span
        style={{
          fontSize: "0.68rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: T.muted,
          fontFamily: T.cormorant,
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: T.border }} />
    </div>
  );
}

function VSelect({
  value,
  onChange,
  options,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string | number }[];
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      style={{
        width: "100%",
        background: T.input,
        border: `1px solid ${T.border}`,
        borderRadius: 2,
        color: disabled ? T.dim : T.text,
        fontSize: "0.84rem",
        fontFamily: T.jost,
        padding: "8px 10px",
        appearance: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        outline: "none",
      }}
    >
      {options.map((o) => (
        <option key={String(o.value)} value={String(o.value)}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function VToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        color: checked ? T.text : T.muted,
        fontFamily: T.jost,
        fontSize: "0.84rem",
        transition: "color 0.2s",
      }}
    >
      <div
        style={{
          width: 28,
          height: 16,
          borderRadius: 8,
          background: checked ? T.accent : "#28222a",
          border: `1px solid ${checked ? T.accent : T.border}`,
          position: "relative",
          transition: "background 0.2s, border-color 0.2s",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 2,
            left: checked ? 13 : 2,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#ede9e4",
            transition: "left 0.18s",
          }}
        />
      </div>
      {label}
    </button>
  );
}

function StatusDot({ status }: { status: string }) {
  const color =
    status === "COMPLETED"
      ? "#4caf82"
      : status === "FAILED"
        ? "#e05a5a"
        : status === "PROCESSING"
          ? "#c9a840"
          : T.dim;
  return (
    <div
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: color,
        flexShrink: 0,
      }}
    />
  );
}

// ── Main component ───────────────────────────────────────────────

export function GeneratorShell({ models, recentJobs: initialJobs }: Props) {
  const [s, setS] = useState<GeneratorSettings>(DEFAULT_SETTINGS);
  const [jobs, setJobs] = useState<RecentJob[]>(initialJobs);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [stageUrl, setStageUrl] = useState<string | null>(null);
  const [stageType, setStageType] = useState<"IMAGE" | "VIDEO">("IMAGE");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const set = useCallback(
    <K extends keyof GeneratorSettings>(key: K, value: GeneratorSettings[K]) => {
      setS((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  // Load saved settings on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("vsc-generator-settings");
      if (saved) setS((prev) => ({ ...prev, ...JSON.parse(saved) }));
    } catch {}
  }, []);

  // Persist settings whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("vsc-generator-settings", JSON.stringify(s));
    } catch {}
  }, [s]);

  // Poll active job every 5s
  useEffect(() => {
    if (!activeJobId) return;
    pollRef.current = setInterval(async () => {
      try {
        const job = await getGenerationJob(activeJobId);
        if (!job) return;
        setJobStatus(job.status);
        if (job.status === "COMPLETED" && job.resultS3Url) {
          clearInterval(pollRef.current!);
          setStageUrl(job.resultS3Url);
          setGenerating(false);
          setJobs((prev) =>
            prev.map((j) =>
              j.id === activeJobId
                ? { ...j, status: "COMPLETED", resultS3Url: job.resultS3Url }
                : j,
            ),
          );
        } else if (job.status === "FAILED") {
          clearInterval(pollRef.current!);
          setError("Generation failed. Please try again.");
          setGenerating(false);
        }
      } catch {
        // network error — keep polling
      }
    }, 5000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [activeJobId]);

  async function handleGenerate() {
    setError(null);
    setGenerating(true);
    setStageUrl(null);
    setActiveJobId(null);
    setJobStatus(null);
    try {
      const prompt = buildPrompt(s);
      const parameters = buildParameters(s);
      const result = await createGenerationJob({
        digitalModelId: s.digitalModelId ?? undefined,
        prompt,
        poseReferenceS3Key: s.poseReferenceKey ?? undefined,
        outputType: s.outputType,
        parameters,
      });
      if ("error" in result) throw new Error(result.error);
      const { jobId } = result;
      setActiveJobId(jobId);
      setJobStatus("PENDING");
      setStageType(s.outputType);
      setJobs((prev) => [
        {
          id: jobId,
          status: "PENDING",
          outputType: s.outputType,
          resultS3Url: null,
          prompt,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed.");
      setGenerating(false);
    }
  }

  function loadJob(job: RecentJob) {
    if (!job.resultS3Url) return;
    setStageUrl(job.resultS3Url);
    setStageType(job.outputType as "IMAGE" | "VIDEO");
    setActiveJobId(null);
    setJobStatus(null);
  }

  const busyLabel =
    jobStatus === "PROCESSING" ? "Generating…" : jobStatus === "PENDING" ? "Queued…" : "Working…";

  // ── Render ───────────────────────────────────────────────────

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        overflow: "hidden",
        position: "relative",
        background: T.bg,
        color: T.text,
        fontFamily: T.jost,
      }}
    >

      {/* ── Left settings panel ── */}
      <div
        style={{
          width: 296,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          background: T.panel,
          borderRight: `1px solid ${T.border}`,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 18px 14px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: T.cormorant,
                fontSize: "1.05rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
              }}
            >
              Studio
            </div>
            <div
              style={{
                fontSize: "0.70rem",
                color: T.dim,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginTop: 3,
              }}
            >
              Generator
            </div>
          </div>
          <button
            type="button"
            onClick={() => setHistoryOpen((p) => !p)}
            style={{
              background: historyOpen ? T.accentFaint : "transparent",
              border: `1px solid ${historyOpen ? T.accent : T.border}`,
              borderRadius: 2,
              color: historyOpen ? T.text : T.muted,
              fontSize: "0.68rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "6px 11px",
              cursor: "pointer",
              fontFamily: T.jost,
              transition: "all 0.2s",
              marginTop: 4,
            }}
          >
            History
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "4px 18px 16px" }}>

          {/* ── Top selector rows ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 7, padding: "14px 0 4px" }}>

            {/* Realistic / Artistic */}
            <div style={{ display: "flex", gap: 6 }}>
              {(["REALISTIC", "ARTISTIC"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set("modelType", t)}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    borderRadius: 2,
                    border: `1px solid ${s.modelType === t ? T.accent : T.border}`,
                    background: s.modelType === t ? T.accent : "rgba(255,255,255,0.04)",
                    color: s.modelType === t ? "#fff" : T.muted,
                    fontSize: "0.82rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    fontFamily: T.cormorant,
                    fontWeight: 600,
                    transition: "all 0.2s",
                  }}
                >
                  {t === "REALISTIC" ? "Realistic" : "Artistic"}
                </button>
              ))}
            </div>

            {/* Female / Male */}
            <div style={{ display: "flex", gap: 6 }}>
              {(["FEMALE", "MALE"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => set("gender", g)}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    borderRadius: 2,
                    border: `1px solid ${s.gender === g ? T.accent : T.border}`,
                    background: s.gender === g ? T.accent : "rgba(255,255,255,0.04)",
                    color: s.gender === g ? "#fff" : T.muted,
                    fontSize: "0.82rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    fontFamily: T.cormorant,
                    fontWeight: 600,
                    transition: "all 0.2s",
                  }}
                >
                  {g === "FEMALE" ? "Female" : "Male"}
                </button>
              ))}
            </div>

            {/* Image / Video */}
            <div style={{ display: "flex", gap: 6 }}>
              {(["IMAGE", "VIDEO"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set("outputType", t)}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    borderRadius: 2,
                    border: `1px solid ${s.outputType === t ? T.accent : T.border}`,
                    background: s.outputType === t ? T.accentFaint : "rgba(255,255,255,0.04)",
                    color: s.outputType === t ? T.text : T.muted,
                    fontSize: "0.82rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    fontFamily: T.cormorant,
                    fontWeight: 600,
                    transition: "all 0.2s",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <SectionRule label="Style" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 4 }}>
            {STYLE_OPTIONS.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => set("style", value)}
                style={{
                  padding: "11px 0",
                  borderRadius: 2,
                  border: `1px solid ${s.style === value ? T.accent : T.border}`,
                  background: s.style === value ? T.accent : "rgba(255,255,255,0.03)",
                  color: s.style === value ? "#fff" : T.muted,
                  fontSize: "0.82rem",
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  fontFamily: T.cormorant,
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Digital model */}
          {models.length > 0 && (
            <>
              <SectionRule label="Digital Model" />
              <VSelect
                value={s.digitalModelId ?? ""}
                onChange={(v) => set("digitalModelId", v || null)}
                options={[
                  { label: "None — Generic", value: "" },
                  ...models.map((m) => ({ label: m.name, value: m.id })),
                ]}
              />
            </>
          )}

          {/* Appearance */}
          <SectionRule label="Appearance Settings" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 8 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <FieldLabel>Ethnicity</FieldLabel>
                <VSelect value={s.ethnicity} onChange={(v) => set("ethnicity", v)} options={ETHNICITY_OPTIONS} />
              </div>
              <div>
                <FieldLabel>Skin Tone</FieldLabel>
                <VSelect value={s.skinTone} onChange={(v) => set("skinTone", v)} options={SKIN_TONE_OPTIONS} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <FieldLabel>Hair Color</FieldLabel>
                <VSelect value={s.hairColor} onChange={(v) => set("hairColor", v)} options={HAIR_COLOR_OPTIONS} />
              </div>
              <div>
                <FieldLabel>Hair Type</FieldLabel>
                <VSelect value={s.hairType} onChange={(v) => set("hairType", v)} options={HAIR_TYPE_OPTIONS} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <FieldLabel>Age Range</FieldLabel>
                <VSelect value={s.ageRange} onChange={(v) => set("ageRange", v)} options={AGE_OPTIONS} />
              </div>
              <div>
                <FieldLabel>Attire</FieldLabel>
                <VSelect value={s.outfit} onChange={(v) => set("outfit", v)} options={OUTFIT_OPTIONS} />
              </div>
            </div>
            <div>
              <FieldLabel>Location / Setting</FieldLabel>
              <VSelect value={s.location} onChange={(v) => set("location", v)} options={LOCATION_OPTIONS} />
            </div>
          </div>

          {/* Foot & Leg */}
          <SectionRule label="Foot & Leg Detail" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <FieldLabel>Footwear</FieldLabel>
                <VSelect value={s.footwear} onChange={(v) => set("footwear", v)} options={FOOTWEAR_OPTIONS} />
              </div>
              <div>
                <FieldLabel>Hosiery</FieldLabel>
                <VSelect value={s.hosiery} onChange={(v) => set("hosiery", v)} options={HOSIERY_OPTIONS} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <FieldLabel>Nail Color</FieldLabel>
                <VSelect value={s.nailColor} onChange={(v) => set("nailColor", v)} options={NAIL_COLOR_OPTIONS} />
              </div>
              <div>
                <FieldLabel>Nail Shape</FieldLabel>
                <VSelect value={s.nailStyle} onChange={(v) => set("nailStyle", v)} options={NAIL_STYLE_OPTIONS} />
              </div>
            </div>
            <div>
              <FieldLabel>Nail Length</FieldLabel>
              <VSelect value={s.nailLength} onChange={(v) => set("nailLength", v)} options={NAIL_LENGTH_OPTIONS} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 12, marginBottom: 4 }}>
            <VToggle label="Toe Rings" checked={s.toeRings} onChange={(v) => set("toeRings", v)} />
            <VToggle label="Anklet" checked={s.anklet} onChange={(v) => set("anklet", v)} />
            <VToggle label="Scrunch" checked={s.scrunch} onChange={(v) => set("scrunch", v)} />
          </div>

          {/* Pose */}
          <SectionRule label="Pose Control" />
          <div style={{ marginBottom: 8 }}>
            <FieldLabel>Pose Strength — {s.poseStrength.toFixed(2)}</FieldLabel>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={s.poseStrength}
              onChange={(e) => set("poseStrength", parseFloat(e.target.value))}
              style={{ width: "100%", accentColor: T.accent, margin: "4px 0" }}
            />
          </div>
          <div
            style={{
              fontSize: "0.70rem",
              color: T.dim,
              background: T.input,
              border: `1px dashed ${T.border}`,
              borderRadius: 2,
              padding: "10px",
              textAlign: "center",
              letterSpacing: "0.06em",
            }}
          >
            Pose library — coming soon
          </div>

          {/* Prompt */}
          <SectionRule label="Prompt" />
          <textarea
            value={s.customPrompt}
            onChange={(e) => set("customPrompt", e.target.value)}
            placeholder="Additional details…"
            rows={3}
            style={{
              width: "100%",
              background: T.input,
              border: `1px solid ${T.border}`,
              borderRadius: 2,
              color: T.text,
              fontSize: "0.76rem",
              fontFamily: T.jost,
              padding: "8px 10px",
              resize: "vertical",
              outline: "none",
              lineHeight: 1.5,
              marginBottom: 6,
            }}
          />
          <textarea
            value={s.negativePrompt}
            onChange={(e) => set("negativePrompt", e.target.value)}
            placeholder="Negative prompt…"
            rows={2}
            style={{
              width: "100%",
              background: T.input,
              border: `1px solid ${T.border}`,
              borderRadius: 2,
              color: T.text,
              fontSize: "0.76rem",
              fontFamily: T.jost,
              padding: "8px 10px",
              resize: "vertical",
              outline: "none",
              lineHeight: 1.5,
            }}
          />

          {/* Advanced */}
          <SectionRule label="Advanced" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <FieldLabel>Aspect Ratio</FieldLabel>
                <VSelect
                  value={s.aspectRatio}
                  onChange={(v) => set("aspectRatio", v)}
                  options={ASPECT_RATIO_OPTIONS}
                />
              </div>
              <div>
                <FieldLabel>Prompt Power</FieldLabel>
                <VSelect
                  value={s.promptPower}
                  onChange={(v) => set("promptPower", v)}
                  options={PROMPT_POWER_OPTIONS}
                />
              </div>
            </div>
            {s.outputType === "VIDEO" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div>
                  <FieldLabel>Duration</FieldLabel>
                  <VSelect
                    value={String(s.duration)}
                    onChange={(v) => set("duration", parseInt(v))}
                    options={DURATION_OPTIONS.map((o) => ({ label: o.label, value: String(o.value) }))}
                  />
                </div>
                <div>
                  <FieldLabel>Motion</FieldLabel>
                  <VSelect
                    value={s.motionIntensity}
                    onChange={(v) => set("motionIntensity", v)}
                    options={MOTION_OPTIONS}
                  />
                </div>
              </div>
            )}
            <div>
              <FieldLabel>Seed (blank = random)</FieldLabel>
              <input
                type="number"
                value={s.seed ?? ""}
                onChange={(e) =>
                  set("seed", e.target.value ? parseInt(e.target.value) : null)
                }
                placeholder="Random"
                style={{
                  width: "100%",
                  background: T.input,
                  border: `1px solid ${T.border}`,
                  borderRadius: 2,
                  color: T.text,
                  fontSize: "0.76rem",
                  fontFamily: T.jost,
                  padding: "7px 10px",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div style={{ height: 24 }} />
        </div>

        {/* Sticky generate footer */}
        <div
          style={{
            padding: "12px 18px 16px",
            borderTop: `1px solid ${T.border}`,
            background: T.panel,
          }}
        >
          {error && (
            <div
              style={{
                fontSize: "0.70rem",
                color: "#e05a5a",
                letterSpacing: "0.03em",
                lineHeight: 1.5,
                marginBottom: 10,
              }}
            >
              {error}
            </div>
          )}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            style={{
              width: "100%",
              padding: "14px 0",
              background: generating ? "rgba(117,8,81,0.22)" : T.accent,
              border: "none",
              borderRadius: 2,
              color: generating ? "rgba(237,233,228,0.38)" : "#fff",
              fontSize: "0.84rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontFamily: T.cormorant,
              fontWeight: 600,
              cursor: generating ? "not-allowed" : "pointer",
              transition: "background 0.25s, color 0.25s",
            }}
          >
            {generating ? busyLabel : "Generate"}
          </button>
        </div>
      </div>

      {/* ── Center stage ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          padding: 32,
        }}
      >
        {stageUrl ? (
          stageType === "VIDEO" ? (
            <video
              key={stageUrl}
              src={stageUrl}
              autoPlay
              loop
              muted
              playsInline
              controls
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                boxShadow: "0 0 80px rgba(0,0,0,0.85)",
              }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={stageUrl}
              alt="Generated result"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                boxShadow: "0 0 80px rgba(0,0,0,0.85)",
              }}
            />
          )
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
            {generating ? (
              <>
                <Spinner />
                <div
                  style={{
                    fontFamily: T.cormorant,
                    fontSize: "1.10rem",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    color: "rgba(237,233,228,0.55)",
                  }}
                >
                  {busyLabel}
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    width: 1,
                    height: 64,
                    background: `linear-gradient(to bottom, transparent, ${T.accent})`,
                  }}
                />
                <div
                  style={{
                    fontFamily: T.cormorant,
                    fontSize: "1.60rem",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    color: "rgba(237,233,228,0.22)",
                    textAlign: "center",
                    lineHeight: 1.5,
                  }}
                >
                  Your creation<br />awaits
                </div>
                <div
                  style={{
                    width: 1,
                    height: 64,
                    background: `linear-gradient(to top, transparent, ${T.accent})`,
                  }}
                />
              </>
            )}
          </div>
        )}
        <style>{`@keyframes vspin { to { transform: rotate(360deg); } }`}</style>
      </div>

      {/* ── History slide-in overlay ── */}
      {historyOpen && (
        <>
          {/* Dim the canvas slightly when history is open */}
          <div
            onClick={() => setHistoryOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
              background: "rgba(0,0,0,0)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: 260,
              zIndex: 11,
              display: "flex",
              flexDirection: "column",
              background: T.panel,
              borderLeft: `1px solid ${T.border}`,
              boxShadow: "-12px 0 40px rgba(0,0,0,0.45)",
              overflow: "hidden",
            }}
          >
            {/* Panel header */}
            <div
              style={{
                padding: "14px 14px 12px",
                borderBottom: `1px solid ${T.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontSize: "0.60rem",
                  letterSpacing: "0.20em",
                  textTransform: "uppercase",
                  color: T.dim,
                  fontFamily: T.jost,
                }}
              >
                History
              </span>
              <button
                type="button"
                onClick={() => setHistoryOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: T.dim,
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  lineHeight: 1,
                  padding: "0 2px",
                }}
              >
                ×
              </button>
            </div>

            {/* Job list */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              {jobs.length === 0 ? (
                <div
                  style={{
                    padding: "20px 14px",
                    fontSize: "0.72rem",
                    color: T.dim,
                    fontFamily: T.jost,
                    lineHeight: 1.6,
                  }}
                >
                  No generations yet.
                </div>
              ) : (
                jobs.map((job) => (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => { loadJob(job); setHistoryOpen(false); }}
                    disabled={!job.resultS3Url}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "11px 14px",
                      background: "none",
                      border: "none",
                      borderBottom: `1px solid ${T.border}`,
                      cursor: job.resultS3Url ? "pointer" : "default",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                      <StatusDot status={job.status} />
                      <span
                        style={{
                          fontSize: "0.60rem",
                          color: T.dim,
                          fontFamily: T.jost,
                          letterSpacing: "0.10em",
                          textTransform: "uppercase",
                        }}
                      >
                        {job.status.toLowerCase()}
                      </span>
                      <span style={{ marginLeft: "auto", fontSize: "0.58rem", color: T.dim, fontFamily: T.jost }}>
                        {job.outputType}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "0.72rem",
                        color: T.muted,
                        fontFamily: T.jost,
                        lineHeight: 1.45,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {job.prompt}
                    </div>
                    <div style={{ fontSize: "0.60rem", color: T.dim, fontFamily: T.jost, marginTop: 4 }}>
                      {new Date(job.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "2px solid rgba(117,8,81,0.18)",
        borderTopColor: "#750851",
        animation: "vspin 1.1s linear infinite",
      }}
    />
  );
}
