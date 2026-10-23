"use client";

import { WatermarkConfig } from "@/types/editor";
import { toast } from "react-hot-toast";

interface WatermarkModalProps {
  isOpen: boolean;
  localWatermark: WatermarkConfig;
  onClose: () => void;
  onChange: (wm: WatermarkConfig) => void;
  onApply: () => void;
}

const DEFAULT_COLORS = ["#000000", "#dc2626", "#2563eb", "#64748b"];
const PLACEMENTS: Array<WatermarkConfig["placement"]> = ["diagonal", "center", "mosaic"];

function WatermarkPreview({ watermark }: { watermark: WatermarkConfig }) {
  return (
    <div className="w-full aspect-[1/1.414] max-w-[280px] bg-white border border-slate-200 shadow-xl relative overflow-hidden flex items-center justify-center rounded-sm pointer-events-none">
      {/* Fake document lines */}
      <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-slate-100 flex flex-col gap-2 p-4">
        <div className="h-2 bg-slate-200 w-3/4 rounded-full" />
        <div className="h-2 bg-slate-100 w-full rounded-full" />
        <div className="h-2 bg-slate-100 w-5/6 rounded-full" />
        <div className="h-2 bg-slate-100 w-full rounded-full" />
        <div className="h-32 bg-slate-100 w-full mt-4 rounded" />
      </div>
      {/* Watermark overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        {watermark.placement === "mosaic" ? (
          <div className="w-full h-full flex flex-wrap items-center justify-center gap-4 p-2 opacity-40">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="font-bold whitespace-nowrap -rotate-45"
                style={{ color: watermark.color ?? "#000000", fontSize: "12px", opacity: watermark.opacity }}
              >
                {watermark.text || "TEXT"}
              </div>
            ))}
          </div>
        ) : (
          <div
            className="font-bold whitespace-nowrap"
            style={{
              color: watermark.color ?? "#000000",
              transform: watermark.placement === "diagonal" ? "rotate(-45deg)" : "none",
              fontSize: "36px",
              opacity: watermark.opacity,
            }}
          >
            {watermark.text || "TEXT"}
          </div>
        )}
      </div>
    </div>
  );
}

export function WatermarkModal({ isOpen, localWatermark, onClose, onChange, onApply }: WatermarkModalProps) {
  if (!isOpen) return null;

  const handleApply = () => {
    if (!localWatermark.text || !localWatermark.text.trim()) {
      toast.error("Please enter text for the watermark");
      return;
    }
    toast.success("Watermark applied successfully");
    onApply();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 z-[9999]">
      <div className="bg-white dark:bg-[#1a1c29] rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-transparent">
          <h3 className="text-2xl font-black flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">branding_watermark</span>
            Global Watermark
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-500 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center size-10 shrink-0"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-full">
          {/* Preview panel */}
          <div className="w-full md:w-1/2 bg-slate-100/50 dark:bg-[#0B0F19] p-8 flex flex-col items-center justify-center border-r border-slate-200 dark:border-slate-800 relative">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest absolute top-6 left-6">
              Preview
            </div>
            <WatermarkPreview watermark={localWatermark} />
          </div>

          {/* Controls panel */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-6">
                This watermark will be applied to{" "}
                <strong className="text-primary">all pages</strong> of your document.
              </p>

              <div className="space-y-6">
                {/* Text input */}
                <div>
                  <span className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">
                    Watermark Text
                  </span>
                  <input
                    type="text"
                    value={localWatermark.text}
                    onChange={(e) => onChange({ ...localWatermark, text: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); handleApply(); }
                    }}
                    autoFocus
                    placeholder="e.g. DRAFT or CONFIDENTIAL"
                    className="w-full px-5 py-4 text-xl font-serif rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-background-dark outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:italic"
                  />
                </div>

                {/* Color + Opacity row */}
                <div className="flex gap-4">
                  <label className="flex-1">
                    <span className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">Color</span>
                    <div className="flex gap-2 mb-2">
                      {DEFAULT_COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => onChange({ ...localWatermark, color: c })}
                          className={`size-6 rounded-full shadow-sm border-2 transition-all ${
                            localWatermark.color === c ? "border-primary scale-110" : "border-transparent hover:scale-110"
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <div className="relative">
                      <input
                        type="color"
                        value={localWatermark.color ?? "#000000"}
                        onChange={(e) => onChange({ ...localWatermark, color: e.target.value })}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      />
                      <div className="w-full h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 pointer-events-none">
                        <div
                          className="w-6 h-6 rounded-md shadow-sm border border-black/10"
                          style={{ backgroundColor: localWatermark.color ?? "#000000" }}
                        />
                        <span className="text-sm font-semibold uppercase">
                          {localWatermark.color ?? "#000000"}
                        </span>
                      </div>
                    </div>
                  </label>

                  <label className="flex-[1.5]">
                    <span className="text-xs font-bold text-slate-500 mb-2 flex justify-between uppercase tracking-wider">
                      <span>Opacity</span>
                      <span className="text-primary">{Math.round(localWatermark.opacity * 100)}%</span>
                    </span>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={localWatermark.opacity}
                      onChange={(e) => onChange({ ...localWatermark, opacity: parseFloat(e.target.value) })}
                      className="w-full h-12 accent-primary cursor-pointer"
                    />
                  </label>
                </div>

                {/* Placement */}
                <div>
                  <span className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">
                    Placement Style
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    {PLACEMENTS.map((style) => (
                      <button
                        key={style}
                        onClick={() => onChange({ ...localWatermark, placement: style })}
                        className={`py-3 rounded-xl border-2 text-sm font-bold capitalize transition-all ${
                          localWatermark.placement === style
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300"
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="btn-primary shadow-lg shadow-primary/30 flex items-center gap-2"
              >
                <span className="material-symbols-outlined">check_circle</span>
                Apply Watermark
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
