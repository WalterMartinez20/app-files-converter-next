"use client";

// * arrastrar archivo o hacer clic para abrir el explorador de archivos

import React, { useCallback, useRef, useState } from "react";

export const FileDropzone = ({
  onFileSelect,
}: {
  onFileSelect: (file: File) => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFileSelect(e.dataTransfer.files[0]);
      }
    },
    [onFileSelect],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      className="relative group"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileInput}
      />

      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
      <div
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-16 transition-all cursor-pointer ${isDragging ? "border-primary bg-primary/5" : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 hover:border-primary/50"}`}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
          <span className="material-symbols-outlined text-4xl">
            upload_file
          </span>
        </div>
        <h3 className="text-xl font-bold mb-1">
          {isDragging ? "Suelta el archivo aquí" : "Drag & Drop Files Here"}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 text-center max-w-sm">
          Support for PDF, DOCX, JPG, PNG, and more. <br />
          Max file size 100MB for free users.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
          >
            Browse Files
          </button>
        </div>
      </div>
    </div>
  );
};
