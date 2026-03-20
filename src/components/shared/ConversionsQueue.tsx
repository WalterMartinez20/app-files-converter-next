"use client";

import { ConversionsQueueProps } from "@/types/ui";

export const ConversionsQueue = ({
  conversions,
  isLoading,
  onDownload,
  onDelete,
  variant = "image",
}: ConversionsQueueProps) => {
  const isPdf = variant === "pdf";

  // Estilos dinámicos para recuperar la apariencia exacta
  const colorPrimary = isPdf ? "text-rose-500" : "text-primary";
  const bgPrimary = isPdf ? "bg-rose-500" : "bg-primary";
  const hoverBgPrimary = isPdf ? "hover:bg-rose-600" : "hover:bg-primary/90";
  const borderLeft = isPdf ? "border-l-rose-500" : "border-l-primary";
  const iconCompleted = isPdf ? "picture_as_pdf" : "check_circle";

  const boxBg = isPdf
    ? "bg-white dark:bg-[#1a1c29]"
    : "bg-white dark:bg-primary/5";
  const boxBorder = isPdf
    ? "border border-slate-200 dark:border-slate-800"
    : "border border-slate-200 dark:border-primary/20";
  const boxHover = isPdf
    ? "hover:border-rose-300 dark:hover:border-rose-500/40"
    : "hover:border-slate-300 dark:hover:border-primary/40";

  const completedTagBg = isPdf
    ? "bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-500"
    : "bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600";

  // Filtramos la cola
  const activeQueue = conversions.filter(
    (c) => c.status === "pending" || c.status === "processing",
  );
  const recentHistory = conversions
    .filter((c) => c.status === "completed" || c.status === "failed")
    .slice(0, 5);

  if (!isLoading && activeQueue.length === 0 && recentHistory.length === 0)
    return null;

  return (
    <section
      id="conversions-queue"
      className="w-full max-w-5xl mx-auto space-y-4 pt-6 scroll-mt-24"
    >
      <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1 border-b border-slate-200 dark:border-primary/20 pb-2">
        Your Conversions
      </h3>

      <div className="space-y-3">
        {isLoading && activeQueue.length === 0 && recentHistory.length === 0 ? (
          <>
            {[1, 2].map((skeleton) => (
              <div
                key={`skeleton-${skeleton}`}
                className={`${boxBg} ${boxBorder} p-4 rounded-xl flex items-center justify-between shadow-sm animate-pulse`}
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-800 flex-shrink-0"></div>
                  <div className="space-y-2 w-full max-w-[200px]">
                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
                    <div className="h-2.5 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {activeQueue.map((item) => (
              <div
                key={item.id}
                className={`${boxBg} ${boxBorder} p-5 rounded-xl flex flex-col gap-3 shadow-sm relative overflow-hidden border-l-4 ${borderLeft}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined ${colorPrimary} animate-spin`}
                    >
                      sync
                    </span>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate max-w-[200px]">
                      {item.file_name}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold ${colorPrimary} uppercase tracking-wider`}
                  >
                    Processing...
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${bgPrimary} animate-[pulse_1s_ease-in-out_infinite]`}
                    style={{ width: "70%" }}
                  ></div>
                </div>
              </div>
            ))}

            {recentHistory.map((item) => (
              <div
                key={item.id}
                className={`${boxBg} ${boxBorder} p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm ${boxHover} transition-all border-l-4 ${borderLeft}`}
              >
                <div className="flex items-center gap-4">
                  {item.status === "completed" ? (
                    <div
                      className={`size-10 rounded-full flex items-center justify-center ${completedTagBg}`}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {iconCompleted}
                      </span>
                    </div>
                  ) : (
                    <div className="size-10 rounded-full bg-rose-100 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-rose-600 dark:text-rose-400 text-xl">
                        error
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate max-w-[250px]">
                      {item.file_name}
                    </p>
                    <p className="text-[11px] text-slate-500 uppercase mt-1 font-medium tracking-wide">
                      {item.original_format} <span className="mx-1">➔</span>{" "}
                      <span
                        className={
                          item.status === "completed"
                            ? "text-primary font-bold"
                            : "text-rose-500 font-bold"
                        }
                      >
                        {item.target_format}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  {item.status === "completed" ? (
                    <button
                      onClick={() =>
                        onDownload(item.storage_path, item.file_name)
                      }
                      className={`flex-1 md:flex-none ${bgPrimary} ${hoverBgPrimary} text-white text-sm font-bold px-6 py-2.5 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 active:scale-95`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        download
                      </span>{" "}
                      Download
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-white px-3 py-1.5 bg-rose-500 rounded-md text-center flex-1 md:flex-none">
                      Failed
                    </span>
                  )}

                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-2.5 text-slate-400 hover:text-rose-500 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-slate-800 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      close
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
};
