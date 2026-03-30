import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import { EditPdfPayload } from "@/types/editor";

export async function POST(req: NextRequest) {
  try {
    // 1. Cliente normal de Supabase (sin admin keys, usando las políticas RLS que ya configuraste)
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Nota: NO ponemos bloqueo `if (!user)`, permitiendo que invitados pasen.

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const editDataRaw = formData.get("editData") as string;

    if (!file || !editDataRaw) {
      return NextResponse.json(
        { error: "Missing file or data" },
        { status: 400 },
      );
    }

    const editData: EditPdfPayload = JSON.parse(editDataRaw);
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // 2. MARCA DE AGUA
    if (editData.watermark && editData.watermark.text?.trim() !== "") {
      const watermarkText = editData.watermark.text;
      const rotationAngle = 45; // Ángulo diagonal

      for (const page of pages) {
        const { width, height } = page.getSize();

        // --- 📐 NUEVA LÓGICA DE ESCALADO INTELIGENTE ---
        // Empezamos con un tamaño de fuente idealmente grande
        let dynamicFontSize = 160;

        // Calculamos el ancho del texto con ese tamaño grande
        let textWidth = helveticaFont.widthOfTextAtSize(
          watermarkText,
          dynamicFontSize,
        );

        // Calculamos el ancho diagonal teórico máximo disponible en la página
        // Matemáticamente, el ancho del texto debe ser <= ancho_página * sqrt(2)
        // Usamos un factor de seguridad (1.2) para dejar márgenes sutiles.
        const maxDiagonalWidth = width * 1.2;

        // Mientras el texto sea más ancho que la diagonal disponible, bajamos la fuente iterativamente.
        while (textWidth > maxDiagonalWidth && dynamicFontSize > 20) {
          dynamicFontSize -= 5;
          textWidth = helveticaFont.widthOfTextAtSize(
            watermarkText,
            dynamicFontSize,
          );
        }

        // --- 📐 FIN LÓGICA DE ESCALADO ---

        // MATEMÁTICAS DE CENTRADO DIAGONAL
        const radians = (rotationAngle * Math.PI) / 180;
        const cosAngle = Math.cos(radians);
        const sinAngle = Math.sin(radians);

        const px = width / 2 - (textWidth / 2) * cosAngle;
        const py = height / 2 - (textWidth / 2) * sinAngle;

        page.drawText(watermarkText, {
          x: px,
          y: py,
          size: dynamicFontSize, // ✨ Usamos la fuente calculada automáticamente
          font: helveticaFont,
          color: rgb(0.5, 0.5, 0.5),
          opacity: editData.watermark.opacity || 0.3,
          rotate: degrees(rotationAngle),
        });
      }
    }

    // 3. TEXTOS
    for (const textEl of editData.textElements || []) {
      if (textEl.pageIndex < pages.length && textEl.text?.trim() !== "") {
        try {
          const page = pages[textEl.pageIndex];
          const { width, height } = page.getSize();
          const safeX = textEl.x || 0;
          const safeY = textEl.y || 0;
          const safeSize = textEl.fontSize || 16;
          const pdfX = (safeX / 100) * width;
          const pdfY = height - (safeY / 100) * height - safeSize;
          page.drawText(textEl.text, {
            x: pdfX,
            y: pdfY,
            size: safeSize,
            font: helveticaFont,
            color: rgb(0.1, 0.1, 0.1),
          });
        } catch (e) {
          console.error("Skipped text:", e);
        }
      }
    }

    // 4. CENSURA
    for (const redactEl of editData.redactElements || []) {
      if (redactEl.pageIndex < pages.length) {
        try {
          const page = pages[redactEl.pageIndex];
          const { width, height } = page.getSize();
          const safeX = redactEl.x || 0;
          const safeY = redactEl.y || 0;
          const safeW = redactEl.width || 10;
          const safeH = redactEl.height || 5;
          const rectW = (safeW / 100) * width;
          const rectH = (safeH / 100) * height;
          const pdfX = (safeX / 100) * width;
          const pdfY = height - (safeY / 100) * height - rectH;
          page.drawRectangle({
            x: pdfX,
            y: pdfY,
            width: rectW,
            height: rectH,
            color: rgb(0, 0, 0),
          });
        } catch (e) {
          console.error("Skipped redact:", e);
        }
      }
    }

    // 5. IMÁGENES / FIRMAS
    for (const imgEl of editData.imageElements || []) {
      if (
        imgEl.pageIndex < pages.length &&
        imgEl.base64Data &&
        imgEl.base64Data.includes(",")
      ) {
        try {
          const page = pages[imgEl.pageIndex];
          const { width, height } = page.getSize();
          const isPng = imgEl.base64Data.includes("image/png");
          const base64Clean = imgEl.base64Data.substring(
            imgEl.base64Data.indexOf(",") + 1,
          );

          const embeddedImage = isPng
            ? await pdfDoc.embedPng(base64Clean)
            : await pdfDoc.embedJpg(base64Clean);
          const safeW = imgEl.width || 20;
          const imgDims = embeddedImage.scaleToFit(
            (safeW / 100) * width,
            height,
          );
          const pdfX = (imgEl.x / 100) * width;
          const pdfY = height - (imgEl.y / 100) * height - imgDims.height;
          page.drawImage(embeddedImage, {
            x: pdfX,
            y: pdfY,
            width: imgDims.width,
            height: imgDims.height,
          });
        } catch (imgErr) {
          console.error("Skipped image:", imgErr);
        }
      }
    }

    const pdfBytes = await pdfDoc.save();

    // 6. Limpiamos el nombre original (Exactamente igual que en Split)
    const safeOriginalName = file.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9.-]/g, "_");

    const newFileName = `edit_${Date.now()}_${safeOriginalName}`;

    // 7. Subimos al bucket "files" de Supabase
    const { error: uploadError } = await supabase.storage
      .from("files")
      .upload(newFileName, pdfBytes, {
        contentType: "application/pdf",
      });

    if (uploadError) throw uploadError;

    // 8. Guardamos el registro en el historial (Tabla 'conversions')
    const { data: dbRecord, error: dbError } = await supabase
      .from("conversions")
      .insert([
        {
          user_id: user?.id || null,
          file_name: `Edited_${safeOriginalName}`,

          // ✨ INVERTIMOS ESTOS DOS VALORES PARA QUE EL FRONTEND LO RECONOZCA
          original_format: "pdf (edit)",
          target_format: "pdf",

          file_size: pdfBytes.length,
          storage_path: newFileName,
          status: "completed",
        },
      ])
      .select()
      .single();

    if (dbError) throw dbError;

    // 9. Devolvemos el mismo formato JSON que espera el frontend
    return NextResponse.json({ success: true, conversion: dbRecord });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "🔥 API EDIT PDF CATCH ERROR:";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
