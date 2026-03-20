// * src\app\api\process\route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib"; // <-- NUEVA LIBRERÍA

export async function POST(request: Request) {
  const supabase = await createClient();
  let conversionIdToUpdate: string | null = null;
  let originalStoragePath: string | null = null;

  try {
    const body = await request.json();
    const { conversionId, storagePath, targetFormat } = body;

    conversionIdToUpdate = conversionId;
    originalStoragePath = storagePath; // Guardamos la ruta original para borrarla al final

    if (!conversionId || !storagePath || !targetFormat) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await supabase
      .from("conversions")
      .update({ status: "processing" })
      .eq("id", conversionId);

    const { data: fileData, error: downloadError } = await supabase.storage
      .from("files")
      .download(storagePath);
    if (downloadError || !fileData)
      throw new Error("Failed to download file from storage");

    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let processedBuffer: Buffer | Uint8Array;
    let contentType = "";

    // Obtenemos la extensión original
    const originalExt = storagePath.split(".").pop()?.toLowerCase() || "";

    // =========================================================
    // 1. IMAGE SUITE (JPG, PNG, WEBP, GIF, AVIF)
    // =========================================================
    if (["webp", "png", "jpg", "jpeg", "gif", "avif"].includes(targetFormat)) {
      contentType = `image/${targetFormat === "jpg" ? "jpeg" : targetFormat}`;

      if (targetFormat === "webp") {
        processedBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
      } else if (targetFormat === "png") {
        processedBuffer = await sharp(buffer).png().toBuffer();
      } else if (targetFormat === "gif") {
        processedBuffer = await sharp(buffer).gif().toBuffer();
      } else if (targetFormat === "avif") {
        processedBuffer = await sharp(buffer).avif({ quality: 80 }).toBuffer();
      } else {
        processedBuffer = await sharp(buffer).jpeg({ quality: 85 }).toBuffer();
      }
    }
    // =========================================================
    // 2. PDF TOOLS (Imagen a PDF y Optimizar PDF)
    // =========================================================
    else if (targetFormat === "pdf") {
      contentType = "application/pdf";

      // A) Convertir Imagen a PDF
      if (["png", "jpg", "jpeg", "webp"].includes(originalExt)) {
        // Pasamos la imagen a PNG primero para garantizar compatibilidad con pdf-lib
        const imagePngBuffer = await sharp(buffer).png().toBuffer();

        const pdfDoc = await PDFDocument.create();
        const image = await pdfDoc.embedPng(imagePngBuffer);
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });

        processedBuffer = await pdfDoc.save();
      }
      // B) Optimizar un PDF existente
      else if (originalExt === "pdf") {
        const pdfDoc = await PDFDocument.load(buffer);
        processedBuffer = await pdfDoc.save();
      } else {
        throw new Error("Cannot convert this format to PDF yet.");
      }
    } else {
      throw new Error(`Format ${targetFormat} is not supported yet.`);
    }

    const newFileName = `converted_${Date.now()}_${conversionId}.${targetFormat}`;
    const { error: uploadError } = await supabase.storage
      .from("files")
      .upload(newFileName, processedBuffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    await supabase
      .from("conversions")
      .update({
        status: "completed",
        storage_path: newFileName,
        target_format: targetFormat,
      })
      .eq("id", conversionId);

    // ✅ LIMPIEZA INTELIGENTE: Borramos el original pesado para ahorrar espacio (solo si hubo éxito)
    if (originalStoragePath) {
      await supabase.storage.from("files").remove([originalStoragePath]);
    }

    return NextResponse.json({ success: true, newPath: newFileName });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Conversion failed:", errorMessage);

    if (conversionIdToUpdate) {
      await supabase
        .from("conversions")
        .update({ status: "failed" })
        .eq("id", conversionIdToUpdate);
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
