import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import sharp from "sharp";
import { EditPdfPayload } from "@/types/editor";

function htmlToPlainText(html: string): string {
  if (!html) return "";
  let text = html;
  // Replace break tags and block tags with newlines
  text = text.replace(/<br\s*[\/]?>/gi, "\n");
  text = text.replace(/<\/div>/gi, "\n");
  text = text.replace(/<\/p>/gi, "\n\n");
  text = text.replace(/<li[^>]*>/gi, "• ");
  text = text.replace(/<\/li>/gi, "\n");

  // Remove all other HTML tags
  text = text.replace(/<[^>]+>/g, "");

  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&iquest;/gi, "¿")
    .replace(/&iexcl;/gi, "¡")
    .replace(/&aacute;/gi, "á")
    .replace(/&eacute;/gi, "é")
    .replace(/&iacute;/gi, "í")
    .replace(/&oacute;/gi, "ó")
    .replace(/&uacute;/gi, "ú")
    .replace(/&ntilde;/gi, "ñ")
    .replace(/&Aacute;/gi, "Á")
    .replace(/&Eacute;/gi, "É")
    .replace(/&Iacute;/gi, "Í")
    .replace(/&Oacute;/gi, "Ó")
    .replace(/&Uacute;/gi, "Ú")
    .replace(/&Ntilde;/gi, "Ñ");

  // Normalize quotes and dashes
  text = text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...");

  return text;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sanitizeForFont(font: any, text: string): string {
  let safeText = "";
  for (const char of text) {
    try {
      font.encodeText(char);
      safeText += char;
    } catch {
      safeText += " ";
    }
  }
  return safeText;
}

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

    // Embed fonts for various styles and families
    const fonts = {
      helvetica: await pdfDoc.embedFont(StandardFonts.Helvetica),
      helveticaBold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
      helveticaItalic: await pdfDoc.embedFont(StandardFonts.HelveticaOblique),
      helveticaBoldItalic: await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique),
      times: await pdfDoc.embedFont(StandardFonts.TimesRoman),
      timesBold: await pdfDoc.embedFont(StandardFonts.TimesRomanBold),
      timesItalic: await pdfDoc.embedFont(StandardFonts.TimesRomanItalic),
      timesBoldItalic: await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic),
      courier: await pdfDoc.embedFont(StandardFonts.Courier),
      courierBold: await pdfDoc.embedFont(StandardFonts.CourierBold),
      courierItalic: await pdfDoc.embedFont(StandardFonts.CourierOblique),
      courierBoldItalic: await pdfDoc.embedFont(StandardFonts.CourierBoldOblique),
    };

    const selectFont = (family?: string, isBold?: boolean, isItalic?: boolean) => {
      const fam = (family || "").toLowerCase();
      if (fam.includes("times") || fam.includes("georgia") || fam.includes("serif")) {
        if (isBold && isItalic) return fonts.timesBoldItalic;
        if (isBold) return fonts.timesBold;
        if (isItalic) return fonts.timesItalic;
        return fonts.times;
      }
      if (fam.includes("courier") || fam.includes("mono")) {
        if (isBold && isItalic) return fonts.courierBoldItalic;
        if (isBold) return fonts.courierBold;
        if (isItalic) return fonts.courierItalic;
        return fonts.courier;
      }
      if (isBold && isItalic) return fonts.helveticaBoldItalic;
      if (isBold) return fonts.helveticaBold;
      if (isItalic) return fonts.helveticaItalic;
      return fonts.helvetica;
    };

    // Helper to parse hex to pdf-lib rgb
    const parseHexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '#000000');
      return result
        ? rgb(parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255)
        : rgb(0, 0, 0);
    };

    // 2. MARCA DE AGUA
    if (editData.watermark && editData.watermark.text?.trim() !== "") {
      const watermarkText = editData.watermark.text;
      const placement = editData.watermark.placement || 'diagonal';
      const wmColor = parseHexToRgb(editData.watermark.color || '#808080');
      const helveticaFont = fonts.helvetica;

      for (const page of pages) {
        const { width, height } = page.getSize();
        
        let dynamicFontSize = 160;
        let textWidth = helveticaFont.widthOfTextAtSize(watermarkText, dynamicFontSize);
        const maxDiagonalWidth = width * 1.2;

        while (textWidth > maxDiagonalWidth && dynamicFontSize > 20) {
          dynamicFontSize -= 5;
          textWidth = helveticaFont.widthOfTextAtSize(watermarkText, dynamicFontSize);
        }

        if (placement === 'mosaic') {
          dynamicFontSize = 40;
          textWidth = helveticaFont.widthOfTextAtSize(watermarkText, dynamicFontSize);
          const rotationAngle = 45;
          for (let mx = -width; mx < width * 2; mx += textWidth * 1.5) {
            for (let my = -height; my < height * 2; my += dynamicFontSize * 4) {
              page.drawText(watermarkText, {
                x: mx,
                y: my,
                size: dynamicFontSize,
                font: helveticaFont,
                color: wmColor,
                opacity: editData.watermark.opacity || 0.3,
                rotate: degrees(rotationAngle),
              });
            }
          }
        } else {
          const rotationAngle = placement === 'diagonal' ? 45 : 0;
          const radians = (rotationAngle * Math.PI) / 180;
          const cosAngle = Math.cos(radians);
          const sinAngle = Math.sin(radians);
          
          const px = width / 2 - (textWidth / 2) * cosAngle;
          const py = height / 2 - (textWidth / 2) * sinAngle;

          page.drawText(watermarkText, {
            x: px,
            y: py,
            size: dynamicFontSize,
            font: helveticaFont,
            color: wmColor,
            opacity: editData.watermark.opacity || 0.3,
            rotate: degrees(rotationAngle),
          });
        }
      }
    }

    // 3. TEXTOS
    for (const textEl of editData.textElements || []) {
      if (textEl.pageIndex < pages.length && textEl.text) {
        try {
          const plainText = htmlToPlainText(textEl.text).trim();
          if (!plainText) continue;

          const page = pages[textEl.pageIndex];
          const { width, height } = page.getSize();
          const font = selectFont(textEl.fontFamily, textEl.isBold, textEl.isItalic);

          const safeX = textEl.x || 0;
          const safeY = textEl.y || 0;
          const safeSize = textEl.fontSize || 16;
          const lineHeight = safeSize * 1.25;

          const pdfX = (safeX / 100) * width;
          const pdfYTop = height - (safeY / 100) * height;

          const rawLines = plainText.split("\n");
          const lines = rawLines.map((l) => sanitizeForFont(font, l));

          // Draw background shape if specified
          if (
            textEl.backgroundColor &&
            textEl.backgroundColor !== "transparent" &&
            textEl.shapeType &&
            textEl.shapeType !== "none"
          ) {
            const bgW = textEl.width ? (textEl.width / 100) * width : width * 0.25;
            const bgH = textEl.height ? (textEl.height / 100) * height : lines.length * lineHeight + safeSize * 0.5;
            const bgY = pdfYTop - bgH;
            const bgColor = parseHexToRgb(textEl.backgroundColor);

            if (textEl.shapeType === "circle") {
              page.drawEllipse({
                x: pdfX + bgW / 2,
                y: bgY + bgH / 2,
                xScale: bgW / 2,
                yScale: bgH / 2,
                color: bgColor,
              });
            } else {
              page.drawRectangle({
                x: pdfX,
                y: bgY,
                width: bgW,
                height: bgH,
                color: bgColor,
              });
            }
          }

          const textColor = parseHexToRgb(textEl.color || "#000000");

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (!line.trim()) continue;

            let lineX = pdfX;
            if (textEl.textAlign === "center" && textEl.width) {
              const elWidth = (textEl.width / 100) * width;
              const textWidth = font.widthOfTextAtSize(line, safeSize);
              lineX = pdfX + Math.max(0, (elWidth - textWidth) / 2);
            } else if (textEl.textAlign === "right" && textEl.width) {
              const elWidth = (textEl.width / 100) * width;
              const textWidth = font.widthOfTextAtSize(line, safeSize);
              lineX = pdfX + Math.max(0, elWidth - textWidth);
            }

            const lineY = pdfYTop - (i + 1) * lineHeight;

            page.drawText(line, {
              x: lineX,
              y: lineY,
              size: safeSize,
              font,
              color: textColor,
            });
          }
        } catch (e) {
          console.error("Skipped text:", e);
        }
      }
    }

    // 4. CENSURA / SHAPES
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
          
          const shapeColor = parseHexToRgb(redactEl.color || '#000000');
          
          if (redactEl.shapeType === 'circle') {
             // pdf-lib drawEllipse uses center x, y
             page.drawEllipse({
               x: pdfX + rectW / 2,
               y: pdfY + rectH / 2,
               xScale: rectW / 2,
               yScale: rectH / 2,
               color: shapeColor,
             });
          } else {
            page.drawRectangle({
              x: pdfX,
              y: pdfY,
              width: rectW,
              height: rectH,
              color: shapeColor,
            });
          }
        } catch (e) {
          console.error("Skipped redact:", e);
        }
      }
    }

    // 5. IMÁGENES / FIRMAS
    for (const imgEl of editData.imageElements || []) {
      if (
        imgEl.pageIndex < pages.length &&
        imgEl.base64Data
      ) {
        try {
          const page = pages[imgEl.pageIndex];
          const { width, height } = page.getSize();
          const base64Clean = imgEl.base64Data.includes(",")
            ? imgEl.base64Data.substring(imgEl.base64Data.indexOf(",") + 1)
            : imgEl.base64Data;

          let embeddedImage;
          try {
            const rawBuffer = Buffer.from(base64Clean.trim(), "base64");
            // Normalize any image format (PNG, WebP, JPEG, GIF, SVG, etc.) to standard PNG buffer
            const pngBuffer = await sharp(rawBuffer).png().toBuffer();
            embeddedImage = await pdfDoc.embedPng(pngBuffer);
          } catch (sharpErr) {
            console.warn("Sharp conversion failed, falling back to direct embed:", sharpErr);
            embeddedImage = imgEl.base64Data.includes("image/png")
              ? await pdfDoc.embedPng(base64Clean)
              : await pdfDoc.embedJpg(base64Clean);
          }

          const safeW = imgEl.width || 20;
          const targetWidth = (safeW / 100) * width;
          const targetHeight = targetWidth * (embeddedImage.height / embeddedImage.width);
          const pdfX = (imgEl.x / 100) * width;
          const pdfY = height - (imgEl.y / 100) * height - targetHeight;

          page.drawImage(embeddedImage, {
            x: pdfX,
            y: pdfY,
            width: targetWidth,
            height: targetHeight,
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
