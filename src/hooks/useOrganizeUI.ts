import { useState, useRef } from "react";
import { usePdfTools } from "./usePdfTools";
import { PdfPageData } from "@/types/ui";
import { PDFDocument } from "pdf-lib";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { toast } from "react-hot-toast";

// ¡OJO! Ya no hay importaciones de pdfjs aquí arriba.

export function useOrganizeUI() {
  const {
    pdfOrganizes,
    handleOrganizePdf,
    isLoading: isColaLoading,
    downloadFile,
    removeConversionFromHistory,
    clearAllConversions,
  } = usePdfTools();

  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [pages, setPages] = useState<PdfPageData[]>([]);
  const [isReadingPdf, setIsReadingPdf] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'none' | 'nameAsc' | 'nameDesc' | 'numAsc' | 'numDesc' | 'mix'>('none');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Recibimos pdfjs como parámetro para no tener que importarlo globalmente
  const generateThumbnail = async (
    pdfjsDoc: PDFDocumentProxy,
    fileIndex: number,
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
          page.fileIndex === fileIndex && page.originalIndex === pageIndex
            ? { ...page, thumbnailUrl, isLoadingThumbnail: false }
            : page,
        ),
      );
    } catch (error) {
      console.error(`Error rendering page ${pageIndex}:`, error);
      setPages((prevPages) =>
        prevPages.map((page) =>
          page.fileIndex === fileIndex && page.originalIndex === pageIndex
            ? { ...page, isLoadingThumbnail: false }
            : page,
        ),
      );
    }
  };

  const handleFileSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newFiles = Array.from(files).filter(f => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    
    if (newFiles.length === 0) {
      toast.error("Please select valid PDF files.");
      return;
    }

    const MAX_SIZE_MB = 100;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
    const validFiles = newFiles.filter(f => {
      if (f.size > MAX_SIZE_BYTES) {
        toast.error(`"${f.name}" exceeds the ${MAX_SIZE_MB}MB limit.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      setIsReadingPdf(true);
      const startingFileIndex = pdfFiles.length;
      setPdfFiles(prev => [...prev, ...validFiles]);

      // Process each file
      for (let fIdx = 0; fIdx < validFiles.length; fIdx++) {
        const file = validFiles[fIdx];
        const currentFileIndex = startingFileIndex + fIdx;
        const arrayBuffer = await file.arrayBuffer();
        const pdfLibDoc = await PDFDocument.load(arrayBuffer.slice(0));
        const pageCount = pdfLibDoc.getPageCount();

        const newPages = Array.from({ length: pageCount }, (_, i) => ({
          id: `page-${currentFileIndex}-${i}-${Date.now()}`,
          fileIndex: currentFileIndex,
          originalIndex: i,
          rotation: 0,
          isBlank: false,
          isLoadingThumbnail: true,
        }));
        
        setPages(prev => [...prev, ...newPages]);

        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

        const pdfjsDoc = await pdfjs.getDocument({ data: arrayBuffer.slice(0) }).promise;
        for (let i = 0; i < pageCount; i++) {
          generateThumbnail(pdfjsDoc, currentFileIndex, i);
        }
      }
    } catch (error) {
      console.warn(error);
      toast.error("Error reading PDF file. It might be corrupted or encrypted.");
    } finally {
      setIsReadingPdf(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removePage = (indexToRemove: number) => {
    setPages((prev) => {
      const newPages = prev.filter((_, index) => index !== indexToRemove);
      if (newPages.length === 0) {
        setPdfFiles([]); // Autoreturn
      }
      return newPages;
    });
  };

  const rotatePage = (index: number) => {
    setPages((prev) =>
      prev.map((p, i) => (i === index ? { ...p, rotation: (p.rotation + 90) % 360 } : p))
    );
  };

  const addBlankPage = (afterIndex: number) => {
    setPages((prev) => {
      const newPages = [...prev];
      newPages.splice(afterIndex + 1, 0, {
        id: `blank-${Date.now()}`,
        fileIndex: -1,
        originalIndex: -1,
        rotation: 0,
        isBlank: true,
        isLoadingThumbnail: false,
      });
      return newPages;
    });
  };

  const resetOrder = (pagesArray: PdfPageData[]) => {
    const newPages = [...pagesArray];
    newPages.sort((a, b) => {
      if (a.isBlank && b.isBlank) return 0;
      if (a.isBlank) return 1;
      if (b.isBlank) return -1;
      if (a.fileIndex !== b.fileIndex) return a.fileIndex - b.fileIndex;
      return a.originalIndex - b.originalIndex;
    });
    return newPages;
  };

  const orderByFileName = () => {
    setPages((prev) => {
      let nextFilter: 'nameAsc' | 'nameDesc' | 'none' = 'none';
      if (activeFilter === 'nameAsc') nextFilter = 'nameDesc';
      else if (activeFilter === 'nameDesc') nextFilter = 'none';
      else nextFilter = 'nameAsc';
      setActiveFilter(nextFilter);

      if (nextFilter === 'none') return resetOrder(prev);

      const newPages = [...prev];
      newPages.sort((a, b) => {
        if (a.isBlank && b.isBlank) return 0;
        if (a.isBlank) return 1;
        if (b.isBlank) return -1;
        
        const fileA = pdfFiles[a.fileIndex]?.name || "";
        const fileB = pdfFiles[b.fileIndex]?.name || "";
        
        const compare = fileA.localeCompare(fileB);
        if (compare !== 0) return nextFilter === 'nameAsc' ? compare : -compare;
        return a.originalIndex - b.originalIndex;
      });
      return newPages;
    });
  };

  const orderByPageNumber = () => {
    setPages((prev) => {
      let nextFilter: 'numAsc' | 'numDesc' | 'none' = 'none';
      if (activeFilter === 'numAsc') nextFilter = 'numDesc';
      else if (activeFilter === 'numDesc') nextFilter = 'none';
      else nextFilter = 'numAsc';
      setActiveFilter(nextFilter);

      if (nextFilter === 'none') return resetOrder(prev);

      const newPages = [...prev];
      newPages.sort((a, b) => {
        if (a.isBlank && b.isBlank) return 0;
        if (a.isBlank) return 1;
        if (b.isBlank) return -1;
        
        if (a.originalIndex !== b.originalIndex) {
          return nextFilter === 'numAsc' 
            ? a.originalIndex - b.originalIndex 
            : b.originalIndex - a.originalIndex;
        }
        return a.fileIndex - b.fileIndex;
      });
      return newPages;
    });
  };

  const mixPages = () => {
    setPages((prev) => {
      if (activeFilter === 'mix') {
        setActiveFilter('none');
        return resetOrder(prev);
      }
      setActiveFilter('mix');

      const nonBlank = prev.filter(p => !p.isBlank);
      const blank = prev.filter(p => p.isBlank);
      
      const fileGroups: Record<number, PdfPageData[]> = {};
      nonBlank.forEach(p => {
        if (!fileGroups[p.fileIndex]) fileGroups[p.fileIndex] = [];
        fileGroups[p.fileIndex].push(p);
      });

      Object.values(fileGroups).forEach(group => {
        group.sort((a, b) => a.originalIndex - b.originalIndex);
      });

      const newPages: PdfPageData[] = [];
      let added = true;
      let i = 0;
      const fileKeys = Object.keys(fileGroups).map(Number).sort();
      
      while (added) {
        added = false;
        for (const fileIndex of fileKeys) {
          if (fileGroups[fileIndex] && i < fileGroups[fileIndex].length) {
            newPages.push(fileGroups[fileIndex][i]);
            added = true;
          }
        }
        i++;
      }
      return [...newPages, ...blank]; // append blanks at the end
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDragOverIndex(null);
      setDraggedIndex(null);
      return;
    }
    const newPages = [...pages];
    const draggedPage = newPages[draggedIndex];
    newPages.splice(draggedIndex, 1);
    newPages.splice(index, 0, draggedPage);
    setPages(newPages);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const onOrganizeClick = async () => {
    if (pdfFiles.length === 0 || pages.length === 0) return;

    setIsProcessing(true);

    const pagesToKeep = pages.map((p) => ({ 
      fileIndex: p.fileIndex, 
      originalIndex: p.originalIndex,
      rotation: p.rotation,
      isBlank: p.isBlank
    }));
    const success = await handleOrganizePdf(pdfFiles, pagesToKeep);

    setIsProcessing(false);

    if (success) {
      toast.success("PDF organized successfully.");
      setPdfFiles([]);
      setPages([]);
      setTimeout(() => {
        document.getElementById("conversions-queue")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } else {
      toast.error("Failed to organize PDF. Please try again.");
    }
  };

  const cancelOrganize = () => {
    setPdfFiles([]);
    setPages([]);
  };

  const resetAllFilters = () => {
    setActiveFilter('none');
    setPages((prev) => resetOrder(prev));
  };

  return {
    pdfOrganizes,
    isColaLoading,
    downloadFile,
    removeConversionFromHistory,
    pdfFiles,
    pages,
    isReadingPdf,
    isProcessing,
    fileInputRef,
    draggedIndex,
    dragOverIndex,
    setDraggedIndex,
    handleFileSelected,
    removePage,
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
    clearAllConversions,
    activeFilter,
    resetAllFilters,
  };
}
