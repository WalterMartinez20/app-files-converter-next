import React from "react";
import { Conversion } from "@/types/conversion";

interface HistoryTableProps {
  conversions: Conversion[];
  isLoading: boolean;
}
export const HistoryTable = ({ conversions, isLoading }: HistoryTableProps) => {
  if (isLoading) {
    <div className="p-8 text-center text-slate-500">Cargando Historial...</div>;
  }

  return (
    <div className="bg-white dark:bg-primary/5 rounded-xl border border-slate-200 dark:border-primary/20 overflow-hidden shadow-xl shadow-black/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-primary/10 border-b border-slate-200 dark:border-primary/20">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                File Name
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Format
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
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-sm text-slate-500"
                >
                  No conversions found.
                </td>
              </tr>
            ) : (
              conversions.map((conv) => (
                <tr
                  key={conv.id}
                  className="hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors group"
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">
                        description
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {conv.file_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-xs font-medium">
                      <span className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300 uppercase">
                        {conv.original_format}
                      </span>
                      <span className="material-symbols-outlined text-xs text-slate-400">
                        arrow_forward
                      </span>
                      <span className="px-2 py-1 bg-primary/20 rounded text-primary border border-primary/30 uppercase">
                        {conv.target_format}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {new Date(conv.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        conv.status === "completed"
                          ? "bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                          : conv.status === "failed"
                            ? "bg-rose-100 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
                            : "bg-amber-100 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${conv.status === "completed" ? "bg-emerald-500" : conv.status === "failed" ? "bg-rose-500" : "bg-amber-500"}`}
                      ></span>
                      {conv.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right">
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all transform active:scale-95 shadow-md shadow-primary/20">
                      <span className="material-symbols-outlined text-sm">
                        download
                      </span>
                      Download
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;
