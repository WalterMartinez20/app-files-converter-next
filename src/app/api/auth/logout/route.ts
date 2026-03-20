import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    // Instanciamos el cliente de servidor que ya tenemos creado
    const supabase = await createClient();

    // Esto destruye la sesión y limpia las cookies HttpOnly del servidor automáticamente
    await supabase.auth.signOut();

    return NextResponse.json(
      { message: "Logged out completely" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: "Error logging out" }, { status: 500 });
  }
}
