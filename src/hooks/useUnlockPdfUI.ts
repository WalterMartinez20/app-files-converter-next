"use client";

import { useState, useEffect } from "react";
import { usePdfTools } from "./usePdfTools";
import { usePdfThumbnail } from "./usePdfThumbnail";
import { toast } from "react-hot-toast";

export function useUnlockPdfUI() {
  const {
    pdfUnlocks,
    isLoading,
    downloadFile,
    removeConversionFromHistory,
    clearAllConversions,
    handleUnlockPdf,
  } = usePdfTools();

  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { thumbnailUrl, isGenerating, isEncrypted } = usePdfThumbnail(file);

  const isNotProtected = !!file && !isGenerating && isEncrypted === false;

  useEffect(() => {
    if (isNotProtected) {
      toast("This PDF is not password-protected, so there's nothing to unlock.", {
        id: "pdf-not-protected",
        icon: "ℹ️",
      });
    }
  }, [isNotProtected]);

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
    if (!password) {
      toast.error("Please enter a password");
      return;
    }
    if (isNotProtected) {
      toast("This PDF does not require a password", { icon: "ℹ️" });
      return;
    }
    setIsProcessing(true);
    const success = await handleUnlockPdf(file, password);
    setIsProcessing(false);
    if (success) {
      toast.success("PDF unlocked successfully");
      setFile(null);
      setPassword("");
      setTimeout(() => {
        document.getElementById("conversions-queue")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } else {
      toast.error("Failed to unlock PDF. Is the password correct?");
    }
  };

  const cancelUnlock = () => {
    setFile(null);
    setPassword("");
  };

  return {
    file,
    setFile,
    password,
    setPassword,
    isProcessing,
    thumbnailUrl,
    isGenerating,
    isNotProtected,
    onFilesSelected,
    handleAction,
    cancelUnlock,
    pdfUnlocks,
    isLoading,
    downloadFile,
    removeConversionFromHistory,
    clearAllConversions,
  };
}
