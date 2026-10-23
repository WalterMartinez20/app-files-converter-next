"use client";

import { useState, useMemo, useEffect } from "react";
import { usePdfTools } from "./usePdfTools";
import { usePdfThumbnail } from "./usePdfThumbnail";
import { toast } from "react-hot-toast";

export type SplitMode = "range" | "pages";
export type RangeSubMode = "custom" | "fixed";
export type ExtractSubMode = "all" | "select";

export interface CustomRange {
  id: number;
  from: number | string;
  to: number | string;
}

export function parsePagesString(str: string, totalPages: number): Set<number> {
  const selected = new Set<number>();
  const parts = str.split(/[,;\s]+/).filter(Boolean);
  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-");
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        const s = Math.max(1, Math.min(start, end));
        const e = Math.min(totalPages, Math.max(start, end));
        for (let i = s; i <= e; i++) selected.add(i);
      }
    } else {
      const p = parseInt(part, 10);
      if (!isNaN(p) && p >= 1 && p <= totalPages) selected.add(p);
    }
  }
  return selected;
}

export function formatPagesString(selectedSet: Set<number>): string {
  const sorted = Array.from(selectedSet).sort((a, b) => a - b);
  if (sorted.length === 0) return "";
  const ranges: string[] = [];
  let start = sorted[0];
  let prev = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    const curr = sorted[i];
    if (curr === prev + 1) {
      prev = curr;
    } else {
      ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
      start = curr;
      prev = curr;
    }
  }
  ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
  return ranges.join(", ");
}

export function useSplitPdfUI() {
  const {
    pdfSplits,
    isLoading,
    downloadFile,
    removeConversionFromHistory,
    clearAllConversions,
    handleSplitPdf,
  } = usePdfTools();

  const [file, setFile] = useState<File | null>(null);
  const [splitMode, setSplitMode] = useState<SplitMode>("range");
  const [rangeMode, setRangeMode] = useState<RangeSubMode>("custom");
  const [extractMode, setExtractMode] = useState<ExtractSubMode>("select");

  const [rangeList, setRangeList] = useState<CustomRange[]>([
    { id: 1, from: 1, to: 1 },
  ]);
  const [activeRangeIndex, setActiveRangeIndex] = useState<number>(0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [fixedChunk, setFixedChunk] = useState<number>(1);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set([1]));
  const [pagesInputText, setPagesInputText] = useState<string>("1");
  const [mergeFiles, setMergeFiles] = useState<boolean>(false);
  const [zoomPage, setZoomPage] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const { allThumbnails, isGenerating, numPages } = usePdfThumbnail(file);

  const [prevFile, setPrevFile] = useState<File | null>(null);
  const [prevNumPages, setPrevNumPages] = useState<number>(0);

  // Initialize ranges and selected pages once PDF numPages is discovered
  if (file !== prevFile) {
    setPrevFile(file);
    setPrevNumPages(0);
    setActiveRangeIndex(0);
  } else if (numPages > 0 && numPages !== prevNumPages) {
    setPrevNumPages(numPages);
    if (
      rangeList.length === 1 &&
      rangeList[0].from === 1 &&
      rangeList[0].to === 1 &&
      numPages > 1
    ) {
      setRangeList([{ id: 1, from: 1, to: numPages }]);
    }
    if (selectedPages.size === 1 && selectedPages.has(1) && numPages >= 2) {
      setSelectedPages(new Set([1, 2]));
      setPagesInputText("1-2");
    }
  }

  // Keyboard navigation for zoom modal
  useEffect(() => {
    if (zoomPage === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setZoomPage(null);
      } else if (e.key === "ArrowLeft") {
        setZoomPage((prev) => (prev && prev > 1 ? prev - 1 : 1));
      } else if (e.key === "ArrowRight") {
        setZoomPage((prev) =>
          prev && numPages && prev < numPages ? prev + 1 : prev
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomPage, numPages]);

  // Handle custom range modification
  const addRange = () => {
    const lastRange = rangeList[rangeList.length - 1];
    let nextFrom = 1;
    let nextTo = numPages || 1;

    if (lastRange) {
      const lastTo =
        typeof lastRange.to === "number"
          ? lastRange.to
          : parseInt(String(lastRange.to), 10) || 1;
      if (numPages > 0 && lastTo < numPages) {
        nextFrom = lastTo + 1;
        nextTo = numPages;
      } else {
        nextFrom = Math.min(lastTo, numPages || 1);
        nextTo = numPages || nextFrom;
      }
    }

    const newRangeId = Date.now();
    setRangeList((prev) => [
      ...prev,
      { id: newRangeId, from: nextFrom, to: nextTo },
    ]);
    setActiveRangeIndex(rangeList.length);
  };

  const removeRange = (id: number) => {
    if (rangeList.length > 1) {
      setRangeList((prev) => prev.filter((r) => r.id !== id));
      setActiveRangeIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const moveRange = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= rangeList.length) return;
    setRangeList((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      copy.splice(targetIndex, 0, item);
      return copy;
    });
    setActiveRangeIndex(targetIndex);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    setRangeList((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(draggedIndex, 1);
      copy.splice(targetIndex, 0, item);
      return copy;
    });
    setActiveRangeIndex(targetIndex);
    setDraggedIndex(null);
  };

  const handleRangeInputChange = (
    id: number,
    field: "from" | "to",
    val: string
  ) => {
    setRangeList((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (val === "") {
          return { ...r, [field]: "" };
        }
        let num = parseInt(val, 10);
        if (isNaN(num)) {
          toast.error("Please enter a valid page number");
          return { ...r, [field]: "" };
        }
        if (num < 1) {
          toast.error("Page number must be at least 1");
          num = 1;
        }
        if (numPages > 0 && num > numPages) {
          toast.error(`Page cannot exceed document length (${numPages} pages)`);
          num = numPages;
        }
        return { ...r, [field]: num };
      })
    );
  };

  const handleRangeBlur = (id: number, field: "from" | "to") => {
    setRangeList((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const rawVal = r[field];
        let val =
          typeof rawVal === "number" ? rawVal : parseInt(String(rawVal), 10);
        if (isNaN(val) || val < 1) {
          toast.error("Page number must be at least 1");
          val = 1;
        }
        if (numPages > 0 && val > numPages) {
          toast.error(`Page cannot exceed total pages (${numPages})`);
          val = numPages;
        }

        let fromVal =
          field === "from"
            ? val
            : typeof r.from === "number"
            ? r.from
            : parseInt(String(r.from), 10) || 1;
        let toVal =
          field === "to"
            ? val
            : typeof r.to === "number"
            ? r.to
            : parseInt(String(r.to), 10) || numPages || 1;

        if (field === "from" && fromVal > toVal) {
          toast.error("Start page cannot be greater than end page");
          toVal = Math.min(numPages || fromVal, fromVal);
        }
        if (field === "to" && toVal < fromVal) {
          toast.error("End page cannot be less than start page");
          fromVal = Math.max(1, toVal);
        }

        return { ...r, from: fromVal, to: toVal };
      })
    );
  };

  // Fixed ranges calculation
  const fixedRanges = useMemo(() => {
    if (!numPages || numPages < 1) return [];
    const chunk = Math.max(1, fixedChunk);
    const ranges: { from: number; to: number }[] = [];
    for (let i = 1; i <= numPages; i += chunk) {
      const to = Math.min(i + chunk - 1, numPages);
      ranges.push({ from: i, to });
    }
    return ranges;
  }, [numPages, fixedChunk]);

  const handleFixedChunkChange = (val: string) => {
    if (val === "") {
      setFixedChunk(1);
      return;
    }
    const num = parseInt(val, 10);
    if (isNaN(num) || num < 1) {
      toast.error("Range must be at least 1 page");
      setFixedChunk(1);
      return;
    }
    if (numPages > 0 && num > numPages) {
      toast.error(`Range cannot exceed document length (${numPages} pages)`);
      setFixedChunk(numPages);
      return;
    }
    setFixedChunk(num);
  };

  // Toggle page in select pages mode
  const togglePage = (pageNumber: number) => {
    if (extractMode !== "select") return;
    const nextSet = new Set(selectedPages);
    if (nextSet.has(pageNumber)) {
      if (nextSet.size > 1) {
        nextSet.delete(pageNumber);
      } else {
        toast.error("At least one page must remain selected");
        return;
      }
    } else {
      nextSet.add(pageNumber);
    }
    setSelectedPages(nextSet);
    setPagesInputText(formatPagesString(nextSet));
  };

  // Input change in select pages mode
  const handlePagesInputChange = (val: string) => {
    setPagesInputText(val);
    if (!val.trim()) return;

    if (!/^[0-9\s,\-]+$/.test(val)) {
      toast.error(
        "Invalid page range format. Use numbers, commas, or hyphens (e.g. 1-3, 5)"
      );
      return;
    }
    const parsed = parsePagesString(val, numPages || 9999);
    if (parsed.size > 0) {
      setSelectedPages(parsed);
    }
  };

  const handlePagesInputBlur = () => {
    if (!pagesInputText.trim() || selectedPages.size === 0) {
      toast.error("Please specify at least one valid page");
      setSelectedPages(new Set([1]));
      setPagesInputText("1");
    } else {
      setPagesInputText(formatPagesString(selectedPages));
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
    setRangeList([{ id: Date.now(), from: 1, to: 1 }]);
    setActiveRangeIndex(0);
    setSelectedPages(new Set([1]));
    setPagesInputText("1");
  };

  const handleAction = async () => {
    if (!file) {
      toast.error("Please select a PDF file first");
      return;
    }

    if (splitMode === "range" && rangeMode === "custom") {
      const invalidRange = rangeList.find((r) => {
        const f = Number(r.from);
        const t = Number(r.to);
        return isNaN(f) || isNaN(t) || f < 1 || (numPages > 0 && t > numPages) || f > t;
      });
      if (invalidRange) {
        toast.error("Please verify that all ranges have valid page numbers");
        return;
      }
    }

    setIsProcessing(true);

    let groups: number[][] = [];
    const isAutoZip =
      (splitMode === "range" && rangeMode === "fixed") ||
      (splitMode === "pages" && extractMode === "all");
    const effectiveMerge = isAutoZip ? false : mergeFiles;

    if (splitMode === "range") {
      if (rangeMode === "custom") {
        if (effectiveMerge) {
          groups = rangeList.map((r) => {
            const f = Number(r.from) || 1;
            const t = Math.max(f, Number(r.to) || f);
            return Array.from({ length: t - f + 1 }, (_, i) => f - 1 + i);
          });
        } else {
          // Unmerged: separate PDFs in a ZIP
          if (rangeList.length === 1) {
            // Single range: separate each individual page into its own PDF in the ZIP
            const f = Number(rangeList[0].from) || 1;
            const t = Math.max(f, Number(rangeList[0].to) || f);
            groups = Array.from({ length: t - f + 1 }, (_, i) => [f - 1 + i]);
          } else {
            // Multiple ranges: separate each range into its own PDF in the ZIP
            groups = rangeList.map((r) => {
              const f = Number(r.from) || 1;
              const t = Math.max(f, Number(r.to) || f);
              return Array.from({ length: t - f + 1 }, (_, i) => f - 1 + i);
            });
          }
        }
      } else {
        // fixed
        groups = fixedRanges.map((r) =>
          Array.from({ length: r.to - r.from + 1 }, (_, i) => r.from - 1 + i)
        );
      }
    } else {
      // pages
      if (extractMode === "all") {
        // In extract all mode: always separate pages into a ZIP archive
        groups = Array.from({ length: numPages }, (_, i) => [i]);
      } else {
        // select
        const sortedSelected = Array.from(selectedPages).sort((a, b) => a - b);
        if (sortedSelected.length === 0) {
          toast.error("Please select at least one page to extract");
          setIsProcessing(false);
          return;
        }
        if (effectiveMerge) {
          groups = [sortedSelected.map((p) => p - 1)];
        } else {
          groups = sortedSelected.map((p) => [p - 1]);
        }
      }
    }

    const success = await handleSplitPdf(file, {
      groups,
      merge: effectiveMerge,
    });

    setIsProcessing(false);

    if (success) {
      toast.success(
        effectiveMerge
          ? "PDF split and saved successfully"
          : "PDF split into ZIP archive successfully"
      );
      setFile(null);
      setTimeout(() => {
        document
          .getElementById("conversions-queue")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } else {
      toast.error("Failed to split PDF. Please try again.");
    }
  };

  const cancelSplit = () => {
    setFile(null);
  };

  // Active range calculation
  const activeRange =
    rangeList[activeRangeIndex] || rangeList[0] || { from: 1, to: 1 };
  const currentRangeFrom =
    typeof activeRange.from === "number"
      ? activeRange.from
      : parseInt(String(activeRange.from), 10) || 1;
  const currentRangeTo =
    typeof activeRange.to === "number"
      ? activeRange.to
      : parseInt(String(activeRange.to), 10) || currentRangeFrom;
  const currentRangePages = Math.max(0, currentRangeTo - currentRangeFrom + 1);

  const isAutoZip =
    (splitMode === "range" && rangeMode === "fixed") ||
    (splitMode === "pages" && extractMode === "all");
  const effectiveMerge = isAutoZip ? false : mergeFiles;

  return {
    file,
    setFile,
    splitMode,
    setSplitMode,
    rangeMode,
    setRangeMode,
    extractMode,
    setExtractMode,
    rangeList,
    setRangeList,
    activeRangeIndex,
    setActiveRangeIndex,
    draggedIndex,
    setDraggedIndex,
    fixedChunk,
    setFixedChunk,
    selectedPages,
    setSelectedPages,
    pagesInputText,
    setPagesInputText,
    mergeFiles,
    setMergeFiles,
    zoomPage,
    setZoomPage,
    isProcessing,
    allThumbnails,
    isGenerating,
    numPages,
    fixedRanges,
    activeRange,
    currentRangeFrom,
    currentRangeTo,
    currentRangePages,
    isAutoZip,
    effectiveMerge,
    addRange,
    removeRange,
    moveRange,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleRangeInputChange,
    handleRangeBlur,
    handleFixedChunkChange,
    togglePage,
    handlePagesInputChange,
    handlePagesInputBlur,
    onFilesSelected,
    handleAction,
    cancelSplit,
    pdfSplits,
    isLoading,
    downloadFile,
    removeConversionFromHistory,
    clearAllConversions,
  };
}
