// * src\app\api\conversions\[id]\route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id } = await params;

  try {
    // 1. Obtener la ruta del archivo convertido que está guardado
    const { data: conversion } = await supabase
      .from("conversions")
      .select("storage_path")
      .eq("id", id)
      .single();

    // 2. Eliminar el archivo físico de Supabase Storage
    if (conversion?.storage_path) {
      await supabase.storage.from("files").remove([conversion.storage_path]);
    }

    // 3. Eliminar la fila de la base de datos
    await supabase.from("conversions").delete().eq("id", id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
