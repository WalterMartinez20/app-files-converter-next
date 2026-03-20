import { Conversion } from "./conversion"; // importamos la interface base

export interface StagedFile {
  id: string;
  file: File;
  originalFormat: string;
  targetFormat: string;
}

export interface PdfPageData {
  id: string;
  originalIndex: number;
  thumbnailUrl?: string; // ✨ NUEVO: La URL de la imagen de la página
  isLoadingThumbnail: boolean; // ✨ NUEVO: Estado de carga individual
}

// types de la cola de conversion
export interface ConversionsQueueProps {
  conversions: Conversion[];
  isLoading: boolean;
  onDownload: (path: string, name: string) => void;
  onDelete: (id: string) => void;
  variant?: "image" | "pdf"; // Para saber si pintarlo azul (imágenes) o rojo (PDFs)
}
