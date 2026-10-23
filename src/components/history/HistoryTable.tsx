"use client";

import React from "react";
import { Conversion } from "@/types/conversion";

interface HistoryTableProps {
  conversions: Conversion[];
  isLoading?: boolean;
  onDownload: (storagePath: string, fileName: string) => void;
  onDelete: (id: string) => void;
}

export function HistoryTable({
  conversions,
  isLoading = false,
  onDownload,
  onDelete,
}: HistoryTableProps) {
  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-3 bg-white dark:bg-primary/5 rounded-2xl border border-slate-200 dark:border-primary/20 shadow-xl shadow-black/5">
        <span className="material-symbols-outlined animate-spin text-2xl text-primary">sync</span>
        <span className="font-medium text-slate-600 dark:text-slate-300">Loading history...</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-primary/5 rounded-2xl border border-slate-200 dark:border-primary/20 overflow-hidden shadow-xl shadow-black/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-primary/10 border-b border-slate-200 dark:border-primary/20">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                File Name
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Conversion
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Size
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Date
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-primary/10">
            {conversions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-4xl text-slate-400">folder_open</span>
                    <p className="text-base font-medium">No conversions yet</p>
                    <p className="text-sm text-slate-400">Your processed files will appear here</p>
                  </div>
                </td>
              </tr>
            ) : (
              conversions.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors group"
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">
                        description
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {item.file_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-xs font-medium">
                      <span className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300 uppercase">
                        {item.original_format}
                      </span>
                      <span className="material-symbols-outlined text-xs text-slate-400">
                        arrow_forward
                      </span>
                      <span className="px-2 py-1 bg-primary/20 rounded text-primary border border-primary/30 uppercase">
                        {item.target_format}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {(item.file_size / 1024 / 1024).toFixed(2)} MB
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        item.status === "completed"
                          ? "bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                          : item.status === "processing"
                          ? "bg-amber-100 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                          : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          item.status === "completed"
                            ? "bg-emerald-500"
                            : item.status === "processing"
                            ? "bg-amber-500"
                            : "bg-slate-500"
                        }`}
                      ></span>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      {item.status === "completed" && (
                        <button
                          type="button"
                          onClick={() => onDownload(item.storage_path, item.file_name)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all transform active:scale-95 shadow-md shadow-primary/20"
                        >
                          <span className="material-symbols-outlined text-sm">download</span>
                          Download
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onDelete(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-slate-800 rounded-xl transition-all flex items-center justify-center active:scale-95"
                        title="Delete file permanently"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {conversions.length > 0 && (
        <div className="px-6 py-4 bg-slate-50 dark:bg-primary/10 border-t border-slate-200 dark:border-primary/20 flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing {conversions.length} conversion{conversions.length === 1 ? "" : "s"}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-primary/20 text-slate-400 disabled:opacity-30"
              disabled
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="size-8 rounded-lg bg-primary text-white text-sm font-bold"
              >
                1
              </button>
            </div>
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-primary/20 text-slate-400 disabled:opacity-30"
              disabled
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoryTable;
