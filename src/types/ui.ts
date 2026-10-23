// src/types/ui.ts

import { Conversion } from "./conversion";

export interface StagedFile {
  id: string;
  file: File;
  originalFormat: string;
  targetFormat: string;
  previewUrl?: string;
}

export interface PdfPageData {
  id: string;
  fileIndex: number;
  originalIndex: number;
  rotation: number;
  isBlank: boolean;
  thumbnailUrl?: string;
  isLoadingThumbnail: boolean;
}

export type PageItem = PdfPageData;

export interface MergeFile {
  id: string;
  file: File;
  previewUrl?: string;
  rotation?: number;
  numPages?: number;
}

export interface ConversionsQueueProps {
  conversions: Conversion[];
  isLoading: boolean;
  onDownload: (path: string, name: string) => void;
  onDelete: (id: string) => void;
  onClearAll?: () => void;
  /** Controls accent color: "image" = blue, "pdf" = red */
  variant?: "image" | "pdf";
}
