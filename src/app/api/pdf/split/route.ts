import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PDFDocument } from "pdf-lib";

/*
 * Separar (Split): Si un PDF tiene 10 páginas y le pasas [0], extraerá solo la portada.
 * Borrar páginas: Si le pasas [0, 1, 3, 4], el PDF perderá para siempre la página 3 (índice 2).
 * Reordenar: Si le pasas [9, 0, 1], pondrá la última página del documento original al principio del nuevo documento.
 */

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    // 1. Recibimos la ruta del archivo y las páginas que el usuario quiere conservar
    // pagesToKeep será un array de números, ej: [0, 1, 4] (índices basados en 0)
    const { storagePath, pagesToKeep, fileName } = await request.json();

    if (
      !storagePath ||
      !pagesToKeep ||
      !Array.isArray(pagesToKeep) ||
      pagesToKeep.length === 0
    ) {
      return NextResponse.json(
        {
          error: "Invalid data. We need the file and the pages to keep.",
        },
        { status: 400 },
      );
    }

    // 2. Descargamos el PDF original subido por el usuario
    const { data, error: downloadError } = await supabase.storage
      .from("files")
      .download(storagePath);
    if (downloadError || !data)
      throw new Error("Failed to download PDF from storage");

    const arrayBuffer = await data.arrayBuffer();
    const originalPdf = await PDFDocument.load(arrayBuffer);

    // 3. Creamos un PDF nuevo y completamente en blanco
    const newPdf = await PDFDocument.create();

    // 4. Copiamos SOLO las páginas que el usuario seleccionó y EN EL ORDEN exacto
    const copiedPages = await newPdf.copyPages(originalPdf, pagesToKeep);
    copiedPages.forEach((page) => newPdf.addPage(page));

    // 5. Guardamos el nuevo documento generado
    const newPdfBytes = await newPdf.save();

    // ✨ Limpiamos el nombre original que recibimos del cliente
    const safeOriginalName = fileName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9.-]/g, "_");
    const newFileName = `split_${Date.now()}_${safeOriginalName}`;

    // 6. Subimos el nuevo PDF al Storage de Supabase
    const { error: uploadError } = await supabase.storage
      .from("files")
      .upload(newFileName, newPdfBytes, {
        contentType: "application/pdf",
      });

    if (uploadError) throw uploadError;

    // 7. Guardamos el registro en la tabla 'conversions' (Historial)
    const { data: dbRecord, error: dbError } = await supabase
      .from("conversions")
      .insert([
        {
          user_id: user.id,
          file_name: `Split_${safeOriginalName}`, // <-- Nombre limpio en la BD
          original_format: "pdf (split)",
          target_format: "pdf",
          file_size: newPdfBytes.byteLength,
          storage_path: newFileName,
          status: "completed",
        },
      ])
      .select()
      .single();

    if (dbError) throw dbError;

    // 8. LIMPIEZA: Borramos el PDF original y pesado para ahorrar espacio en tu servidor
    await supabase.storage.from("files").remove([storagePath]);

    return NextResponse.json({ success: true, conversion: dbRecord });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
