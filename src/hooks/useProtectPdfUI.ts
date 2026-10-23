"use client";

import { useState, useEffect } from "react";
import { usePdfTools } from "./usePdfTools";
import { usePdfThumbnail } from "./usePdfThumbnail";
import { toast } from "react-hot-toast";

export function useProtectPdfUI() {
  const {
    pdfProtects,
    isLoading,
    downloadFile,
    removeConversionFromHistory,
    clearAllConversions,
    handleProtectPdf,
  } = usePdfTools();

  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { thumbnailUrl, isGenerating, isEncrypted } = usePdfThumbnail(file);

  const isAlreadyProtected = !!file && !isGenerating && isEncrypted === true;

  useEffect(() => {
    if (isAlreadyProtected) {
      toast("This PDF is already protected. Unlock it first if you want to set a new password.", {
        id: "pdf-already-protected",
        icon: "ℹ️",
      });
    }
  }, [isAlreadyProtected]);

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 20;
    if (/[A-Z]/.test(pass)) score += 20;
    if (/[a-z]/.test(pass)) score += 20;
    if (/[0-9]/.test(pass)) score += 20;
    if (/[^A-Za-z0-9]/.test(pass)) score += 20;
    return score;
  };

  const strength = getPasswordStrength(password);

  const isPasswordValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password);

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
    if (!isPasswordValid) {
      toast.error(
        "Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters",
      );
      return;
    }
    setIsProcessing(true);
    const success = await handleProtectPdf(file, password);
    setIsProcessing(false);
    if (success) {
      toast.success("PDF protected successfully");
      setFile(null);
      setPassword("");
      setTimeout(() => {
        document.getElementById("conversions-queue")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } else {
      toast.error("Failed to protect PDF. Please try again.");
    }
  };

  const cancelProtect = () => {
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
    isAlreadyProtected,
    strength,
    isPasswordValid,
    onFilesSelected,
    handleAction,
    cancelProtect,
    pdfProtects,
    isLoading,
    downloadFile,
    removeConversionFromHistory,
    clearAllConversions,
  };
}
