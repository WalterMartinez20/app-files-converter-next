"use client";

import { useRef, useEffect } from "react";
import { TextElement, ImageElement, RedactElement, WatermarkConfig } from "@/types/editor";
import { ToolType, DragAction } from "@/types/editor";

interface CanvasLayerProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  canvasContainerRef: React.RefObject<HTMLDivElement | null>;
  scale: number;
  selectedTool: ToolType;
  currentPageIndex: number;
  textElements: TextElement[];
  imageElements: ImageElement[];
  redactElements: RedactElement[];
  watermark: WatermarkConfig;
  isPanning: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  onWorkspaceClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPanStart: (e: React.PointerEvent) => void;
  onPanMove: (e: React.PointerEvent) => void;
  onPanEnd: (e: React.PointerEvent) => void;
  onSelectElement: (id: string) => void;
  onElementPointerDown: (e: React.PointerEvent, id: string, type: ToolType, action?: DragAction) => void;
  onUpdateText: (id: string, text: string) => void;
  onUpdateTextFormat: (id: string, updates: Partial<TextElement>) => void;
  onRemoveElement: (id: string, type: "text" | "image" | "redact") => void;
  selectedElementId: string | null;
  onEditingStart: (id: string | null) => void;
}

function ResizeHandle({
  onPointerDown,
  className,
}: {
  onPointerDown: (e: React.PointerEvent) => void;
  className: string;
}) {
  return (
    <div
      onPointerDown={onPointerDown}
      className={`absolute size-3 bg-white border-2 border-primary rounded-full shadow-md z-30 ${className}`}
    />
  );
}

function DeleteButton({ onPointerDown }: { onPointerDown: (e: React.PointerEvent) => void }) {
  return (
    <button
      onPointerDown={onPointerDown}
      className="absolute -top-10 left-1/2 -translate-x-1/2 size-6 rounded-full bg-white text-rose-500 hover:bg-rose-600 hover:text-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-slate-200 z-20"
    >
      <span className="material-symbols-outlined text-[14px] font-bold">close</span>
    </button>
  );
}

function ContentEditableInput({
  el,
  onUpdateText,
  onEditingStart,
  onSelectElement,
}: {
  el: TextElement;
  onUpdateText: (id: string, html: string) => void;
  onEditingStart: (id: string | null) => void;
  onSelectElement: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Set initial HTML content only on mount or when el.id changes
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== el.text) {
      ref.current.innerHTML = el.text;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [el.id]);

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onInput={() => ref.current && onUpdateText(el.id, ref.current.innerHTML)}
      onFocus={() => onEditingStart(el.id)}
      onBlur={() => onEditingStart(null)}
      onPointerDown={(e) => { e.stopPropagation(); onSelectElement(el.id); }}
      onClick={(e) => e.stopPropagation()}
      style={{
        color: el.color,
        fontSize: `${el.fontSize}px`,
        fontFamily: el.fontFamily || "Arial",
        fontWeight: el.isBold ? "bold" : "normal",
        fontStyle: el.isItalic ? "italic" : "normal",
        textDecoration: el.isUnderline ? "underline" : "none",
        textAlign: el.textAlign || "left",
        outline: "none",
        wordBreak: "break-word",
        whiteSpace: "pre-wrap",
      }}
      className={`w-full h-full bg-transparent cursor-text pointer-events-auto ${el.textAlign === "center" ? "text-center" : el.textAlign === "right" ? "text-right" : "text-left"}`}
    />
  );
}

export function CanvasLayer({
  canvasRef,
  canvasContainerRef,
  scale,
  selectedTool,
  currentPageIndex,
  textElements,
  imageElements,
  redactElements,
  watermark,
  isPanning,
  scrollContainerRef,
  onWorkspaceClick,
  onPointerMove,
  onPanStart,
  onPanMove,
  onPanEnd,
  onSelectElement,
  onElementPointerDown,
  onUpdateText,
  onRemoveElement,
  selectedElementId,
  onEditingStart,
}: CanvasLayerProps) {
  const currentTexts = textElements.filter((el) => el.pageIndex === currentPageIndex);
  const currentImages = imageElements.filter((el) => el.pageIndex === currentPageIndex);
  const currentRedacts = redactElements.filter((el) => el.pageIndex === currentPageIndex);

  return (
    <div
      ref={scrollContainerRef}
      className={`flex-1 bg-slate-100/50 dark:bg-[#0B0F19] p-4 md:p-8 flex justify-center items-start overflow-auto custom-scrollbar relative ${
        isPanning ? "cursor-grabbing" : ""
      }`}
      onPointerDown={onPanStart}
      onPointerMove={onPanMove}
      onPointerUp={onPanEnd}
      onPointerCancel={onPanEnd}
    >
      {selectedTool !== "none" && selectedTool !== "signature" && (
        <div className="absolute top-4 bg-primary/90 text-white px-4 py-2 rounded-full text-xs font-bold animate-pulse shadow-lg z-50 pointer-events-none">
          Click anywhere to place
        </div>
      )}

      <div className="flex flex-row items-start justify-center gap-6 mx-auto">
        <div
          ref={canvasContainerRef}
          onClick={onWorkspaceClick}
          onPointerMove={onPointerMove}
          className="relative shadow-xl mx-auto select-none touch-none bg-white origin-top transition-transform duration-200"
          style={{
            cursor: selectedTool !== "none" ? "crosshair" : "grab",
            width: "fit-content",
            height: "fit-content",
            transform: `scale(${scale})`,
          }}
        >
          {/* Watermark overlay */}
          {watermark.text && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-40">
              {watermark.placement === "mosaic" ? (
                <div className="w-full h-full flex flex-wrap items-center justify-center gap-12 p-8 opacity-40">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div
                      key={i}
                      className="font-bold whitespace-nowrap -rotate-45"
                      style={{
                        color: watermark.color ?? "#000000",
                        fontSize: "40px",
                        opacity: watermark.opacity,
                      }}
                    >
                      {watermark.text}
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="font-bold whitespace-nowrap"
                  style={{
                    color: watermark.color ?? "#000000",
                    transform: watermark.placement === "diagonal" ? "rotate(-45deg)" : "none",
                    fontSize: "80px",
                    opacity: watermark.opacity,
                  }}
                >
                  {watermark.text}
                </div>
              )}
            </div>
          )}

          {/* PDF Canvas */}
          <canvas
            ref={canvasRef}
            className="block max-w-full shadow-sm"
            style={{ maxHeight: "65vh", width: "auto", height: "auto" }}
          />

          {/* Text elements */}
          {currentTexts.map((el) => (
            <div
              key={el.id}
              className={`absolute group cursor-move border-2 hover:border-primary/40 pointer-events-auto transition-colors flex flex-col justify-center px-3 py-2 ${selectedElementId === el.id ? 'border-primary/60 bg-primary/5' : 'border-dashed border-slate-400/40 hover:bg-primary/5'} ${el.shapeType === 'circle' ? 'rounded-full' : 'rounded-lg'}`}
              style={{ 
                left: `${el.x}%`, 
                top: `${el.y}%`, 
                width: el.width ? `${el.width}%` : 'max-content',
                height: el.height ? `${el.height}%` : 'max-content',
                zIndex: el.zIndex, 
                backgroundColor: el.backgroundColor || 'transparent' 
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onSelectElement(el.id);
                onElementPointerDown(e, el.id, "text", "move");
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Hover highlight overlay when not selected */}
              {selectedElementId !== el.id && (
                <div className={`absolute inset-0 bg-transparent pointer-events-none transition-colors ${el.shapeType === 'circle' ? 'rounded-full' : 'rounded-lg'}`} />
              )}
              <ContentEditableInput el={el} onUpdateText={onUpdateText} onEditingStart={onEditingStart} onSelectElement={onSelectElement} />
              <DeleteButton onPointerDown={(e) => { e.stopPropagation(); onRemoveElement(el.id, "text"); }} />
              {/* Resize Handles (Only show when selected or on hover) */}
              <div className={`transition-opacity duration-200 ${selectedElementId === el.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <ResizeHandle onPointerDown={(e) => onElementPointerDown(e, el.id, "text", "nw")} className="-top-1.5 -left-1.5 cursor-nw-resize" />
                <ResizeHandle onPointerDown={(e) => onElementPointerDown(e, el.id, "text", "n")} className="-top-1.5 left-1/2 -translate-x-1/2 cursor-n-resize" />
                <ResizeHandle onPointerDown={(e) => onElementPointerDown(e, el.id, "text", "ne")} className="-top-1.5 -right-1.5 cursor-ne-resize" />
                <ResizeHandle onPointerDown={(e) => onElementPointerDown(e, el.id, "text", "e")} className="top-1/2 -translate-y-1/2 -right-1.5 cursor-e-resize" />
                <ResizeHandle onPointerDown={(e) => onElementPointerDown(e, el.id, "text", "se")} className="-bottom-1.5 -right-1.5 cursor-se-resize" />
                <ResizeHandle onPointerDown={(e) => onElementPointerDown(e, el.id, "text", "s")} className="-bottom-1.5 left-1/2 -translate-x-1/2 cursor-s-resize" />
                <ResizeHandle onPointerDown={(e) => onElementPointerDown(e, el.id, "text", "sw")} className="-bottom-1.5 -left-1.5 cursor-sw-resize" />
                <ResizeHandle onPointerDown={(e) => onElementPointerDown(e, el.id, "text", "w")} className="top-1/2 -translate-y-1/2 -left-1.5 cursor-w-resize" />
              </div>
            </div>
          ))}

          {/* Shape / redact elements */}
          {currentRedacts.map((el) => (
            <div
              key={el.id}
              className={`absolute group border-2 pointer-events-auto cursor-move transition-colors ${
                el.shapeType === "circle" ? "rounded-full" : "rounded-lg"
              } ${selectedElementId === el.id ? 'border-primary/60' : 'border-dashed border-slate-400/40 hover:border-primary/40'}`}
              style={{
                left: `${el.x}%`,
                top: `${el.y}%`,
                width: `${el.width}%`,
                height: `${el.height}%`,
                background: el.color,
                zIndex: el.zIndex,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onSelectElement(el.id);
                onElementPointerDown(e, el.id, "redact", "move");
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <DeleteButton onPointerDown={(e) => { e.stopPropagation(); onRemoveElement(el.id, "redact"); }} />
              <div className={`transition-opacity duration-200 ${selectedElementId === el.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <ResizeHandle onPointerDown={(e) => onElementPointerDown(e, el.id, "redact", "nw")} className="-top-1.5 -left-1.5 cursor-nw-resize" />
                <ResizeHandle onPointerDown={(e) => onElementPointerDown(e, el.id, "redact", "ne")} className="-top-1.5 -right-1.5 cursor-ne-resize" />
                <ResizeHandle onPointerDown={(e) => onElementPointerDown(e, el.id, "redact", "sw")} className="-bottom-1.5 -left-1.5 cursor-sw-resize" />
                <ResizeHandle onPointerDown={(e) => onElementPointerDown(e, el.id, "redact", "se")} className="-bottom-1.5 -right-1.5 cursor-se-resize" />
              </div>
            </div>
          ))}

          {/* Image / signature elements */}
          {currentImages.map((el) => (
            <div
              key={el.id}
              className={`absolute group border-2 pointer-events-auto cursor-move transition-colors rounded-lg ${selectedElementId === el.id ? 'border-primary/60 bg-primary/5' : 'border-dashed border-slate-400/40 hover:border-primary/40 hover:bg-primary/5'}`}
              style={{ left: `${el.x}%`, top: `${el.y}%`, width: `${el.width}%`, zIndex: el.zIndex }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onSelectElement(el.id);
                onElementPointerDown(e, el.id, "image", "move");
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={el.base64Data} alt="Added element" className="w-full h-auto block rounded-sm pointer-events-none" draggable={false} />
              <DeleteButton onPointerDown={(e) => { e.stopPropagation(); onRemoveElement(el.id, "image"); }} />
              <div className={`transition-opacity duration-200 ${selectedElementId === el.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <ResizeHandle onPointerDown={(e) => onElementPointerDown(e, el.id, "image", "nw")} className="-top-1.5 -left-1.5 cursor-nw-resize" />
                <ResizeHandle onPointerDown={(e) => onElementPointerDown(e, el.id, "image", "ne")} className="-top-1.5 -right-1.5 cursor-ne-resize" />
                <ResizeHandle onPointerDown={(e) => onElementPointerDown(e, el.id, "image", "sw")} className="-bottom-1.5 -left-1.5 cursor-sw-resize" />
                <ResizeHandle onPointerDown={(e) => onElementPointerDown(e, el.id, "image", "se")} className="-bottom-1.5 -right-1.5 cursor-se-resize" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
