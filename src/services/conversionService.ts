import { Conversion, CreateConversionDTO } from "@/types/conversion";

const API_URL = "/api/conversions";

export const conversionService = {
  async getConversions(): Promise<Conversion[]> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch conversions");
    return res.json();
  },

  async createConversion(data: CreateConversionDTO): Promise<Conversion> {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create conversion");
    return res.json();
  },

  async uploadFile(file: File, supabase: any): Promise<string> {
    // ✨ LIMPIEZA: Quitamos tildes, eñes y cambiamos espacios/símbolos por guiones bajos
    const safeName = file.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Quita tildes
      .replace(/[^a-zA-Z0-9.-]/g, "_"); // Cambia espacios y caracteres raros por "_"

    const fileName = `${Date.now()}_${safeName}`; // Usamos el nombre limpio

    const { error } = await supabase.storage
      .from("files")
      .upload(fileName, file);

    if (error) throw error;
    return fileName;
  },
};
