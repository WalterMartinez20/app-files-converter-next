import { useState, useEffect } from "react";
import { Conversion } from "@/types/conversion";
import { conversionService } from "@/services/conversionService";
import { createClient } from "@/lib/supabase/client";

export function useConversions() {
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const supabase = createClient();

  const fetchConversions = async () => {
    try {
      setIsLoading(true);
      let {
        data: { session },
      } = await supabase.auth.getSession();

      // ✨ MAGIA DE SEGURIDAD: Si no hay sesión, creamos una anónima automáticamente
      if (!session) {
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) throw error;
        session = data.session;
      }

      if (session?.user) {
        // is_anonymous es true para invitados, false para usuarios registrados
        setIsAuthenticated(!session.user.is_anonymous);

        // Como ya estamos autenticados (incluso como anónimos), traemos la data de la API real
        const data = await conversionService.getConversions();
        setConversions(data);
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadAndConvert = async (file: File, targetFormat: string) => {
    try {
      const storagePath = await conversionService.uploadFile(file, supabase);

      const newConversion = await conversionService.createConversion({
        file_name: file.name,
        original_format: file.name.split(".").pop() || "unknown",
        target_format: targetFormat,
        file_size: file.size,
        storage_path: storagePath,
      });

      const response = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversionId: newConversion.id,
          storagePath: storagePath,
          targetFormat: targetFormat,
        }),
      });

      if (!response.ok)
        throw new Error("Conversion processing failed on server");
      const result = await response.json();

      const completedConversion: Conversion = {
        ...newConversion,
        status: "completed",
        storage_path: result.newPath,
        target_format: targetFormat,
      };

      setConversions((prev) => [completedConversion, ...prev]);
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      throw err;
    }
  };

  const downloadFile = async (storagePath: string, fileName: string) => {
    const isZip =
      fileName.toLowerCase().endsWith(".zip") ||
      storagePath.toLowerCase().endsWith(".zip");

    if (isZip) {
      try {
        const { data, error } = await supabase.storage
          .from("files")
          .download(storagePath);
        if (error || !data) throw error || new Error("Failed to download");

        // If modern File System Access API is supported, prompt native File Explorer "Save As" window
        if (typeof window !== "undefined" && "showSaveFilePicker" in window) {
          try {
            const picker = (window as unknown as {
              showSaveFilePicker: (options?: {
                suggestedName?: string;
                types?: { description: string; accept: Record<string, string[]> }[];
              }) => Promise<{
                createWritable: () => Promise<{
                  write: (data: Blob) => Promise<void>;
                  close: () => Promise<void>;
                }>;
              }>;
            }).showSaveFilePicker;

            const handle = await picker({
              suggestedName: fileName,
              types: [
                {
                  description: "ZIP Archive",
                  accept: { "application/zip": [".zip"] },
                },
              ],
            });
            const writable = await handle.createWritable();
            await writable.write(data);
            await writable.close();
            return;
          } catch (pickerErr: unknown) {
            if (
              pickerErr &&
              typeof pickerErr === "object" &&
              "name" in pickerErr &&
              pickerErr.name === "AbortError"
            ) {
              // User dismissed or cancelled the file picker dialog
              return;
            }
          }
        }

        // Fallback for browsers without showSaveFilePicker
        const blobUrl = window.URL.createObjectURL(data);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 2000);
      } catch (err) {
        console.error("ZIP download error", err);
        const { data } = supabase.storage.from("files").getPublicUrl(storagePath);
        const link = document.createElement("a");
        link.href = data.publicUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      return;
    }

    // For PDFs (and other document formats), open in a separate tab as in the other sections
    const { data } = supabase.storage.from("files").getPublicUrl(storagePath);
    const link = document.createElement("a");
    link.href = data.publicUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const removeConversionFromHistory = async (id: string) => {
    // 1. Borramos de la UI instantáneamente
    setConversions((prev) => prev.filter((c) => c.id !== id));

    // 2. Mandamos a borrar a la API (Como RLS está activo, no pueden borrar archivos que no sean suyos)
    try {
      await fetch(`/api/conversions/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to delete conversion permanently", err);
    }
  };

  const clearAllConversions = async () => {
    const idsToDelete = conversions.map((c) => c.id);
    setConversions([]);

    try {
      await Promise.all(
        idsToDelete.map((id) =>
          fetch(`/api/conversions/${id}`, { method: "DELETE" })
        )
      );
    } catch (err) {
      console.error("Failed to clear all conversions", err);
    }
  };

  useEffect(() => {
    fetchConversions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    conversions,
    setConversions,
    isLoading,
    error,
    isAuthenticated,
    handleUploadAndConvert,
    fetchConversions,
    downloadFile,
    removeConversionFromHistory,
    clearAllConversions,
  };
}
