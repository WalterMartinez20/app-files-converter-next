"use client";

import React from "react";
import { SplitMode } from "@/hooks/useSplitPdfUI";

interface SplitModeSelectorProps {
  splitMode: SplitMode;
  onSplitModeChange: (mode: SplitMode) => void;
}

export function SplitModeSelector({
  splitMode,
  onSplitModeChange,
}: SplitModeSelectorProps) {
  return (
    <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
      <button
        type="button"
        onClick={() => onSplitModeChange("range")}
        className={`flex-1 py-3 px-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
          splitMode === "range"
            ? "bg-white dark:bg-slate-900 text-primary shadow-sm font-black"
            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">view_timeline</span>
        Split by range
      </button>

      <button
        type="button"
        onClick={() => onSplitModeChange("pages")}
        className={`flex-1 py-3 px-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
          splitMode === "pages"
            ? "bg-white dark:bg-slate-900 text-primary shadow-sm font-black"
            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">filter_none</span>
        Extract pages
      </button>
    </div>
  );
}
