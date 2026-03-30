// src/types/editor.ts

export type TextElement = {
  id: string;
  text: string;
  x: number; // Porcentaje relativo al ancho (0-100)
  y: number; // Porcentaje relativo al alto (0-100)
  pageIndex: number;
  color: string;
  fontSize: number;
};

export type ImageElement = {
  id: string;
  base64Data: string;
  x: number;
  y: number;
  width: number;
  pageIndex: number;
};

export type RedactElement = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pageIndex: number;
  color: string;
};

export type WatermarkConfig = {
  text: string;
  opacity: number;
};

export type ToolType = "none" | "text" | "image" | "signature" | "redact";

// Para identificar de qué esquina estamos tirando
export type DragAction = "move" | "nw" | "ne" | "sw" | "se";

export interface EditPdfPayload {
  textElements: TextElement[];
  imageElements: ImageElement[];
  redactElements: RedactElement[];
  watermark: WatermarkConfig;
}
