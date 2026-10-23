"use client";

interface SinglePdfPreviewProps {
  fileName: string;
  thumbnailUrl: string | null;
  isGenerating?: boolean;
  fallbackIcon?: string;
  fallbackText?: string;
  fallbackIconColor?: string;
}

export function SinglePdfPreview({
  fileName,
  thumbnailUrl,
  isGenerating = false,
  fallbackIcon = "picture_as_pdf",
  fallbackText = "No preview available",
  fallbackIconColor = "text-rose-500",
}: SinglePdfPreviewProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 min-h-[300px]">
      {isGenerating ? (
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <span className="material-symbols-outlined text-4xl animate-spin">
            refresh
          </span>
          <p className="text-sm font-medium">Generating preview...</p>
        </div>
      ) : thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt={`Preview of ${fileName}`}
          className="max-h-[350px] object-contain rounded shadow-sm border border-slate-200 dark:border-slate-800"
        />
      ) : (
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <span
            className={`material-symbols-outlined text-4xl ${
              fallbackIconColor || ""
            }`}
          >
            {fallbackIcon}
          </span>
          <p className="text-sm font-medium">{fallbackText}</p>
        </div>
      )}
      <p className="mt-4 font-semibold text-slate-700 dark:text-slate-300 text-center truncate max-w-xs text-sm">
        {fileName}
      </p>
    </div>
  );
}
