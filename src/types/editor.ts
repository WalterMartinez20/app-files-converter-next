// src/types/editor.ts

/** Percentage-based position (0–100 relative to canvas width/height) */
export type TextElement = {
  id: string;
  text: string;
  x: number;
  y: number;
  pageIndex: number;
  color: string;
  fontSize: number;
  name?: string;
  zIndex?: number;
  fontFamily?: string;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  textAlign?: "left" | "center" | "right";
  backgroundColor?: string;
  shapeType?: "rectangle" | "circle" | "none";
  width?: number;
  height?: number;
};

export type ImageElement = {
  id: string;
  base64Data: string;
  x: number;
  y: number;
  width: number;
  pageIndex: number;
  name?: string;
  zIndex?: number;
};

export type RedactElement = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pageIndex: number;
  color: string;
  shapeType?: "rectangle" | "circle";
  name?: string;
  zIndex?: number;
};

export type WatermarkConfig = {
  text: string;
  opacity: number;
  color?: string;
  placement?: "diagonal" | "center" | "mosaic";
};

export type ToolType = "none" | "text" | "image" | "signature" | "redact";

/** Resize handle corner identifier */
export type DragAction = "move" | "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w";

export interface EditPdfPayload {
  textElements: TextElement[];
  imageElements: ImageElement[];
  redactElements: RedactElement[];
  watermark: WatermarkConfig;
}
