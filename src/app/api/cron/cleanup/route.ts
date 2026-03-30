import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Usamos el Service Role Key para tener permisos de administrador
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(request: Request) {
  try {
    // 1. Calcular la fecha límite
    const timeLimit = new Date();

    // ✨ MODO DE PRUEBA: Restamos 1 minuto (Borrará todo lo que tenga más de 1 min de viejo)
    // Cuando termines de probar, borra esta línea y descomenta la de abajo:
    // timeLimit.setMinutes(timeLimit.getMinutes() - 1);

    timeLimit.setHours(timeLimit.getHours() - 24); // <-- Usa esta para producción

    const limitDate = timeLimit.toISOString();

    // 2. Buscar conversiones viejas en la base de datos
    const { data: oldConversions, error: fetchError } = await supabaseAdmin
      .from("conversions")
      .select("id, storage_path")
      .lt("created_at", limitDate);

    if (fetchError) throw fetchError;
    if (!oldConversions || oldConversions.length === 0) {
      return NextResponse.json({ message: "No old files to clean up." });
    }

    // 3. Borrar los archivos reales del Storage
    const pathsToDelete = oldConversions
      .map((c) => c.storage_path)
      .filter(Boolean);
    if (pathsToDelete.length > 0) {
      const { error: storageError } = await supabaseAdmin.storage
        // ✨ CORRECCIÓN: Ahora apunta a tu bucket "files"
        .from("files")
        .remove(pathsToDelete);
      if (storageError) console.error("Storage cleanup error:", storageError);
    }

    // 4. Borrar los registros de la tabla de la base de datos
    const idsToDelete = oldConversions.map((c) => c.id);
    const { error: dbError } = await supabaseAdmin
      .from("conversions")
      .delete()
      .in("id", idsToDelete);

    if (dbError) throw dbError;

    return NextResponse.json({
      message: `Successfully deleted ${oldConversions.length} old conversions.`,
    });
  } catch (error: any) {
    console.error("Cron Cleanup Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
