import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PDFDocument, degrees } from "pdf-lib";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const contentType = request.headers.get("content-type") || "";
    const pdfBuffers: { buffer: ArrayBuffer; rotation?: number }[] = [];
    let originalFileName = "Merged_Document.pdf";
    let pathsToDelete: string[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const files = formData.getAll("files") as File[];
      const rotationsRaw = formData.get("rotations") as string;
      const rotations: number[] = rotationsRaw ? JSON.parse(rotationsRaw) : [];

      if (!files || files.length < 2) {
        return NextResponse.json(
          { error: "Need at least 2 PDFs to merge" },
          { status: 400 },
        );
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        pdfBuffers.push({
          buffer: await file.arrayBuffer(),
          rotation: rotations[i] || 0,
        });
      }

      const firstCleanName = files[0]?.name
        ?.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9.-]/g, "_");
      originalFileName = firstCleanName ? `Merged_${firstCleanName}` : "Merged_Document.pdf";
    } else {
      const { files } = await request.json();

      if (!files || files.length < 2) {
        return NextResponse.json(
          { error: "Need at least 2 PDFs to merge" },
          { status: 400 },
        );
      }

      pathsToDelete = files.map((f: { storagePath: string }) => f.storagePath);

      for (const file of files) {
        const { data, error } = await supabase.storage
          .from("files")
          .download(file.storagePath);
        if (error || !data) continue;

        const arrayBuffer = await data.arrayBuffer();
        pdfBuffers.push({
          buffer: arrayBuffer,
          rotation: file.rotation || 0,
        });
      }
    }

    if (pdfBuffers.length < 2) {
      return NextResponse.json(
        { error: "At least 2 valid PDF documents are required to merge." },
        { status: 400 },
      );
    }

    // 1. Creamos un PDF en blanco donde pegaremos todas las páginas
    const mergedPdf = await PDFDocument.create();

    // 2. Unimos cada PDF en orden
    for (const item of pdfBuffers) {
      const pdfToMerge = await PDFDocument.load(item.buffer, { ignoreEncryption: true });
      const copiedPages = await mergedPdf.copyPages(
        pdfToMerge,
        pdfToMerge.getPageIndices(),
      );

      copiedPages.forEach((page) => {
        if (item.rotation) {
          page.setRotation(degrees(item.rotation));
        }
        mergedPdf.addPage(page);
      });
    }

    if (mergedPdf.getPageCount() === 0) {
      throw new Error("Cannot save an empty merged PDF document");
    }

    // 3. Guardamos el PDF final
    const mergedPdfBytes = await mergedPdf.save();
    const mergedFileName = `merged_${Date.now()}.pdf`;

    // 4. Subimos el nuevo documento unificado a Supabase
    const { error: uploadError } = await supabase.storage
      .from("files")
      .upload(mergedFileName, mergedPdfBytes, {
        contentType: "application/pdf",
      });

    if (uploadError) throw uploadError;

    // 5. Creamos el registro en la tabla 'conversions' (Permite usuarios registrados e invitados)
    const { data: dbRecord, error: dbError } = await supabase
      .from("conversions")
      .insert([
        {
          user_id: user?.id || null,
          file_name: originalFileName,
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

    // 6. LIMPIEZA si se usó almacenamiento intermedio
    if (pathsToDelete.length > 0) {
      await supabase.storage.from("files").remove(pathsToDelete);
    }

    return NextResponse.json({ success: true, conversion: dbRecord });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error in merge";
    console.error("Merge error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
