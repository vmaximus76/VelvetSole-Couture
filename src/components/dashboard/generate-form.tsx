"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createRenderJob } from "@/app/actions/queue";

interface BaseVideo {
  id: string;
  title: string;
  performerName: string;
}

export function GenerateForm({ videos }: { videos: BaseVideo[] }) {
  const [videoId, setVideoId] = useState(videos[0]?.id ?? "");
  const [denoiseStrength, setDenoiseStrength] = useState(0.5);
  const [styleScale, setStyleScale] = useState(5);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!videoId) return;
    setPending(true);
    try {
      const result = await createRenderJob({
        videoId,
        parameters: { denoiseStrength, styleScale },
      });
      toast.success(`Job queued — ID: ${result.jobId.slice(0, 8)}…`, {
        description: "Your render is in the pipeline. Check back shortly.",
      });
    } catch (err) {
      toast.error("Failed to queue job", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Video selector */}
      <div className="space-y-2">
        <label htmlFor="video-select" className="block text-xs font-montserrat uppercase tracking-widest text-white/60">
          Base Video
        </label>
        {videos.length === 0 ? (
          <p className="text-sm text-white/40">No base videos uploaded yet.</p>
        ) : (
          <select
            id="video-select"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            className="w-full bg-[#2b2b2b] border border-white/10 rounded-sm px-4 py-3 text-sm text-white font-opensans focus:outline-none focus:border-[#7F2A3C] transition-colors"
          >
            {videos.map((v) => (
              <option key={v.id} value={v.id}>
                {v.title} — {v.performerName}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Denoise Strength slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <label htmlFor="denoise" className="text-xs font-montserrat uppercase tracking-widest text-white/60">
            Denoise Strength
          </label>
          <span className="text-sm font-montserrat tabular-nums" style={{ color: "#7F2A3C" }}>
            {denoiseStrength.toFixed(2)}
          </span>
        </div>
        <input
          id="denoise"
          type="range"
          min={0.1}
          max={1.0}
          step={0.01}
          value={denoiseStrength}
          onChange={(e) => setDenoiseStrength(parseFloat(e.target.value))}
          className="w-full h-px bg-white/10 appearance-none cursor-pointer accent-[#7F2A3C]"
        />
        <div className="flex justify-between text-[10px] text-white/30 font-opensans">
          <span>0.10</span>
          <span>1.00</span>
        </div>
      </div>

      {/* Style Scale slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <label htmlFor="style-scale" className="text-xs font-montserrat uppercase tracking-widest text-white/60">
            Style Scale
          </label>
          <span className="text-sm font-montserrat tabular-nums" style={{ color: "#7F2A3C" }}>
            {styleScale}
          </span>
        </div>
        <input
          id="style-scale"
          type="range"
          min={1}
          max={10}
          step={1}
          value={styleScale}
          onChange={(e) => setStyleScale(parseInt(e.target.value, 10))}
          className="w-full h-px bg-white/10 appearance-none cursor-pointer accent-[#7F2A3C]"
        />
        <div className="flex justify-between text-[10px] text-white/30 font-opensans">
          <span>1</span>
          <span>10</span>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={pending || !videoId}
        className="w-full py-4 text-xs font-montserrat uppercase tracking-[0.2em] text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ backgroundColor: "#7F2A3C" }}
      >
        {pending ? "Queuing…" : "Push to AI Pipeline"}
      </button>

    </form>
  );
}
