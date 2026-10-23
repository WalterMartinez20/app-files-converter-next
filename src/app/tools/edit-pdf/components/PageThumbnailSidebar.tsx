"use client";

interface PageThumbnailSidebarProps {
  isOpen: boolean;
  numPages: number;
  currentPageIndex: number;
  pageThumbnails: string[];
  onPageSelect: (index: number) => void;
}

export function PageThumbnailSidebar({
  isOpen,
  numPages,
  currentPageIndex,
  pageThumbnails,
  onPageSelect,
}: PageThumbnailSidebarProps) {
  return (
    <div
      className={`transition-all duration-300 ease-in-out flex flex-col shrink-0 ${
        isOpen ? "w-full lg:w-32 opacity-100" : "w-0 opacity-0 overflow-hidden"
      }`}
    >
      <div className="w-full lg:w-32 flex flex-col gap-4 max-h-[300px] lg:max-h-[80vh] overflow-y-auto custom-scrollbar pr-2 pb-6 pt-2">
        {Array.from({ length: numPages }).map((_, i) => (
          <button
            key={i}
            id={`thumbnail-${i}`}
            onClick={() => onPageSelect(i)}
            className={`relative w-full aspect-[1/1.4] p-1.5 rounded-xl flex flex-col items-center justify-center font-bold text-sm transition-all ${
              currentPageIndex === i
                ? "border-2 border-primary shadow-md bg-white dark:bg-[#1a1c29] z-10"
                : "border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1a1c29] text-slate-400 hover:border-primary/50 hover:shadow-sm"
            }`}
          >
            <div className="relative w-full h-full overflow-hidden rounded-lg pointer-events-none">
              {pageThumbnails[i] ? (
                <img
                  src={pageThumbnails[i]}
                  alt={`Page ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-slate-100/50 dark:bg-slate-800/30 animate-pulse">
                  <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div
              className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md z-40 pointer-events-none whitespace-nowrap transition-colors ${
                currentPageIndex === i
                  ? "bg-primary text-white"
                  : "bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {i + 1}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
