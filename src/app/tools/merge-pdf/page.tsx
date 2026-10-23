"use client";

import { useMergeUI } from "@/hooks/useMergeUI";
import { ConversionsQueue } from "@/components/shared/ConversionsQueue";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FileUploader } from "@/components/shared/FileUploader";
import { ToolPageHeader } from "@/components/tools";
import { MergeFileList } from "./components/MergeFileList";
import { MergeSidebar } from "./components/MergeSidebar";

export default function MergePdfPage() {
  const {
    pdfMerges,
    isLoading,
    downloadFile,
    removeConversionFromHistory,
    clearAllConversions,
    pdfFiles,
    isMerging,
    handleFilesSelected,
    removeFile,
    draggedIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDragEnd,
    handleDrop,
    onMergeClick,
    rotateFile,
    orderByFileName,
    cancelMerge,
    activeFilter,
    resetAllFilters,
  } = useMergeUI();

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 transition-colors">
      <div className="layout-container flex h-full grow flex-col">
        <Header />

        <main className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-10 py-8 md:py-12 space-y-12">
          <section className="w-full flex flex-col items-center">
            <ToolPageHeader
              title="Merge PDF files"
              subtitle="Combine multiple PDFs in the exact order you want with seamless merging."
            />

            {pdfFiles.length === 0 ? (
              <FileUploader
                onFilesSelected={handleFilesSelected}
                accept="application/pdf"
                multiple={true}
                icon="library_add"
                buttonText="Select PDF files"
                subtitle="or drop PDFs here. 100 MB maximum file size."
                hasHistory={pdfMerges.length > 0}
              />
            ) : (
              <div className="w-full flex flex-col md:flex-row gap-8 items-start">
                {/* File list workspace */}
                <MergeFileList
                  pdfFiles={pdfFiles}
                  draggedIndex={draggedIndex}
                  dragOverIndex={dragOverIndex}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDragEnd={handleDragEnd}
                  onDrop={handleDrop}
                  onRemoveFile={removeFile}
                  onRotateFile={rotateFile}
                  onFilesSelected={handleFilesSelected}
                />

                {/* Sidebar controls */}
                <MergeSidebar
                  filesCount={pdfFiles.length}
                  activeFilter={activeFilter}
                  onOrderByFileName={orderByFileName}
                  onResetFilters={resetAllFilters}
                  isMerging={isMerging}
                  onMergeClick={onMergeClick}
                  onCancel={cancelMerge}
                />
              </div>
            )}
          </section>

          <ConversionsQueue
            conversions={pdfMerges}
            isLoading={isLoading}
            onDownload={downloadFile}
            onDelete={removeConversionFromHistory}
            onClearAll={clearAllConversions}
            variant="pdf"
          />
        </main>
        <Footer />
      </div>
    </div>
  );
}
