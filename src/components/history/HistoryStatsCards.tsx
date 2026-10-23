import React from "react";

export function HistoryStatsCards() {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Monthly Usage */}
      <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col gap-2 shadow-sm">
        <div className="size-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-2">
          <span className="material-symbols-outlined">analytics</span>
        </div>
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Monthly Usage</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          You have used 12.4GB of your 50GB monthly quota.
        </p>
        <div className="mt-4 w-full h-2 bg-slate-200 dark:bg-primary/20 rounded-full overflow-hidden">
          <div className="h-full bg-primary w-1/4 rounded-full transition-all duration-500"></div>
        </div>
      </div>

      {/* Conversion Accuracy */}
      <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col gap-2 shadow-sm">
        <div className="size-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-2">
          <span className="material-symbols-outlined">verified</span>
        </div>
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Conversion Accuracy</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          99.8% of your files were converted successfully this week.
        </p>
        <div className="mt-4 flex items-center gap-2 text-emerald-500 font-bold text-sm">
          <span className="material-symbols-outlined text-sm">trending_up</span>
          +2.4% from last week
        </div>
      </div>

      {/* Auto-Delete */}
      <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col gap-2 shadow-sm">
        <div className="size-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center mb-2">
          <span className="material-symbols-outlined">bolt</span>
        </div>
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Auto-Delete</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Next scheduled cleanup in 4 hours. Download your files soon.
        </p>
        <button
          type="button"
          className="mt-4 text-primary text-sm font-bold hover:underline flex items-center gap-1 w-fit"
        >
          Configure cleanup settings
          <span className="material-symbols-outlined text-xs">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
