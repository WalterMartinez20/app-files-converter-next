"use client";

import React from "react";
import { PageItem } from "@/types/ui";

interface OrganizePageGridProps {
  pages: PageItem[];
  fileColors: string[];
  draggedIndex: number | null;
  dragOverIndex: number | null;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragLeave: () => void;
  onDragEnd: () => void;
  onDrop: (index: number) => void;
  onRemovePage: (index: number) => void;
  onRotatePage: (index: number) => void;
  onAddBlankPage: (afterIndex: number) => void;
  onAddPdfClick: () => void;
}

export function OrganizePageGrid({
  pages,
  fileColors,
  draggedIndex,
  dragOverIndex,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDragEnd,
  onDrop,
  onRemovePage,
  onRotatePage,
  onAddBlankPage,
  onAddPdfClick,
}: OrganizePageGridProps) {
  const getRotationClass = (deg: number = 0) => {
    switch (deg % 360) {
      case 90:
        return "rotate-90";
      case 180:
        return "rotate-180";
      case 270:
        return "rotate-[270deg]";
      default:
        return "rotate-0";
    }
  };

  return (
    <div className="flex-1 bg-white dark:bg-primary/5 rounded-3xl border border-slate-200 dark:border-primary/20 p-6 md:p-8 min-h-[500px] flex flex-wrap gap-6 items-start justify-center shadow-inner relative overflow-hidden">
      {pages.map((page, index) => {
        const isDragged = draggedIndex === index;
        const isDragOver =
          dragOverIndex === index && draggedIndex !== null && draggedIndex !== index;

        return (
          <div
            key={page.id}
            draggable
            onDragStart={() => onDragStart(index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDragLeave={onDragLeave}
            onDragEnd={onDragEnd}
            onDrop={() => onDrop(index)}
            className={`relative group w-36 cursor-grab active:cursor-grabbing transition-all duration-300 pb-6 ${
              isDragged ? "opacity-40 scale-90 blur-[1px]" : ""
            } ${
              isDragOver
                ? `scale-105 drop-shadow-2xl before:content-[""] before:absolute before:top-4 before:w-1.5 before:h-2/3 before:bg-primary before:rounded-full before:z-50 ${
                    draggedIndex !== null && draggedIndex < index
                      ? "before:-right-5"
                      : "before:-left-5"
                  }`
                : draggedIndex === null
                ? "hover:-translate-y-2 hover:drop-shadow-xl"
                : ""
            }`}
          >
            {/* Remove Page Button */}
            <button
              type="button"
              onClick={() => onRemovePage(index)}
              className="absolute -top-3 -right-3 size-8 bg-white dark:bg-background-dark rounded-full shadow-md text-slate-400 hover:text-rose-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-30 border border-slate-200 dark:border-primary/20 hover:scale-110"
              title="Remove page"
            >
              <span className="material-symbols-outlined text-sm font-bold">close</span>
            </button>

            {/* Page Card */}
            <div className="w-full aspect-[1/1.4] relative rounded-2xl shadow-sm group-hover:shadow-lg transition-all bg-slate-100 dark:bg-slate-800/80 overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
              {/* Color Bar */}
              <div
                className="absolute top-0 left-0 w-full h-1.5 z-10"
                style={{
                  backgroundColor: page.isBlank
                    ? "#cbd5e1"
                    : fileColors[page.fileIndex % fileColors.length],
                }}
              />

              {/* Rotate Page Button */}
              {!page.isBlank && (
                <button
                  type="button"
                  onClick={() => onRotatePage(index)}
                  className="absolute bottom-3 right-3 size-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full shadow-sm text-slate-500 hover:text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 border border-slate-200/50 dark:border-slate-700/50 hover:scale-110"
                  title="Rotate page"
                >
                  <span className="material-symbols-outlined text-sm font-bold">rotate_right</span>
                </button>
              )}

              {/* Thumbnail / Blank indicator */}
              {page.isLoadingThumbnail ? (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center animate-pulse bg-slate-50 dark:bg-slate-800">
                  <span className="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-600 animate-spin">
                    sync
                  </span>
                </div>
              ) : page.isBlank ? (
                <div className="absolute inset-0 w-full h-full bg-white dark:bg-slate-200 flex items-center justify-center">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Blank Page
                  </span>
                </div>
              ) : page.thumbnailUrl ? (
                <div className="absolute inset-0 w-full h-full p-2 pt-4 pointer-events-none flex items-center justify-center">
                  <img
                    src={page.thumbnailUrl}
                    alt={`Page ${page.originalIndex + 1}`}
                    className={`max-w-full max-h-full object-contain drop-shadow-sm transition-transform duration-300 ${getRotationClass(
                      page.rotation
                    )}`}
                  />
                </div>
              ) : (
                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-rose-500/70 p-2 text-center bg-slate-50 dark:bg-slate-800">
                  <span className="material-symbols-outlined text-3xl mb-1">picture_as_pdf</span>
                </div>
              )}
            </div>

            {/* Bottom Page Number Badge */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md z-40 pointer-events-none whitespace-nowrap">
              {page.isBlank ? "Blank" : `Pg ${page.originalIndex + 1}`}
            </div>

            {/* Insert blank page BEFORE */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddBlankPage(index - 1);
              }}
              className="absolute -left-3.5 top-[45%] -translate-y-1/2 z-30 size-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-full flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
              title="Add blank page before"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
            </button>

            {/* Insert blank page AFTER */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddBlankPage(index);
              }}
              className="absolute -right-3.5 top-[45%] -translate-y-1/2 z-30 size-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-full flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
              title="Add blank page after"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
            </button>
          </div>
        );
      })}

      {/* Add PDF button card */}
      <button
        type="button"
        onClick={onAddPdfClick}
        className="w-36 aspect-[1/1.4] border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group mb-6"
      >
        <span className="material-symbols-outlined text-3xl mb-2 group-hover:scale-110 transition-transform">
          add_circle
        </span>
        <span className="text-sm font-bold">Add PDF</span>
      </button>
    </div>
  );
}
