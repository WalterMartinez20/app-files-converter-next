"use client";

import { useDashboardUI } from "@/hooks/useDashboardUI";
import { ConversionsQueue } from "@/components/shared/ConversionsQueue";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FileUploader } from "@/components/shared/FileUploader";

export default function DashboardPage() {
  const {
    conversions,
    isLoading,
    downloadFile,
    removeConversionFromHistory,
    stagedFiles,
    isUploading,
    fileInputRef,
    handleFilesSelected,
    updateTargetFormat,
    removeStagedFile,
    handleConvertAll,
    hasHistory,
  } = useDashboardUI();

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <div className="layout-container flex h-full grow flex-col">
        <Header />

        <main className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-10 py-8 md:py-12 space-y-12">
          <section className="w-full flex flex-col items-center md:items-start">
            <div className="mb-8 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                Image Converter
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl">
                Fast, secure, and free online file converter. Select your
                formats and convert in seconds.
              </p>
            </div>

            <div className="w-full bg-white dark:bg-primary/5 rounded-xl border border-slate-200 dark:border-primary/20 overflow-hidden shadow-xl shadow-black/5">
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                multiple
                onChange={(e) => handleFilesSelected(e.target.files)}
                accept="image/png, image/jpeg, image/webp, application/pdf"
              />

              {stagedFiles.length === 0 ? (
                <FileUploader
                  onFilesSelected={handleFilesSelected}
                  accept="image/png, image/jpeg, image/webp, application/pdf"
                  multiple={true}
                  icon="add_photo_alternate"
                  buttonText="Choose Files"
                  subtitle="Drop files here. 100 MB maximum file size."
                  hasHistory={hasHistory}
                />
              ) : (
                <div className="flex flex-col">
                  <div className="p-4 max-h-[350px] overflow-y-auto custom-scrollbar">
                    {stagedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-primary/10 p-4 border border-slate-200 dark:border-primary/20 rounded-xl mb-3 shadow-sm"
                      >
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          <div className="size-10 rounded bg-primary/20 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">
                              image
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold truncate max-w-[200px] text-slate-900 dark:text-slate-100">
                              {file.file.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {(file.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto justify-center">
                          <div className="relative">
                            <select
                              className="appearance-none bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 rounded-lg pl-4 pr-8 py-2 text-xs font-bold uppercase text-slate-700 dark:text-slate-300 outline-none disabled:opacity-70"
                              disabled
                            >
                              <option>{file.originalFormat}</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-2 top-2 text-slate-400 text-sm">
                              expand_more
                            </span>
                          </div>
                          <span className="text-slate-400 text-sm font-medium">
                            to
                          </span>
                          <div className="relative">
                            <select
                              value={file.targetFormat}
                              onChange={(e) =>
                                updateTargetFormat(file.id, e.target.value)
                              }
                              disabled={isUploading}
                              className="appearance-none bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/30 rounded-lg pl-4 pr-8 py-2 text-xs font-bold uppercase text-slate-900 dark:text-slate-100 cursor-pointer outline-none focus:ring-2 ring-primary transition-all disabled:opacity-50"
                            >
                              <optgroup label="Images">
                                <option value="jpg">JPG</option>
                                <option value="png">PNG</option>
                                <option value="webp">WEBP</option>
                              </optgroup>
                              <optgroup label="Documents">
                                <option value="pdf">PDF</option>
                              </optgroup>
                            </select>
                            <span className="material-symbols-outlined absolute right-2 top-2 text-slate-400 pointer-events-none text-sm">
                              expand_more
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-500/10 rounded-md uppercase tracking-wide border border-emerald-200 dark:border-emerald-500/20">
                            Ready
                          </span>
                          <button
                            onClick={() => removeStagedFile(file.id)}
                            disabled={isUploading}
                            className="text-slate-400 hover:text-rose-500 bg-white dark:bg-background-dark hover:bg-rose-50 dark:hover:bg-rose-500/10 p-2 rounded-lg transition-colors border border-slate-200 dark:border-primary/20 disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-lg">
                              close
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 bg-slate-50 dark:bg-primary/10 border-t border-slate-200 dark:border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-full md:w-auto flex items-center justify-center gap-2 bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/30 px-6 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-primary/5 transition-colors disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">
                        add
                      </span>{" "}
                      Add more files
                    </button>
                    <button
                      onClick={handleConvertAll}
                      disabled={isUploading}
                      className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-10 py-3 rounded-xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                      {isUploading ? (
                        <>
                          <span className="material-symbols-outlined text-sm animate-spin">
                            sync
                          </span>
                          Uploading...
                        </>
                      ) : (
                        <>
                          Convert
                          <span className="material-symbols-outlined text-sm">
                            arrow_forward
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          <ConversionsQueue
            conversions={conversions}
            isLoading={isLoading}
            onDownload={downloadFile}
            onDelete={removeConversionFromHistory}
            variant="image"
          />
        </main>
        <Footer />
      </div>
    </div>
  );
}
