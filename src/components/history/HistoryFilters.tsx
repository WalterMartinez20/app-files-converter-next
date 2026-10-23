"use client";

import React from "react";

interface HistoryFiltersProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  hasConversions: boolean;
  onClearHistory: () => void;
}

const CATEGORIES = [
  { id: "all", label: "All Files", icon: "grid_view" },
  { id: "documents", label: "Documents", icon: "description" },
  { id: "images", label: "Images", icon: "image" },
  { id: "video", label: "Video", icon: "movie" },
  { id: "audio", label: "Audio", icon: "audiotrack" },
];

export function HistoryFilters({
  activeCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  hasConversions,
  onClearHistory,
}: HistoryFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20 active:scale-[0.98]"
                  : "bg-slate-100 dark:bg-primary/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-primary/20 active:scale-[0.98]"
              }`}
            >
              <span className="material-symbols-outlined text-sm">{cat.icon}</span>
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
          Sort by:
        </span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-slate-100 dark:bg-primary/10 border-none rounded-xl text-sm font-medium py-2 px-4 focus:ring-primary ring-0 cursor-pointer outline-none"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="size">File size</option>
        </select>

        {hasConversions && (
          <button
            type="button"
            onClick={onClearHistory}
            className="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-bold rounded-xl transition-all border border-rose-200 dark:border-rose-500/20 shadow-sm active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
            Clear History
          </button>
        )}
      </div>
    </div>
  );
}
