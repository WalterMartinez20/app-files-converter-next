"use client";

import { useState } from "react";
import { usePdfTools } from "./usePdfTools";
import { usePdfThumbnail } from "./usePdfThumbnail";
import { toast } from "react-hot-toast";

export const DEFAULT_NUMBER_COLORS = ["#ffffff", "#000000", "#dc2626", "#2563eb", "#64748b"];

export const NUMBER_THUMB_SCALE = 1;

export const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 48, 64, 72];

export const SHAPES_LIST = [
  { id: "none", icon: "do_not_disturb", title: "None" },
  { id: "circle", icon: "circle", title: "Circle" },
  { id: "square", icon: "square", title: "Square" },
];

export const POSITION_LIST = [
  { id: "top-left", icon: "format_align_left", title: "Top Left" },
  { id: "top-center", icon: "format_align_center", title: "Top Center" },
  { id: "top-right", icon: "format_align_right", title: "Top Right" },
  { id: "bottom-left", icon: "format_align_left", title: "Bottom Left" },
  { id: "bottom-center", icon: "format_align_center", title: "Bottom Center" },
  { id: "bottom-right", icon: "format_align_right", title: "Bottom Right" },
];

export function useNumberPdfUI() {
  const {
    pdfNumbers,
    isLoading,
    downloadFile,
    removeConversionFromHistory,
    clearAllConversions,
    handleNumberPdf,
  } = usePdfTools();

  const [file, setFile] = useState<File | null>(null);
  const [position, setPosition] = useState("bottom-right");
  const [format, setFormat] = useState("n");
  const [size, setSize] = useState<number>(12);
  const [textColor, setTextColor] = useState(DEFAULT_NUMBER_COLORS[1]);
  const [shapeColor, setShapeColor] = useState(DEFAULT_NUMBER_COLORS[2]);
  const [shape, setShape] = useState("none");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [isProcessing, setIsProcessing] = useState(false);

  const { thumbnailUrl, allThumbnails, isGenerating, numPages } = usePdfThumbnail(file, NUMBER_THUMB_SCALE);

  const formatsList = [
    { id: "n", label: "1 (Normal)", sample: "1" },
    { id: "- n -", label: "- 1 - (Classic)", sample: "- 1 -" },
    { id: "Page n", label: "Page 1 (Formal)", sample: "Page 1" },
    { id: "Page n of m", label: "Page 1 of X", sample: `Page 1 of ${numPages || 10}` },
    { id: "[ n ]", label: "[ 1 ] (Brackets)", sample: "[ 1 ]" },
    { id: "~ n ~", label: "~ 1 ~ (Tilde)", sample: "~ 1 ~" },
  ];

  const getFormatSampleString = (pageIndex: number, total: number) => {
    switch (format) {
      case "n":
        return `${pageIndex}`;
      case "- n -":
        return `- ${pageIndex} -`;
      case "Page n":
        return `Page ${pageIndex}`;
      case "Page n of m":
        return `Page ${pageIndex} of ${total || 10}`;
      case "[ n ]":
        return `[ ${pageIndex} ]`;
      case "~ n ~":
        return `~ ${pageIndex} ~`;
      default:
        return `${pageIndex}`;
    }
  };

  const onFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) {
      toast.error("No file was selected");
      return;
    }
    const f = files[0];
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please select a valid PDF file");
      return;
    }
    if (f.size > 100 * 1024 * 1024) {
      toast.error("File exceeds maximum allowed size of 100 MB");
      return;
    }
    setFile(f);
  };

  const handleAction = async () => {
    if (!file) {
      toast.error("Please select a PDF file first");
      return;
    }
    setIsProcessing(true);
    const success = await handleNumberPdf(
      file,
      position,
      format,
      size,
      textColor,
      shape,
      shapeColor,
      fontFamily,
    );
    setIsProcessing(false);
    if (success) {
      toast.success("Page numbers added successfully");
      setFile(null);
      setTimeout(() => {
        document.getElementById("conversions-queue")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } else {
      toast.error("Failed to add page numbers. Please try again.");
    }
  };

  const cancelNumbering = () => {
    setFile(null);
  };

  return {
    file,
    setFile,
    position,
    setPosition,
    format,
    setFormat,
    size,
    setSize,
    textColor,
    setTextColor,
    shapeColor,
    setShapeColor,
    shape,
    setShape,
    fontFamily,
    setFontFamily,
    isProcessing,
    thumbnailUrl,
    allThumbnails,
    isGenerating,
    numPages,
    formatsList,
    getFormatSampleString,
    onFilesSelected,
    handleAction,
    cancelNumbering,
    pdfNumbers,
    isLoading,
    downloadFile,
    removeConversionFromHistory,
    clearAllConversions,
  };
}
