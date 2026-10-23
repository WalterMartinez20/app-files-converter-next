"use client";

import React from "react";
import { ExtractSubMode } from "@/hooks/useSplitPdfUI";

interface SelectPagesControlsProps {
  extractMode: ExtractSubMode;
  onExtractModeChange: (mode: ExtractSubMode) => void;
  pagesInputText: string;
  onPagesInputChange: (val: string) => void;
  onPagesInputBlur: () => void;
  mergeFiles: boolean;
  onMergeFilesChange: (merged: boolean) => void;
}

export function SelectPagesControls({
  extractMode,
  onExtractModeChange,
  pagesInputText,
  onPagesInputChange,
  onPagesInputBlur,
  mergeFiles,
  onMergeFilesChange,
}: SelectPagesControlsProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Extract submode tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 pb-1">
        <button
          type="button"
          onClick={() => onExtractModeChange("all")}
          className={`flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            extractMode === "all"
              ? "border-primary text-primary"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Extract all pages
        </button>
        <button
          type="button"
          onClick={() => onExtractModeChange("select")}
          className={`flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            extractMode === "select"
              ? "border-primary text-primary"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Select pages
        </button>
      </div>

      {/* Select pages input */}
      {extractMode === "select" && (
        <div className="flex flex-col gap-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
            Pages to extract:
          </label>
          <input
            type="text"
            value={pagesInputText}
            onChange={(e) => onPagesInputChange(e.target.value)}
            onBlur={onPagesInputBlur}
            placeholder="e.g. 1-3, 5, 7"
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
          <p className="text-[11px] text-slate-400">
            Click on the page previews on the left to select or deselect them.
          </p>
        </div>
      )}

      {/* Merge extracted pages checkbox (ONLY in select mode) */}
      {extractMode === "select" && (
        <label className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/40 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={mergeFiles}
            onChange={(e) => onMergeFilesChange(e.target.checked)}
            className="size-5 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary cursor-pointer accent-primary"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 select-none">
              Merge extracted pages into one PDF file
            </span>
            <span className="text-[11px] text-slate-500">
              {mergeFiles
                ? "Output will be a single combined PDF"
                : "Output will be separate PDFs in a ZIP"}
            </span>
          </div>
        </label>
      )}

      {/* Info Callout Box */}
      <div className="p-3.5 bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
        <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">
          info
        </span>
        <p className="text-xs leading-relaxed">
          {extractMode === "all"
            ? "Every page of this PDF will be converted into an individual PDF file and packaged together in a ZIP."
            : "Only the selected pages will be extracted. You can merge them or get them in a ZIP."}
        </p>
      </div>
    </div>
  );
}
