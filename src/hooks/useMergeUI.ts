import { useState, useRef } from "react";
import { usePdfTools } from "./usePdfTools";
import { toast } from "react-hot-toast";

import { MergeFile } from "@/types/ui";
export type { MergeFile };

export function useMergeUI() {
  const {
    pdfMerges,
    handleMergePdfs,
    isLoading,
    downloadFile,
    removeConversionFromHistory,
    clearAllConversions,
  } = usePdfTools();

  const [pdfFiles, setPdfFiles] = useState<MergeFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'none' | 'nameAsc' | 'nameDesc'>('none');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const hasHistory = pdfMerges.some((c) =>
    ["pending", "processing", "completed", "failed"].includes(c.status),
  );

  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;

    const MAX_SIZE_MB = 100;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    const validFiles = Array.from(files).filter((file) => {
      const isValidType = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      if (!isValidType) {
        toast.error(`"${file.name}" is not a valid PDF file.`);
        return false;
      }

      if (file.size > MAX_SIZE_BYTES) {
        toast.error(`"${file.name}" exceeds the ${MAX_SIZE_MB}MB size limit.`);
        return false;
      }
      return true;
    });

    const newPdfs: MergeFile[] = validFiles.map((file, i) => ({ id: `${Date.now()}-${i}`, file }));
    
    setPdfFiles((prev) => [...prev, ...newPdfs]);
    if (fileInputRef.current) fileInputRef.current.value = "";

    // Generate thumbnails in background
    newPdfs.forEach(async (pdfObj) => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

        const arrayBuffer = await pdfObj.file.arrayBuffer();
        const pdfjsDoc = await pdfjs.getDocument({ data: arrayBuffer.slice(0) }).promise;
        const page = await pdfjsDoc.getPage(1);
        
        const viewport = page.getViewport({ scale: 1 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) return;
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({ canvasContext: context, viewport, canvas }).promise;
        const dataUrl = canvas.toDataURL("image/jpeg", 0.5);
        
        setPdfFiles((prev) => 
          prev.map((item) => 
            item.file === pdfObj.file ? { ...item, previewUrl: dataUrl } : item
          )
        );
      } catch (err) {
        console.error("Error generating thumbnail", err);
      }
    });
  };

  const removeFile = (indexToRemove: number) => {
    setPdfFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const rotateFile = (index: number) => {
    setPdfFiles((prev) => 
      prev.map((item, i) => i === index ? { ...item, rotation: ((item.rotation || 0) + 90) % 360 } : item)
    );
  };

  const orderByFileName = () => {
    setPdfFiles((prev) => {
      if (prev.length < 2) return prev;
      const newFiles = [...prev];
      if (activeFilter === 'none' || activeFilter === 'nameDesc') {
        // Sort Asc
        setActiveFilter('nameAsc');
        newFiles.sort((a, b) => a.file.name.localeCompare(b.file.name));
      } else if (activeFilter === 'nameAsc') {
        // Sort Desc
        setActiveFilter('nameDesc');
        newFiles.sort((a, b) => b.file.name.localeCompare(a.file.name));
      }
      return newFiles;
    });
  };

  const resetAllFilters = () => {
    setActiveFilter('none');
    setPdfFiles((prev) => [...prev].sort((a, b) => {
      const idA = parseInt(a.id.split('-')[0]);
      const idB = parseInt(b.id.split('-')[0]);
      if (idA !== idB) return idA - idB;
      return parseInt(a.id.split('-')[1]) - parseInt(b.id.split('-')[1]);
    }));
  };

  const cancelMerge = () => {
    setPdfFiles([]);
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
    const newFiles = [...pdfFiles];
    const draggedFile = newFiles[draggedIndex];
    newFiles.splice(draggedIndex, 1);
    newFiles.splice(index, 0, draggedFile);
    setPdfFiles(newFiles);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const onMergeClick = async () => {
    if (pdfFiles.length < 2) {
      toast.error("Please add at least 2 PDF files to merge.");
      return;
    }

    setIsMerging(true);

    const success = await handleMergePdfs(pdfFiles.map((f) => ({ file: f.file, rotation: f.rotation })));
    setIsMerging(false);

    if (success) {
      toast.success("PDFs merged successfully.");
      setPdfFiles([]);
      setTimeout(() => {
        document.getElementById("conversions-queue")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } else {
      toast.error("Failed to merge PDFs. Please try again.");
    }
  };

  return {
    // Datos de la base de datos
    pdfMerges,
    isLoading,
    downloadFile,
    removeConversionFromHistory,
    clearAllConversions,
    // Estados de la UI
    pdfFiles,
    isMerging,
    fileInputRef,
    draggedIndex,
    dragOverIndex,
    setDraggedIndex,
    hasHistory,
    // Funciones de la UI
    handleFilesSelected,
    removeFile,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDragEnd,
    handleDrop,
    onMergeClick,
    rotateFile,
    orderByFileName,
    cancelMerge,
    activeFilter,
    resetAllFilters,
  };
}
