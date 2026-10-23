import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const actionDataStr = formData.get("actionData") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const actionData = JSON.parse(actionDataStr || "{}");
    const { ranges, groups: rawGroups, merge = true } = actionData;

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const totalPages = pdfDoc.getPageCount();

    // Determine groups of 0-indexed page indices
    let groups: number[][] = [];

    if (Array.isArray(rawGroups) && rawGroups.length > 0) {
      groups = rawGroups
        .map((g: number[]) => g.filter((p) => p >= 0 && p < totalPages))
        .filter((g: number[]) => g.length > 0);
    } else if (ranges) {
      const parts = ranges
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);

      for (const part of parts) {
        const groupPages: number[] = [];
        if (part.includes("-")) {
          const [start, end] = part.split("-").map(Number);
          for (let i = start; i <= end; i++) {
            if (i > 0 && i <= totalPages) groupPages.push(i - 1);
          }
        } else {
          const page = Number(part);
          if (page > 0 && page <= totalPages) groupPages.push(page - 1);
        }
        if (groupPages.length > 0) groups.push(groupPages);
      }
    } else {
      // Default: all pages in 1 group
      const all: number[] = [];
      for (let i = 0; i < totalPages; i++) all.push(i);
      groups.push(all);
    }

    if (groups.length === 0) {
      return NextResponse.json(
        { error: "No valid pages to split" },
        { status: 400 },
      );
    }

    const safeOriginalName = file.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9.-]/g, "_");
    const cleanBaseName = safeOriginalName.replace(/\.pdf$/i, "");

    // Case 1: Merged output -> Single PDF
    if (merge) {
      const newPdf = await PDFDocument.create();
      const flatPages: number[] = [];
      for (const grp of groups) {
        for (const p of grp) {
          flatPages.push(p);
        }
      }

      const copiedPages = await newPdf.copyPages(pdfDoc, flatPages);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const resultFileName = `split_${Date.now()}_${safeOriginalName}`;

      const { error: uploadError } = await supabase.storage
        .from("files")
        .upload(resultFileName, pdfBytes, {
          contentType: "application/pdf",
        });

      if (uploadError) throw uploadError;

      const { data: dbRecord, error: dbError } = await supabase
        .from("conversions")
        .insert([
          {
            user_id: user?.id || null,
            file_name: `Split_${safeOriginalName}`,
            original_format: "pdf (split)",
            target_format: "pdf",
            file_size: pdfBytes.byteLength,
            storage_path: resultFileName,
            status: "completed",
          },
        ])
        .select()
        .single();

      if (dbError) throw dbError;

      return NextResponse.json({ success: true, conversion: dbRecord });
    }

    // Case 2: Unmerged output with multiple groups -> ZIP archive containing separate PDFs
    const zip = new JSZip();

    for (let i = 0; i < groups.length; i++) {
      const grp = groups[i];
      const partPdf = await PDFDocument.create();
      const copied = await partPdf.copyPages(pdfDoc, grp);
      copied.forEach((page) => partPdf.addPage(page));
      const partBytes = await partPdf.save();

      const label =
        grp.length === 1
          ? `page_${grp[0] + 1}`
          : `pages_${grp[0] + 1}-${grp[grp.length - 1] + 1}`;

      zip.file(`${cleanBaseName}_${label}.pdf`, partBytes);
    }

    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
    });
    const resultFileName = `split_${Date.now()}_${cleanBaseName}.zip`;

    const { error: uploadError } = await supabase.storage
      .from("files")
      .upload(resultFileName, zipBuffer, {
        contentType: "application/zip",
      });

    if (uploadError) throw uploadError;

    const { data: dbRecord, error: dbError } = await supabase
      .from("conversions")
      .insert([
        {
          user_id: user?.id || null,
          file_name: `Split_${cleanBaseName}.zip`,
          original_format: "pdf (split)",
          target_format: "zip",
          file_size: zipBuffer.byteLength,
          storage_path: resultFileName,
          status: "completed",
        },
      ])
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, conversion: dbRecord });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
