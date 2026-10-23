"use client";

import React from "react";
import {
  SplitMode,
  RangeSubMode,
  ExtractSubMode,
  CustomRange,
} from "@/hooks/useSplitPdfUI";

interface SplitPreviewGridProps {
  file: File;
  numPages: number;
  allThumbnails: string[];
  isGenerating: boolean;
  splitMode: SplitMode;
  rangeMode: RangeSubMode;
  extractMode: ExtractSubMode;
  rangeList: CustomRange[];
  activeRangeIndex: number;
  onSelectRange: (index: number) => void;
  fixedRanges: { from: number; to: number }[];
  selectedPages: Set<number>;
  onTogglePage: (pageNumber: number) => void;
  onZoomPage: (pageNumber: number) => void;
  onChangeFile: () => void;
}

export function SplitPreviewGrid({
  file,
  numPages,
  allThumbnails,
  isGenerating,
  splitMode,
  rangeMode,
  extractMode,
  rangeList,
  activeRangeIndex,
  onSelectRange,
  fixedRanges,
  selectedPages,
  onTogglePage,
  onZoomPage,
  onChangeFile,
}: SplitPreviewGridProps) {
  return (
    <div className="flex-1 w-full flex flex-col">
      {/* Top file meta bar */}
      <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="size-10 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-500 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate max-w-xs sm:max-w-md">
              {file.name}
            </h3>
            <p className="text-xs text-slate-500">
              {numPages > 0 ? `${numPages} page${numPages > 1 ? "s" : ""}` : "Loading pages..."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onChangeFile}
          className="text-xs font-bold text-slate-500 hover:text-primary flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-primary/40 transition-colors"
          title="Choose another file"
        >
          <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
          Change file
        </button>
      </div>

      {/* Main Visual Canvas Container */}
      <div className="relative min-h-[460px] max-h-[700px] overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-start">
        {isGenerating && allThumbnails.length === 0 ? (
          <div className="my-auto flex flex-col items-center gap-3 text-slate-400">
            <span className="material-symbols-outlined text-4xl animate-spin text-primary">
              refresh
            </span>
            <p className="text-sm font-semibold">Generating document preview...</p>
          </div>
        ) : splitMode === "range" ? (
          /* ─── RANGE PREVIEW ─── */
          <div className="flex flex-wrap gap-6 items-center justify-center w-full my-auto">
            {(rangeMode === "custom"
              ? rangeList.map((r, i) => {
                  const fromNum = typeof r.from === "number" && r.from > 0 ? r.from : 1;
                  const toNum =
                    typeof r.to === "number" && r.to > 0 ? Math.max(fromNum, r.to) : fromNum;
                  return {
                    id: r.id,
                    label: `Range ${i + 1}`,
                    from: Math.min(numPages || fromNum, fromNum),
                    to: Math.min(numPages || toNum, toNum),
                  };
                })
              : fixedRanges.map((r, i) => ({
                  id: `fixed-${i}`,
                  label: `Range ${i + 1}`,
                  from: r.from,
                  to: r.to,
                }))
            ).map((rangeItem, idx) => {
              const fromSafe = Math.max(1, Math.min(numPages || 1, rangeItem.from));
              const toSafe = Math.max(1, Math.min(numPages || 1, rangeItem.to));
              const fromThumb = allThumbnails[fromSafe - 1];
              const toThumb = allThumbnails[toSafe - 1];
              const isSinglePage = fromSafe === toSafe;
              const hasMiddleDots = toSafe - fromSafe > 1;
              const isActive = rangeMode === "custom" && activeRangeIndex === idx;

              return (
                <div
                  key={`range-box-${rangeItem.id || idx}-${fromSafe}-${toSafe}`}
                  onClick={() => {
                    if (rangeMode === "custom") {
                      onSelectRange(idx);
                    }
                  }}
                  className={`flex flex-col items-center gap-2 group cursor-pointer transition-all duration-200 ${
                    isActive ? "scale-[1.03]" : "hover:scale-[1.01]"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-bold transition-colors ${
                        isActive ? "text-primary font-black" : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {rangeItem.label}
                    </span>
                    {isActive && (
                      <span className="size-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>

                  {/* Bounding Box */}
                  <div
                    className={`border-2 rounded-2xl p-5 bg-white dark:bg-slate-800/40 shadow-sm flex items-center justify-center gap-4 transition-all ${
                      isActive
                        ? "border-primary border-solid ring-2 ring-primary/30 shadow-md"
                        : "border-dashed border-slate-300 dark:border-slate-700 hover:border-primary/50"
                    }`}
                  >
                    {/* From Page Card */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative group/thumb rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden w-28 h-40 flex items-center justify-center">
                        {fromThumb ? (
                          <img
                            src={fromThumb}
                            alt={`Page ${fromSafe}`}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="flex flex-col items-center text-slate-400">
                            <span className="material-symbols-outlined text-2xl">description</span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onZoomPage(fromSafe);
                          }}
                          className="absolute top-2 right-2 size-7 rounded-full bg-white dark:bg-background-dark text-slate-600 dark:text-slate-300 shadow-md opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-all hover:scale-110 hover:text-primary border border-slate-200 dark:border-primary/20"
                          title="Zoom page"
                        >
                          <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                        </button>
                      </div>
                      <span className="text-xs font-bold text-slate-500">Page {fromSafe}</span>
                    </div>

                    {/* Middle dots if multiple pages */}
                    {!isSinglePage && (
                      <>
                        {hasMiddleDots && (
                          <span className="text-xl font-black text-slate-400 tracking-widest px-1">
                            ...
                          </span>
                        )}

                        {/* To Page Card */}
                        <div className="flex flex-col items-center gap-2">
                          <div className="relative group/thumb rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden w-28 h-40 flex items-center justify-center">
                            {toThumb ? (
                              <img
                                src={toThumb}
                                alt={`Page ${toSafe}`}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="flex flex-col items-center text-slate-400">
                                <span className="material-symbols-outlined text-2xl">description</span>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onZoomPage(toSafe);
                              }}
                              className="absolute top-2 right-2 size-7 rounded-full bg-white dark:bg-background-dark text-slate-600 dark:text-slate-300 shadow-md opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-all hover:scale-110 hover:text-primary border border-slate-200 dark:border-primary/20"
                              title="Zoom page"
                            >
                              <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                            </button>
                          </div>
                          <span className="text-xs font-bold text-slate-500">Page {toSafe}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ─── EXTRACT PAGES GRID ─── */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
            {Array.from({ length: numPages || 1 }).map((_, idx) => {
              const pageNum = idx + 1;
              const isSelected = extractMode === "all" || selectedPages.has(pageNum);
              const thumb = allThumbnails[idx];

              return (
                <div
                  key={`page-grid-${pageNum}`}
                  onClick={() => onTogglePage(pageNum)}
                  className={`flex flex-col items-center gap-2 group cursor-pointer transition-all ${
                    extractMode === "select" && !isSelected
                      ? "opacity-40 hover:opacity-75"
                      : "opacity-100"
                  }`}
                >
                  <div
                    className={`relative rounded-xl border bg-white dark:bg-slate-800 shadow-sm overflow-hidden w-full aspect-[1/1.4] flex items-center justify-center transition-all ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/20 shadow-md"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={`Page ${pageNum}`}
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-slate-400">
                        <span className="material-symbols-outlined text-2xl">description</span>
                      </div>
                    )}

                    {/* Checkmark Badge */}
                    {isSelected && (
                      <div className="absolute top-2 left-2 size-6 rounded-full bg-primary text-white flex items-center justify-center shadow-md animate-in zoom-in-75 duration-150">
                        <span className="material-symbols-outlined text-[15px] font-black">
                          check
                        </span>
                      </div>
                    )}

                    {/* Zoom button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onZoomPage(pageNum);
                      }}
                      className="absolute top-2 right-2 size-7 rounded-full bg-white dark:bg-background-dark text-slate-600 dark:text-slate-300 shadow-md opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-all hover:scale-110 hover:text-primary border border-slate-200 dark:border-primary/20"
                      title="Zoom page"
                    >
                      <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                    </button>
                  </div>

                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    {pageNum}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
