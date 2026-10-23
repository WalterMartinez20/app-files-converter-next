import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const actionDataStr = formData.get("actionData") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const { position = "bottom-right", format = "n", size = 12, textColor = "#000000", shape = "none", shapeColor = "#dc2626", fontFamily = "Arial" } = JSON.parse(actionDataStr || "{}");

    const hexToRgbLib = (hex: string) => {
      let r = 0, g = 0, b = 0;
      hex = hex.replace("#", "");
      if (hex.length === 3) { r = parseInt(hex[0] + hex[0], 16); g = parseInt(hex[1] + hex[1], 16); b = parseInt(hex[2] + hex[2], 16); }
      else if (hex.length === 6) { r = parseInt(hex.substring(0, 2), 16); g = parseInt(hex.substring(2, 4), 16); b = parseInt(hex.substring(4, 6), 16); }
      return rgb(r / 255, g / 255, b / 255);
    };

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    let fontToEmbed = StandardFonts.Helvetica;
    if (fontFamily === "Times New Roman") fontToEmbed = StandardFonts.TimesRoman;
    else if (fontFamily === "Courier New") fontToEmbed = StandardFonts.Courier;
    else if (fontFamily === "Georgia") fontToEmbed = StandardFonts.TimesRoman; // Georgia mapping fallback
    
    const customFont = await pdfDoc.embedFont(fontToEmbed);
    
    const pages = pdfDoc.getPages();

    const totalPages = pages.length;

    pages.forEach((page, idx) => {
      const { width, height } = page.getSize();
      const current = idx + 1;
      const text = format.replace("n", current.toString()).replace("m", totalPages.toString());
      const fontSize = Number(size);
      const textRgb = hexToRgbLib(textColor);
      const shapeRgb = hexToRgbLib(shapeColor);

      // Geometry (PDF points). Keep in sync with PagePreview in number-pdf/page.tsx
      const MARGIN = 30;
      const textWidth = customFont.widthOfTextAtSize(text, fontSize);
      const hasShape = shape !== "none";
      const boxW = hasShape ? Math.max(textWidth + fontSize * 1.4, fontSize * 2) : textWidth;
      const boxH = hasShape ? fontSize * 2 : fontSize * 0.7;

      let boxX = (width - boxW) / 2;
      if (position.endsWith("right")) boxX = width - MARGIN - boxW;
      else if (position.endsWith("left")) boxX = MARGIN;

      const boxY = position.startsWith("top") ? height - MARGIN - boxH : MARGIN;

      if (hasShape) {
        // Corner radius: full round for "circle" (true circle for short text, pill for long text),
        // softly rounded corners for "square". Path origin is top-left with y pointing down.
        const r = shape === "circle" ? boxH / 2 : boxH * 0.2;
        const path =
          `M ${r} 0 L ${boxW - r} 0 A ${r} ${r} 0 0 1 ${boxW} ${r} ` +
          `L ${boxW} ${boxH - r} A ${r} ${r} 0 0 1 ${boxW - r} ${boxH} ` +
          `L ${r} ${boxH} A ${r} ${r} 0 0 1 0 ${boxH - r} ` +
          `L 0 ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`;
        page.drawSvgPath(path, { x: boxX, y: boxY + boxH, color: shapeRgb, borderWidth: 0 });
      }

      // Center glyphs (cap height ~0.7em) vertically inside the box
      page.drawText(text, {
        x: boxX + (boxW - textWidth) / 2,
        y: boxY + (boxH - fontSize * 0.7) / 2,
        size: fontSize,
        font: customFont,
        color: textRgb,
      });
    });

    const pdfBytes = await pdfDoc.save();
    const resultFileName = `numbered_${Date.now()}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("files")
      .upload(resultFileName, pdfBytes, { contentType: "application/pdf" });

    if (uploadError) throw uploadError;

    const { data: dbRecord, error: dbError } = await supabase
      .from("conversions")
      .insert([{
        user_id: user?.id || null,
        file_name: `Numbered_${file.name}`,
        original_format: "pdf (number)",
        target_format: "pdf",
        file_size: pdfBytes.byteLength,
        storage_path: resultFileName,
        status: "completed",
      }])
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, conversion: dbRecord });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
