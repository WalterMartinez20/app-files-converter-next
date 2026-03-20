import React from "react";
import Link from "next/link";

export const Sidebar = () => {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="size-10 rounded-lg bg-primary flex items-center justify-center text-white">
          <span className="material-symbols-outlined">sync_alt</span>
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">FileConvert</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Pro Plan</p>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium transition-colors"
        >
          <span className="material-symbols-outlined">auto_fix_high</span>
          <span className="text-sm">Convert</span>
        </Link>
        <Link
          href="/history"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors group"
        >
          <span className="material-symbols-outlined group-hover:text-primary">
            history
          </span>
          <span className="text-sm">History</span>
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors group"
        >
          <span className="material-symbols-outlined group-hover:text-primary">
            settings
          </span>
          <span className="text-sm">Settings</span>
        </Link>
      </nav>
      {/* User Profile Section */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 p-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
          <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-500">
              person
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">My Account</p>
          </div>
          <span className="material-symbols-outlined text-slate-400 text-sm">
            logout
          </span>
        </div>
      </div>
    </aside>
  );
};
