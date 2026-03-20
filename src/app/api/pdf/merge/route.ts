import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PDFDocument } from "pdf-lib";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Recibimos un arreglo con las rutas de los PDFs que el usuario subió
    const { files } = await request.json();

    if (!files || files.length < 2) {
      return NextResponse.json(
        { error: "Need at least 2 PDFs to merge" },
        { status: 400 },
      );
    }

    // 1. Creamos un PDF en blanco donde pegaremos todas las páginas
    const mergedPdf = await PDFDocument.create();
    let totalSize = 0;

    // 2. Descargamos y unimos cada PDF en orden
    for (const file of files) {
      const { data, error } = await supabase.storage
        .from("files")
        .download(file.storagePath);
      if (error || !data) continue; // Si uno falla, lo saltamos y seguimos con el resto

      const arrayBuffer = await data.arrayBuffer();
      totalSize += arrayBuffer.byteLength;

      const pdfToMerge = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(
        pdfToMerge,
        pdfToMerge.getPageIndices(),
      );

      // Pegamos las páginas copiadas en nuestro PDF maestro
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    // 3. Guardamos el PDF final
    const mergedPdfBytes = await mergedPdf.save();
    const mergedFileName = `merged_${Date.now()}.pdf`; // Este ya es seguro porque no usa el nombre del usuario

    // 4. Subimos el nuevo documento unificado a Supabase
    const { error: uploadError } = await supabase.storage
      .from("files")
      .upload(mergedFileName, mergedPdfBytes, {
        contentType: "application/pdf",
      });

    if (uploadError) throw uploadError;

    // 5. Creamos el registro en la tabla 'conversions' (Ya con status 'completed')
    const { data: dbRecord, error: dbError } = await supabase
      .from("conversions")
      .insert([
        {
          user_id: user.id,
          file_name: "Merged_Document.pdf",
          original_format: "pdf (multiple)",
          target_format: "pdf",
          file_size: mergedPdfBytes.byteLength,
          storage_path: mergedFileName,
          status: "completed",
        },
      ])
      .select()
      .single();

    if (dbError) throw dbError;

    // 6. LIMPIEZA: Borramos los PDFs individuales originales para ahorrar espacio
    const pathsToDelete = files.map(
      (f: { storagePath: string }) => f.storagePath,
    );
    await supabase.storage.from("files").remove(pathsToDelete);

    return NextResponse.json({ success: true, conversion: dbRecord });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
