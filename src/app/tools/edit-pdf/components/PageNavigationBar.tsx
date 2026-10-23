"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface PageNavigationBarProps {
  currentPageIndex: number;
  numPages: number;
  scale: number;
  onNavigate: (pageIndex: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onResetZoom: () => void;
}

export function PageNavigationBar({
  currentPageIndex,
  numPages,
  scale,
  onNavigate,
  onPrevPage,
  onNextPage,
  onZoomOut,
  onZoomIn,
  onResetZoom,
}: PageNavigationBarProps) {
  const [pageInput, setPageInput] = useState((currentPageIndex + 1).toString());

  // Sync input display when the page changes externally (e.g. thumbnail click).
  // This is valid: the text input is the "external system" we are syncing.
  useEffect(() => {
    setPageInput((currentPageIndex + 1).toString());
  }, [currentPageIndex]);

  const commitInput = () => {
    let val = parseInt(pageInput);
    if (isNaN(val) || val < 1) {
      toast.error("Page number must be at least 1");
      val = 1;
    } else if (val > numPages) {
      toast.error(`Page cannot exceed document length (${numPages} pages)`);
      val = numPages;
    }
    setPageInput(val.toString());
    onNavigate(val - 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commitInput();
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/95 dark:bg-[#0f1423]/95 backdrop-blur-xl rounded-2xl p-1.5 shadow-2xl shadow-primary/20 flex items-center gap-1.5 text-white border border-slate-700/50 z-[60] animate-in slide-in-from-bottom-6 duration-300">
      <button
        onClick={onPrevPage}
        disabled={currentPageIndex === 0}
        className="p-2 hover:bg-slate-700 rounded-xl disabled:opacity-30 transition-colors flex items-center justify-center"
        title="Previous Page"
      >
        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
      </button>

      <div className="flex items-center justify-center px-1 font-bold text-sm">
        <input
          type="text"
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          onBlur={commitInput}
          onKeyDown={handleKeyDown}
          className="w-8 text-center bg-slate-800 border border-slate-600 text-white outline-none focus:border-primary rounded py-1"
        />
        <span className="mx-2 text-slate-400 font-normal">/</span>
        {numPages}
      </div>

      <button
        onClick={onNextPage}
        disabled={currentPageIndex === numPages - 1}
        className="p-2 hover:bg-slate-700 rounded-xl disabled:opacity-30 transition-colors flex items-center justify-center"
        title="Next Page"
      >
        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
      </button>

      <div className="w-px h-5 bg-slate-700 mx-1" />

      <button
        onClick={onZoomOut}
        className="p-2 hover:bg-slate-700 rounded-xl transition-colors flex items-center justify-center text-slate-300 hover:text-white"
        title="Zoom Out"
      >
        <span className="material-symbols-outlined text-[20px]">zoom_out</span>
      </button>
      <span className="text-sm font-bold w-14 text-center text-slate-300">
        {Math.round(scale * 100)}%
      </span>
      <button
        onClick={onZoomIn}
        className="p-2 hover:bg-slate-700 rounded-xl transition-colors flex items-center justify-center text-slate-300 hover:text-white"
        title="Zoom In"
      >
        <span className="material-symbols-outlined text-[20px]">zoom_in</span>
      </button>

      <div className="w-px h-5 bg-slate-700 mx-1" />

      <button
        onClick={onResetZoom}
        className="px-3 py-1 hover:bg-slate-700 rounded-xl transition-colors flex items-center justify-center text-slate-300 hover:text-white text-sm font-bold"
        title="Reset Zoom to 100%"
      >
        Reset
      </button>
    </div>
  );
}
