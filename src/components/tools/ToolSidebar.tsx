"use client";

import React from "react";

interface ToolSidebarProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function ToolSidebar({
  title,
  description,
  children,
  className = "",
}: ToolSidebarProps) {
  return (
    <aside
      className={`w-full md:w-80 lg:w-96 bg-white dark:bg-primary/5 rounded-3xl border border-slate-200 dark:border-primary/20 shadow-xl p-6 md:p-8 flex flex-col sticky top-24 shrink-0 transition-all ${className}`}
    >
      <div className="mb-6">
        <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-6">{children}</div>
    </aside>
  );
}
