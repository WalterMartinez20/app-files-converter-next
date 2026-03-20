"use client";

import { useState } from "react";
import Link from "next/link";
import { FileDropzone } from "@/components/converter/FileDropzone";
import { useConversions } from "@/hooks/useConversions";

export const Hero = () => {
  const { conversions, handleUploadAndConvert, isAuthenticated } =
    useConversions();
  // For simplicity in the landing page, we default to PDF. In a real app,
  // you might want a small dropdown here or redirect them to the dashboard.
  const [targetFormat] = useState("pdf");

  // We only show the last 3 conversions in the landing page
  const recentConversions = conversions.slice(0, 3);

  return (
    <section className="px-6 lg:px-40 py-16 md:py-24">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Text Column */}
          <div className="flex flex-col gap-8 lg:w-1/2">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider text-primary uppercase bg-primary/10 rounded-full">
                New: Video Compression 2.0
              </span>
              <h1 className="text-slate-900 dark:text-white text-5xl md:text-6xl font-black leading-[1.1] tracking-tight">
                Convert anything to everything
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl leading-relaxed max-w-xl">
                Professional-grade file conversion for over 300+ formats. Fast,
                secure, and entirely in your browser. No software installation
                required.
              </p>
            </div>

            {/* Si no está autenticado, le sugerimos registrarse */}
            {!isAuthenticated && (
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10 flex items-center gap-4 max-w-md">
                <span className="material-symbols-outlined text-amber-500">
                  info
                </span>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Guest conversions are deleted after 24h.{" "}
                  <Link href="/auth/signup" className="font-bold underline">
                    Create a free account
                  </Link>{" "}
                  to save your history permanently.
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Interactive Dropzone */}
          <div className="lg:w-1/2 w-full space-y-4">
            <FileDropzone
              onFileSelect={(file) =>
                handleUploadAndConvert(file, targetFormat)
              }
            />

            {/* Mostrar mini-historial si el usuario anónimo ya subió algo */}
            {recentConversions.length > 0 && (
              <div className="bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg">
                <h4 className="text-sm font-bold mb-3 flex items-center justify-between">
                  <span>Recent Conversions</span>
                  <Link
                    href="/dashboard"
                    className="text-xs text-primary hover:underline"
                  >
                    View Dashboard
                  </Link>
                </h4>
                <div className="space-y-3">
                  {recentConversions.map((conv) => (
                    <div
                      key={conv.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="material-symbols-outlined text-primary text-lg">
                          description
                        </span>
                        <span className="truncate max-w-[150px]">
                          {conv.file_name}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider ${
                          conv.status === "completed"
                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                            : "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
                        }`}
                      >
                        {conv.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
