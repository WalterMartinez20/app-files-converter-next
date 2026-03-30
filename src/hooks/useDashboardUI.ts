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
    if (!files) return;

    const newFiles = Array.from(files).map((f) => ({
      id: Math.random().toString(36).substring(7),
      file: f,
      originalFormat: f.name.split(".").pop()?.toLowerCase() || "img",
      targetFormat: "jpg",
    }));

    setStagedFiles((prev) => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const updateTargetFormat = (id: string, format: string) => {
    setStagedFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, targetFormat: format } : f)),
    );
  };

  const removeStagedFile = (id: string) => {
    setStagedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleConvertAll = async () => {
    setIsUploading(true);
    setTimeout(
      () =>
        document
          .getElementById("conversions-queue")
          ?.scrollIntoView({ behavior: "smooth" }),
      100,
    );

    // 1. Iniciamos el Toast de carga (mostrando cuántas imágenes son)
    const loadingToast = toast.loading(
      `🖼️ Convirtiendo ${stagedFiles.length} imagen(es)...`,
    );

    try {
      await Promise.all(
        stagedFiles.map((staged) =>
          handleUploadAndConvert(staged.file, staged.targetFormat),
        ),
      );

      // 2. Si el Promise.all termina bien, mostramos éxito
      toast.dismiss(loadingToast);
      toast.success("Conversión completada con éxito.");
      setStagedFiles([]); // Limpiamos la zona de subida
    } catch (error) {
      // 3. Si algo falla, mostramos el error
      toast.dismiss(loadingToast);
      toast.error("Ocurrió un error al convertir las imágenes.");
    } finally {
      setIsUploading(false);
    }
  };

  return {
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
  };
}
