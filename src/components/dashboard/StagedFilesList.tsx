"use client";

import { StagedFile } from "@/types/ui";

interface StagedFilesListProps {
  stagedFiles: StagedFile[];
  isUploading: boolean;
  onUpdateTargetFormat: (fileId: string, format: string) => void;
  onRemoveFile: (fileId: string) => void;
  onZoomImage: (image: { url: string; name: string }) => void;
}

export function StagedFilesList({
  stagedFiles,
  isUploading,
  onUpdateTargetFormat,
  onRemoveFile,
  onZoomImage,
}: StagedFilesListProps) {
  return (
    <div className="p-4 sm:p-6 max-h-[380px] overflow-y-auto custom-scrollbar">
      {stagedFiles.map((file) => (
        <div
          key={file.id}
          className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-primary/10 p-4 border border-slate-200 dark:border-primary/20 rounded-xl mb-3 shadow-sm"
        >
          {/* File Thumbnail & Name */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            {(() => {
              const isPdf =
                file.originalFormat?.toLowerCase() === "pdf" ||
                file.file.type === "application/pdf" ||
                file.file.name.toLowerCase().endsWith(".pdf");
              return (
                <div
                  className={`relative size-12 sm:size-14 rounded-xl overflow-hidden border flex items-center justify-center shrink-0 shadow-xs transition-all ${
                    isPdf
                      ? "bg-rose-500/10 border-rose-500/25 text-rose-500 hover:ring-2 hover:ring-rose-500/40"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-primary/20 hover:ring-2 hover:ring-primary/40 cursor-pointer group/thumb"
                  }`}
                  onClick={() =>
                    file.previewUrl &&
                    onZoomImage({
                      url: file.previewUrl,
                      name: file.file.name,
                    })
                  }
                  title={
                    file.previewUrl
                      ? "Click to view full preview"
                      : file.file.name
                  }
                >
                  {file.previewUrl ? (
                    <>
                      <img
                        src={file.previewUrl}
                        alt={file.file.name}
                        className="size-full object-cover group-hover/thumb:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity text-white">
                        <span className="material-symbols-outlined text-[18px]">
                          zoom_in
                        </span>
                      </div>
                    </>
                  ) : (
                    <div
                      className={`size-full flex items-center justify-center ${
                        isPdf
                          ? "bg-rose-500/10 text-rose-500"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl">
                        {isPdf ? "picture_as_pdf" : "image"}
                      </span>
                    </div>
                  )}
                </div>
              );
            })()}
            <div className="min-w-0">
              <p className="text-sm font-bold truncate max-w-[200px] text-slate-900 dark:text-slate-100">
                {file.file.name}
              </p>
              <p className="text-xs text-slate-500">
                {(file.file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          {/* Format Selectors */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-center">
            <div className="relative">
              <select
                className="appearance-none bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 rounded-lg pl-4 pr-8 py-2 text-xs font-bold uppercase text-slate-700 dark:text-slate-300 outline-none disabled:opacity-70"
                disabled
              >
                <option>{file.originalFormat}</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-2 text-slate-400 text-sm">
                expand_more
              </span>
            </div>
            <span className="text-slate-400 text-sm font-medium">to</span>
            <div className="relative">
              <select
                value={file.targetFormat}
                onChange={(e) => onUpdateTargetFormat(file.id, e.target.value)}
                disabled={isUploading}
                className="appearance-none bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/30 rounded-lg pl-4 pr-8 py-2 text-xs font-bold uppercase text-slate-900 dark:text-slate-100 cursor-pointer outline-none focus:ring-2 ring-primary transition-all disabled:opacity-50"
              >
                <optgroup label="Images">
                  <option value="jpg">JPG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WEBP</option>
                </optgroup>
                <optgroup label="Documents">
                  <option value="pdf">PDF</option>
                </optgroup>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-2 text-slate-400 pointer-events-none text-sm">
                expand_more
              </span>
            </div>
          </div>

          {/* Status & Remove */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-500/10 rounded-md uppercase tracking-wide border border-emerald-200 dark:border-emerald-500/20">
              Ready
            </span>
            <button
              type="button"
              onClick={() => onRemoveFile(file.id)}
              disabled={isUploading}
              title="Remove file"
              aria-label="Remove file"
              className="flex items-center justify-center size-9 text-slate-400 hover:text-rose-500 bg-white dark:bg-background-dark hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors border border-slate-200 dark:border-primary/20 disabled:opacity-50 shrink-0"
            >
              <span className="material-symbols-outlined text-[18px] leading-none select-none">
                close
              </span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
