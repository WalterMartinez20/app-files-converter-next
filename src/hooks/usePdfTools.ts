import { useConversions } from "./useConversions";
import { conversionService } from "@/services/conversionService";
import { createClient } from "@/lib/supabase/client";
import { Conversion } from "@/types/conversion";

export function usePdfTools() {
  // Heredamos la base del hook principal para poder editar la cola visual
  const {
    conversions,
    setConversions,
    isLoading,
    error,
    downloadFile,
    removeConversionFromHistory,
  } = useConversions();
  const supabase = createClient();

  // Filtrar solo las conversiones que nos importan en este hook
  const pdfMerges = conversions.filter(
    (c) => c.original_format === "pdf (multiple)",
  );
  const pdfSplits = conversions.filter(
    (c) => c.original_format === "pdf (split)",
  );

  const handleMergePdfs = async (files: File[]): Promise<boolean> => {
    const tempId = `temp-${Date.now()}`;
    const tempConversion: Conversion = {
      id: tempId,
      user_id: "",
      file_name: "Merged_Document.pdf",
      original_format: "pdf (multiple)",
      target_format: "pdf",
      file_size: files.reduce((acc, f) => acc + f.size, 0),
      storage_path: "",
      status: "processing",
      created_at: new Date().toISOString(),
    };

    try {
      setConversions((prev) => [tempConversion, ...prev]);
      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          const storagePath = await conversionService.uploadFile(
            file,
            supabase,
          );
          return { storagePath, fileName: file.name };
        }),
      );

      const response = await fetch("/api/pdf/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: uploadedFiles }),
      });

      if (!response.ok) throw new Error("Merge failed");
      const result = await response.json();
      setConversions((prev) =>
        prev.map((c) => (c.id === tempId ? result.conversion : c)),
      );
      return true;
    } catch (err) {
      setConversions((prev) =>
        prev.map((c) => (c.id === tempId ? { ...c, status: "failed" } : c)),
      );
      return false;
    }
  };

  const handleSplitPdf = async (
    file: File,
    pagesToKeep: number[],
  ): Promise<boolean> => {
    const tempId = `temp-${Date.now()}`;
    const tempConversion: Conversion = {
      id: tempId,
      user_id: "",
      file_name: `Split_${file.name}`,
      original_format: "pdf (split)",
      target_format: "pdf",
      file_size: file.size,
      storage_path: "",
      status: "processing",
      created_at: new Date().toISOString(),
    };

    try {
      setConversions((prev) => [tempConversion, ...prev]);
      const storagePath = await conversionService.uploadFile(file, supabase);
      const response = await fetch("/api/pdf/split", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storagePath, pagesToKeep, fileName: file.name }),
      });

      if (!response.ok) throw new Error("Split failed");
      const result = await response.json();
      setConversions((prev) =>
        prev.map((c) => (c.id === tempId ? result.conversion : c)),
      );
      return true;
    } catch (err) {
      setConversions((prev) =>
        prev.map((c) => (c.id === tempId ? { ...c, status: "failed" } : c)),
      );
      return false;
    }
  };

  return {
    pdfMerges,
    pdfSplits,
    isLoading,
    error,
    handleMergePdfs,
    handleSplitPdf,
    downloadFile,
    removeConversionFromHistory,
  };
}
