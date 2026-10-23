"use client";

import React from "react";

interface ZoomModalProps {
  zoomPage: number | null;
  numPages: number;
  allThumbnails: string[];
  onClose: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function ZoomModal({
  zoomPage,
  numPages,
  allThumbnails,
  onClose,
  onPrevPage,
  onNextPage,
}: ZoomModalProps) {
  if (zoomPage === null) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Previous Page Arrow */}
      {zoomPage > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrevPage();
          }}
          className="absolute left-3 sm:left-6 md:left-10 top-1/2 -translate-y-1/2 z-40 size-11 rounded-full bg-white dark:bg-background-dark shadow-xl text-slate-700 dark:text-slate-200 hover:text-primary flex items-center justify-center transition-all border border-slate-200 dark:border-primary/20 hover:scale-110"
          title="Previous page (Left arrow)"
        >
          <span className="material-symbols-outlined text-2xl font-bold">
            chevron_left
          </span>
        </button>
      )}

      {/* Next Page Arrow */}
      {numPages > 0 && zoomPage < numPages && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNextPage();
          }}
          className="absolute right-3 sm:right-6 md:right-10 top-1/2 -translate-y-1/2 z-40 size-11 rounded-full bg-white dark:bg-background-dark shadow-xl text-slate-700 dark:text-slate-200 hover:text-primary flex items-center justify-center transition-all border border-slate-200 dark:border-primary/20 hover:scale-110"
          title="Next page (Right arrow)"
        >
          <span className="material-symbols-outlined text-2xl font-bold">
            chevron_right
          </span>
        </button>
      )}

      {/* Floating Page Container */}
      <div
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[88vh] aspect-[1/1.414] w-auto max-w-[92vw] flex items-center justify-center overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-30 size-8 rounded-full bg-white dark:bg-background-dark shadow-md text-slate-400 hover:text-rose-500 flex items-center justify-center transition-all border border-slate-200 dark:border-primary/20 hover:scale-110"
          title="Close preview (Esc)"
        >
          <span className="material-symbols-outlined text-sm font-bold">close</span>
        </button>

        {allThumbnails[zoomPage - 1] ? (
          <img
            src={allThumbnails[zoomPage - 1]}
            alt={`Page ${zoomPage}`}
            className="w-full h-full object-contain select-none"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <span className="material-symbols-outlined text-5xl">description</span>
            <p className="text-sm font-semibold">Page {zoomPage}</p>
          </div>
        )}

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/80 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none">
          Page {zoomPage} of {numPages}
        </div>
      </div>
    </div>
  );
}
