"use client";

import React from "react";
import { ToolActionButton } from "@/components/tools";

interface MergeSidebarProps {
  filesCount: number;
  activeFilter: "none" | "nameAsc" | "nameDesc";
  onOrderByFileName: () => void;
  onResetFilters: () => void;
  isMerging: boolean;
  onMergeClick: () => void;
  onCancel: () => void;
}

export function MergeSidebar({
  filesCount,
  activeFilter,
  onOrderByFileName,
  onResetFilters,
  isMerging,
  onMergeClick,
  onCancel,
}: MergeSidebarProps) {
  return (
    <aside className="w-full md:w-80 lg:w-96 bg-white dark:bg-primary/5 rounded-3xl border border-slate-200 dark:border-primary/20 shadow-xl p-6 md:p-8 flex flex-col gap-6 sticky top-24 shrink-0 transition-all">
      <div>
        <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Merge PDF
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Your files will be securely merged into a single document in the order shown.
        </p>
      </div>

      {filesCount < 2 ? (
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-4 rounded-xl flex items-start gap-3">
          <span className="material-symbols-outlined text-amber-500 text-xl">info</span>
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
            You need at least <strong>2 PDFs</strong> to merge them. Please add another file.
          </p>
        </div>
      ) : (
        <>
          {/* Sort controls */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Sort Order
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
                Reset
              </button>
            </div>

            <button
              type="button"
              onClick={onOrderByFileName}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all font-bold text-xs ${
                activeFilter === "nameAsc" || activeFilter === "nameDesc"
                  ? "bg-primary/10 border-primary/40 text-primary shadow-sm"
                  : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/40 hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">swap_vert</span>
              <span>
                {activeFilter === "nameAsc"
                  ? "Sorted A → Z"
                  : activeFilter === "nameDesc"
                  ? "Sorted Z → A"
                  : "Sort files by name (A → Z)"}
              </span>
            </button>
          </div>

          {/* Files count indicator */}
          <div className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-primary/20 pb-3">
            <span className="text-slate-500 font-medium">Files selected</span>
            <span className="font-bold text-primary text-base">{filesCount}</span>
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 mt-auto pt-2">
        <ToolActionButton
          onClick={onMergeClick}
          disabled={isMerging || filesCount < 2}
          isLoading={isMerging}
          text="Merge PDF"
          loadingText="Merging files..."
          icon="library_add"
        />

        <button
          type="button"
          onClick={onCancel}
          disabled={isMerging}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </aside>
  );
}
