"use client";

import { useEffect, useState, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConversionsQueue } from "@/components/shared/ConversionsQueue";
import { FileUploader } from "@/components/shared/FileUploader";
import { useEditPdfUI } from "@/hooks/useEditPdfUI";
import { WatermarkConfig } from "@/types/editor";

import { ToolPageHeader } from "@/components/tools";

// ─── Sub-components ───────────────────────────────────────────────────────────
import { EditorToolbar } from "./components/EditorToolbar";
import { SecondaryToolbar } from "./components/SecondaryToolbar";
import { PageThumbnailSidebar } from "./components/PageThumbnailSidebar";
import { CanvasLayer } from "./components/CanvasLayer";
import { PageNavigationBar } from "./components/PageNavigationBar";
import { LayerManagementPanel } from "./components/LayerManagementPanel";
import { SignatureModal } from "./components/SignatureModal";
import { WatermarkModal } from "./components/WatermarkModal";

export default function EditPdfPage() {
  const {
    pdfFile, pdfDoc, numPages, currentPageIndex, setCurrentPageIndex,
    pageThumbnails, isReadingPdf, isProcessing,
    isSignatureModalOpen, setIsSignatureModalOpen,
    isWatermarkModalOpen, setIsWatermarkModalOpen,
    imageInputRef, canvasRef, canvasContainerRef, sigCanvasRef,
    selectedTool, setSelectedTool,
    textElements, setTextElements,
    imageElements, setImageElements,
    redactElements, setRedactElements,
    watermark, setWatermark,
    activeShapeType, setActiveShapeType,
    activeShapeColor, setActiveShapeColor,
    handleFileSelected, renderPage,
    handleWorkspaceClick, handleImageUpload,
    handleElementPointerDown, handlePointerMove, handlePointerUp,
    startDrawing, drawSignature, stopDrawing, clearSignature,
    saveSignature, saveInitials,
    updateText, updateTextFormat, removeElement, renameElement,
    onSaveClick, removeAllElements, cancelEdit,
    pdfEdits, isColaLoading, downloadFile,
    removeConversionFromHistory, clearAllConversions,
  } = useEditPdfUI();

  // ─── Local UI state ───────────────────────────────────────────────────────
  const [sigMode, setSigMode] = useState<"draw" | "type">("draw");
  const [initialsText, setInitialsText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [localWatermark, setLocalWatermark] = useState<WatermarkConfig>({
    text: "", opacity: 0.3, color: "#000000", placement: "diagonal",
  });
  const [scale, setScale] = useState(1);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const [draggedLayerId, setDraggedLayerId] = useState<string | null>(null);
  const [dragOverLayerId, setDragOverLayerId] = useState<string | null>(null);

  // ─── Panning state ────────────────────────────────────────────────────────
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [scrollStart, setScrollStart] = useState({ x: 0, y: 0 });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ─── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => {
    document.getElementById(`thumbnail-${currentPageIndex}`)?.scrollIntoView({
      behavior: "smooth", block: "nearest",
    });
  }, [currentPageIndex]);

  useEffect(() => {
    if (pdfDoc && canvasRef.current) renderPage(currentPageIndex, canvasRef.current);
  }, [pdfDoc, currentPageIndex, renderPage, canvasRef]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if ((e.target as HTMLElement).contentEditable === 'true') return;
      if ((e.key === "Delete" || e.key === "Backspace") && selectedElementId) {
        setTextElements((prev) => prev.filter((el) => el.id !== selectedElementId));
        setImageElements((prev) => prev.filter((el) => el.id !== selectedElementId));
        setRedactElements((prev) => prev.filter((el) => el.id !== selectedElementId));
        setSelectedElementId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElementId, setTextElements, setImageElements, setRedactElements]);

  // ─── Derived state ────────────────────────────────────────────────────────
  const currentPageElements = [
    ...textElements.filter((el) => el.pageIndex === currentPageIndex).map((el) => ({ ...el, type: "text" as const })),
    ...imageElements.filter((el) => el.pageIndex === currentPageIndex).map((el) => ({
      ...el, type: el.id.startsWith("sig") ? "signature" as const : "image" as const,
    })),
    ...redactElements.filter((el) => el.pageIndex === currentPageIndex).map((el) => ({ ...el, type: "redact" as const })),
  ].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

  // ─── Panning handlers ─────────────────────────────────────────────────────
  const handlePanStart = (e: React.PointerEvent) => {
    if (selectedElementId) setSelectedElementId(null);
    if (selectedTool !== "none") return;
    setIsPanning(true);
    setPanStart({ x: e.clientX, y: e.clientY });
    if (scrollContainerRef.current)
      setScrollStart({ x: scrollContainerRef.current.scrollLeft, y: scrollContainerRef.current.scrollTop });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePanMove = (e: React.PointerEvent) => {
    if (!isPanning || !scrollContainerRef.current || selectedTool !== "none") return;
    scrollContainerRef.current.scrollLeft = scrollStart.x - (e.clientX - panStart.x);
    scrollContainerRef.current.scrollTop = scrollStart.y - (e.clientY - panStart.y);
  };

  const handlePanEnd = (e: React.PointerEvent) => {
    if (!isPanning) return;
    setIsPanning(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  // ─── Layer drag & drop ────────────────────────────────────────────────────
  const handleDropLayer = (targetId: string) => {
    if (!draggedLayerId || draggedLayerId === targetId) return;
    const items = [...currentPageElements];
    const sourceIdx = items.findIndex((el) => el.id === draggedLayerId);
    const targetIdx = items.findIndex((el) => el.id === targetId);
    if (sourceIdx === -1 || targetIdx === -1) return;

    const [movedItem] = items.splice(sourceIdx, 1);
    items.splice(targetIdx, 0, movedItem);

    const maxZ = currentPageElements.reduce((max, el) => Math.max(max, el.zIndex || 0), 10);
    const updateFn = <T extends { id: string; zIndex?: number }>(el: T): T => {
      const idx = items.findIndex((i) => i.id === el.id);
      return idx !== -1 ? { ...el, zIndex: maxZ - idx } : el;
    };

    setTextElements((prev) => prev.map(updateFn));
    setImageElements((prev) => prev.map(updateFn));
    setRedactElements((prev) => prev.map(updateFn));
    setDraggedLayerId(null);
    setDragOverLayerId(null);
  };

  // ─── Tool click handler ───────────────────────────────────────────────────
  const handleToolClick = (toolId: string) => {
    if (toolId === "image") {
      imageInputRef.current?.click();
    } else if (toolId === "signature") {
      setIsSignatureModalOpen(true);
    } else if (toolId === "watermark") {
      setLocalWatermark(watermark.text ? watermark : { text: "", opacity: 0.3, color: "#000000", placement: "diagonal" });
      setIsWatermarkModalOpen(true);
    } else {
      setSelectedTool((prev) => (prev === toolId ? "none" : toolId as typeof prev));
      setSelectedElementId(null);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 transition-colors duration-200"
      onPointerUp={handlePointerUp}
    >
      <div className="layout-container flex h-full grow flex-col">
        <Header />

        <main
          className={`flex-1 mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12 ${
            pdfFile ? "max-w-[1600px]" : "max-w-5xl md:px-10"
          }`}
        >
          <section className="w-full flex flex-col items-center">
            <ToolPageHeader
              title="Edit PDF"
              subtitle="Add text, images, shapes, and signatures to your PDF documents."
            />

            {/* Hidden image file input */}
            <input
              type="file"
              ref={imageInputRef}
              className="hidden"
              accept="image/jpeg, image/png"
              onChange={handleImageUpload}
            />

            {!pdfFile ? (
              <FileUploader
                onFilesSelected={handleFileSelected}
                isProcessing={isReadingPdf}
                accept="application/pdf"
                multiple={false}
                icon="edit_document"
                buttonText="Select PDF file"
                subtitle="or drop PDF here. 100 MB maximum file size."
                hasHistory={pdfEdits.length > 0}
              />
            ) : (
              <div className="w-full flex flex-col lg:flex-row gap-6 items-start">
                {/* Left sidebar – page thumbnails */}
                <PageThumbnailSidebar
                  isOpen={isSidebarOpen}
                  numPages={numPages}
                  currentPageIndex={currentPageIndex}
                  pageThumbnails={pageThumbnails}
                  onPageSelect={setCurrentPageIndex}
                />

                {/* Central editing area */}
                <div className="flex-1 w-full flex flex-col bg-white dark:bg-primary/5 rounded-3xl border border-slate-200 dark:border-primary/20 shadow-xl min-h-[500px] lg:h-[80vh] relative overflow-hidden">
                  <EditorToolbar
                    selectedTool={selectedTool}
                    watermark={watermark}
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    onToolClick={handleToolClick}
                  />

                  <SecondaryToolbar
                    selectedTool={selectedTool}
                    activeShapeType={activeShapeType}
                    activeShapeColor={activeShapeColor}
                    onShapeTypeChange={setActiveShapeType}
                    onShapeColorChange={setActiveShapeColor}
                    selectedTextElement={textElements.find(el => el.id === selectedElementId)}
                    onUpdateTextFormat={updateTextFormat}
                    editingElementId={editingElementId}
                    selectedRedactElement={redactElements.find(el => el.id === selectedElementId) ?? null}
                    onUpdateRedactColor={(id, color) => setRedactElements(prev => prev.map(el => el.id === id ? { ...el, color } : el))}
                  />

                  <CanvasLayer
                    canvasRef={canvasRef}
                    canvasContainerRef={canvasContainerRef}
                    scale={scale}
                    selectedTool={selectedTool}
                    currentPageIndex={currentPageIndex}
                    textElements={textElements}
                    imageElements={imageElements}
                    redactElements={redactElements}
                    watermark={watermark}
                    isPanning={isPanning}
                    scrollContainerRef={scrollContainerRef}
                    onWorkspaceClick={(e) => {
                      if (selectedElementId) setSelectedElementId(null);
                      handleWorkspaceClick(e);
                    }}
                    onPointerMove={handlePointerMove}
                    onPanStart={handlePanStart}
                    onPanMove={handlePanMove}
                    onPanEnd={handlePanEnd}
                    onSelectElement={setSelectedElementId}
                    onElementPointerDown={handleElementPointerDown}
                    onUpdateText={updateText}
                    onUpdateTextFormat={updateTextFormat}
                    onRemoveElement={removeElement}
                    selectedElementId={selectedElementId}
                    onEditingStart={setEditingElementId}
                  />

                  <PageNavigationBar
                    currentPageIndex={currentPageIndex}
                    numPages={numPages}
                    scale={scale}
                    onNavigate={setCurrentPageIndex}
                    onPrevPage={() => setCurrentPageIndex((p) => Math.max(0, p - 1))}
                    onNextPage={() => setCurrentPageIndex((p) => Math.min(numPages - 1, p + 1))}
                    onZoomOut={() => setScale((s) => Math.max(0.25, s - 0.25))}
                    onZoomIn={() => setScale((s) => Math.min(3, s + 0.25))}
                    onResetZoom={() => setScale(1)}
                  />
                </div>

                {/* Right sidebar – layer management */}
                <LayerManagementPanel
                  currentPageIndex={currentPageIndex}
                  currentPageElements={currentPageElements}
                  watermark={watermark}
                  selectedElementId={selectedElementId}
                  draggedLayerId={draggedLayerId}
                  dragOverLayerId={dragOverLayerId}
                  isProcessing={isProcessing}
                  isReadingPdf={isReadingPdf}
                  textElements={textElements}
                  imageElements={imageElements}
                  redactElements={redactElements}
                  onSelectElement={setSelectedElementId}
                  onRenameElement={renameElement}
                  onRemoveElement={removeElement}
                  onRemoveWatermark={() => setWatermark({ text: "", opacity: 0.3 })}
                  onRemoveAll={removeAllElements}
                  onDragStart={setDraggedLayerId}
                  onDragOver={(id) => { if (draggedLayerId !== id) setDragOverLayerId(id); }}
                  onDragLeave={() => setDragOverLayerId(null)}
                  onDrop={handleDropLayer}
                  onSave={onSaveClick}
                  onCancel={cancelEdit}
                />
              </div>
            )}
          </section>

          <ConversionsQueue
            conversions={pdfEdits}
            isLoading={isColaLoading}
            onDownload={downloadFile}
            onDelete={removeConversionFromHistory}
            onClearAll={clearAllConversions}
            variant="pdf"
          />
        </main>

        <Footer />
      </div>

      {/* ─── Modals ─────────────────────────────────────────────────────────── */}
      <SignatureModal
        isOpen={isSignatureModalOpen}
        sigMode={sigMode}
        initialsText={initialsText}
        sigCanvasRef={sigCanvasRef}
        onClose={() => setIsSignatureModalOpen(false)}
        onSigModeChange={setSigMode}
        onInitialsTextChange={setInitialsText}
        onStartDrawing={startDrawing}
        onDrawSignature={drawSignature}
        onStopDrawing={stopDrawing}
        onClear={sigMode === "draw" ? clearSignature : () => setInitialsText("")}
        onApply={() => (sigMode === "draw" ? saveSignature() : saveInitials(initialsText))}
      />

      <WatermarkModal
        isOpen={isWatermarkModalOpen}
        localWatermark={localWatermark}
        onClose={() => setIsWatermarkModalOpen(false)}
        onChange={setLocalWatermark}
        onApply={() => { setWatermark(localWatermark); setIsWatermarkModalOpen(false); }}
      />
    </div>
  );
}
