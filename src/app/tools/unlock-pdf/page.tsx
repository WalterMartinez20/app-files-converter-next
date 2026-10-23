"use client";

import { useUnlockPdfUI } from "@/hooks/useUnlockPdfUI";
import { ConversionsQueue } from "@/components/shared/ConversionsQueue";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FileUploader } from "@/components/shared/FileUploader";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { ToolPageHeader, ToolActionButton, SinglePdfPreview } from "@/components/tools";

export default function UnlockPdfPage() {
  const {
    file,
    password,
    setPassword,
    isProcessing,
    thumbnailUrl,
    isGenerating,
    isNotProtected,
    onFilesSelected,
    handleAction,
    cancelUnlock,
    pdfUnlocks,
    isLoading,
    downloadFile,
    removeConversionFromHistory,
    clearAllConversions,
  } = useUnlockPdfUI();

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 transition-colors">
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-10 py-8 md:py-12 space-y-12">
          <section className="w-full flex flex-col items-center">
            <ToolPageHeader
              title="Unlock PDF"
              subtitle="Remove password security from your PDF document."
            />

            {!file ? (
              <FileUploader
                onFilesSelected={onFilesSelected}
                accept="application/pdf"
                multiple={false}
                icon="lock_open"
                buttonText="Select PDF file"
                subtitle="or drop PDF here. 100 MB maximum file size."
                hasHistory={pdfUnlocks.length > 0}
              />
            ) : (
              <div className="w-full max-w-4xl bg-white dark:bg-primary/5 rounded-3xl border border-slate-200 dark:border-primary/20 p-6 md:p-8 shadow-xl flex flex-col md:flex-row gap-8">
                {/* Left Side: Preview */}
                <SinglePdfPreview
                  fileName={file.name}
                  thumbnailUrl={thumbnailUrl}
                  isGenerating={isGenerating}
                  fallbackIcon="lock"
                  fallbackIconColor="text-amber-500"
                  fallbackText="Encrypted PDF"
                />

                {/* Right Side: Form */}
                <div className="flex-1 flex flex-col gap-6 justify-center">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Original Password
                    </label>
                    {isNotProtected ? (
                      <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-300 text-sm">
                        <span className="material-symbols-outlined text-[20px] mt-0.5">info</span>
                        <p>
                          This PDF is not password-protected, so there&apos;s nothing to unlock. Cancel and choose another file.
                        </p>
                      </div>
                    ) : (
                      <PasswordInput
                        value={password}
                        onChange={setPassword}
                        placeholder="Enter current password"
                      />
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={cancelUnlock}
                      disabled={isProcessing}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <ToolActionButton
                      onClick={handleAction}
                      disabled={!password || isNotProtected}
                      isLoading={isProcessing}
                      text="Unlock PDF"
                      loadingText="Unlocking..."
                      icon="lock_open"
                    />
                  </div>
                </div>
              </div>
            )}
          </section>
          <ConversionsQueue
            conversions={pdfUnlocks}
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
