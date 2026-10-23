"use client";

import { useNumberPdfUI } from "@/hooks/useNumberPdfUI";
import { ConversionsQueue } from "@/components/shared/ConversionsQueue";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FileUploader } from "@/components/shared/FileUploader";
import { ToolPageHeader } from "@/components/tools";
import { NumberPreview } from "./components/NumberPreview";
import { NumberPdfSidebar } from "./components/NumberPdfSidebar";

export default function NumberPdfPage() {
  const {
    file,
    position,
    setPosition,
    format,
    setFormat,
    size,
    setSize,
    textColor,
    setTextColor,
    shapeColor,
    setShapeColor,
    shape,
    setShape,
    fontFamily,
    setFontFamily,
    isProcessing,
    thumbnailUrl,
    allThumbnails,
    isGenerating,
    numPages,
    formatsList,
    getFormatSampleString,
    onFilesSelected,
    handleAction,
    cancelNumbering,
    pdfNumbers,
    isLoading,
    downloadFile,
    removeConversionFromHistory,
    clearAllConversions,
  } = useNumberPdfUI();

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 transition-colors">
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main
          className={`flex-1 mx-auto w-full px-4 md:px-8 py-8 md:py-12 space-y-12 ${
            file ? "max-w-7xl" : "max-w-5xl md:px-10"
          }`}
        >
          <section className="w-full flex flex-col items-center">
            <ToolPageHeader
              title="Add Page Numbers"
              subtitle="Insert beautiful, custom page numbers into your PDF documents."
            />

            {!file ? (
              <FileUploader
                onFilesSelected={onFilesSelected}
                accept="application/pdf"
                multiple={false}
                icon="format_list_numbered"
                buttonText="Select PDF file"
                subtitle="or drop PDF here. 100 MB maximum file size."
                hasHistory={pdfNumbers.length > 0}
              />
            ) : (
              <div className="w-full max-w-7xl bg-white dark:bg-primary/5 rounded-3xl border border-slate-200 dark:border-primary/20 p-6 md:p-10 shadow-xl flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Left Side: Preview */}
                <div className="w-full lg:w-[380px] xl:w-[400px] shrink-0 flex flex-col items-center justify-between bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 min-h-[300px]">
                  {isGenerating ? (
                    <div className="flex flex-col items-center gap-2 text-slate-400 py-16">
                      <span className="material-symbols-outlined text-4xl animate-spin">refresh</span>
                      <p className="text-sm font-medium">Generating preview...</p>
                    </div>
                  ) : allThumbnails.length > 0 ? (
                    <div className="flex flex-col gap-6 max-h-[580px] overflow-y-auto w-full items-center p-2 custom-scrollbar">
                      {allThumbnails.map((thumbUrl, idx) => {
                        const pageNum = idx + 1;
                        return (
                          <NumberPreview
                            key={pageNum}
                            thumbUrl={thumbUrl}
                            alt={`Page ${pageNum}`}
                            text={getFormatSampleString(pageNum, allThumbnails.length || numPages)}
                            position={position}
                            size={size}
                            textColor={textColor}
                            shape={shape}
                            shapeColor={shapeColor}
                            fontFamily={fontFamily}
                          />
                        );
                      })}
                    </div>
                  ) : thumbnailUrl ? (
                    <div className="flex flex-col gap-6 max-h-[580px] overflow-y-auto w-full items-center p-2 custom-scrollbar">
                      <NumberPreview
                        thumbUrl={thumbnailUrl}
                        alt="PDF Preview"
                        text={getFormatSampleString(1, numPages || 1)}
                        position={position}
                        size={size}
                        textColor={textColor}
                        shape={shape}
                        shapeColor={shapeColor}
                        fontFamily={fontFamily}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400 py-16">
                      <span className="material-symbols-outlined text-4xl text-slate-400">description</span>
                      <p className="text-sm font-medium">No preview available</p>
                    </div>
                  )}
                  <p
                    className="mt-4 font-semibold text-slate-700 dark:text-slate-300 text-center truncate max-w-xs text-sm"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                </div>

                {/* Right Side: Form / Controls */}
                <NumberPdfSidebar
                  position={position}
                  setPosition={setPosition}
                  format={format}
                  setFormat={setFormat}
                  formatsList={formatsList}
                  size={size}
                  setSize={setSize}
                  fontFamily={fontFamily}
                  setFontFamily={setFontFamily}
                  textColor={textColor}
                  setTextColor={setTextColor}
                  shape={shape}
                  setShape={setShape}
                  shapeColor={shapeColor}
                  setShapeColor={setShapeColor}
                  isProcessing={isProcessing}
                  onCancel={cancelNumbering}
                  onSubmit={handleAction}
                />
              </div>
            )}
          </section>

          <ConversionsQueue
            conversions={pdfNumbers}
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
