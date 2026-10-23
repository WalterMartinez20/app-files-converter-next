"use client";

import React from "react";

interface ToolWorkspaceProps {
  children: React.ReactNode;
  className?: string;
  hasPadding?: boolean;
}

export function ToolWorkspace({
  children,
  className = "",
  hasPadding = true,
}: ToolWorkspaceProps) {
  return (
    <section
      className={`flex-1 w-full bg-white dark:bg-primary/5 rounded-3xl border border-slate-200 dark:border-primary/20 shadow-xl min-h-[480px] flex flex-col relative overflow-hidden transition-all ${
        hasPadding ? "p-6 md:p-8" : ""
      } ${className}`}
    >
      {children}
    </section>
  );
}
