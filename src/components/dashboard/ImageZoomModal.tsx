"use client";

interface ImageZoomModalProps {
  image: { url: string; name: string } | null;
  onClose: () => void;
}

export function ImageZoomModal({ image, onClose }: ImageZoomModalProps) {
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[85vh] bg-white dark:bg-[#0f1423] rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-primary/20 flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100 dark:border-primary/10">
          <div className="flex items-center gap-2 min-w-0 pr-4">
            <span className="material-symbols-outlined text-primary text-xl">
              image
            </span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
              {image.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 text-slate-500 flex items-center justify-center transition-colors shrink-0"
            title="Close preview"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
        <div className="max-h-[70vh] overflow-hidden rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-slate-950/50 p-2">
          <img
            src={image.url}
            alt={image.name}
            className="max-h-[66vh] max-w-full object-contain rounded-xl shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}
