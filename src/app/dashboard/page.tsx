"use client";

import { useState } from "react";
import { useDashboardUI } from "@/hooks/useDashboardUI";
import { ConversionsQueue } from "@/components/shared/ConversionsQueue";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FileUploader } from "@/components/shared/FileUploader";
import { ToolPageHeader } from "@/components/tools";
import {
  StagedFilesList,
  StagedFilesActionBar,
  ImageZoomModal,
} from "@/components/dashboard";

export default function DashboardPage() {
  const [zoomImage, setZoomImage] = useState<{ url: string; name: string } | null>(null);
  const {
    conversions,
    isLoading,
    downloadFile,
    removeConversionFromHistory,
    clearAllConversions,
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
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="layout-container flex h-full grow flex-col">
        <Header />

        <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
          <section className="w-full flex flex-col items-center">
            <ToolPageHeader
              title="Image Converter"
              subtitle="Fast, secure, and free online file converter. Select your formats and convert in seconds."
            />

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
                icon="image"
                buttonText="Select image files"
                subtitle="or drop images here. 100 MB maximum file size."
                hasHistory={hasHistory}
              />
            ) : (
              <div className="w-full bg-white dark:bg-primary/5 rounded-3xl border border-slate-200 dark:border-primary/20 overflow-hidden shadow-xl">
                <div className="flex flex-col">
                  <StagedFilesList
                    stagedFiles={stagedFiles}
                    isUploading={isUploading}
                    onUpdateTargetFormat={updateTargetFormat}
                    onRemoveFile={removeStagedFile}
                    onZoomImage={setZoomImage}
                  />

                  <StagedFilesActionBar
                    isUploading={isUploading}
                    onAddMoreFiles={() => fileInputRef.current?.click()}
                    onConvertAll={handleConvertAll}
                  />
                </div>
              </div>
            )}
          </section>

          <ConversionsQueue
            conversions={conversions}
            isLoading={isLoading}
            onDownload={downloadFile}
            onDelete={removeConversionFromHistory}
            onClearAll={clearAllConversions}
            variant="image"
          />
        </main>
        <Footer />
      </div>

      <ImageZoomModal
        image={zoomImage}
        onClose={() => setZoomImage(null)}
      />
    </div>
  );
}
