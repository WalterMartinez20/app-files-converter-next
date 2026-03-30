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

type PdfJsLib = {
  getDocument: (options: any) => any;
  GlobalWorkerOptions: {
    workerSrc: string;
  };
  version: string;
};

type PdfDocument = {
  numPages: number;
  getPage: (page: number) => Promise<any>;
};

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

export function useEditPdfUI() {
  const {
    handleEditPdf,
    pdfEdits,
    isLoading: isColaLoading,
    downloadFile,
    removeConversionFromHistory,
  } = usePdfTools();

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PdfDocument | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pageThumbnails, setPageThumbnails] = useState<string[]>([]);

  const [selectedTool, setSelectedTool] = useState<ToolType>("none");
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [imageElements, setImageElements] = useState<ImageElement[]>([]);
  const [redactElements, setRedactElements] = useState<RedactElement[]>([]);
  const [watermark, setWatermark] = useState<WatermarkConfig>({
    text: "",
    opacity: 0.3,
  });

  const [isReadingPdf, setIsReadingPdf] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // ✨ NUEVO ESTADO DE ARRASTRE AVANZADO
  const [dragState, setDragState] = useState<{
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
  } | null>(null);

  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isWatermarkModalOpen, setIsWatermarkModalOpen] = useState(false);
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.type !== "application/pdf")
      return alert("Please select a valid PDF.");

    try {
      setIsReadingPdf(true);
      setPdfFile(file);
      setTextElements([]);
      setImageElements([]);
      setRedactElements([]);
      setWatermark({ text: "", opacity: 0.3 });
      setPageThumbnails([]);

      // Importación dinámica SSR fix
      const pdfjs = await getPdfJs();
      if (!pdfjs) return;

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({
        data: arrayBuffer.slice(0),
      });
      const doc = await loadingTask.promise;
      setPdfDoc(doc);
      setNumPages(doc.numPages);
      setCurrentPageIndex(0);

      const generateThumbnails = async () => {
        const thumbs: string[] = [];
        for (let i = 1; i <= doc.numPages; i++) {
          const page = await doc.getPage(i);
          const viewport = page.getViewport({ scale: 1.0 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          if (ctx)
            await page.render({ canvasContext: ctx, viewport, canvas }).promise;
          thumbs.push(canvas.toDataURL("image/jpeg", 0.7));
        }
        setPageThumbnails(thumbs);
      };
      generateThumbnails();
    } catch (error) {
      console.error(error);
      alert("Error reading PDF file.");
      setPdfFile(null);
    } finally {
      setIsReadingPdf(false);
    }
  };

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

  // Dibujo Firma
  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    sigCanvasRef.current?.getContext("2d")?.beginPath();
    sigCanvasRef.current
      ?.getContext("2d")
      ?.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };
  const drawSignature = (e: React.MouseEvent) => {
    if (isDrawing) {
      const ctx = sigCanvasRef.current?.getContext("2d");
      if (ctx) {
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#0B0F19";
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
      }
    }
  };
  const stopDrawing = () => setIsDrawing(false);
  const clearSignature = () =>
    sigCanvasRef.current
      ?.getContext("2d")
      ?.clearRect(
        0,
        0,
        sigCanvasRef.current.width,
        sigCanvasRef.current.height,
      );
  const saveSignature = () => {
    if (sigCanvasRef.current) {
      setImageElements((prev) => [
        ...prev,
        {
          id: `sig-${Date.now()}`,
          base64Data: sigCanvasRef.current!.toDataURL("image/png"),
          x: 10,
          y: 10,
          width: 20,
          pageIndex: currentPageIndex,
        },
      ]);
      setIsSignatureModalOpen(false);
      setSelectedTool("none");
    }
  };
  const saveInitials = (text: string) => {
    if (!text.trim()) return;
    const c = document.createElement("canvas");
    c.width = 300;
    c.height = 150;
    const ctx = c.getContext("2d");
    if (ctx) {
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
        },
      ]);
      setIsSignatureModalOpen(false);
      setSelectedTool("none");
    }
  };

  // CLIC INICIAL
  const handleWorkspaceClick = (e: React.MouseEvent<HTMLDivElement>) => {
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

    if (selectedTool === "text")
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
        },
      ]);
    else if (selectedTool === "redact")
      setRedactElements((prev) => [
        ...prev,
        {
          id: `redact-${Date.now()}`,
          x: px,
          y: py,
          width: 15,
          height: 4,
          pageIndex: currentPageIndex,
          color: "#000000",
        },
      ]);
    setSelectedTool("none");
  };

  // ✨ INICIAR MOVIMIENTO / REDIMENSIÓN
  const handleElementPointerDown = (
    e: React.PointerEvent,
    id: string,
    type: ToolType,
    action: DragAction = "move",
  ) => {
    e.stopPropagation();
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId); // Atrapa el ratón para que no se suelte al salir del elemento

    let initX = 0,
      initY = 0,
      initW = 0,
      initH = 0,
      initFontSize = 16;
    if (type === "text") {
      const el = textElements.find((t) => t.id === id);
      if (el) {
        initX = el.x;
        initY = el.y;
        initFontSize = el.fontSize;
      }
    } else if (type === "redact") {
      const el = redactElements.find((r) => r.id === id);
      if (el) {
        initX = el.x;
        initY = el.y;
        initW = el.width;
        initH = el.height;
      }
    } else if (type === "image" || type === "signature") {
      const el = imageElements.find((i) => i.id === id);
      if (el) {
        initX = el.x;
        initY = el.y;
        initW = el.width;
      }
    }

    setDragState({
      id,
      type,
      action,
      startX: e.clientX,
      startY: e.clientY,
      initX,
      initY,
      initW,
      initH,
      initFontSize,
    });
  };

  // ✨ CALCULAR FÍSICAS MIENTRAS SE MUEVE
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState || !canvasContainerRef.current) return;
    const rect = canvasContainerRef.current.getBoundingClientRect();

    // Cuánto se movió el ratón desde el clic inicial (en porcentaje)
    const deltaX = ((e.clientX - dragState.startX) / rect.width) * 100;
    const deltaY = ((e.clientY - dragState.startY) / rect.height) * 100;

    if (dragState.type === "text") {
      if (dragState.action === "move") {
        setTextElements((prev) =>
          prev.map((el) =>
            el.id === dragState.id
              ? {
                  ...el,
                  x: dragState.initX + deltaX,
                  y: dragState.initY + deltaY,
                }
              : el,
          ),
        );
      } else if (dragState.action === "se") {
        setTextElements((prev) =>
          prev.map((el) =>
            el.id === dragState.id
              ? {
                  ...el,
                  fontSize: Math.max(12, dragState.initFontSize + deltaX * 3),
                }
              : el,
          ),
        );
      }
    } else if (dragState.type === "redact") {
      let nx = dragState.initX,
        ny = dragState.initY,
        nw = dragState.initW,
        nh = dragState.initH;

      if (dragState.action === "move") {
        nx += deltaX;
        ny += deltaY;
      } else {
        // Lógica de 4 Esquinas
        if (dragState.action.includes("n")) {
          ny += deltaY;
          nh -= deltaY;
        }
        if (dragState.action.includes("s")) {
          nh += deltaY;
        }
        if (dragState.action.includes("w")) {
          nx += deltaX;
          nw -= deltaX;
        }
        if (dragState.action.includes("e")) {
          nw += deltaX;
        }
      }

      if (nw < 2) nw = 2;
      if (nh < 1) nh = 1; // Limites mínimos
      setRedactElements((prev) =>
        prev.map((el) =>
          el.id === dragState.id
            ? { ...el, x: nx, y: ny, width: nw, height: nh }
            : el,
        ),
      );
    } else if (dragState.type === "image" || dragState.type === "signature") {
      let nx = dragState.initX,
        ny = dragState.initY,
        nw = dragState.initW;

      if (dragState.action === "move") {
        nx += deltaX;
        ny += deltaY;
      } else {
        // Redimensión manteniendo proporción
        let wChange = 0;
        if (dragState.action.includes("e")) wChange = deltaX;
        if (dragState.action.includes("w")) {
          wChange = -deltaX;
          nx += deltaX;
        }
        nw += wChange;
        if (dragState.action.includes("n")) ny += deltaY;
      }
      if (nw < 5) nw = 5;
      setImageElements((prev) =>
        prev.map((el) =>
          el.id === dragState.id ? { ...el, x: nx, y: ny, width: nw } : el,
        ),
      );
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragState) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {}
      setDragState(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
        },
      ]);
      setSelectedTool("none");
    };
    reader.readAsDataURL(file);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const onSaveClick = async () => {
    if (!pdfFile) return;

    // Mostramos un toast de "cargando" que dura hasta que termina la API
    const loadingToast = toast.loading("💾 Guardando cambios...");
    setIsProcessing(true);

    setTimeout(
      () =>
        document
          .getElementById("conversions-queue")
          ?.scrollIntoView({ behavior: "smooth" }),
      100,
    );

    const payload: EditPdfPayload = {
      textElements,
      imageElements,
      redactElements,
      watermark,
    };
    const success = await handleEditPdf(pdfFile, payload);

    setIsProcessing(false);

    // Eliminamos el toast de carga
    toast.dismiss(loadingToast);

    if (success) {
      // ✨ 2. TOAST DE ÉXITO
      toast.success("PDF guardado con éxito.");
      cancelEdit();
    } else {
      // ✨ 3. TOAST DE ERROR
      toast.error("Error al guardar el PDF.");
    }
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

  return {
    pdfFile,
    pdfDoc,
    numPages,
    currentPageIndex,
    setCurrentPageIndex,
    pageThumbnails,
    isReadingPdf,
    isProcessing,
    isSignatureModalOpen,
    setIsSignatureModalOpen,
    isWatermarkModalOpen,
    setIsWatermarkModalOpen,
    fileInputRef,
    imageInputRef,
    canvasContainerRef,
    canvasRef,
    sigCanvasRef,
    selectedTool,
    setSelectedTool,
    textElements,
    setTextElements,
    imageElements,
    setImageElements,
    redactElements,
    setRedactElements,
    watermark,
    setWatermark,
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
    onSaveClick,
    cancelEdit,
    pdfEdits,
    isColaLoading,
    downloadFile,
    removeConversionFromHistory,
  };
}
