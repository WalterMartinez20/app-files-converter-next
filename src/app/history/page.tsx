"use client";

import { useState, useMemo } from "react";
import { useConversions } from "@/hooks/useConversions";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  HistoryTable,
  HistoryFilters,
  HistoryStatsCards,
} from "@/components/history";

export default function HistoryPage() {
  const {
    conversions,
    isLoading,
    downloadFile,
    removeConversionFromHistory,
    clearAllConversions,
  } = useConversions();

  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filteredConversions = useMemo(() => {
    let list = [...conversions];

    // Filter by category
    if (activeCategory === "documents") {
      list = list.filter((c) =>
        ["pdf", "docx", "doc", "txt"].includes(c.target_format.toLowerCase())
      );
    } else if (activeCategory === "images") {
      list = list.filter((c) =>
        ["jpg", "jpeg", "png", "webp"].includes(c.target_format.toLowerCase())
      );
    } else if (activeCategory === "video") {
      list = list.filter((c) =>
        ["mp4", "webm", "avi"].includes(c.target_format.toLowerCase())
      );
    } else if (activeCategory === "audio") {
      list = list.filter((c) =>
        ["mp3", "wav", "ogg"].includes(c.target_format.toLowerCase())
      );
    }

    // Sort
    if (sortBy === "oldest") {
      list.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    } else if (sortBy === "size") {
      list.sort((a, b) => b.file_size - a.file_size);
    } else {
      // newest
      list.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return list;
  }, [conversions, activeCategory, sortBy]);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 transition-colors">
      <div className="layout-container flex h-full grow flex-col">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-10 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              Conversion History
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl">
              Access, manage, and download your processed files. Files are
              automatically deleted after 24 hours for your privacy.
            </p>
          </div>

          <HistoryFilters
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            hasConversions={conversions.length > 0}
            onClearHistory={clearAllConversions}
          />

          <HistoryTable
            conversions={filteredConversions}
            isLoading={isLoading}
            onDownload={downloadFile}
            onDelete={removeConversionFromHistory}
          />

          <HistoryStatsCards />
        </main>

        <Footer />
      </div>
    </div>
  );
}
