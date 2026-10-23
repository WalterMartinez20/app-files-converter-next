import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";

const execAsync = promisify(exec);

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let tempInputPath = "";
  let tempOutputPath = "";

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const actionDataStr = formData.get("actionData") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const { password } = JSON.parse(actionDataStr || "{}");
    if (!password) {
      return NextResponse.json({ error: "No password provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const tempDir = os.tmpdir();
    const uniqueId = Date.now().toString();
    tempInputPath = path.join(tempDir, `input_${uniqueId}.pdf`);
    tempOutputPath = path.join(tempDir, `output_${uniqueId}.pdf`);

    await fs.writeFile(tempInputPath, buffer);

    const scriptPath = path.join(process.cwd(), "src", "lib", "python", "pdf_crypto.py");
    const command = `python "${scriptPath}" unlock "${tempInputPath}" "${tempOutputPath}" "${password.replace(/"/g, '\\"')}"`;

    try {
      const { stdout } = await execAsync(command);
      if (!stdout.includes("SUCCESS")) {
         throw new Error(stdout || "Python script failed");
      }
    } catch (e: unknown) {
      const err = e as { stdout?: string };
      if (err.stdout && err.stdout.includes("Incorrect password")) {
        return NextResponse.json({ error: "Incorrect password" }, { status: 400 });
      }
      throw e;
    }

    const resultBuffer = await fs.readFile(tempOutputPath);
    const resultFileName = `unlocked_${Date.now()}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("files")
      .upload(resultFileName, resultBuffer, { contentType: "application/pdf" });

    if (uploadError) throw uploadError;

    const { data: dbRecord, error: dbError } = await supabase
      .from("conversions")
      .insert([{
        user_id: user?.id || null,
        file_name: `Unlocked_${file.name}`,
        original_format: "pdf (unlock)",
        target_format: "pdf",
        file_size: resultBuffer.byteLength,
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
  } finally {
    // Cleanup
    if (tempInputPath) await fs.unlink(tempInputPath).catch(() => {});
    if (tempOutputPath) await fs.unlink(tempOutputPath).catch(() => {});
  }
}
