"use client";

import React from "react";
import { MergeFile } from "@/types/ui";

interface MergeFileListProps {
  pdfFiles: MergeFile[];
  draggedIndex: number | null;
  dragOverIndex: number | null;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragLeave: () => void;
  onDragEnd: () => void;
  onDrop: (index: number) => void;
  onRemoveFile: (index: number) => void;
  onRotateFile: (index: number) => void;
  onFilesSelected: (files: FileList | null) => void;
}

export function MergeFileList({
  pdfFiles,
  draggedIndex,
  dragOverIndex,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDragEnd,
  onDrop,
  onRemoveFile,
  onRotateFile,
  onFilesSelected,
}: MergeFileListProps) {
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
    <div className="flex-1 bg-white dark:bg-primary/5 rounded-3xl border border-slate-200 dark:border-primary/20 p-6 md:p-8 min-h-[480px] flex flex-wrap gap-6 items-start justify-center shadow-inner relative overflow-hidden">
      {pdfFiles.map((fileObj, index) => {
        const isDragged = draggedIndex === index;
        const isDragOver =
          dragOverIndex === index && draggedIndex !== null && draggedIndex !== index;

        return (
          <div
            key={`${fileObj.file.name}-${fileObj.file.size}-${index}`}
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
            {/* Remove File Button */}
            <button
              type="button"
              onClick={() => onRemoveFile(index)}
              className="absolute -top-3 -right-3 size-8 bg-white dark:bg-background-dark rounded-full shadow-md text-slate-400 hover:text-rose-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-30 border border-slate-200 dark:border-primary/20 hover:scale-110"
              title="Remove file"
            >
              <span className="material-symbols-outlined text-sm font-bold">close</span>
            </button>

            {/* File Card */}
            <div className="w-full aspect-[1/1.4] relative rounded-2xl shadow-sm group-hover:shadow-lg transition-all bg-slate-100 dark:bg-slate-800/80 overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
              {/* Primary color bar at top */}
              <div className="absolute top-0 left-0 w-full h-1.5 z-10 bg-primary/80" />

              {/* Rotate button */}
              <button
                type="button"
                onClick={() => onRotateFile(index)}
                className="absolute bottom-3 right-3 size-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full shadow-sm text-slate-500 hover:text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 border border-slate-200/50 dark:border-slate-700/50 hover:scale-110"
                title="Rotate file"
              >
                <span className="material-symbols-outlined text-sm font-bold">
                  rotate_right
                </span>
              </button>

              {/* Thumbnail or fallback */}
              {fileObj.previewUrl ? (
                <div className="absolute inset-0 w-full h-full p-2 pt-4 pointer-events-none flex items-center justify-center">
                  <img
                    src={fileObj.previewUrl}
                    alt={fileObj.file.name}
                    className={`max-w-full max-h-full object-contain drop-shadow-sm transition-transform duration-300 ${getRotationClass(
                      fileObj.rotation
                    )}`}
                  />
                </div>
              ) : (
                <div className="absolute inset-0 w-full h-full bg-slate-50 dark:bg-[#1a1c29] flex flex-col items-center justify-center pointer-events-none">
                  <span className="material-symbols-outlined text-5xl text-rose-500/60 mb-2 animate-pulse">
                    picture_as_pdf
                  </span>
                  <span className="text-xs font-bold text-center text-slate-400">Loading...</span>
                </div>
              )}

              {/* File name label */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-slate-700 dark:text-slate-300 z-10 shadow-sm border border-slate-200/50 dark:border-slate-700/50 max-w-[70%] truncate text-center">
                {fileObj.file.name}
              </div>
            </div>

            {/* Index badge at bottom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md z-40 pointer-events-none whitespace-nowrap">
              {index + 1}
            </div>
          </div>
        );
      })}

      {/* Add more button */}
      <label className="relative group w-36 aspect-[1/1.4] cursor-pointer transition-transform hover:-translate-y-2 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary dark:hover:border-primary rounded-2xl flex flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm mb-6">
        <input
          type="file"
          multiple
          accept=".pdf"
          className="hidden"
          onChange={(e) => onFilesSelected(e.target.files)}
        />
        <span className="material-symbols-outlined text-4xl text-slate-400 group-hover:text-primary transition-colors">
          add_circle
        </span>
        <span className="text-xs font-bold text-slate-500 group-hover:text-primary transition-colors">
          Add More
        </span>
      </label>
    </div>
  );
}
