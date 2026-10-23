"use client";

import React from "react";
import { CustomRange } from "@/hooks/useSplitPdfUI";

interface CustomRangeListProps {
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
  numPages: number;
}

export function CustomRangeList({
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
  numPages,
}: CustomRangeListProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
        {rangeList.map((r, i) => {
          const isActive = activeRangeIndex === i;
          return (
            <div
              key={r.id}
              draggable={rangeList.length > 1}
              onDragStart={() => onDragStart(i)}
              onDragOver={onDragOver}
              onDrop={() => onDrop(i)}
              onClick={() => onSelectRange(i)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                isActive
                  ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-sm ring-1 ring-primary/30"
                  : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  {rangeList.length > 1 && (
                    <span className="material-symbols-outlined text-slate-400 text-sm cursor-grab">
                      drag_indicator
                    </span>
                  )}
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Range {i + 1}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {rangeList.length > 1 && (
                    <>
                      <button
                        type="button"
                        disabled={i === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveRange(i, "up");
                        }}
                        className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 rounded"
                        title="Move up"
                      >
                        <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                      </button>
                      <button
                        type="button"
                        disabled={i === rangeList.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveRange(i, "down");
                        }}
                        className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 rounded"
                        title="Move down"
                      >
                        <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveRange(r.id);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded"
                        title="Remove range"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex flex-col flex-1">
                  <label className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">
                    From page
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={numPages || 999}
                    value={r.from}
                    onFocus={() => onSelectRange(i)}
                    onChange={(e) => onRangeInputChange(r.id, "from", e.target.value)}
                    onBlur={() => onRangeBlur(r.id, "from")}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm font-semibold focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-700 dark:text-slate-200 transition-all text-center"
                  />
                </div>
                <span className="text-slate-300 dark:text-slate-600 mt-5 font-black">-</span>
                <div className="flex flex-col flex-1">
                  <label className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">
                    To page
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={numPages || 999}
                    value={r.to}
                    onFocus={() => onSelectRange(i)}
                    onChange={(e) => onRangeInputChange(r.id, "to", e.target.value)}
                    onBlur={() => onRangeBlur(r.id, "to")}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm font-semibold focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-700 dark:text-slate-200 transition-all text-center"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onAddRange}
        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-primary/40 text-primary hover:bg-primary/5 transition-colors font-bold text-sm w-full"
      >
        <span className="material-symbols-outlined text-lg">add_circle</span>
        Add Range
      </button>
    </div>
  );
}
