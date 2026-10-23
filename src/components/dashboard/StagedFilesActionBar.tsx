"use client";

interface StagedFilesActionBarProps {
  isUploading: boolean;
  onAddMoreFiles: () => void;
  onConvertAll: () => void;
}

export function StagedFilesActionBar({
  isUploading,
  onAddMoreFiles,
  onConvertAll,
}: StagedFilesActionBarProps) {
  return (
    <div className="p-5 sm:p-6 bg-slate-50 dark:bg-primary/10 border-t border-slate-200 dark:border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4">
      <button
        type="button"
        onClick={onAddMoreFiles}
        disabled={isUploading}
        className="w-full md:w-auto flex items-center justify-center gap-2 bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/30 px-6 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-primary/5 transition-colors disabled:opacity-50 active:scale-95"
      >
        <span className="material-symbols-outlined text-sm">add</span>
        Add more files
      </button>

      <button
        type="button"
        onClick={onConvertAll}
        disabled={isUploading}
        className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-10 py-3 rounded-xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {isUploading ? (
          <>
            <span className="material-symbols-outlined text-[18px] animate-spin">
              progress_activity
            </span>
            Processing...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[18px]">
              sync_alt
            </span>
            Convert All
          </>
        )}
      </button>
    </div>
  );
}
