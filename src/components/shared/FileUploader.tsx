"use client";

import { useRef, useState } from "react";
import { toast } from "react-hot-toast";

interface FileUploaderProps {
  onFilesSelected: (files: FileList | null) => void;
  isProcessing?: boolean;
  accept?: string;
  multiple?: boolean;
  subtitle?: string;
  icon?: string;
  buttonText?: string;
  hasHistory?: boolean;
}

export const FileUploader = ({
  onFilesSelected,
  isProcessing = false,
  accept,
  multiple = true,
  subtitle,
  icon = "folder_open",
  buttonText = "Choose Files",
  hasHistory = false,
}: FileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

  const validateAndProcessFiles = (files: FileList | null) => {
    if (!files || files.length === 0) {
      toast.error("No file was selected");
      return;
    }

    const fileList = Array.from(files);

    if (!multiple && fileList.length > 1) {
      toast.error("Only one file can be selected at a time");
      return;
    }

    const oversizedFile = fileList.find((f) => f.size > MAX_FILE_SIZE_BYTES);
    if (oversizedFile) {
      toast.error(`"${oversizedFile.name}" exceeds the 100 MB size limit`);
      return;
    }

    if (accept) {
      const allowedPatterns = accept
        .split(",")
        .map((s) => s.trim().toLowerCase());

      const invalidFile = fileList.find((f) => {
        const name = f.name.toLowerCase();
        const type = f.type.toLowerCase();
        return !allowedPatterns.some((pattern) => {
          if (pattern.startsWith(".")) {
            return name.endsWith(pattern);
          }
          if (pattern.endsWith("/*")) {
            const prefix = pattern.replace("/*", "");
            return type.startsWith(prefix);
          }
          return type === pattern;
        });
      });

      if (invalidFile) {
        toast.error(`"${invalidFile.name}" is not a supported file format`);
        return;
      }
    }

    onFilesSelected(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      validateAndProcessFiles(e.dataTransfer.files);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-full bg-white dark:bg-primary/5 rounded-xl border transition-all duration-300 overflow-hidden shadow-xl shadow-black/5 ${
        isDragging
          ? "border-primary border-2 border-dashed bg-primary/5 dark:bg-primary/10 scale-[1.005]"
          : "border-slate-200 dark:border-primary/20"
      }`}
    >
      <div
        className={`flex flex-col items-center justify-center text-center transition-all duration-500 ${hasHistory ? "py-10" : "p-12 md:p-24"}`}
      >
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          multiple={multiple}
          onChange={(e) => {
            validateAndProcessFiles(e.target.files);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
          accept={accept}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="bg-primary hover:bg-primary/90 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {isProcessing ? (
            <>
              <span className="material-symbols-outlined animate-spin text-2xl text-white">sync</span>
              Processing...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-2xl">{icon}</span>
              {buttonText}
            </>
          )}
        </button>

        {subtitle && (
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
