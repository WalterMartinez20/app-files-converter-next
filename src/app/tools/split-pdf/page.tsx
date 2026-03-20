"use client";

import { useSplitUI } from "@/hooks/useSplitUI";
import { ConversionsQueue } from "@/components/shared/ConversionsQueue";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FileUploader } from "@/components/shared/FileUploader";

export default function SplitPdfPage() {
  const {
    pdfSplits,
    isColaLoading,
    downloadFile,
    removeConversionFromHistory,
    pdfFile,
    pages,
    isReadingPdf,
    isProcessing,
    draggedIndex,
    setDraggedIndex,
    handleFileSelected,
    removePage,
    handleDragStart,
    handleDragOver,
    handleDrop,
    onSplitClick,
    cancelSplit,
  } = useSplitUI();

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <div className="layout-container flex h-full grow flex-col">
        <Header />

        <main className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-10 py-8 md:py-12 space-y-12">
          <section className="w-full flex flex-col items-center">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 mb-4">
                Organize PDF
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                Sort, add and delete PDF pages. Drag and drop the page
                thumbnails to order them.
              </p>
            </div>

            {!pdfFile ? (
              <FileUploader
                onFilesSelected={handleFileSelected}
                isProcessing={isReadingPdf}
                accept="application/pdf"
                multiple={false}
                icon="view_module"
                buttonText="Select PDF file"
                subtitle="Select a single PDF to extract or organize its pages"
                hasHistory={pdfSplits.length > 0}
              />
            ) : (
              <div className="w-full flex flex-col md:flex-row gap-8 items-start">
                {/* Cuadrícula Estilo iLovePDF */}
                <div className="flex-1 bg-white dark:bg-primary/5 rounded-3xl border border-slate-200 dark:border-primary/20 p-8 min-h-[500px] flex flex-wrap gap-6 items-start justify-center shadow-inner relative overflow-hidden">
                  {pages.map((page, index) => (
                    <div
                      key={page.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(index)}
                      onDragEnd={() => setDraggedIndex(null)}
                      className={`relative group w-36 cursor-grab active:cursor-grabbing transition-transform ${draggedIndex === index ? "opacity-40 scale-95" : "opacity-100 hover:-translate-y-2"}`}
                    >
                      <button
                        onClick={() => removePage(index)}
                        className="absolute -top-3 -right-3 size-8 bg-white dark:bg-background-dark rounded-full shadow-md text-slate-400 hover:text-rose-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 border border-slate-200 dark:border-primary/20"
                      >
                        <span className="material-symbols-outlined text-sm font-bold">
                          close
                        </span>
                      </button>

                      {/* Tarjeta Limpia (Sin insignias) */}
                      <div className="w-full aspect-[1/1.4] bg-white dark:bg-[#1a1c29] border-2 border-slate-200 dark:border-primary/20 rounded-xl shadow-sm flex flex-col items-center justify-center overflow-hidden pointer-events-none p-2 relative">
                        {page.isLoadingThumbnail ? (
                          <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center animate-pulse">
                            <span className="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-600 animate-spin">
                              sync
                            </span>
                          </div>
                        ) : page.thumbnailUrl ? (
                          <img
                            src={page.thumbnailUrl}
                            alt={`Page ${page.originalIndex + 1}`}
                            className="w-full h-full object-contain rounded-lg border border-slate-100 dark:border-slate-800"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-lg flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                            <span className="material-symbols-outlined text-3xl mb-1">
                              picture_as_pdf
                            </span>
                            <span className="text-[9px] font-bold">
                              Preview N/A
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Número de página debajo (Al estilo iLovePDF) */}
                      <p className="text-center text-sm font-bold mt-3 text-slate-600 dark:text-slate-400">
                        {page.originalIndex + 1}
                      </p>
                    </div>
                  ))}
                  {pages.length === 0 && !isReadingPdf && (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <span className="material-symbols-outlined text-5xl mb-4">
                        delete_sweep
                      </span>
                      <p>You deleted all pages! Nothing to extract.</p>
                    </div>
                  )}
                </div>

                <div className="w-full md:w-80 bg-white dark:bg-primary/5 rounded-3xl border border-slate-200 dark:border-primary/20 shadow-xl p-8 flex flex-col sticky top-24">
                  <h3 className="text-xl font-bold mb-2">Organize PDF</h3>
                  <p className="text-sm text-slate-500 mb-6">
                    A new PDF will be created with the pages in the exact order
                    shown.
                  </p>

                  <div className="flex flex-col gap-3 mb-8">
                    <div className="flex justify-between text-sm border-b border-slate-100 dark:border-primary/20 pb-2">
                      <span className="text-slate-500">Original file</span>
                      <span
                        className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[120px]"
                        title={pdfFile.name}
                      >
                        {pdfFile.name}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={onSplitClick}
                    disabled={
                      isProcessing || pages.length === 0 || isReadingPdf
                    }
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
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
                        Saving...
                      </>
                    ) : isReadingPdf ? (
                      <>
                        <span className="material-symbols-outlined animate-spin">
                          picture_as_pdf
                        </span>
                        Loading...
                      </>
                    ) : (
                      <>
                        Organize
                        <span className="material-symbols-outlined">
                          arrow_forward
                        </span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={cancelSplit}
                    className="w-full mt-3 text-sm text-slate-400 hover:text-rose-500 font-bold py-2 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>

          <ConversionsQueue
            conversions={pdfSplits}
            isLoading={isColaLoading}
            onDownload={downloadFile}
            onDelete={removeConversionFromHistory}
            variant="pdf"
          />
        </main>
        <Footer />
      </div>
    </div>
  );
}
