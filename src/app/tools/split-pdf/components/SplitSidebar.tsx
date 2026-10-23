"use client";

import React from "react";
import {
  SplitMode,
  RangeSubMode,
  ExtractSubMode,
  CustomRange,
} from "@/hooks/useSplitPdfUI";
import { SplitModeSelector } from "./SplitModeSelector";
import { RangeControls } from "./RangeControls";
import { SelectPagesControls } from "./SelectPagesControls";
import { ToolActionButton } from "@/components/tools";

interface SplitSidebarProps {
  splitMode: SplitMode;
  onSplitModeChange: (mode: SplitMode) => void;
  rangeMode: RangeSubMode;
  onRangeModeChange: (mode: RangeSubMode) => void;
  extractMode: ExtractSubMode;
  onExtractModeChange: (mode: ExtractSubMode) => void;
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
  pagesInputText: string;
  onPagesInputChange: (val: string) => void;
  onPagesInputBlur: () => void;
  mergeFiles: boolean;
  onMergeFilesChange: (merged: boolean) => void;
  numPages: number;
  isProcessing: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export function SplitSidebar({
  splitMode,
  onSplitModeChange,
  rangeMode,
  onRangeModeChange,
  extractMode,
  onExtractModeChange,
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
  pagesInputText,
  onPagesInputChange,
  onPagesInputBlur,
  mergeFiles,
  onMergeFilesChange,
  numPages,
  isProcessing,
  onCancel,
  onSubmit,
}: SplitSidebarProps) {
  return (
    <aside className="w-full md:w-80 lg:w-96 bg-white dark:bg-primary/5 rounded-3xl border border-slate-200 dark:border-primary/20 shadow-xl p-6 md:p-8 flex flex-col gap-6 sticky top-24 shrink-0 transition-all">
      <div>
        <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Split PDF
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure how you want to divide your PDF document.
        </p>
      </div>

      {/* Main Mode Selector */}
      <SplitModeSelector
        splitMode={splitMode}
        onSplitModeChange={onSplitModeChange}
      />

      {/* Mode Controls */}
      {splitMode === "range" ? (
        <RangeControls
          rangeMode={rangeMode}
          onRangeModeChange={onRangeModeChange}
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
          fixedChunk={fixedChunk}
          onFixedChunkChange={onFixedChunkChange}
          mergeFiles={mergeFiles}
          onMergeFilesChange={onMergeFilesChange}
          numPages={numPages}
        />
      ) : (
        <SelectPagesControls
          extractMode={extractMode}
          onExtractModeChange={onExtractModeChange}
          pagesInputText={pagesInputText}
          onPagesInputChange={onPagesInputChange}
          onPagesInputBlur={onPagesInputBlur}
          mergeFiles={mergeFiles}
          onMergeFilesChange={onMergeFilesChange}
        />
      )}

      {/* Action Footer */}
      <div className="flex gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="btn-secondary"
        >
          Cancel
        </button>
        <ToolActionButton
          onClick={onSubmit}
          disabled={isProcessing}
          isLoading={isProcessing}
          text="Split PDF"
          loadingText="Processing..."
          icon="content_cut"
        />
      </div>
    </aside>
  );
}
