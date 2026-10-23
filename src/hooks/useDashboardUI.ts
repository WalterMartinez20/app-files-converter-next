import { useState, useRef } from "react";
import { useConversions } from "./useConversions";
import { StagedFile } from "@/types/ui";
import { toast } from "react-hot-toast";

export function useDashboardUI() {
  const {
    conversions,
    handleUploadAndConvert,
    downloadFile,
    removeConversionFromHistory,
    clearAllConversions,
    isLoading,
  } = useConversions();

  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Si no hay conversiones, mostramos un botón para subir archivos
  const hasHistory = conversions.some((c) =>
    ["pending", "processing", "completed", "failed"].includes(c.status),
  );

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) {
      toast.error("No file was selected");
      return;
    }

    const MAX_SIZE_MB = 100;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
    const validFiles: typeof newFiles = [];
    const allowedExtensions = ["jpg", "jpeg", "png", "webp", "pdf"];

    const isImageFile = (f: File) =>
      f.type.startsWith("image/") ||
      /\.(jpe?g|png|webp|gif|bmp|svg|avif|ico|jfif)$/i.test(f.name);

    const newFiles = Array.from(files).map((f) => ({
      id: Math.random().toString(36).substring(7),
      file: f,
      originalFormat: f.name.split(".").pop()?.toLowerCase() || "img",
      targetFormat: "jpg",
      previewUrl: isImageFile(f) ? URL.createObjectURL(f) : undefined,
    }));

    newFiles.forEach((stagedFile) => {
      const ext = stagedFile.originalFormat;
      if (!allowedExtensions.includes(ext) && !stagedFile.file.type.startsWith("image/") && stagedFile.file.type !== "application/pdf") {
        toast.error(`"${stagedFile.file.name}" is not a supported format (JPG, PNG, WEBP, PDF).`);
        return;
      }
      if (stagedFile.file.size > MAX_SIZE_BYTES) {
        toast.error(`"${stagedFile.file.name}" exceeds the ${MAX_SIZE_MB}MB limit.`);
      } else {
        validFiles.push(stagedFile);
      }
    });

    if (validFiles.length > 0) {
      setStagedFiles((prev) => [...prev, ...validFiles]);
    }
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const updateTargetFormat = (id: string, format: string) => {
    setStagedFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, targetFormat: format } : f)),
    );
  };

  const clearStagedFiles = () => {
    setStagedFiles([]);
  };

  const removeStagedFile = (id: string) => {
    setStagedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove?.previewUrl) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleConvertAll = async () => {
    if (stagedFiles.length === 0) {
      toast.error("Please add files to convert first");
      return;
    }
    setIsUploading(true);

    try {
      await Promise.all(
        stagedFiles.map((staged) =>
          handleUploadAndConvert(staged.file, staged.targetFormat),
        ),
      );

      toast.success("Conversions completed successfully!", { id: "conversion-success", duration: 5000 });
      // Limpiar URLs antes de vaciar
      stagedFiles.forEach(f => f.previewUrl && URL.revokeObjectURL(f.previewUrl));
      setStagedFiles([]); // Limpiamos la zona de subida

      setTimeout(() => {
        document.getElementById("conversions-queue")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch {
      toast.error("An error occurred while converting the files.", { id: "conversion-error", duration: 5000 });
    } finally {
      setIsUploading(false);
    }
  };

  return {
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
    clearStagedFiles,
    handleConvertAll,
    hasHistory,
  };
}
