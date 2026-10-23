"use client";

import React from "react";

interface ToolActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  text: string;
  loadingText?: string;
  icon?: string;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}

export function ToolActionButton({
  onClick,
  disabled = false,
  isLoading = false,
  text,
  loadingText = "Processing...",
  icon = "arrow_forward",
  variant = "primary",
  className = "",
}: ToolActionButtonProps) {
  const baseStyles =
    "w-full font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2.5 text-sm md:text-base select-none";

  const variants = {
    primary:
      "bg-primary hover:bg-primary/90 text-white shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none disabled:active:scale-100",
    secondary:
      "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-slate-200/50 dark:shadow-none active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none",
    danger:
      "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {isLoading ? (
        <>
          <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          {icon && <span className="material-symbols-outlined text-lg">{icon}</span>}
          <span>{text}</span>
        </>
      )}
    </button>
  );
}
