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

      // Ya no usamos localStorage, solo actualizamos el estado de React
      setConversions((prev) => [newConversion, ...prev]);

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

      setConversions((prev) =>
        prev.map((c) =>
          c.id === newConversion.id
            ? {
                ...c,
                status: "completed" as const,
                storage_path: result.newPath,
              }
            : c,
        ),
      );
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      fetchConversions();
    }
  };

  const downloadFile = async (storagePath: string, fileName: string) => {
    const { data } = supabase.storage.from("files").getPublicUrl(storagePath);
    const link = document.createElement("a");
    link.href = data.publicUrl;
    link.download = fileName;
    link.target = "_blank";
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

  useEffect(() => {
    fetchConversions();
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
  };
}
