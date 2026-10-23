import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PDFDocument, degrees } from "pdf-lib";

/*
 * Organizar (Organize): Si un PDF tiene 10 páginas y le pasas [0], extraerá solo la portada.
 * Borrar páginas: Si le pasas [0, 1, 3, 4], el PDF perderá para siempre la página 3 (índice 2).
 * Reordenar: Si le pasas [9, 0, 1], pondrá la última página del documento original al principio del nuevo documento.
 */

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { storagePaths, pagesToKeep, fileName } = await request.json();

    if (
      !storagePaths ||
      !Array.isArray(storagePaths) ||
      storagePaths.length === 0 ||
      !pagesToKeep ||
      !Array.isArray(pagesToKeep) ||
      pagesToKeep.length === 0
    ) {
      return NextResponse.json(
        {
          error: "Invalid data. We need the files and the pages to keep.",
        },
        { status: 400 },
      );
    }

    // 2. Descargamos TODOS los PDFs originales subidos por el usuario
    const loadedPdfs: PDFDocument[] = [];
    for (const path of storagePaths) {
      const { data, error: downloadError } = await supabase.storage
        .from("files")
        .download(path);
      if (downloadError || !data)
        throw new Error(`Failed to download PDF from storage: ${path}`);

      const arrayBuffer = await data.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      loadedPdfs.push(pdf);
    }

    // 3. Creamos un PDF nuevo y completamente en blanco
    const newPdf = await PDFDocument.create();

    // 4. Copiamos SOLO las páginas que el usuario seleccionó y EN EL ORDEN exacto
    for (const pageReq of pagesToKeep) {
      const { fileIndex, originalIndex, rotation, isBlank } = pageReq;
      
      if (isBlank) {
        newPdf.addPage([595.28, 841.89]); // A4 size blank page
        continue;
      }

      if (fileIndex >= 0 && fileIndex < loadedPdfs.length) {
        const sourcePdf = loadedPdfs[fileIndex];
        const [copiedPage] = await newPdf.copyPages(sourcePdf, [originalIndex]);
        if (rotation) {
          copiedPage.setRotation(degrees(rotation));
        }
        newPdf.addPage(copiedPage);
      }
    }

    // 5. Guardamos el nuevo documento generado
    const newPdfBytes = await newPdf.save();

    // ✨ Limpiamos el nombre original que recibimos del cliente
    const safeOriginalName = fileName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9.-]/g, "_");
    const newFileName = `organize_${Date.now()}_${safeOriginalName}`;

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
          user_id: user?.id || null,
          file_name: `Organize_${safeOriginalName}`, // <-- Nombre limpio en la BD
          original_format: "pdf (organize)",
          target_format: "pdf",
          file_size: newPdfBytes.byteLength,
          storage_path: newFileName,
          status: "completed",
        },
      ])
      .select()
      .single();

    if (dbError) throw dbError;

    // 8. LIMPIEZA: Borramos los PDFs originales y pesados para ahorrar espacio en tu servidor
    await supabase.storage.from("files").remove(storagePaths);

    return NextResponse.json({ success: true, conversion: dbRecord });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
