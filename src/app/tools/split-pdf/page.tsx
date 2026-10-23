"use client";

import { useSplitPdfUI } from "@/hooks/useSplitPdfUI";
import { ConversionsQueue } from "@/components/shared/ConversionsQueue";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FileUploader } from "@/components/shared/FileUploader";
import { ToolPageHeader } from "@/components/tools";
import {
  SplitSidebar,
  SplitPreviewGrid,
  ZoomModal,
} from "./components";

export default function SplitPdfPage() {
  const {
    file,
    splitMode,
    setSplitMode,
    rangeMode,
    setRangeMode,
    extractMode,
    setExtractMode,
    rangeList,
    activeRangeIndex,
    setActiveRangeIndex,
    fixedChunk,
    selectedPages,
    pagesInputText,
    mergeFiles,
    setMergeFiles,
    zoomPage,
    setZoomPage,
    isProcessing,
    allThumbnails,
    isGenerating,
    numPages,
    fixedRanges,
    addRange,
    removeRange,
    moveRange,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleRangeInputChange,
    handleRangeBlur,
    handleFixedChunkChange,
    togglePage,
    handlePagesInputChange,
    handlePagesInputBlur,
    onFilesSelected,
    handleAction,
    cancelSplit,
    pdfSplits,
    isLoading,
    downloadFile,
    removeConversionFromHistory,
    clearAllConversions,
  } = useSplitPdfUI();

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="layout-container flex h-full grow flex-col">
        <Header />

        <main
          className={`flex-1 mx-auto w-full px-4 md:px-8 py-8 md:py-12 space-y-12 ${
            file ? "max-w-7xl" : "max-w-5xl md:px-10"
          }`}
        >
          <section className="w-full flex flex-col items-center">
            <ToolPageHeader
              title="Split PDF"
              subtitle="Separate one page or a whole set for easy conversion into independent PDF files."
            />

            {!file ? (
              <FileUploader
                onFilesSelected={onFilesSelected}
                accept="application/pdf"
                multiple={false}
                icon="content_cut"
                buttonText="Select PDF file"
                subtitle="or drop PDF here. 100 MB maximum file size."
                hasHistory={pdfSplits.length > 0}
              />
            ) : (
              <div className="w-full max-w-6xl bg-white dark:bg-primary/5 rounded-3xl border border-slate-200 dark:border-primary/20 p-6 sm:p-8 md:p-10 shadow-xl flex flex-col lg:flex-row gap-8 md:gap-10">
                {/* Visual Preview Canvas */}
                <SplitPreviewGrid
                  file={file}
                  numPages={numPages}
                  allThumbnails={allThumbnails}
                  isGenerating={isGenerating}
                  splitMode={splitMode}
                  rangeMode={rangeMode}
                  extractMode={extractMode}
                  rangeList={rangeList}
                  activeRangeIndex={activeRangeIndex}
                  onSelectRange={setActiveRangeIndex}
                  fixedRanges={fixedRanges}
                  selectedPages={selectedPages}
                  onTogglePage={togglePage}
                  onZoomPage={setZoomPage}
                  onChangeFile={cancelSplit}
                />

                {/* Configuration Sidebar */}
                <SplitSidebar
                  splitMode={splitMode}
                  onSplitModeChange={setSplitMode}
                  rangeMode={rangeMode}
                  onRangeModeChange={setRangeMode}
                  extractMode={extractMode}
                  onExtractModeChange={setExtractMode}
                  rangeList={rangeList}
                  activeRangeIndex={activeRangeIndex}
                  onSelectRange={setActiveRangeIndex}
                  onAddRange={addRange}
                  onRemoveRange={removeRange}
                  onMoveRange={moveRange}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onRangeInputChange={handleRangeInputChange}
                  onRangeBlur={handleRangeBlur}
                  fixedChunk={fixedChunk}
                  onFixedChunkChange={handleFixedChunkChange}
                  pagesInputText={pagesInputText}
                  onPagesInputChange={handlePagesInputChange}
                  onPagesInputBlur={handlePagesInputBlur}
                  mergeFiles={mergeFiles}
                  onMergeFilesChange={setMergeFiles}
                  numPages={numPages}
                  isProcessing={isProcessing}
                  onCancel={cancelSplit}
                  onSubmit={handleAction}
                />
              </div>
            )}
          </section>

          {/* Conversions Queue Section */}
          <ConversionsQueue
            conversions={pdfSplits}
            isLoading={isLoading}
            onDownload={downloadFile}
            onDelete={removeConversionFromHistory}
            onClearAll={clearAllConversions}
            variant="pdf"
          />
        </main>

        {/* Floating Zoom Preview Modal */}
        <ZoomModal
          zoomPage={zoomPage}
          numPages={numPages}
          allThumbnails={allThumbnails}
          onClose={() => setZoomPage(null)}
          onPrevPage={() => setZoomPage((prev) => (prev && prev > 1 ? prev - 1 : 1))}
          onNextPage={() => setZoomPage((prev) => (prev && prev < numPages ? prev + 1 : prev))}
        />

        <Footer />
      </div>
    </div>
  );
}
