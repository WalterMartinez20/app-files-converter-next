"use client";

import { toast } from "react-hot-toast";

interface SignatureModalProps {
  isOpen: boolean;
  sigMode: "draw" | "type";
  initialsText: string;
  sigCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  onClose: () => void;
  onSigModeChange: (mode: "draw" | "type") => void;
  onInitialsTextChange: (text: string) => void;
  onStartDrawing: (e: React.MouseEvent) => void;
  onDrawSignature: (e: React.MouseEvent) => void;
  onStopDrawing: () => void;
  onClear: () => void;
  onApply: () => void;
}

export function SignatureModal({
  isOpen,
  sigMode,
  initialsText,
  sigCanvasRef,
  onClose,
  onSigModeChange,
  onInitialsTextChange,
  onStartDrawing,
  onDrawSignature,
  onStopDrawing,
  onClear,
  onApply,
}: SignatureModalProps) {
  if (!isOpen) return null;

  const handleApply = () => {
    if (sigMode === "type" && !initialsText.trim()) {
      toast.error("Please enter your initials or name");
      return;
    }
    if (sigMode === "draw" && sigCanvasRef.current) {
      const canvas = sigCanvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const pixelBuffer = new Uint32Array(
          ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer
        );
        const hasDrawn = pixelBuffer.some((color) => color !== 0);
        if (!hasDrawn) {
          toast.error("Please draw your signature first");
          return;
        }
      }
    }
    toast.success("Signature applied");
    onApply();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#1a1c29] rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">draw</span>
            Add Signature
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-500 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center size-10 shrink-0"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Mode tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
          <button
            onClick={() => onSigModeChange("draw")}
            className={`px-6 py-2 text-sm font-bold border-b-2 transition-colors ${
              sigMode === "draw" ? "border-primary text-primary" : "border-transparent text-slate-500"
            }`}
          >
            Draw
          </button>
          <button
            onClick={() => onSigModeChange("type")}
            className={`px-6 py-2 text-sm font-bold border-b-2 transition-colors ${
              sigMode === "type" ? "border-primary text-primary" : "border-transparent text-slate-500"
            }`}
          >
            Type Initials
          </button>
        </div>

        {/* Content */}
        {sigMode === "draw" ? (
          <div className="bg-slate-50 dark:bg-white rounded-2xl border-2 border-dashed border-slate-300 overflow-hidden mb-4 cursor-crosshair touch-none">
            <canvas
              ref={sigCanvasRef}
              width={450}
              height={200}
              className="w-full h-full block"
              onMouseDown={onStartDrawing}
              onMouseMove={onDrawSignature}
              onMouseUp={onStopDrawing}
              onMouseLeave={onStopDrawing}
            />
          </div>
        ) : (
          <div className="mb-4">
            <input
              type="text"
              value={initialsText}
              onChange={(e) => onInitialsTextChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); handleApply(); }
              }}
              autoFocus
              placeholder="e.g. WM"
              maxLength={5}
              className="w-full px-4 py-8 text-center text-4xl font-serif italic rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-background-dark outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {/* Footer actions */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={onClear}
            className="text-sm font-bold text-rose-500 hover:text-white bg-rose-50 hover:bg-rose-500 dark:bg-rose-500/10 dark:hover:bg-rose-500 border border-rose-200 dark:border-rose-500/30 px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
            Clear
          </button>
          <button
            onClick={handleApply}
            className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl shadow-md hover:-translate-y-0.5 transition-all"
          >
            Apply Signature
          </button>
        </div>
      </div>
    </div>
  );
}
