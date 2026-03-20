"use client";

import { useRef } from "react";

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

  return (
    <div className="w-full bg-white dark:bg-primary/5 rounded-xl border border-slate-200 dark:border-primary/20 overflow-hidden shadow-xl shadow-black/5">
      <div
        className={`flex flex-col items-center justify-center text-center transition-all duration-500 ${hasHistory ? "py-10" : "p-12 md:p-24"}`}
      >
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          multiple={multiple}
          onChange={(e) => onFilesSelected(e.target.files)}
          accept={accept}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="bg-primary hover:bg-primary/90 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {isProcessing ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
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
