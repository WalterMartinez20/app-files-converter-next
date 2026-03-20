"use client";

import { useConversions } from "@/hooks/useConversions";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function HistoryPage() {
  const { conversions, downloadFile } = useConversions();
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header Superior */}
        <Header />

        {/* Contenido Principal */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-10 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              Conversion History
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl">
              Access, manage, and download your processed files. Files are
              automatically deleted after 24 hours for your privacy.
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold transition-all shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-sm">
                  grid_view
                </span>
                All Files
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-primary/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-primary/20 text-sm font-medium transition-all">
                <span className="material-symbols-outlined text-sm">
                  description
                </span>
                Documents
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-primary/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-primary/20 text-sm font-medium transition-all">
                <span className="material-symbols-outlined text-sm">image</span>
                Images
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-primary/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-primary/20 text-sm font-medium transition-all">
                <span className="material-symbols-outlined text-sm">movie</span>
                Video
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-primary/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-primary/20 text-sm font-medium transition-all">
                <span className="material-symbols-outlined text-sm">
                  audiotrack
                </span>
                Audio
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                Sort by:
              </span>
              <select className="bg-slate-100 dark:bg-primary/10 border-none rounded-lg text-sm font-medium py-2 px-4 focus:ring-primary ring-0 cursor-pointer outline-none">
                <option>Newest first</option>
                <option>Oldest first</option>
                <option>File size</option>
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-primary/5 rounded-xl border border-slate-200 dark:border-primary/20 overflow-hidden shadow-xl shadow-black/5">
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
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-slate-500"
                      >
                        No conversions yet.
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
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${item.status === "completed" ? "bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" : item.status === "processing" ? "bg-amber-100 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20" : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"}`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${item.status === "completed" ? "bg-emerald-500" : item.status === "processing" ? "bg-amber-500" : "bg-slate-500"}`}
                            ></span>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right">
                          {item.status === "completed" && (
                            <button
                              onClick={() =>
                                downloadFile(item.storage_path, item.file_name)
                              }
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all transform active:scale-95 shadow-md shadow-primary/20"
                            >
                              <span className="material-symbols-outlined text-sm">
                                download
                              </span>
                              Download
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-primary/10 border-t border-slate-200 dark:border-primary/20 flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing 4 of 24 conversions
              </p>
              <div className="flex items-center gap-2">
                <button
                  className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-primary/20 text-slate-400 disabled:opacity-30"
                  disabled
                >
                  <span className="material-symbols-outlined">
                    chevron_left
                  </span>
                </button>
                <div className="flex items-center gap-1">
                  <button className="size-8 rounded-lg bg-primary text-white text-sm font-bold">
                    1
                  </button>
                  <button className="size-8 rounded-lg hover:bg-slate-200 dark:hover:bg-primary/20 text-sm font-bold">
                    2
                  </button>
                  <button className="size-8 rounded-lg hover:bg-slate-200 dark:hover:bg-primary/20 text-sm font-bold">
                    3
                  </button>
                </div>
                <button className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-primary/20 text-slate-400">
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-primary/5 border border-primary/20 flex flex-col gap-2">
              <div className="size-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center mb-2">
                <span className="material-symbols-outlined">analytics</span>
              </div>
              <h3 className="font-bold text-lg">Monthly Usage</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                You have used 12.4GB of your 50GB monthly quota.
              </p>
              <div className="mt-4 w-full h-2 bg-slate-200 dark:bg-primary/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: "25%" }}
                ></div>
              </div>
            </div>
            <div className="p-6 rounded-xl bg-primary/5 border border-primary/20 flex flex-col gap-2">
              <div className="size-10 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <h3 className="font-bold text-lg">Conversion Accuracy</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                99.8% of your files were converted successfully this week.
              </p>
              <div className="mt-4 flex items-center gap-2 text-emerald-500 font-bold text-sm">
                <span className="material-symbols-outlined text-sm">
                  trending_up
                </span>
                +2.4% from last week
              </div>
            </div>
            <div className="p-6 rounded-xl bg-primary/5 border border-primary/20 flex flex-col gap-2">
              <div className="size-10 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined">bolt</span>
              </div>
              <h3 className="font-bold text-lg">Auto-Delete</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Next scheduled cleanup in 4 hours. Download your files soon.
              </p>
              <button className="mt-4 text-primary text-sm font-bold hover:underline flex items-center gap-1">
                Configure cleanup settings
                <span className="material-symbols-outlined text-xs">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
