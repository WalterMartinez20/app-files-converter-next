"use client";

import { useMergeUI } from "@/hooks/useMergeUI";
import { ConversionsQueue } from "@/components/shared/ConversionsQueue";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FileUploader } from "@/components/shared/FileUploader";

export default function MergePdfPage() {
  const {
    pdfMerges,
    isLoading,
    downloadFile,
    removeConversionFromHistory,
    pdfFiles,
    isMerging,
    handleFilesSelected,
    removeFile,
    handleDragStart,
    handleDragOver,
    handleDrop,
    onMergeClick,
  } = useMergeUI();

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <div className="layout-container flex h-full grow flex-col">
        <Header />

        <main className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-10 py-8 md:py-12 space-y-12">
          <section className="w-full flex flex-col items-center">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 mb-4">
                Merge PDF files
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                Combine PDFs in the order you want with the easiest PDF merger
                available.
              </p>
            </div>

            {pdfFiles.length === 0 ? (
              <FileUploader
                onFilesSelected={handleFilesSelected}
                accept="application/pdf"
                multiple={true}
                icon="library_books"
                buttonText="Select PDF files"
                subtitle="or drop PDFs here"
                hasHistory={pdfMerges.length > 0}
              />
            ) : (
              <div className="w-full flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 bg-white dark:bg-primary/5 rounded-3xl border border-slate-200 dark:border-primary/20 p-8 min-h-[500px] flex flex-wrap gap-6 items-start justify-center shadow-inner relative overflow-hidden">
                  {pdfFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${file.size}-${index}`}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(index)}
                      className="relative group w-40 cursor-grab active:cursor-grabbing transition-transform hover:-translate-y-2"
                    >
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute -top-3 -right-3 size-8 bg-white dark:bg-background-dark rounded-full shadow-md text-slate-400 hover:text-rose-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 border border-slate-200 dark:border-primary/20"
                      >
                        <span className="material-symbols-outlined text-sm font-bold">
                          close
                        </span>
                      </button>

                      <div className="w-full aspect-[1/1.4] bg-slate-50 dark:bg-[#1a1c29] border-2 border-slate-200 dark:border-primary/20 rounded-xl shadow-sm flex flex-col items-center justify-center p-4 pointer-events-none">
                        <span className="material-symbols-outlined text-6xl text-rose-500/60 mb-4">
                          picture_as_pdf
                        </span>
                        <p className="text-xs font-bold text-center break-words w-full line-clamp-3 text-slate-700 dark:text-slate-300">
                          {file.name}
                        </p>
                      </div>

                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md pointer-events-none">
                        {index + 1}
                      </div>
                    </div>
                  ))}

                  {/* Se borró el botón "Add more" para simplificar y forzar a usar el Uploader principal */}
                </div>

                <div className="w-full md:w-80 bg-white dark:bg-primary/5 rounded-3xl border border-slate-200 dark:border-primary/20 shadow-xl p-8 flex flex-col sticky top-24">
                  <h3 className="text-xl font-bold mb-2">Merge PDF</h3>
                  <p className="text-sm text-slate-500 mb-8">
                    Your files will be securely merged into a single document in
                    the order shown.
                  </p>

                  <div className="flex flex-col gap-3 mb-8">
                    <div className="flex justify-between text-sm border-b border-slate-100 dark:border-primary/20 pb-2">
                      <span className="text-slate-500">Files selected</span>
                      <span className="font-bold text-primary">
                        {pdfFiles.length}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={onMergeClick}
                    disabled={isMerging || pdfFiles.length < 2}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                  >
                    {isMerging ? (
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
                        Merging...
                      </>
                    ) : (
                      <>
                        Merge PDF
                        <span className="material-symbols-outlined">
                          arrow_forward
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </section>

          <ConversionsQueue
            conversions={pdfMerges}
            isLoading={isLoading}
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
