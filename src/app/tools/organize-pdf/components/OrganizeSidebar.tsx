"use client";

import React from "react";
import { ToolActionButton } from "@/components/tools";

interface OrganizeSidebarProps {
  pdfFiles: File[];
  fileColors: string[];
  activeFilter: string;
  onOrderByFileName: () => void;
  onOrderByPageNumber: () => void;
  onMixPages: () => void;
  onResetFilters: () => void;
  isProcessing: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export function OrganizeSidebar({
  pdfFiles,
  fileColors,
  activeFilter,
  onOrderByFileName,
  onOrderByPageNumber,
  onMixPages,
  onResetFilters,
  isProcessing,
  onSave,
  onCancel,
}: OrganizeSidebarProps) {
  return (
    <aside className="w-full md:w-80 lg:w-96 bg-white dark:bg-primary/5 rounded-3xl border border-slate-200 dark:border-primary/20 shadow-xl p-6 md:p-8 flex flex-col gap-6 sticky top-24 shrink-0 transition-all">
      <div>
        <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Organize PDF
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          A new PDF will be created with the pages in the exact order shown.
        </p>
      </div>

      {/* Files list + Reset */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Files ({pdfFiles.length})
          </span>
          <button
            type="button"
            onClick={onResetFilters}
            className={`flex items-center gap-1 text-[11px] font-bold text-rose-500 hover:text-rose-600 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 px-2.5 py-1 rounded-full transition-all ${
              activeFilter !== "none"
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">restart_alt</span>
            Reset all
          </button>
        </div>

        <div className="flex flex-col gap-2 max-h-[25vh] overflow-y-auto pr-1 custom-scrollbar">
          {pdfFiles.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40"
            >
              <div
                className="size-3 rounded-full shrink-0"
                style={{ backgroundColor: fileColors[idx % fileColors.length] }}
              />
              <span className="truncate text-slate-700 dark:text-slate-300" title={file.name}>
                {file.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter / Sort actions */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Quick Sort
        </span>
        <div className="grid grid-cols-3 gap-2">
          {/* By Name */}
          <button
            type="button"
            onClick={onOrderByFileName}
            className={`flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-xl border transition-all text-[11px] font-bold ${
              activeFilter === "nameAsc" || activeFilter === "nameDesc"
                ? "bg-primary/10 border-primary/40 text-primary shadow-sm"
                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/40 hover:text-primary"
            }`}
          >
            <span className="font-black text-xs">
              {activeFilter === "nameDesc" ? "Z → A" : "A → Z"}
            </span>
            <span className="material-symbols-outlined text-[14px]">swap_vert</span>
          </button>

          {/* By Number */}
          <button
            type="button"
            onClick={onOrderByPageNumber}
            className={`flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-xl border transition-all text-[11px] font-bold ${
              activeFilter === "numAsc" || activeFilter === "numDesc"
                ? "bg-primary/10 border-primary/40 text-primary shadow-sm"
                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/40 hover:text-primary"
            }`}
          >
            <span className="font-black text-xs">
              {activeFilter === "numDesc" ? "9 → 1" : "1 → 9"}
            </span>
            <span className="material-symbols-outlined text-[14px]">format_list_numbered</span>
          </button>

          {/* Mix */}
          <button
            type="button"
            onClick={onMixPages}
            className={`flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-xl border transition-all text-[11px] font-bold ${
              activeFilter === "mix"
                ? "bg-primary/10 border-primary/40 text-primary shadow-sm"
                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/40 hover:text-primary"
            }`}
          >
            <span className="font-black text-xs">
              {activeFilter === "mix" ? "Mixed" : "Shuffle"}
            </span>
            <span className="material-symbols-outlined text-[14px]">shuffle</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 mt-auto pt-2">
        <ToolActionButton
          onClick={onSave}
          disabled={isProcessing}
          isLoading={isProcessing}
          text="Organize PDF"
          loadingText="Organizing..."
          icon="note_stack"
        />

        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </aside>
  );
}
