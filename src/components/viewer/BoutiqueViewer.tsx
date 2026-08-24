"use client";

import { motion } from "framer-motion";
import { useViewerStore, type VariantKey } from "@/store/viewerStore";

const DIALS: { key: VariantKey; label: string }[] = [
  { key: "nails", label: "Red Velvet Nails" },
  { key: "stilettos", label: "Red Velvet Stilettos" },
  { key: "nylons", label: "Red Velvet Nylons" },
];

const SWATCHES = ["A", "B", "C", "D"];

export function BoutiqueViewer() {
  const { activeVariant, selectedSwatches, setActiveVariant, selectSwatch } = useViewerStore();

  return (
    <div className="relative w-full h-screen bg-[#2b2b2b] overflow-hidden">

      {/* ── Left/Center zone ── */}
      <div className="absolute inset-0 right-48 flex flex-col">

        {/* Main Stage — strict 16:9 */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full aspect-video bg-[#454545] rounded-sm flex items-center justify-center">
            <span className="text-white/20 font-montserrat text-sm tracking-widest uppercase">
              Main Stage
            </span>
          </div>
        </div>

        {/* Radial Dials — bottom of left zone */}
        <div className="flex justify-center items-end gap-10 pb-8">
          {DIALS.map(({ key, label }) => {
            const isActive = activeVariant === key;
            return (
              <motion.button
                key={key}
                className="flex flex-col items-center gap-2 focus:outline-none"
                whileTap={{ scale: 0.93 }}
                onClick={() => setActiveVariant(isActive ? null : key)}
                aria-pressed={isActive}
              >
                {/* Semi-circular ring */}
                <div
                  className="w-20 h-10 transition-colors duration-200"
                  style={{
                    borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
                    border: `2px solid ${isActive ? "#7F2A3C" : "#454545"}`,
                    borderBottom: "none",
                    boxShadow: isActive ? "0 0 12px #7F2A3C55" : "none",
                  }}
                />
                <span
                  className="font-montserrat text-[10px] tracking-widest uppercase transition-colors duration-200"
                  style={{ color: isActive ? "#7F2A3C" : "#ffffff" }}
                >
                  {label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Preview Grid — top-right quadrant ── */}
      <div className="absolute top-0 right-0 w-48 h-full flex flex-col p-2 gap-1">
        <p className="font-montserrat text-[9px] tracking-widest uppercase text-white/30 px-1 pt-1 pb-0.5">
          Variants
        </p>
        <div className="grid grid-cols-2 gap-1">
          {SWATCHES.map((id) => {
            const isSelected = activeVariant && selectedSwatches[activeVariant] === id;
            return (
              <motion.button
                key={id}
                className="aspect-video rounded-sm focus:outline-none transition-colors duration-150"
                style={{
                  backgroundColor: isSelected ? "#7F2A3C" : "#454545",
                  border: isSelected ? "1px solid #7F2A3C" : "1px solid transparent",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => activeVariant && selectSwatch(activeVariant, id)}
              >
                <span className="font-opensans text-[10px] text-white/40">{id}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
