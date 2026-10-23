import { useState, useRef, useCallback } from "react";
import { usePdfTools } from "./usePdfTools";
import {
  TextElement,
  ImageElement,
  RedactElement,
  WatermarkConfig,
  ToolType,
  EditPdfPayload,
  DragAction,
} from "@/types/editor";
import { toast } from "react-hot-toast";

// ─── PDF.js lazy singleton ────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PdfJsLib = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PdfDocument = any;

let pdfjsLib: PdfJsLib | null = null;

const getPdfJs = async (): Promise<PdfJsLib | null> => {
  if (typeof window === "undefined") return null;
  if (!pdfjsLib) {
    const pdfjs = await import("pdfjs-dist");
    (pdfjs as PdfJsLib).GlobalWorkerOptions.workerSrc =
      `https://unpkg.com/pdfjs-dist@${(pdfjs as PdfJsLib).version}/build/pdf.worker.min.mjs`;
    pdfjsLib = pdfjs as PdfJsLib;
  }
  return pdfjsLib;
};

// ─── Drag state shape ─────────────────────────────────────────────────────────
interface ElementDragState {
  id: string;
  type: ToolType;
  action: DragAction;
  startX: number;
  startY: number;
  initX: number;
  initY: number;
  initW: number;
  initH: number;
  initFontSize: number;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useEditPdfUI() {
  const {
    handleEditPdf,
    pdfEdits,
    isLoading: isColaLoading,
    downloadFile,
    removeConversionFromHistory,
    clearAllConversions,
  } = usePdfTools();

  // PDF document state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PdfDocument | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pageThumbnails, setPageThumbnails] = useState<string[]>([]);

  // Editor elements state
  const [selectedTool, setSelectedTool] = useState<ToolType>("none");
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [imageElements, setImageElements] = useState<ImageElement[]>([]);
  const [redactElements, setRedactElements] = useState<RedactElement[]>([]);
  const [watermark, setWatermark] = useState<WatermarkConfig>({
    text: "",
    opacity: 0.3,
    color: "#0f172a",
    placement: "diagonal",
  });

  // Shape tool state
  const [activeShapeType, setActiveShapeType] = useState<"rectangle" | "circle">("rectangle");
  const [activeShapeColor, setActiveShapeColor] = useState("#000000");

  // Loading states
  const [isReadingPdf, setIsReadingPdf] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Element drag/resize state
  const [dragState, setDragState] = useState<ElementDragState | null>(null);

  // Modals
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isWatermarkModalOpen, setIsWatermarkModalOpen] = useState(false);

  // Signature drawing state
  const [isDrawing, setIsDrawing] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const lastDragEndTime = useRef<number>(0);

  // ─── File handling ──────────────────────────────────────────────────────────
  const handleFileSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.type !== "application/pdf") {
      toast.error("Please select a valid PDF.");
      return;
    }

    const MAX_SIZE_BYTES = 100 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      toast.error(`"${file.name}" exceeds the 100 MB size limit.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      setIsReadingPdf(true);
      setPdfFile(file);
      setTextElements([]);
      setImageElements([]);
      setRedactElements([]);
      setWatermark({ text: "", opacity: 0.3 });
      setPageThumbnails([]);

      const pdfjs = await getPdfJs();
      if (!pdfjs) return;

      const arrayBuffer = await file.arrayBuffer();
      const doc = await pdfjs.getDocument({ data: arrayBuffer.slice(0) }).promise;
      setPdfDoc(doc);
      setNumPages(doc.numPages);
      setCurrentPageIndex(0);

      // Generate page thumbnails in the background
      const generateThumbnails = async () => {
        const thumbs: string[] = [];
        for (let i = 1; i <= doc.numPages; i++) {
          const page = await doc.getPage(i);
          const viewport = page.getViewport({ scale: 1.0 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          if (ctx) await page.render({ canvasContext: ctx, viewport, canvas }).promise;
          thumbs.push(canvas.toDataURL("image/jpeg", 0.7));
        }
        setPageThumbnails(thumbs);
      };
      generateThumbnails();
    } catch (error) {
      console.warn(error);
      toast.error("Error reading PDF file. It might be corrupted or encrypted.");
      setPdfFile(null);
    } finally {
      setIsReadingPdf(false);
    }
  };

  // ─── Render page to canvas ──────────────────────────────────────────────────
  const renderPage = useCallback(
    async (pageIndex: number, canvas: HTMLCanvasElement | null) => {
      if (!pdfDoc || !canvas) return;
      try {
        const page = await pdfDoc.getPage(pageIndex + 1);
        const context = canvas.getContext("2d");
        if (!context) return;
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport, canvas }).promise;
      } catch (error) {
        console.error("Error rendering page:", error);
      }
    },
    [pdfDoc],
  );

  // ─── Signature drawing ──────────────────────────────────────────────────────
  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const ctx = sigCanvasRef.current?.getContext("2d");
    ctx?.beginPath();
    ctx?.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const drawSignature = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const ctx = sigCanvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#0B0F19";
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
    }
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearSignature = () => {
    const canvas = sigCanvasRef.current;
    if (canvas) canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    if (!sigCanvasRef.current) return;
    setImageElements((prev) => [
      ...prev,
      {
        id: `sig-${Date.now()}`,
        base64Data: sigCanvasRef.current!.toDataURL("image/png"),
        x: 10,
        y: 10,
        width: 20,
        pageIndex: currentPageIndex,
        name: `Signature ${prev.filter((e) => e.id.startsWith("sig")).length + 1}`,
        zIndex: Date.now(),
      },
    ]);
    setIsSignatureModalOpen(false);
    setSelectedTool("none");
  };

  const saveInitials = (text: string) => {
    if (!text.trim()) return;
    const c = document.createElement("canvas");
    c.width = 300;
    c.height = 150;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.font = "italic 60px 'Times New Roman', serif";
    ctx.fillStyle = "#0B0F19";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, c.width / 2, c.height / 2);
    setImageElements((prev) => [
      ...prev,
      {
        id: `sig-${Date.now()}`,
        base64Data: c.toDataURL("image/png"),
        x: 10,
        y: 10,
        width: 20,
        pageIndex: currentPageIndex,
        name: `Initials ${prev.filter((e) => e.id.startsWith("sig")).length + 1}`,
        zIndex: Date.now(),
      },
    ]);
    setIsSignatureModalOpen(false);
    setSelectedTool("none");
  };

  // ─── Canvas click – place element ────────────────────────────────────────────
  const handleWorkspaceClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (Date.now() - lastDragEndTime.current < 200) return;
    if (
      selectedTool === "none" ||
      selectedTool === "signature" ||
      selectedTool === "image" ||
      !canvasContainerRef.current
    )
      return;

    const rect = canvasContainerRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;

    if (selectedTool === "text") {
      setTextElements((prev) => [
        ...prev,
        {
          id: `text-${Date.now()}`,
          text: "Type here",
          x: px,
          y: py,
          pageIndex: currentPageIndex,
          color: "#000000",
          fontSize: 24,
          name: `Text ${prev.length + 1}`,
          zIndex: Date.now(),
        },
      ]);
    } else if (selectedTool === "redact") {
      setRedactElements((prev) => [
        ...prev,
        {
          id: `redact-${Date.now()}`,
          x: px,
          y: py,
          width: activeShapeType === "circle" ? 10 : 15,
          height: activeShapeType === "circle" ? (10 * rect.width) / rect.height : 4,
          pageIndex: currentPageIndex,
          color: activeShapeColor,
          shapeType: activeShapeType,
          name: `Shape ${prev.length + 1}`,
          zIndex: Date.now(),
        },
      ]);
    }

    setSelectedTool("none");
  };

  // ─── Element pointer-down (begin move or resize) ─────────────────────────────
  const handleElementPointerDown = (
    e: React.PointerEvent,
    id: string,
    type: ToolType,
    action: DragAction = "move",
  ) => {
    e.stopPropagation();
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    let initX = 0, initY = 0, initW = 0, initH = 0, initFontSize = 16;

    if (type === "text") {
      const el = textElements.find((t) => t.id === id);
      if (el) { initX = el.x; initY = el.y; initFontSize = el.fontSize; initW = el.width || 20; initH = el.height || 10; }
    } else if (type === "redact") {
      const el = redactElements.find((r) => r.id === id);
      if (el) { initX = el.x; initY = el.y; initW = el.width; initH = el.height; }
    } else if (type === "image" || type === "signature") {
      const el = imageElements.find((i) => i.id === id);
      if (el) { initX = el.x; initY = el.y; initW = el.width; }
    }

    setDragState({ id, type, action, startX: e.clientX, startY: e.clientY, initX, initY, initW, initH, initFontSize });
  };

  // ─── Pointer move – apply drag physics ──────────────────────────────────────
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState || !canvasContainerRef.current) return;
    const rect = canvasContainerRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragState.startX) / rect.width) * 100;
    const deltaY = ((e.clientY - dragState.startY) / rect.height) * 100;

    if (dragState.type === "text") {
      if (dragState.action === "move") {
        setTextElements((prev) =>
          prev.map((el) =>
            el.id === dragState.id
              ? { ...el, x: dragState.initX + deltaX, y: dragState.initY + deltaY }
              : el,
          ),
        );
      } else if (["se", "sw", "ne", "nw", "n", "s", "e", "w"].includes(dragState.action)) {
        let nx = dragState.initX, ny = dragState.initY, nw = dragState.initW, nh = dragState.initH;
        if (dragState.action.includes("n")) { ny += deltaY; nh -= deltaY; }
        if (dragState.action.includes("s")) { nh += deltaY; }
        if (dragState.action.includes("w")) { nx += deltaX; nw -= deltaX; }
        if (dragState.action.includes("e")) { nw += deltaX; }
        if (nw < 2) nw = 2;
        if (nh < 2) nh = 2;
        
        setTextElements((prev) =>
          prev.map((el) =>
            el.id === dragState.id
              ? { ...el, x: nx, y: ny, width: nw, height: nh }
              : el,
          ),
        );
      }
    } else if (dragState.type === "redact") {
      let nx = dragState.initX, ny = dragState.initY, nw = dragState.initW, nh = dragState.initH;
      if (dragState.action === "move") { nx += deltaX; ny += deltaY; }
      else {
        if (dragState.action.includes("n")) { ny += deltaY; nh -= deltaY; }
        if (dragState.action.includes("s")) { nh += deltaY; }
        if (dragState.action.includes("w")) { nx += deltaX; nw -= deltaX; }
        if (dragState.action.includes("e")) { nw += deltaX; }
      }
      if (nw < 2) nw = 2;
      if (nh < 1) nh = 1;
      setRedactElements((prev) =>
        prev.map((el) =>
          el.id === dragState.id ? { ...el, x: nx, y: ny, width: nw, height: nh } : el,
        ),
      );
    } else if (dragState.type === "image" || dragState.type === "signature") {
      let nx = dragState.initX, ny = dragState.initY, nw = dragState.initW;
      if (dragState.action === "move") { nx += deltaX; ny += deltaY; }
      else {
        let wChange = 0;
        if (dragState.action.includes("e")) wChange = deltaX;
        if (dragState.action.includes("w")) { wChange = -deltaX; nx += deltaX; }
        nw += wChange;
        if (dragState.action.includes("n")) ny += deltaY;
      }
      if (nw < 5) nw = 5;
      setImageElements((prev) =>
        prev.map((el) => (el.id === dragState.id ? { ...el, x: nx, y: ny, width: nw } : el)),
      );
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragState) {
      try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* noop */ }
      setDragState(null);
      lastDragEndTime.current = Date.now();
    }
  };

  // ─── Image upload ────────────────────────────────────────────────────────────
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Unsupported image format. Please use JPG, PNG, or WebP.");
      return;
    }

    const MAX_IMAGE_SIZE = 25 * 1024 * 1024; // 25MB
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image exceeds the 25 MB size limit.");
      return;
    }

    if (file.size === 0) {
      toast.error("The selected image file is empty.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageElements((prev) => [
        ...prev,
        {
          id: `img-${Date.now()}`,
          base64Data: event.target?.result as string,
          x: 10,
          y: 10,
          width: 25,
          pageIndex: currentPageIndex,
          name: `Image ${prev.filter((e) => e.id.startsWith("img")).length + 1}`,
          zIndex: Date.now(),
        },
      ]);
      setSelectedTool("none");
    };
    reader.readAsDataURL(file);
  };

  // ─── Save / Cancel ───────────────────────────────────────────────────────────
  const onSaveClick = async () => {
    if (!pdfFile) return;
    setIsProcessing(true);

    const payload: EditPdfPayload = { textElements, imageElements, redactElements, watermark };
    const success = await handleEditPdf(pdfFile, payload);
    setIsProcessing(false);

    if (success) {
      toast.success("PDF saved successfully.");
      cancelEdit();
      setTimeout(() => {
        document.getElementById("conversions-queue")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } else {
      toast.error("Error saving PDF.");
    }
  };

  const removeAllElements = () => {
    setTextElements((prev) => prev.filter((el) => el.pageIndex !== currentPageIndex));
    setImageElements((prev) => prev.filter((el) => el.pageIndex !== currentPageIndex));
    setRedactElements((prev) => prev.filter((el) => el.pageIndex !== currentPageIndex));
  };

  const cancelEdit = () => {
    setPdfFile(null);
    setPdfDoc(null);
    setPageThumbnails([]);
    setTextElements([]);
    setImageElements([]);
    setRedactElements([]);
    setWatermark({ text: "", opacity: 0.3 });
  };

  // ─── Element helpers ─────────────────────────────────────────────────────────
  const updateText = (id: string, text: string) =>
    setTextElements((prev) => prev.map((el) => (el.id === id ? { ...el, text } : el)));

  const updateTextFormat = (id: string, updates: Partial<TextElement>) =>
    setTextElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...updates } : el)));

  const removeElement = (id: string, type: "text" | "image" | "redact") => {
    if (type === "text") setTextElements((prev) => prev.filter((el) => el.id !== id));
    if (type === "image") setImageElements((prev) => prev.filter((el) => el.id !== id));
    if (type === "redact") setRedactElements((prev) => prev.filter((el) => el.id !== id));
  };

  const renameElement = (id: string, type: string, newName: string) => {
    const updateName = <T extends { id: string; name?: string }>(prev: T[]): T[] =>
      prev.map((el) => (el.id === id ? { ...el, name: newName } : el));
    if (type === "text") setTextElements(updateName);
    else if (type === "image" || type === "signature") setImageElements(updateName);
    else if (type === "redact") setRedactElements(updateName);
  };

  return {
    // PDF state
    pdfFile,
    pdfDoc,
    numPages,
    currentPageIndex,
    setCurrentPageIndex,
    pageThumbnails,
    isReadingPdf,
    isProcessing,
    // Modals
    isSignatureModalOpen,
    setIsSignatureModalOpen,
    isWatermarkModalOpen,
    setIsWatermarkModalOpen,
    // Refs
    fileInputRef,
    imageInputRef,
    canvasContainerRef,
    canvasRef,
    sigCanvasRef,
    // Tool state
    selectedTool,
    setSelectedTool,
    activeShapeType,
    setActiveShapeType,
    activeShapeColor,
    setActiveShapeColor,
    // Elements
    textElements,
    setTextElements,
    imageElements,
    setImageElements,
    redactElements,
    setRedactElements,
    watermark,
    setWatermark,
    // Handlers
    handleFileSelected,
    renderPage,
    handleWorkspaceClick,
    handleImageUpload,
    handleElementPointerDown,
    handlePointerMove,
    handlePointerUp,
    startDrawing,
    drawSignature,
    stopDrawing,
    clearSignature,
    saveSignature,
    saveInitials,
    updateText,
    updateTextFormat,
    removeElement,
    renameElement,
    onSaveClick,
    removeAllElements,
    cancelEdit,
    // Conversion queue
    pdfEdits,
    isColaLoading,
    downloadFile,
    removeConversionFromHistory,
    clearAllConversions,
  };
}
