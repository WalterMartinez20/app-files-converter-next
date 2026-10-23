"use client";

import React, { useState, useEffect } from "react";
import { ConversionsQueueProps } from "@/types/ui";
import { toast } from "react-hot-toast";

function formatBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const isPdfFormat = (format?: string): boolean =>
  (format ?? "").trim().toLowerCase().startsWith("pdf");

export const ConversionsQueue = ({
  conversions,
  isLoading,
  onDownload,
  onDelete,
  onClearAll,
}: ConversionsQueueProps) => {
  const [confirmAction, setConfirmAction] = useState<{
    type: "item" | "clear_all";
    id?: string;
    fileName?: string;
  } | null>(null);

  useEffect(() => {
    if (!confirmAction) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setConfirmAction(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [confirmAction]);

  // Separate active queue (pending/processing) from completed/failed history
  const activeQueue = conversions.filter(
    (c) => c.status === "pending" || c.status === "processing"
  );
  const recentHistory = conversions
    .filter((c) => c.status === "completed" || c.status === "failed")
    .slice(0, 8);

  const totalCount = activeQueue.length + recentHistory.length;

  return (
    <section
      id="conversions-queue"
      className="w-full max-w-5xl mx-auto space-y-5 pt-8 scroll-mt-24 font-display"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-primary/20">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">history</span>
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Your Conversions
          </h3>
          {totalCount > 0 && (
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {totalCount}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1.5 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-500/20">
            <span className="material-symbols-outlined text-[15px]">timer</span>
            <span>Auto-deleted after 24h</span>
          </p>

          {onClearAll && conversions.length > 0 && (
            <button
              type="button"
              onClick={() => setConfirmAction({ type: "clear_all" })}
              className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 border border-rose-200 dark:border-rose-500/20 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[15px]">delete_sweep</span>
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Cards Container */}
      <div className="space-y-3.5">
        {/* Loading Skeletons */}
        {isLoading && activeQueue.length === 0 && recentHistory.length === 0 ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={`skeleton-${i}`}
                className="bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/20 p-5 rounded-2xl flex items-center justify-between shadow-sm animate-pulse"
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="size-12 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                  <div className="space-y-2 w-full max-w-xs">
                    <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
                    <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  </div>
                </div>
                <div className="h-9 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Active Queue Cards (Processing / Pending) */}
            {activeQueue.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                {/* Top Shimmer Loading Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary/40 via-primary to-primary/40 animate-pulse w-full" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Icon container */}
                    <div
                      className={`size-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
                        isPdfFormat(item.original_format) || isPdfFormat(item.target_format)
                          ? "bg-rose-500/10 border border-rose-500/25 text-rose-500"
                          : "bg-primary/10 border border-primary/20 text-primary"
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl animate-pulse">
                        {isPdfFormat(item.original_format) || isPdfFormat(item.target_format) ? "picture_as_pdf" : "image"}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate mb-1.5" title={item.file_name}>
                        {item.file_name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px]">
                          {item.original_format}
                        </span>
                        <span className="material-symbols-outlined text-xs text-slate-400">
                          arrow_forward
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-primary/15 text-primary border border-primary/25 font-bold uppercase text-[10px]">
                          {item.target_format}
                        </span>
                        {item.file_size > 0 && (
                          <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 font-semibold text-[11px] ml-1">
                            <span className="text-slate-300 dark:text-slate-600 font-bold">•</span>
                            <span>{formatBytes(item.file_size)}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-end shrink-0">
                    <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[16px] animate-spin">
                        sync
                      </span>
                      <span>Processing...</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Recent History Cards (Completed / Failed) */}
            {recentHistory.map((item) => {
              const isSuccess = item.status === "completed";
              const isZip = item.target_format?.toLowerCase() === "zip";
              const isPdf = item.target_format?.toLowerCase() === "pdf";
              const isPdfItem = isPdf || isPdfFormat(item.original_format);

              return (
                <div
                  key={item.id}
                  className="group relative bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-primary/40 dark:hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left: Thumbnail & Info */}
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Thumbnail or File Type Badge */}
                      <div
                        className={`relative size-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden shadow-inner ${
                          isPdfItem &&
                          (!isSuccess || !item.storage_path || isPdf)
                            ? "bg-rose-500/10 border border-rose-500/25"
                            : "bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80"
                        }`}
                      >
                        {isSuccess && !isPdf && !isZip && item.storage_path ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/files/${item.storage_path}`}
                            alt={item.file_name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <span
                            className={`material-symbols-outlined text-2xl ${
                              isPdfItem
                                ? "text-rose-500"
                                : isZip
                                ? "text-amber-500"
                                : "text-primary"
                            }`}
                          >
                            {isZip
                              ? "folder_zip"
                              : isPdfItem
                              ? "picture_as_pdf"
                              : "description"}
                          </span>
                        )}
                      </div>

                      {/* File Names & Format Flow */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <h4
                            className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate max-w-xs md:max-w-md"
                            title={item.file_name}
                          >
                            {item.file_name}
                          </h4>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shrink-0 ${
                              isSuccess
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25"
                            }`}
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              {isSuccess ? "check_circle" : "cancel"}
                            </span>
                            <span className="capitalize">{item.status}</span>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px]">
                            {item.original_format}
                          </span>
                          <span className="material-symbols-outlined text-xs text-slate-400">
                            arrow_forward
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] border ${
                              isSuccess
                                ? "bg-primary/10 text-primary border-primary/25"
                                : "bg-rose-100/60 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
                            }`}
                          >
                            {item.target_format}
                          </span>

                          {item.file_size > 0 && (
                            <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 font-semibold text-[11px] ml-1">
                              <span className="text-slate-300 dark:text-slate-600 font-bold">•</span>
                              <span>{formatBytes(item.file_size)}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2.5 justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      {isSuccess && (
                        <button
                          type="button"
                          onClick={() => onDownload(item.storage_path, item.file_name)}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-md shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98] transition-all"
                        >
                          <span className="material-symbols-outlined text-[16px]">download</span>
                          Download
                        </button>
                      )}

                      {!isSuccess && (
                        <span className="text-xs font-bold text-rose-500 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20">
                          Failed
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setConfirmAction({
                            type: "item",
                            id: item.id,
                            fileName: item.file_name,
                          })
                        }
                        className="size-9 rounded-xl text-slate-400 hover:text-rose-500 bg-slate-50 dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center transition-all active:scale-95 shadow-sm"
                        title="Delete permanently"
                        aria-label={`Delete ${item.file_name}`}
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty State */}
            {activeQueue.length === 0 && recentHistory.length === 0 && (
              <div className="py-14 px-6 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 dark:border-primary/20 rounded-3xl bg-slate-50/50 dark:bg-primary/[0.02]">
                <div className="size-16 bg-white dark:bg-slate-800/60 shadow-xl shadow-black/5 rounded-2xl flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-700/60">
                  <span className="material-symbols-outlined text-3xl text-slate-400 dark:text-slate-500">
                    history_toggle_off
                  </span>
                </div>
                <h4 className="text-lg font-black text-slate-700 dark:text-slate-200 mb-1">
                  No conversions yet
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                  Your processed files will appear here. Choose or drop a file above to get started.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setConfirmAction(null)}
        >
          <div
            className="relative w-full max-w-md bg-white dark:bg-[#121626] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-5 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">
                  {confirmAction.type === "clear_all" ? "delete_sweep" : "delete"}
                </span>
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {confirmAction.type === "clear_all"
                    ? "Clear all conversions?"
                    : "Delete conversion?"}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed break-words">
                  {confirmAction.type === "clear_all"
                    ? "Are you sure you want to remove all files from your conversion queue? This action cannot be undone."
                    : `Are you sure you want to delete "${confirmAction.fileName || "this file"}" from your history?`}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmAction.type === "clear_all") {
                    onClearAll?.();
                    toast.success("All conversions cleared");
                  } else if (confirmAction.id) {
                    onDelete(confirmAction.id);
                    toast.success("Conversion removed");
                  }
                  setConfirmAction(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all active:scale-95 shadow-md shadow-rose-500/25 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {confirmAction.type === "clear_all" ? "delete_sweep" : "delete"}
                </span>
                {confirmAction.type === "clear_all" ? "Yes, Clear All" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
