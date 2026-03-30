import { useState, useRef } from "react";
import { usePdfTools } from "./usePdfTools";
import { toast } from "react-hot-toast";

export function useMergeUI() {
  const {
    pdfMerges,
    handleMergePdfs,
    isLoading,
    downloadFile,
    removeConversionFromHistory,
  } = usePdfTools();

  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const hasHistory = pdfMerges.some((c) =>
    ["pending", "processing", "completed", "failed"].includes(c.status),
  );

  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;
    const newPdfs = Array.from(files).filter(
      (file) =>
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf"),
    );
    setPdfFiles((prev) => [...prev, ...newPdfs]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (indexToRemove: number) => {
    setPdfFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleDragStart = (index: number) => setDraggedIndex(index);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    const newFiles = [...pdfFiles];
    const draggedFile = newFiles[draggedIndex];
    newFiles.splice(draggedIndex, 1);
    newFiles.splice(index, 0, draggedFile);
    setPdfFiles(newFiles);
    setDraggedIndex(null);
  };

  const onMergeClick = async () => {
    if (pdfFiles.length < 2)
      return alert("Por favor, añade al menos 2 archivos PDF para unirlos.");

    setTimeout(
      () =>
        document
          .getElementById("conversions-queue")
          ?.scrollIntoView({ behavior: "smooth" }),
      100,
    );

    const loadingToast = toast.loading("🔗 Uniendo PDFs...");
    setIsMerging(true);

    const success = await handleMergePdfs(pdfFiles);
    setIsMerging(false);
    toast.dismiss(loadingToast);

    if (success) {
      toast.success("PDFs unidos con éxito.");
      setPdfFiles([]);
    } else {
      toast.error("Error al unir los PDFs.");
    }
  };

  return {
    // Datos de la base de datos
    pdfMerges,
    isLoading,
    downloadFile,
    removeConversionFromHistory,
    // Estados de la UI
    pdfFiles,
    isMerging,
    fileInputRef,
    draggedIndex,
    setDraggedIndex,
    hasHistory,
    // Funciones de la UI
    handleFilesSelected,
    removeFile,
    handleDragStart,
    handleDragOver,
    handleDrop,
    onMergeClick,
  };
}
