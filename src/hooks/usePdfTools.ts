import { useConversions } from "./useConversions";
import { conversionService } from "@/services/conversionService";
import { createClient } from "@/lib/supabase/client";
import { EditPdfPayload } from "@/types/editor";

export function usePdfTools() {
  // Heredamos la base del hook principal para poder editar la cola visual
  const {
    conversions,
    setConversions,
    isLoading,
    error,
    downloadFile,
    removeConversionFromHistory,
    clearAllConversions,
  } = useConversions();
  const supabase = createClient();

  // Filtrar solo las conversiones que nos importan en este hook
  const pdfMerges = conversions.filter(
    (c) => c.original_format === "pdf (multiple)",
  );
  const pdfOrganizes = conversions.filter(
    (c) => c.original_format === "pdf (organize)",
  );
  const pdfEdits = conversions.filter(
    (c) => c.original_format === "pdf (edit)",
  );
  const pdfSplits = conversions.filter(
    (c) => c.original_format === "pdf (split)",
  );
  const pdfProtects = conversions.filter(
    (c) => c.original_format === "pdf (protect)",
  );
  const pdfUnlocks = conversions.filter(
    (c) => c.original_format === "pdf (unlock)",
  );
  const pdfNumbers = conversions.filter(
    (c) => c.original_format === "pdf (number)",
  );

  const handleMergePdfs = async (files: { file: File, rotation?: number }[]): Promise<boolean> => {
    try {
      const formData = new FormData();
      const rotations: number[] = [];
      files.forEach(({ file, rotation }) => {
        formData.append("files", file);
        rotations.push(rotation || 0);
      });
      formData.append("rotations", JSON.stringify(rotations));

      const response = await fetch("/api/pdf/merge", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Merge failed");
      }

      const result = await response.json();
      if (result.conversion) {
        setConversions((prev) => [result.conversion, ...prev]);
      }
      return true;
    } catch (err) {
      console.error("Merge error:", err);
      return false;
    }
  };

  const handleOrganizePdf = async (
    files: File[],
    pagesToKeep: { fileIndex: number; originalIndex: number }[],
  ): Promise<boolean> => {
    if (files.length === 0) return false;
    const mainFileName = files[0].name;

    let uploadedPaths: string[] = [];
    try {
      uploadedPaths = await Promise.all(
        files.map((file) => conversionService.uploadFile(file, supabase))
      );

      const response = await fetch("/api/pdf/organize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storagePaths: uploadedPaths, pagesToKeep, fileName: mainFileName }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Organize failed");
      }

      const result = await response.json();
      if (result.conversion) {
        setConversions((prev) => [result.conversion, ...prev]);
      }
      return true;
    } catch (err) {
      if (uploadedPaths.length > 0) supabase.storage.from("files").remove(uploadedPaths);
      console.error("Organize error:", err);
      return false;
    }
  };

  const handleEditPdf = async (file: File, editData: EditPdfPayload) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("editData", JSON.stringify(editData));

      const response = await fetch("/api/pdf/edit", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Edit failed");
      }

      const result = await response.json();
      if (result.conversion) {
        setConversions((prev) => [result.conversion, ...prev]);
      }
      return true;
    } catch (err) {
      console.error("Edit error:", err);
      return false;
    }
  };

  const handleGenericPdfAction = async (
    file: File,
    action: "split" | "protect" | "unlock" | "number",
    actionData: Record<string, unknown>
  ): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("actionData", JSON.stringify(actionData));

      const response = await fetch(`/api/pdf/${action}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `${action} failed`);
      }

      const result = await response.json();
      if (result.conversion) {
        setConversions((prev) => [result.conversion, ...prev]);
      }
      return true;
    } catch (err) {
      console.error(`${action} error:`, err);
      return false;
    }
  };

  const handleSplitPdf = (
    file: File,
    actionDataOrRanges: string | { ranges?: string; groups?: number[][]; merge?: boolean },
  ) => {
    const actionData =
      typeof actionDataOrRanges === "string"
        ? { ranges: actionDataOrRanges, merge: true }
        : actionDataOrRanges;
    return handleGenericPdfAction(file, "split", actionData);
  };
  const handleProtectPdf = (file: File, password: string) => handleGenericPdfAction(file, "protect", { password });
  const handleUnlockPdf = (file: File, password: string) => handleGenericPdfAction(file, "unlock", { password });
  const handleNumberPdf = (file: File, position: string, format: string, size: number, textColor: string, shape: string, shapeColor: string, fontFamily: string) => handleGenericPdfAction(file, "number", { position, format, size, textColor, shape, shapeColor, fontFamily });

  return {
    pdfMerges,
    pdfOrganizes,
    pdfEdits,
    pdfSplits,
    pdfProtects,
    pdfUnlocks,
    pdfNumbers,
    isLoading,
    error,
    handleMergePdfs,
    handleOrganizePdf,
    handleEditPdf,
    handleSplitPdf,
    handleProtectPdf,
    handleUnlockPdf,
    handleNumberPdf,
    downloadFile,
    removeConversionFromHistory,
    clearAllConversions,
  };
}
