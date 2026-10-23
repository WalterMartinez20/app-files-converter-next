"use client";

import React from "react";
import { RangeSubMode, CustomRange } from "@/hooks/useSplitPdfUI";
import { CustomRangeList } from "./CustomRangeList";

interface RangeControlsProps {
  rangeMode: RangeSubMode;
  onRangeModeChange: (mode: RangeSubMode) => void;
  rangeList: CustomRange[];
  activeRangeIndex: number;
  onSelectRange: (index: number) => void;
  onAddRange: () => void;
  onRemoveRange: (id: number) => void;
  onMoveRange: (index: number, direction: "up" | "down") => void;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (index: number) => void;
  onRangeInputChange: (id: number, field: "from" | "to", val: string) => void;
  onRangeBlur: (id: number, field: "from" | "to") => void;
  fixedChunk: number;
  onFixedChunkChange: (val: string) => void;
  mergeFiles: boolean;
  onMergeFilesChange: (merged: boolean) => void;
  numPages: number;
}

export function RangeControls({
  rangeMode,
  onRangeModeChange,
  rangeList,
  activeRangeIndex,
  onSelectRange,
  onAddRange,
  onRemoveRange,
  onMoveRange,
  onDragStart,
  onDragOver,
  onDrop,
  onRangeInputChange,
  onRangeBlur,
  fixedChunk,
  onFixedChunkChange,
  mergeFiles,
  onMergeFilesChange,
  numPages,
}: RangeControlsProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Submode toggle */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 pb-1">
        <button
          type="button"
          onClick={() => onRangeModeChange("custom")}
          className={`flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            rangeMode === "custom"
              ? "border-primary text-primary"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Custom ranges
        </button>
        <button
          type="button"
          onClick={() => onRangeModeChange("fixed")}
          className={`flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            rangeMode === "fixed"
              ? "border-primary text-primary"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Fixed ranges
        </button>
      </div>

      {rangeMode === "custom" && (
        <div className="flex flex-col gap-4">
          <CustomRangeList
            rangeList={rangeList}
            activeRangeIndex={activeRangeIndex}
            onSelectRange={onSelectRange}
            onAddRange={onAddRange}
            onRemoveRange={onRemoveRange}
            onMoveRange={onMoveRange}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onRangeInputChange={onRangeInputChange}
            onRangeBlur={onRangeBlur}
            numPages={numPages}
          />

          {/* Merge all ranges checkbox */}
          <label className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/40 cursor-pointer transition-colors mt-1">
            <input
              type="checkbox"
              checked={mergeFiles}
              onChange={(e) => onMergeFilesChange(e.target.checked)}
              className="size-5 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary cursor-pointer accent-primary"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 select-none">
                Merge all ranges in one PDF file
              </span>
              <span className="text-[11px] text-slate-500">
                {mergeFiles
                  ? "Output will be a single combined PDF"
                  : "Output will be separate PDFs in a ZIP"}
              </span>
            </div>
          </label>
        </div>
      )}

      {rangeMode === "fixed" && (
        <div className="flex flex-col gap-4 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-600 dark:text-slate-400">
              Split into page ranges of
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={numPages || 999}
                value={fixedChunk}
                onChange={(e) => onFixedChunkChange(e.target.value)}
                className="w-24 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-base font-bold text-center text-slate-700 dark:text-slate-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <span className="font-bold text-slate-500 text-sm">Pages</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            This document will be split into PDF files of {fixedChunk} pages each, automatically compressed into a ZIP archive.
          </p>
        </div>
      )}
    </div>
  );
}
