// * src\app\api\conversions\route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CreateConversionDTO } from "@/types/conversion";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("conversions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Bloqueamos estrictamente a cualquiera que no tenga un UUID (registrado o anónimo)
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body: CreateConversionDTO = await request.json();

    const conversionData = {
      ...body,
      user_id: user.id, // <-- Ya es obligatorio
      status: "pending",
    };

    const { data, error } = await supabase
      .from("conversions")
      .insert([conversionData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    const errorMesage =
      error instanceof Error ? error.message : "Error en api/conversions";
    return NextResponse.json({ error: errorMesage }, { status: 500 });
  }
}
