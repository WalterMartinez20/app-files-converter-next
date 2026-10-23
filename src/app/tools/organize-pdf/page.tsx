"use client";

import { useOrganizeUI } from "@/hooks/useOrganizeUI";
import { ConversionsQueue } from "@/components/shared/ConversionsQueue";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FileUploader } from "@/components/shared/FileUploader";
import { ToolPageHeader } from "@/components/tools";
import { OrganizePageGrid } from "./components/OrganizePageGrid";
import { OrganizeSidebar } from "./components/OrganizeSidebar";

export default function OrganizePdfPage() {
  const {
    pdfOrganizes,
    isColaLoading,
    downloadFile,
    removeConversionFromHistory,
    clearAllConversions,
    pdfFiles,
    pages,
    isReadingPdf,
    isProcessing,
    draggedIndex,
    handleFileSelected,
    fileInputRef,
    removePage,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDragEnd,
    handleDrop,
    rotatePage,
    addBlankPage,
    orderByFileName,
    orderByPageNumber,
    mixPages,
    onOrganizeClick,
    cancelOrganize,
    activeFilter,
    resetAllFilters,
  } = useOrganizeUI();

  const fileColors = [
    "#6366f1",
    "#10b981",
    "#ec4899",
    "#8b5cf6",
    "#f59e0b",
    "#06b6d4",
    "#ef4444",
    "#84cc16",
    "#14b8a6",
  ];

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 transition-colors">
      <div className="layout-container flex h-full grow flex-col">
        <Header />

        <main className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-10 py-8 md:py-12 space-y-12">
          <section className="w-full flex flex-col items-center">
            <ToolPageHeader
              title="Organize PDF"
              subtitle="Sort, add, rotate, and delete PDF pages. Drag and drop thumbnails to reorder them with ease."
            />

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="application/pdf"
              multiple
              onChange={(e) => handleFileSelected(e.target.files)}
            />

            {pdfFiles.length === 0 ? (
              <FileUploader
                onFilesSelected={handleFileSelected}
                isProcessing={isReadingPdf}
                accept="application/pdf"
                multiple={false}
                icon="note_stack"
                buttonText="Select PDF file"
                subtitle="Select a single PDF to extract or organize its pages. 100 MB maximum file size."
                hasHistory={pdfOrganizes.length > 0}
              />
            ) : (
              <div className="w-full flex flex-col md:flex-row gap-8 items-start">
                {/* Visual Page Grid */}
                <OrganizePageGrid
                  pages={pages}
                  fileColors={fileColors}
                  draggedIndex={draggedIndex}
                  dragOverIndex={dragOverIndex}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDragEnd={handleDragEnd}
                  onDrop={handleDrop}
                  onRemovePage={removePage}
                  onRotatePage={rotatePage}
                  onAddBlankPage={addBlankPage}
                  onAddPdfClick={() => fileInputRef.current?.click()}
                />

                {/* Sidebar Controls */}
                <OrganizeSidebar
                  pdfFiles={pdfFiles}
                  fileColors={fileColors}
                  activeFilter={activeFilter}
                  onOrderByFileName={orderByFileName}
                  onOrderByPageNumber={orderByPageNumber}
                  onMixPages={mixPages}
                  onResetFilters={resetAllFilters}
                  isProcessing={isProcessing}
                  onSave={onOrganizeClick}
                  onCancel={cancelOrganize}
                />
              </div>
            )}
          </section>

          <ConversionsQueue
            conversions={pdfOrganizes}
            isLoading={isColaLoading}
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
