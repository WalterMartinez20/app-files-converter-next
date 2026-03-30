import { useState, useRef } from "react";
import { usePdfTools } from "./usePdfTools";
import { PdfPageData } from "@/types/ui";
import { PDFDocument } from "pdf-lib";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { toast } from "react-hot-toast";

// ¡OJO! Ya no hay importaciones de pdfjs aquí arriba.

export function useSplitUI() {
  const {
    pdfSplits,
    handleSplitPdf,
    isLoading: isColaLoading,
    downloadFile,
    removeConversionFromHistory,
  } = usePdfTools();

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PdfPageData[]>([]);
  const [isReadingPdf, setIsReadingPdf] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Recibimos pdfjs como parámetro para no tener que importarlo globalmente
  const generateThumbnail = async (
    pdfjsDoc: PDFDocumentProxy,
    pageIndex: number,
  ) => {
    try {
      const pagejs = await pdfjsDoc.getPage(pageIndex + 1);
      const scale = 0.3;
      const viewport = pagejs.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (!context) throw new Error("Could not get canvas context");

      await pagejs.render({
        canvasContext: context,
        viewport: viewport,
        canvas: canvas,
      }).promise;
      const thumbnailUrl = canvas.toDataURL("image/png");

      setPages((prevPages) =>
        prevPages.map((page) =>
          page.originalIndex === pageIndex
            ? { ...page, thumbnailUrl, isLoadingThumbnail: false }
            : page,
        ),
      );
    } catch (error) {
      console.error(`Error rendering page ${pageIndex}:`, error);
      setPages((prevPages) =>
        prevPages.map((page) =>
          page.originalIndex === pageIndex
            ? { ...page, isLoadingThumbnail: false }
            : page,
        ),
      );
    }
  };

  const handleFileSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      return alert("Please select a valid PDF file.");
    }

    try {
      setIsReadingPdf(true);
      setPdfFile(file);
      setPages([]);

      const arrayBuffer = await file.arrayBuffer();
      const pdfLibDoc = await PDFDocument.load(arrayBuffer.slice(0));
      const pageCount = pdfLibDoc.getPageCount();

      const initialPages = Array.from({ length: pageCount }, (_, i) => ({
        id: `page-${i}-${Date.now()}`,
        originalIndex: i,
        isLoadingThumbnail: true,
      }));
      setPages(initialPages);

      // ✨ SOLUCIÓN AL ERROR SSR: Importamos pdfjs solo aquí (en el cliente)
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

      const pdfjsDoc = await pdfjs.getDocument({ data: arrayBuffer.slice(0) })
        .promise;
      for (let i = 0; i < pageCount; i++) {
        generateThumbnail(pdfjsDoc, i);
      }
    } catch (error) {
      console.error(error);
      alert("Error reading PDF file. It might be corrupted or encrypted.");
      setPdfFile(null);
    } finally {
      setIsReadingPdf(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removePage = (indexToRemove: number) =>
    setPages((prev) => prev.filter((_, index) => index !== indexToRemove));

  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    const newPages = [...pages];
    const draggedPage = newPages[draggedIndex];
    newPages.splice(draggedIndex, 1);
    newPages.splice(index, 0, draggedPage);
    setPages(newPages);
    setDraggedIndex(null);
  };

  const onSplitClick = async () => {
    if (!pdfFile || pages.length === 0) return;
    setTimeout(
      () =>
        document
          .getElementById("conversions-queue")
          ?.scrollIntoView({ behavior: "smooth" }),
      100,
    );

    const loadingToast = toast.loading("✂️ Dividiendo PDF...");
    setIsProcessing(true);

    const pagesToKeep = pages.map((p) => p.originalIndex);
    const success = await handleSplitPdf(pdfFile, pagesToKeep);

    setIsProcessing(false);
    toast.dismiss(loadingToast);

    if (success) {
      toast.success("✅ PDF dividido con éxito.");
      setPdfFile(null);
      setPages([]);
    } else {
      toast.error("❌ Error al dividir el PDF.");
    }
  };

  const cancelSplit = () => {
    setPdfFile(null);
    setPages([]);
  };

  return {
    pdfSplits,
    isColaLoading,
    downloadFile,
    removeConversionFromHistory,
    pdfFile,
    pages,
    isReadingPdf,
    isProcessing,
    fileInputRef,
    draggedIndex,
    setDraggedIndex,
    handleFileSelected,
    removePage,
    handleDragStart,
    handleDragOver,
    handleDrop,
    onSplitClick,
    cancelSplit,
  };
}
